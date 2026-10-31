import { Ban, Check, Eye, RotateCcw, X } from 'lucide-react';
import { getAvailableActions, JOB_ACTIONS, type JobAction } from '@/admin/jobActions';
import Spinner from '@/components/ui/Spinner';
import StatusBadge from '@/components/ui/StatusBadge';
import type { PrintJob } from '@/types/printJob';
import { formatDateTime, PRINT_MODE_LABELS } from '@/utils/format';

interface JobsTableProps {
  jobs: PrintJob[];
  busyJobId: string | null;
  onView: (job: PrintJob) => void;
  onAction: (job: PrintJob, action: JobAction) => void;
}

const ACTION_ICONS: Record<JobAction, typeof Check> = {
  approve: Check,
  reject: X,
  cancel: Ban,
  retry: RotateCcw,
};

const ACTION_STYLES: Record<JobAction, string> = {
  approve: 'text-success-700 hover:bg-success-50',
  reject: 'text-error-700 hover:bg-error-50',
  cancel: 'text-neutral-700 hover:bg-neutral-100',
  retry: 'text-secondary-700 hover:bg-secondary-50',
};

export default function JobsTable({ jobs, busyJobId, onView, onAction }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 px-6 py-12 text-center text-sm text-neutral-500">
        No print jobs match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
        <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Job ID</th>
            <th className="px-4 py-3">File</th>
            <th className="px-4 py-3 text-center">Copies</th>
            <th className="px-4 py-3">Mode</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {jobs.map((job) => {
            const busy = busyJobId === job.jobId;
            return (
              <tr key={job.jobId} className="transition-colors hover:bg-neutral-50">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-neutral-900">{job.jobId}</td>
                <td className="max-w-[180px] truncate px-4 py-3 text-neutral-700" title={job.fileName}>
                  {job.fileName}
                </td>
                <td className="px-4 py-3 text-center text-neutral-900">{job.copies}</td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-700">{PRINT_MODE_LABELS[job.printMode]}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-700">{formatDateTime(job.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {busy && <Spinner className="mr-1 h-4 w-4 text-neutral-500" />}
                    <button
                      type="button"
                      onClick={() => onView(job)}
                      className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-50"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      View
                    </button>
                    {getAvailableActions(job.status).map((action) => {
                      const Icon = ACTION_ICONS[action];
                      return (
                        <button
                          key={action}
                          type="button"
                          disabled={busy}
                          onClick={() => onAction(job, action)}
                          title={`${JOB_ACTIONS[action].label} job ${job.jobId}`}
                          aria-label={`${JOB_ACTIONS[action].label} job ${job.jobId}`}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${ACTION_STYLES[action]}`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
