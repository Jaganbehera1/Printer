import { getDownloadURL, ref } from 'firebase/storage';
import { getFileStorage } from '@/firebase/client';
import { findSupportedFileType } from '@/utils/fileValidation';
import { AppError } from '@/utils/errors';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(cloudName && uploadPreset);

export interface UploadedPrintFile {
  storagePath: string;
  fileUrl: string;
}

function getPrintFileStoragePath(jobId: string, extension: string): string {
  return `printJobs/${jobId}/original.${extension}`;
}

export function uploadPrintFile(
  jobId: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedPrintFile> {
  if (!cloudName || !uploadPreset) {
    throw new AppError('Cloudinary is not configured. Please contact the administrator.');
  }
  const type = findSupportedFileType(file.name);
  if (!type) throw new AppError('This file type is not supported.');
  const storagePath = getPrintFileStoragePath(jobId, type.extension);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('public_id', storagePath);

  return new Promise<UploadedPrintFile>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`);
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => reject(new AppError('The file could not be uploaded. Check your internet connection and try again.'));
    request.onabort = () => reject(new AppError('The file upload was cancelled.'));
    request.onload = () => {
      let response: unknown;
      try {
        response = JSON.parse(request.responseText);
      } catch {
        reject(new AppError('Cloudinary returned an invalid upload response.'));
        return;
      }

      if (!response || typeof response !== 'object') {
        reject(new AppError('Cloudinary returned an invalid upload response.'));
        return;
      }
      const result = response as { secure_url?: unknown; public_id?: unknown; error?: { message?: unknown } };
      if (request.status < 200 || request.status >= 300) {
        const message = typeof result.error?.message === 'string' ? result.error.message : 'The file could not be uploaded.';
        reject(new AppError(message));
        return;
      }
      if (result.public_id !== storagePath || typeof result.secure_url !== 'string') {
        reject(new AppError('Cloudinary returned unexpected file details.'));
        return;
      }

      resolve({ storagePath, fileUrl: result.secure_url });
    };
    request.send(formData);
  });
}

export function getPrintFileDownloadUrl(fileUrl: string, storagePath: string): Promise<string> {
  if (fileUrl.startsWith('gs://')) {
    return getDownloadURL(ref(getFileStorage(), storagePath));
  }

  if (!cloudName) throw new AppError('Cloudinary is not configured. Please contact the administrator.');

  try {
    const url = new URL(fileUrl);
    const expectedPrefix = `/${cloudName}/raw/upload/`;
    if (
      url.protocol !== 'https:' ||
      url.hostname !== 'res.cloudinary.com' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !url.pathname.startsWith(expectedPrefix) ||
      !url.pathname.endsWith(`/${storagePath}`)
    ) {
      throw new AppError('The file URL is invalid.');
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('The file URL is invalid.');
  }
  return Promise.resolve(fileUrl);
}
