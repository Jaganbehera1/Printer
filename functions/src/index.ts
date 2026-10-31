import { getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getStorage } from 'firebase-admin/storage';
import { v2 as cloudinary } from 'cloudinary';
import { defineSecret } from 'firebase-functions/params';
import { logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

const cloudinaryCloudName = defineSecret('CLOUDINARY_CLOUD_NAME');
const cloudinaryApiKey = defineSecret('CLOUDINARY_API_KEY');
const cloudinaryApiSecret = defineSecret('CLOUDINARY_API_SECRET');

const RETENTION_MS = 10 * 24 * 60 * 60 * 1000;
const BATCH_SIZE = 50;
const JOB_ID_PATTERN = /^PR-\d{8}-\d{4}$/;
const STORAGE_PATH_PATTERN =
  /^printJobs\/(PR-\d{8}-\d{4})\/original\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png)$/;

interface PrintJobRecord {
  createdAt: number;
  storagePath: string;
  fileUrl: string;
}

if (getApps().length === 0) initializeApp();

function isPrintJobRecord(value: unknown): value is PrintJobRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<PrintJobRecord>;
  return (
    typeof record.createdAt === 'number' &&
    Number.isFinite(record.createdAt) &&
    typeof record.storagePath === 'string' &&
    typeof record.fileUrl === 'string'
  );
}

function validateStoragePath(jobId: string, storagePath: string): void {
  if (
    !JOB_ID_PATTERN.test(jobId) ||
    !STORAGE_PATH_PATTERN.test(storagePath) ||
    storagePath.match(STORAGE_PATH_PATTERN)?.[1] !== jobId
  ) {
    throw new Error('The stored file path does not match the print request.');
  }
}

async function deletePrintFile(jobId: string, job: PrintJobRecord): Promise<void> {
  validateStoragePath(jobId, job.storagePath);

  if (job.fileUrl.startsWith('gs://')) {
    await getStorage().bucket().file(job.storagePath).delete({ ignoreNotFound: true });
    return;
  }

  const cloudName = cloudinaryCloudName.value();
  let fileUrl: URL;
  try {
    fileUrl = new URL(job.fileUrl);
  } catch {
    throw new Error('The stored file URL is invalid.');
  }

  if (
    fileUrl.protocol !== 'https:' ||
    fileUrl.hostname !== 'res.cloudinary.com' ||
    fileUrl.username ||
    fileUrl.password ||
    fileUrl.search ||
    fileUrl.hash ||
    !fileUrl.pathname.startsWith(`/${cloudName}/raw/upload/`) ||
    !fileUrl.pathname.endsWith(`/${job.storagePath}`)
  ) {
    throw new Error('The stored file URL does not match the expected Cloudinary asset.');
  }

  const result = await cloudinary.uploader.destroy(job.storagePath, { resource_type: 'raw' });
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Cloudinary did not delete the file (result: ${result.result}).`);
  }
}

async function deleteExpiredJob(jobId: string, value: unknown): Promise<void> {
  if (!isPrintJobRecord(value)) {
    throw new Error('The expired print request has invalid data.');
  }

  await deletePrintFile(jobId, value);
  await getDatabase().ref(`printJobs/${jobId}`).remove();
  logger.info('Deleted expired print request and file.', { jobId });
}

export const deleteExpiredPrintJobs = onSchedule(
  {
    schedule: 'every 60 minutes',
    timeZone: 'UTC',
    timeoutSeconds: 540,
    memory: '512MiB',
    secrets: [cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret],
  },
  async () => {
    const cloudName = cloudinaryCloudName.value();
    const apiKey = cloudinaryApiKey.value();
    const apiSecret = cloudinaryApiSecret.value();
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary cleanup secrets are not configured.');
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

    const jobsRef = getDatabase().ref('printJobs');
    const cutoff = Date.now() - RETENTION_MS;
    let cursor: { createdAt: number; jobId: string } | undefined;
    let failedJobs = 0;

    while (true) {
      let query = jobsRef.orderByChild('createdAt').startAt(0).endAt(cutoff);
      if (cursor) query = query.startAfter(cursor.createdAt, cursor.jobId);
      const snapshot = await query.limitToFirst(BATCH_SIZE).once('value');
      if (!snapshot.exists()) break;

      const batch: Array<{ jobId: string; value: unknown }> = [];
      snapshot.forEach((child) => {
        if (child.key) batch.push({ jobId: child.key, value: child.val() });
      });
      if (batch.length === 0) break;

      const lastJob = batch[batch.length - 1];
      if (!isPrintJobRecord(lastJob.value)) {
        logger.error('Cannot paginate expired print requests: invalid oldest record.', {
          jobId: lastJob.jobId,
        });
        throw new Error('An expired print request has an invalid creation timestamp.');
      }
      cursor = { createdAt: lastJob.value.createdAt, jobId: lastJob.jobId };

      const results = await Promise.allSettled(
        batch.map(({ jobId, value }) => deleteExpiredJob(jobId, value))
      );
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          failedJobs += 1;
          logger.error('Could not delete expired print request; it will be retried.', {
            jobId: batch[index].jobId,
            error: result.reason,
          });
        }
      });

      if (batch.length < BATCH_SIZE) break;
    }

    if (failedJobs > 0) {
      throw new Error(`Could not delete ${failedJobs} expired print request(s).`);
    }
  }
);
