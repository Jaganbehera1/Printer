import { ArrowLeft, FileUp, Printer, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import PrintRequestForm from '@/components/print/PrintRequestForm';
import { useSettings } from '@/hooks/useSettings';

export default function PrintRequestPage() {
  const { data: settings, loading, error } = useSettings();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <Link to="/" className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-neutral-600 transition-colors hover:text-primary-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 px-5 py-6 shadow-xl shadow-primary-900/15 sm:mt-5 sm:rounded-3xl sm:px-8 sm:py-8">
        <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-accent-300/15 blur-2xl" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="relative flex min-w-0 items-start justify-between gap-3 sm:gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/30 bg-accent-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-200 sm:text-[11px]">
              <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Print portal
            </span>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">Create a print request</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-primary-100 sm:text-base">
              Upload your file, choose your print settings and review everything before submitting.
            </p>
          </div>
          <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent-200 sm:flex">
            <FileUp className="h-7 w-7" aria-hidden="true" />
          </div>
        </div>
        <div className="relative mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-primary-100 sm:mt-6 sm:gap-3 sm:text-xs">
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent-300 px-2.5 py-2 text-primary-900 sm:px-3"><FileUp className="h-3.5 w-3.5" aria-hidden="true" />Upload</span>
          <span className="h-px flex-1 bg-white/20" />
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-2 sm:px-3"><SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />Options</span>
          <span className="h-px flex-1 bg-white/20" />
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-2 sm:px-3"><Printer className="h-3.5 w-3.5" aria-hidden="true" />Review</span>
        </div>
      </div>

      <div className="mt-7">
        {loading ? (
          <div className="flex justify-center py-16 text-primary-600">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {error && <Alert tone="info">Settings could not be loaded, so standard print options are shown.</Alert>}
            <PrintRequestForm settings={settings} />
          </div>
        )}
      </div>
    </section>
  );
}
