import type { DuplexMode, PrintMode } from '@/types/printJob';

export interface PrintSettings {
  schoolName: string;
  maxFileSize: number;
  maxCopies: number;
  allowedFileTypes: string[];
  printApprovalRequired: boolean;
  defaultPrintMode: PrintMode;
  defaultDuplex: DuplexMode;
}
