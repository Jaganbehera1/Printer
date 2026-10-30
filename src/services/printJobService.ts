import { get, onValue, ref, set, update } from 'firebase/database';
import { getDb } from '@/firebase/client';
import { PRINT_STATUSES, type PrintJob, type PrintStatus } from '@/types/printJob';
import { AppError } from '@/utils/errors';

export type NewPrintJob = Omit<
  PrintJob,
  'status' | 'createdAt' | 'approvedAt' | 'printingAt' | 'savingAt' | 'printedAt' | 'savedAt' | 'failedAt' | 'errorMessage'
>;

const JOBS_PATH = 'printJobs';

const jobsRef = () => ref(getDb(), JOBS_PATH);
const jobRef = (jobId: string) => ref(getDb(), `${JOBS_PATH}/${jobId}`);

const STATUS_TIMESTAMP_FIELD: Partial<
  Record<PrintStatus, 'approvedAt' | 'printingAt' | 'savingAt' | 'printedAt' | 'savedAt' | 'failedAt'>
> = {
  APPROVED: 'approvedAt',
  PRINTING: 'printingAt',
  SAVING: 'savingAt',
  PRINTED: 'printedAt',
  SAVED: 'savedAt',
  FAILED: 'failedAt',
};

function toPrintJob(key: string, value: unknown): PrintJob | null {
  if (!value || typeof value !== 'object') return null;
  const job = value as PrintJob;
  if (!(PRINT_STATUSES as readonly string[]).includes(job.status)) return null;
  return { ...job, jobId: job.jobId ?? key };
}

function toPrintJobList(value: unknown): PrintJob[] {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value as Record<string, unknown>)
    .map(([key, item]) => toPrintJob(key, item))
    .filter((job): job is PrintJob => job !== null);
}

export async function createPrintJob(input: NewPrintJob, status: PrintStatus): Promise<PrintJob> {
  if (await getPrintJob(input.jobId)) {
    throw new AppError('This request ID is already in use. Please submit your request again.');
  }
  const now = Date.now();
  const job: PrintJob = {
    ...input,
    status,
    createdAt: now,
    ...(status === 'APPROVED' ? { approvedAt: now } : {}),
  };
  await set(jobRef(input.jobId), job);
  return job;
}

export async function getPrintJob(jobId: string): Promise<PrintJob | null> {
  const snapshot = await get(jobRef(jobId));
  return snapshot.exists() ? toPrintJob(jobId, snapshot.val()) : null;
}

export async function getPrintJobs(): Promise<PrintJob[]> {
  const snapshot = await get(jobsRef());
  return toPrintJobList(snapshot.val());
}

export function subscribeToPrintJob(
  jobId: string,
  onData: (job: PrintJob | null) => void,
  onError: (error: unknown) => void
): () => void {
  return onValue(
    jobRef(jobId),
    (snapshot) => onData(snapshot.exists() ? toPrintJob(jobId, snapshot.val()) : null),
    onError
  );
}

export function subscribeToPrintJobs(
  onData: (jobs: PrintJob[]) => void,
  onError: (error: unknown) => void
): () => void {
  return onValue(jobsRef(), (snapshot) => onData(toPrintJobList(snapshot.val())), onError);
}

export async function updatePrintJobStatus(jobId: string, status: PrintStatus, errorMessage?: string): Promise<void> {
  const changes: Record<string, unknown> = {
    status,
    errorMessage: status === 'FAILED' && errorMessage ? errorMessage : null,
  };
  const timestampField = STATUS_TIMESTAMP_FIELD[status];
  if (timestampField) changes[timestampField] = Date.now();
  await update(jobRef(jobId), changes);
}

async function changeStatus(jobId: string, allowedFrom: readonly PrintStatus[], nextStatus: PrintStatus): Promise<void> {
  const job = await getPrintJob(jobId);
  if (!job) throw new AppError('This print request could not be found.');
  if (!allowedFrom.includes(job.status)) {
    throw new AppError('This action is not available for the current status of the job.');
  }
  await updatePrintJobStatus(jobId, nextStatus);
}

export const approvePrintJob = (jobId: string) => changeStatus(jobId, ['WAITING_APPROVAL'], 'APPROVED');
export const rejectPrintJob = (jobId: string) => changeStatus(jobId, ['WAITING_APPROVAL'], 'REJECTED');
export const cancelPrintJob = (jobId: string) => changeStatus(jobId, ['WAITING_APPROVAL', 'APPROVED'], 'CANCELLED');
export const retryPrintJob = (jobId: string) => changeStatus(jobId, ['FAILED'], 'APPROVED');
