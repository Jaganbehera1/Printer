import type { PrintJob, PrintStatus } from '@/types/printJob';

export type StatusFilter = 'ALL' | PrintStatus;
export type DateFilter = 'ALL' | 'TODAY' | '7D' | '30D';
export type SortOrder = 'newest' | 'oldest';

export interface JobFilters {
  search: string;
  status: StatusFilter;
  date: DateFilter;
  sort: SortOrder;
}

export type JobStats = Record<PrintStatus | 'total', number>;

export const DEFAULT_JOB_FILTERS: JobFilters = { search: '', status: 'ALL', date: 'ALL', sort: 'newest' };

const DAY_MS = 24 * 60 * 60 * 1000;

function matchesDate(job: PrintJob, date: DateFilter, now: number): boolean {
  if (date === 'ALL') return true;
  if (date === 'TODAY') {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    return job.createdAt >= startOfToday.getTime();
  }
  const days = date === '7D' ? 7 : 30;
  return job.createdAt >= now - days * DAY_MS;
}

function matchesSearch(job: PrintJob, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return [job.jobId, job.fileName]
    .some((field) => field.toLowerCase().includes(term));
}

export function filterAndSortJobs(jobs: PrintJob[], filters: JobFilters, now: number = Date.now()): PrintJob[] {
  return jobs
    .filter((job) => filters.status === 'ALL' || job.status === filters.status)
    .filter((job) => matchesDate(job, filters.date, now))
    .filter((job) => matchesSearch(job, filters.search))
    .sort((a, b) => (filters.sort === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
}

export function computeJobStats(jobs: PrintJob[]): JobStats {
  const stats: JobStats = {
    total: jobs.length,
    WAITING_APPROVAL: 0,
    APPROVED: 0,
    REJECTED: 0,
    PRINTING: 0,
    SAVING: 0,
    PRINTED: 0,
    SAVED: 0,
    FAILED: 0,
    CANCELLED: 0,
  };
  for (const job of jobs) stats[job.status] += 1;
  return stats;
}
