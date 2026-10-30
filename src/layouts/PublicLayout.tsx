import { Printer } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';

export default function PublicLayout() {
  const { data: settings } = useSettings();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Printer className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight text-neutral-900">
                {settings.schoolName}
              </span>
              <span className="block truncate text-xs leading-tight text-neutral-500">School Smart Print System</span>
            </span>
          </Link>
          <Link
            to="/print"
            className="inline-flex h-10 shrink-0 items-center rounded-xl bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            New request
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-neutral-500 sm:px-6">
          {settings.schoolName} - School Smart Print
        </div>
      </footer>
    </div>
  );
}
