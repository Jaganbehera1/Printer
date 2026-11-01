import type { DuplexMode, PageOrientation, PrintMode } from '@/types/printJob';
import type { PrintSettings } from '@/types/printSettings';
import { resolvePageSelection } from '@/utils/pageRange';

export interface PrintFormValues {
  copies: string;
  pageMode: 'ALL' | 'CURRENT' | 'CUSTOM';
  pageRange: string;
  printMode: PrintMode;
  duplex: DuplexMode;
  orientation: PageOrientation;
}

export type PrintFormErrors = Partial<Record<keyof PrintFormValues | 'file', string>>;

export function validatePrintForm(values: PrintFormValues, settings: PrintSettings, currentPage: number): PrintFormErrors {
  const errors: PrintFormErrors = {};

  const copies = Number(values.copies);
  if (!Number.isInteger(copies) || copies < 1 || copies > settings.maxCopies) {
    errors.copies = `Enter a number of copies from 1 to ${settings.maxCopies}.`;
  }

  const pages =
    values.pageMode === 'CURRENT'
      ? currentPage > 0
        ? { ok: true as const, value: String(currentPage) }
        : { ok: false as const, error: 'Load a PDF preview before choosing the current page.' }
      : resolvePageSelection(values.pageMode, values.pageRange);
  if (!pages.ok) errors.pageRange = pages.error;

  return errors;
}
