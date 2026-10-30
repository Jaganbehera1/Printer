import type { PrintSettings } from '@/types/printSettings';

export interface SupportedFileType {
  extension: string;
  mimeType: string;
  label: string;
  signature: readonly number[] | null;
}

const OLE_SIGNATURE = [0xd0, 0xcf, 0x11, 0xe0];
const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04];

export const SUPPORTED_FILE_TYPES: readonly SupportedFileType[] = [
  { extension: 'pdf', mimeType: 'application/pdf', label: 'PDF', signature: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  { extension: 'doc', mimeType: 'application/msword', label: 'Word', signature: OLE_SIGNATURE },
  {
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    label: 'Word',
    signature: ZIP_SIGNATURE,
  },
  { extension: 'xls', mimeType: 'application/vnd.ms-excel', label: 'Excel', signature: OLE_SIGNATURE },
  {
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    label: 'Excel',
    signature: ZIP_SIGNATURE,
  },
  { extension: 'ppt', mimeType: 'application/vnd.ms-powerpoint', label: 'PowerPoint', signature: OLE_SIGNATURE },
  {
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    label: 'PowerPoint',
    signature: ZIP_SIGNATURE,
  },
  { extension: 'txt', mimeType: 'text/plain', label: 'Text', signature: null },
  { extension: 'jpg', mimeType: 'image/jpeg', label: 'Image', signature: [0xff, 0xd8, 0xff] },
  { extension: 'jpeg', mimeType: 'image/jpeg', label: 'Image', signature: [0xff, 0xd8, 0xff] },
  { extension: 'png', mimeType: 'image/png', label: 'Image', signature: [0x89, 0x50, 0x4e, 0x47] },
];

export const ACCEPT_ATTRIBUTE = SUPPORTED_FILE_TYPES.map((type) => `.${type.extension}`).join(',');

export function getFileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot === -1 ? '' : fileName.slice(dot + 1).toLowerCase();
}

export function findSupportedFileType(fileName: string): SupportedFileType | undefined {
  const extension = getFileExtension(fileName);
  return SUPPORTED_FILE_TYPES.find((type) => type.extension === extension);
}

async function hasSignature(file: File, signature: readonly number[]): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, signature.length).arrayBuffer());
  return signature.every((value, index) => bytes[index] === value);
}

export async function validatePrintFile(file: File, settings: PrintSettings): Promise<string | null> {
  const type = findSupportedFileType(file.name);
  if (!type || !settings.allowedFileTypes.includes(type.extension)) {
    return 'This file type is not accepted. Please upload a PDF, Word, Excel, PowerPoint, text or image file.';
  }
  if (file.size === 0) {
    return 'This file is empty. Please choose another file.';
  }
  if (file.size > settings.maxFileSize * 1024 * 1024) {
    return `This file is too large. The maximum size is ${settings.maxFileSize} MB.`;
  }
  if (type.signature && !(await hasSignature(file, type.signature))) {
    return `This file does not look like a valid ${type.label} file. Please choose another file.`;
  }
  return null;
}
