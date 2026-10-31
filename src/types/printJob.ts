export const PRINT_STATUSES = [
  'WAITING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'PRINTING',
  'SAVING',
  'PRINTED',
  'SAVED',
  'FAILED',
  'CANCELLED',
] as const;

export type PrintStatus = (typeof PRINT_STATUSES)[number];
export type PrintMode = 'BLACK_WHITE' | 'COLOUR';
export type DuplexMode = 'SINGLE' | 'DOUBLE';
export type PageOrientation = 'PORTRAIT' | 'LANDSCAPE';

export interface PrintJob {
  jobId: string;
  studentName?: string;
  className?: string;
  section?: string;
  rollNumber?: string;
  fileName: string;
  storagePath: string;
  fileUrl: string;
  fileSize: number;
  copies: number;
  pageSelection: string;
  printMode: PrintMode;
  duplex: DuplexMode;
  orientation?: PageOrientation;
  status: PrintStatus;
  createdAt: number;
  approvedAt?: number;
  printingAt?: number;
  savingAt?: number;
  printedAt?: number;
  savedAt?: number;
  failedAt?: number;
  errorMessage?: string;
}
