import { Search } from 'lucide-react';
import { inputClassName } from '@/components/ui/formStyles';
import { PRINT_STATUSES } from '@/types/printJob';
import { STATUS_LABELS } from '@/utils/printStatus';
import type { DateFilter, JobFilters, SortOrder, StatusFilter } from '@/admin/jobQueries';

interface JobFiltersBarProps {
  filters: JobFilters;
  onChange: (patch: Partial<JobFilters>) => void;
}

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'ALL', label: 'All dates' },
  { value: 'TODAY', label: 'Today' },
  { value: '7D', label: 'Last 7 days' },
  { value: '30D', label: 'Last 30 days' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const selectClassName = `${inputClassName} appearance-none pr-4`;

export default function JobFiltersBar({ filters, onChange }: JobFiltersBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {(['ALL', ...PRINT_STATUSES] as StatusFilter[]).map((status) => {
          const active = filters.status === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ status })}
              className={`h-9 rounded-full px-3.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {status === 'ALL' ? 'All statuses' : STATUS_LABELS[status]}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <span className="sr-only">Search jobs</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by job ID, name, roll, class or file"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            className={`${inputClassName} pl-10`}
          />
        </label>
        <label>
          <span className="sr-only">Date range</span>
          <select
            value={filters.date}
            onChange={(event) => onChange({ date: event.target.value as DateFilter })}
            className={selectClassName}
          >
            {DATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort order</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ sort: event.target.value as SortOrder })}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
