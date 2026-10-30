import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-primary-700">Error 404</p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">This page does not exist</h1>
      <p className="mt-2 text-sm text-neutral-600">The link may be out of date.</p>
      <Link to="/" className="mt-6">
        <Button>Go to home</Button>
      </Link>
    </div>
  );
}
