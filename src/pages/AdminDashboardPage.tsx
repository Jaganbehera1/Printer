import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_JOB_FILTERS, computeJobStats, filterAndSortJobs } from '@/admin/jobQueries';
import JobDetailModal from '@/admin/JobDetailModal';
import JobsTable from '@/admin/JobsTable';
import StatsGrid from '@/admin/StatsGrid';
import { useJobActions } from '@/admin/useJobActions';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { usePrintJobs } from '@/hooks/usePrintJobs';
import type { JobAction } from '@/admin/jobActions';
import type { PrintJob } from '@/types/printJob';

const RECENT_LIMIT = 10;

export default function AdminDashboardPage() {
  const { data: jobs, loading, error } = usePrintJobs();
  const { perform, busyJobId, actionError } = useJobActions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => computeJobStats(jobs), [jobs]);
  const recentJobs = useMemo(
    () => filterAndSortJobs(jobs, DEFAULT_JOB_FILTERS).slice(0, RECENT_LIMIT),
    [jobs]
  );
  const selected = jobs.find((job) => job.jobId === selectedId) ?? null;

  const handleAction = (job: PrintJob, action: JobAction) => void perform(job.jobId, action);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="page-heading">Dashboard</h1>
        <p className="page-subheading">An overview of all print requests.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-primary-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <>
          <StatsGrid stats={stats} />

          <Card className="p-0 sm:p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/70 px-4 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">Recent print jobs</h2>
                <p className="text-sm text-neutral-500">The {RECENT_LIMIT} newest requests</p>
              </div>
              <Link to="/admin/jobs">
                <Button variant="secondary" size="sm">
                  View all jobs
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            </div>
            {actionError && !selected && (
              <div className="px-5 pt-4 sm:px-6">
                <Alert>{actionError}</Alert>
              </div>
            )}
            <JobsTable
              jobs={recentJobs}
              busyJobId={busyJobId}
              onView={(job) => setSelectedId(job.jobId)}
              onAction={handleAction}
            />
          </Card>
        </>
      )}

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
