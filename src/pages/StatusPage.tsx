import { ArrowLeft, SearchX } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import JobStatusPanel from '@/components/print/JobStatusPanel';
import { usePrintJob } from '@/hooks/usePrintJobs';
import { formatDateTime, formatFileSize, DUPLEX_LABELS, ORIENTATION_LABELS, PRINT_MODE_LABELS, formatPageSelection } from '@/utils/format';

export default function StatusPage() {
  const { jobId = '' } = useParams();
  const { data: job, loading, error } = usePrintJob(jobId);

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-primary-800">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>

      <div className="mt-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16 text-primary-600">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <Alert>{error}</Alert>
        ) : !job ? (
          <Card className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600">
              <SearchX className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-lg font-semibold text-neutral-900">Request not found</h1>
            <p className="mt-2 text-sm leading-normal text-neutral-600">
              No print request matches <span className="font-mono">{jobId}</span>. Check the ID on your confirmation screen.
            </p>
          </Card>
        ) : (
          <>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Print job ID</p>
              <h1 className="mt-1 break-all font-mono text-xl font-bold text-primary-900 sm:text-2xl">{job.jobId}</h1>
            </div>

            <Card>
              <JobStatusPanel job={job} />
            </Card>

            <Card>
              <h2 className="text-base font-bold text-primary-900">Request details</h2>
              <dl className="mt-4 divide-y divide-neutral-100">
                {[
                  ['Document', job.fileName],
                  ['File size', formatFileSize(job.fileSize)],
                  ['Pages', formatPageSelection(job.pageSelection)],
                  ['Copies', String(job.copies)],
                  ['Mode', PRINT_MODE_LABELS[job.printMode]],
                  ['Sides', DUPLEX_LABELS[job.duplex]],
                  ['Orientation', ORIENTATION_LABELS[job.orientation ?? 'PORTRAIT']],
                  ['Submitted', formatDateTime(job.createdAt)],
                  [
                    'Last update',
                    formatDateTime(
                      job.printedAt ?? job.savedAt ?? job.failedAt ?? job.printingAt ?? job.savingAt ?? job.approvedAt ?? job.createdAt
                    ),
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-sm text-neutral-500">{label}</dt>
                    <dd className="min-w-0 truncate text-right text-sm font-medium text-neutral-900" title={value}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          </>
        )}
      </div>
    </section>
  );
}
