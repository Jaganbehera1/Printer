import { ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import PrintRequestForm from '@/components/print/PrintRequestForm';
import { useSettings } from '@/hooks/useSettings';
import { BRAND_NAME } from '@/utils/constants';

export default function PrintRequestPage() {
  const { data: settings, loading, error } = useSettings();

  return (
    <section className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-screen-2xl items-center justify-between gap-3 px-3 sm:min-h-[4.5rem] sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <img src="/images/jagan-logo.jpg" alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover sm:h-11 sm:w-11" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-neutral-900 sm:text-base">{BRAND_NAME}</p>
              <p className="text-[11px] text-neutral-500">Secure print portal</p>
            </div>
          </div>
          <Link
            to="/"
            aria-label="Back to home"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-screen-2xl px-3 py-4 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-4 flex items-center gap-3 sm:mb-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Printer className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">Print your document</h1>
            <p className="mt-0.5 text-sm text-neutral-600">Upload a file, check the preview and send it to print.</p>
          </div>
        </div>
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
