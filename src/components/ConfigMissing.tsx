import { Printer } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function ConfigMissing() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-xl shadow-primary-900/10 sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-800 to-primary-900 text-accent-300 shadow-lg shadow-primary-900/20">
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
