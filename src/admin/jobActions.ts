import { approvePrintJob, cancelPrintJob, rejectPrintJob, retryPrintJob } from '@/services/printJobService';
import type { PrintStatus } from '@/types/printJob';

export type JobAction = 'approve' | 'reject' | 'cancel' | 'retry';

interface JobActionDefinition {
  label: string;
  confirmMessage?: string;
  statuses: readonly PrintStatus[];
  run: (jobId: string) => Promise<void>;
}

export const JOB_ACTIONS: Record<JobAction, JobActionDefinition> = {
  approve: {
    label: 'Approve',
    statuses: ['WAITING_APPROVAL'],
    run: approvePrintJob,
  },
  reject: {
    label: 'Reject',
    confirmMessage: 'Reject this print request?',
    statuses: ['WAITING_APPROVAL'],
    run: rejectPrintJob,
  },
  cancel: {
    label: 'Cancel',
    confirmMessage: 'Cancel this print job?',
    statuses: ['WAITING_APPROVAL', 'APPROVED'],
    run: cancelPrintJob,
  },
  retry: {
    label: 'Retry',
    statuses: ['FAILED'],
    run: retryPrintJob,
  },
};

export function getAvailableActions(status: PrintStatus): JobAction[] {
  return (Object.keys(JOB_ACTIONS) as JobAction[]).filter((action) =>
    JOB_ACTIONS[action].statuses.includes(status)
  );
}
