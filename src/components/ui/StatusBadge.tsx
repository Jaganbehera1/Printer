import type { PrintStatus } from '@/types/printJob';
import { STATUS_LABELS } from '@/utils/printStatus';

const TONES: Record<PrintStatus, string> = {
  WAITING_APPROVAL: 'bg-warning-100 text-warning-800 ring-warning-600/20',
  APPROVED: 'bg-primary-100 text-primary-800 ring-primary-600/20',
  REJECTED: 'bg-error-100 text-error-800 ring-error-600/20',
  PRINTING: 'bg-accent-100 text-accent-800 ring-accent-600/20',
  SAVING: 'bg-accent-100 text-accent-800 ring-accent-600/20',
  PRINTED: 'bg-success-100 text-success-800 ring-success-600/20',
  SAVED: 'bg-success-100 text-success-800 ring-success-600/20',
  FAILED: 'bg-error-100 text-error-800 ring-error-600/20',
  CANCELLED: 'bg-neutral-200 text-neutral-700 ring-neutral-500/20',
};

export default function StatusBadge({ status }: { status: PrintStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${TONES[status]}`}
    >
      {(status === 'PRINTING' || status === 'SAVING') && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}
