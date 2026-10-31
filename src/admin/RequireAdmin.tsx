import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { signOutAdmin } from '@/services/authService';

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const auth = useAdminAuth();

  if (auth.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-primary-600">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (auth.status === 'signed-out') {
    return <Navigate to="/admin/login" replace />;
  }

  if (auth.status === 'admin') return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 text-center shadow-xl shadow-primary-900/10 sm:p-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-700">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="text-lg font-semibold text-neutral-900">Access not available</h1>
        <Alert>
          {auth.status === 'forbidden'
            ? 'This account does not have administrator access.'
            : auth.errorMessage ?? 'Something went wrong. Please try again in a moment.'}
        </Alert>
        <Button variant="secondary" fullWidth onClick={() => void signOutAdmin()}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
