import type { DuplexMode, PrintMode } from '@/types/printJob';
import type { PrintSettings } from '@/types/printSettings';
import { resolvePageSelection } from '@/utils/pageRange';

export interface PrintFormValues {
  fullName: string;
  className: string;
  section: string;
  rollNumber: string;
  copies: string;
  pageMode: 'ALL' | 'CUSTOM';
  pageRange: string;
  printMode: PrintMode;
  duplex: DuplexMode;
}

export type PrintFormErrors = Partial<Record<keyof PrintFormValues | 'file', string>>;

const ROLL_NUMBER_PATTERN = /^[A-Za-z0-9-]+$/;

export function validatePrintForm(values: PrintFormValues, settings: PrintSettings): PrintFormErrors {
  const errors: PrintFormErrors = {};

  const fullName = values.fullName.trim();
  if (fullName.length < 2) errors.fullName = 'Enter your full name.';
  else if (fullName.length > 80) errors.fullName = 'Name must be 80 characters or fewer.';

  if (!values.className.trim()) errors.className = 'Enter your class.';
  if (!values.section.trim()) errors.section = 'Enter your section.';

  const rollNumber = values.rollNumber.trim();
  if (!rollNumber) errors.rollNumber = 'Enter your roll number.';
  else if (!ROLL_NUMBER_PATTERN.test(rollNumber)) errors.rollNumber = 'Roll number can contain letters, numbers and dashes only.';

  const copies = Number(values.copies);
  if (!Number.isInteger(copies) || copies < 1 || copies > settings.maxCopies) {
    errors.copies = `Enter a number of copies from 1 to ${settings.maxCopies}.`;
  }

  const pages = resolvePageSelection(values.pageMode, values.pageRange);
  if (!pages.ok) errors.pageRange = pages.error;

  return errors;
}
