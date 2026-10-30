import { useMemo, useState } from 'react';
import { DEFAULT_JOB_FILTERS, filterAndSortJobs, type JobFilters } from '@/admin/jobQueries';
import JobDetailModal from '@/admin/JobDetailModal';
import JobFiltersBar from '@/admin/JobFilters';
import JobsTable from '@/admin/JobsTable';
import { useJobActions } from '@/admin/useJobActions';
import type { JobAction } from '@/admin/jobActions';
import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { usePrintJobs } from '@/hooks/usePrintJobs';
import type { PrintJob } from '@/types/printJob';

export default function AdminJobsPage() {
  const { data: jobs, loading, error } = usePrintJobs();
  const { perform, busyJobId, actionError } = useJobActions();
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_JOB_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleJobs = useMemo(() => filterAndSortJobs(jobs, filters), [jobs, filters]);
  const selected = jobs.find((job) => job.jobId === selectedId) ?? null;

  const handleAction = (job: PrintJob, action: JobAction) => void perform(job.jobId, action);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Print jobs</h1>
        <p className="mt-1 text-sm text-neutral-600">Review, approve and manage every print request.</p>
      </div>

      <Card className="space-y-5">
        <JobFiltersBar filters={filters} onChange={(patch) => setFilters((previous) => ({ ...previous, ...patch }))} />
        {!loading && !error && (
          <p className="text-sm text-neutral-500">
            Showing {visibleJobs.length} of {jobs.length} jobs
          </p>
        )}
        {actionError && !selected && <Alert>{actionError}</Alert>}
      </Card>

      <Card className="p-0 sm:p-0">
        {loading ? (
          <div className="flex justify-center py-16 text-primary-600">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="p-5 sm:p-6">
            <Alert>{error}</Alert>
          </div>
        ) : (
          <JobsTable
            jobs={visibleJobs}
            busyJobId={busyJobId}
            onView={(job) => setSelectedId(job.jobId)}
            onAction={handleAction}
          />
        )}
      </Card>

      {selected && (
        <JobDetailModal
          job={selected}
          busy={busyJobId === selected.jobId}
          actionError={actionError}
          onAction={(action) => void perform(selected.jobId, action)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
