import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-100 text-accent-800 ring-1 ring-accent-200">
        <SearchX className="h-7 w-7" aria-hidden="true" />
      </span>
      <p className="mt-5 text-sm font-bold uppercase tracking-widest text-primary-700">Error 404</p>
      <h1 className="mt-2 text-2xl font-bold text-neutral-900">This page does not exist</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">The link may be out of date.</p>
      <Link to="/" className="mt-6">
        <Button>Go to home</Button>
      </Link>
    </div>
  );
}
