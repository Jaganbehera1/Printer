import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import QRCodeCard from '@/admin/QRCodeCard';
import SettingsForm from '@/admin/SettingsForm';
import { useSettings } from '@/hooks/useSettings';

export default function AdminSettingsPage() {
  const { data: settings, loading, error } = useSettings();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-neutral-600">Printing rules, defaults and the printer QR code.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-primary-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {error && <Alert>{error}</Alert>}
            <SettingsForm initial={settings} />
          </div>
          <QRCodeCard schoolName={settings.schoolName} />
        </div>
      )}
    </div>
  );
}
