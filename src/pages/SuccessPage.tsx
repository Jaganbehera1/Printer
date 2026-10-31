import { CheckCircle2, Copy, Check, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import JobStatusPanel from '@/components/print/JobStatusPanel';
import { usePrintJob } from '@/hooks/usePrintJobs';

export default function SuccessPage() {
  const { jobId = '' } = useParams();
  const { data: job, loading, error } = usePrintJob(jobId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(jobId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-7 sm:px-6 sm:py-12">
      {loading ? (
        <div className="flex justify-center py-16 text-primary-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <Alert>{error}</Alert>
      ) : !job ? (
        <Alert>We could not find this print request. Check the ID and try again.</Alert>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-700 shadow-sm shadow-success-900/10 ring-1 ring-success-200">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Request submitted</h1>
            <p className="mt-2 text-sm leading-normal text-neutral-600">Keep this ID to check your request later.</p>
          </div>

          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Print job ID</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="min-w-0 break-all font-mono text-lg font-bold text-primary-900 sm:text-2xl">{job.jobId}</p>
              <button
                type="button"
                onClick={copyId}
                aria-label="Copy job ID"
                className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-3 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {copied ? <Check className="h-4 w-4 text-success-700" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-5 border-t border-neutral-100 pt-5">
              <JobStatusPanel job={job} />
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to={`/status/${job.jobId}`} className="flex-1">
              <Button variant="secondary" size="lg" fullWidth>
                <Search className="h-4 w-4" aria-hidden="true" />
                View status
              </Button>
            </Link>
            <Link to="/print" className="flex-1">
              <Button size="lg" fullWidth>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New request
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
