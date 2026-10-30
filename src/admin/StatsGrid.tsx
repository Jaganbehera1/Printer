import {
  Hourglass,
  Printer,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Ban,
  ListChecks,
  FileDown,
  type LucideIcon,
} from 'lucide-react';
import type { JobStats } from '@/admin/jobQueries';

interface StatCard {
  key: keyof JobStats;
  label: string;
  icon: LucideIcon;
  tone: string;
}

const CARDS: StatCard[] = [
  { key: 'total', label: 'Total jobs', icon: ListChecks, tone: 'bg-neutral-100 text-neutral-700' },
  { key: 'WAITING_APPROVAL', label: 'Waiting for approval', icon: Hourglass, tone: 'bg-warning-100 text-warning-800' },
  { key: 'APPROVED', label: 'Approved', icon: CheckCircle2, tone: 'bg-secondary-100 text-secondary-800' },
  { key: 'PRINTING', label: 'Printing', icon: Printer, tone: 'bg-accent-100 text-accent-800' },
  { key: 'SAVING', label: 'Saving PDF', icon: FileDown, tone: 'bg-accent-100 text-accent-800' },
  { key: 'PRINTED', label: 'Printed', icon: CheckCircle2, tone: 'bg-success-100 text-success-800' },
  { key: 'SAVED', label: 'PDF saved', icon: FileDown, tone: 'bg-success-100 text-success-800' },
  { key: 'FAILED', label: 'Failed', icon: AlertOctagon, tone: 'bg-error-100 text-error-800' },
  { key: 'REJECTED', label: 'Rejected', icon: XCircle, tone: 'bg-error-50 text-error-700' },
  { key: 'CANCELLED', label: 'Cancelled', icon: Ban, tone: 'bg-neutral-200 text-neutral-700' },
];

export default function StatsGrid({ stats }: { stats: JobStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {CARDS.map(({ key, label, icon: Icon, tone }) => (
        <div key={key} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-neutral-600">{label}</p>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">{stats[key]}</p>
        </div>
      ))}
    </div>
  );
}
