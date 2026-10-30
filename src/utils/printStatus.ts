import type { PrintStatus } from '@/types/printJob';

export const STATUS_LABELS: Record<PrintStatus, string> = {
  WAITING_APPROVAL: 'Waiting for approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PRINTING: 'Printing',
  SAVING: 'Saving PDF',
  PRINTED: 'Printed',
  SAVED: 'PDF saved',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
};

export const STUDENT_STATUS_MESSAGES: Record<PrintStatus, string> = {
  WAITING_APPROVAL: 'Your print request has been submitted and is waiting for approval.',
  APPROVED: 'Your document has been approved and is waiting for the printer.',
  REJECTED: 'Your print request was not approved. Please contact the administrator for details.',
  PRINTING: 'Your document is currently being printed.',
  SAVING: 'Your document is being saved as a PDF.',
  PRINTED: 'Printing completed successfully.',
  SAVED: 'Your document has been saved as a PDF.',
  FAILED: 'Printing could not be completed. Please contact the administrator.',
  CANCELLED: 'This print request was cancelled.',
};
