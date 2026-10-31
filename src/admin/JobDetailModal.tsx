import { Download } from 'lucide-react';
import { useState } from 'react';
import { getAvailableActions, JOB_ACTIONS, type JobAction } from '@/admin/jobActions';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/ui/StatusBadge';
import { getPrintFileDownloadUrl } from '@/services/storageService';
import type { PrintJob } from '@/types/printJob';
import { DUPLEX_LABELS, PRINT_MODE_LABELS, formatDateTime, formatFileSize, formatPageSelection } from '@/utils/format';
import { getUserErrorMessage } from '@/utils/errors';

interface JobDetailModalProps {
  job: PrintJob;
  busy: boolean;
  actionError: string | null;
  onAction: (action: JobAction) => void;
  onClose: () => void;
}

const ACTION_BUTTON_VARIANT: Record<JobAction, 'primary' | 'danger' | 'secondary' | 'success'> = {
  approve: 'success',
  reject: 'danger',
  cancel: 'secondary',
  retry: 'primary',
};

export default function JobDetailModal({ job, busy, actionError, onAction, onClose }: JobDetailModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const details: [string, string][] = [
    ['File name', job.fileName],
    ['File size', formatFileSize(job.fileSize)],
    ['Copies', String(job.copies)],
    ['Page range', formatPageSelection(job.pageSelection)],
    ['Print mode', PRINT_MODE_LABELS[job.printMode]],
    ['Duplex', DUPLEX_LABELS[job.duplex]],
    ['Created', formatDateTime(job.createdAt)],
    ['Approved', formatDateTime(job.approvedAt)],
    ['Printing started', formatDateTime(job.printingAt)],
    ['PDF saving started', formatDateTime(job.savingAt)],
    ['Completed', formatDateTime(job.printedAt ?? job.savedAt ?? job.failedAt)],
  ];

  const handleDownload = async () => {
    setDownloadError(null);
    const preview = window.open('', '_blank');
    if (!preview) {
      setDownloadError('Allow pop-ups for this site to open the file.');
      return;
    }
    setDownloading(true);
    try {
      const url = await getPrintFileDownloadUrl(job.fileUrl, job.storagePath);
      preview.location.href = url;
    } catch (error) {
      preview.close();
      setDownloadError(getUserErrorMessage(error));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal title={`Print job ${job.jobId}`} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Current status</p>
            <div className="mt-2">
              <StatusBadge status={job.status} />
            </div>
          </div>
          <Button variant="secondary" size="sm" loading={downloading} onClick={handleDownload}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download file
          </Button>
        </div>

        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="min-w-0 border-b border-neutral-100 pb-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-neutral-900">{value}</dd>
            </div>
          ))}
        </dl>

        {job.errorMessage && (
          <div className="rounded-xl bg-error-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-error-700">Printer error</p>
            <p className="mt-1 break-words text-sm text-error-800">{job.errorMessage}</p>
          </div>
        )}

        {downloadError && <Alert>{downloadError}</Alert>}
        {actionError && <Alert>{actionError}</Alert>}

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:flex-wrap">
          {getAvailableActions(job.status).map((action) => (
            <Button
              key={action}
              variant={ACTION_BUTTON_VARIANT[action]}
              size="lg"
              loading={busy}
              onClick={() => onAction(action)}
              className="sm:flex-1"
            >
              {JOB_ACTIONS[action].label.toUpperCase()}
            </Button>
          ))}
          {getAvailableActions(job.status).length === 0 && (
            <p className="text-sm text-neutral-500">No further actions are available for this job.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
