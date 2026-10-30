import { Clock3 } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import type { PrintJob } from '@/types/printJob';
import { STUDENT_STATUS_MESSAGES } from '@/utils/printStatus';

export default function JobStatusPanel({ job }: { job: PrintJob }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status={job.status} />
        <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          Updates automatically
        </span>
      </div>
      <p className="text-base leading-normal text-neutral-800">{STUDENT_STATUS_MESSAGES[job.status]}</p>
    </div>
  );
}
