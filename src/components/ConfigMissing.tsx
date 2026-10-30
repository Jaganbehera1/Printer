import { Printer } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function ConfigMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
          <Printer className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-neutral-900">The print system is not connected yet</h1>
        <p className="mt-3 text-sm leading-normal text-neutral-600">
          Add your Firebase and Cloudinary project details to the environment file (see .env.example in the project), then restart the app.
        </p>
        <Link to="/" className="mt-6 inline-block">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
