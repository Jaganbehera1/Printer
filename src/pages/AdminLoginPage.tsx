import { AlertTriangle, LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField, { TextInput } from '@/components/ui/FormField';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { signInAdmin, signOutAdmin } from '@/services/authService';
import { getUserErrorMessage } from '@/utils/errors';

export default function AdminLoginPage() {
  const auth = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  if (auth.status === 'admin') return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setEmailError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError('Enter a valid email address.');
      return;
    }
    if (!password) {
      setSubmitError('Enter your password.');
      return;
    }
    setSubmitting(true);
    try {
      await signInAdmin(email.trim(), password);
    } catch (error) {
      setSubmitError(getUserErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm">
            <LogIn className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-900">Administrator sign in</h1>
          <p className="mt-2 text-sm text-neutral-600">School Smart Print System</p>
        </div>

        <Card>
          {auth.status === 'forbidden' && (
            <div className="mb-5 space-y-3">
              <Alert>This account does not have administrator access.</Alert>
              <Button variant="secondary" fullWidth onClick={() => void signOutAdmin()}>
                Sign out
              </Button>
            </div>
          )}
          {auth.status === 'error' && auth.errorMessage && (
            <div className="mb-5">
              <Alert>{auth.errorMessage}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField label="Email" htmlFor="email" error={emailError}>
              <TextInput
                id="email"
                type="email"
                autoComplete="username"
                inputMode="email"
                value={email}
                invalid={!!emailError}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField label="Password" htmlFor="password">
              <TextInput
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>

            {submitError && <Alert>{submitError}</Alert>}

            <Button type="submit" size="lg" fullWidth loading={submitting}>
              {submitting ? 'Signing in' : 'Sign in'}
            </Button>
          </form>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Administrator accounts are created by the school IT team.
        </p>
      </div>
    </div>
  );
}
