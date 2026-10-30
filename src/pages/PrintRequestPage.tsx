import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import PrintRequestForm from '@/components/print/PrintRequestForm';
import { useSettings } from '@/hooks/useSettings';

export default function PrintRequestPage() {
  const { data: settings, loading, error } = useSettings();

  return (
    <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <Link to="/" className="inline-flex h-10 items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to home
      </Link>
      <div className="mt-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Print request</h1>
        <p className="mt-2 text-sm leading-normal text-neutral-600">
          Fill in your details, upload your file and choose how you want it printed.
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-16 text-primary-600">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-6">
            {error && <Alert tone="info">Settings could not be loaded, so standard print options are shown.</Alert>}
            <PrintRequestForm settings={settings} />
          </div>
        )}
      </div>
    </section>
  );
}
