import type { DuplexMode, PrintMode } from '@/types/printJob';
import type { PrintSettings } from '@/types/printSettings';
import { resolvePageSelection } from '@/utils/pageRange';

export interface PrintFormValues {
  copies: string;
  pageMode: 'ALL' | 'CUSTOM';
  pageRange: string;
  printMode: PrintMode;
  duplex: DuplexMode;
}

export type PrintFormErrors = Partial<Record<keyof PrintFormValues | 'file', string>>;

export function validatePrintForm(values: PrintFormValues, settings: PrintSettings): PrintFormErrors {
  const errors: PrintFormErrors = {};

  const copies = Number(values.copies);
  if (!Number.isInteger(copies) || copies < 1 || copies > settings.maxCopies) {
    errors.copies = `Enter a number of copies from 1 to ${settings.maxCopies}.`;
  }

  const pages = resolvePageSelection(values.pageMode, values.pageRange);
  if (!pages.ok) errors.pageRange = pages.error;

  return errors;
}
