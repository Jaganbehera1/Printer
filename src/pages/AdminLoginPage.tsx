import { AlertTriangle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FormField, { TextInput } from '@/components/ui/FormField';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { signInAdmin, signOutAdmin } from '@/services/authService';
import { getUserErrorMessage } from '@/utils/errors';
import { BRAND_NAME, BRAND_WEBSITE } from '@/utils/constants';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4 py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
      <div className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full bg-accent-300/20 blur-3xl" />
      <div className="w-full max-w-md">
        <div className="relative mb-6 text-center sm:mb-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary-900 shadow-lg shadow-primary-700/20 ring-1 ring-neutral-200">
            <img src="/images/jagan-logo.jpg" alt={`${BRAND_NAME} logo`} className="h-full w-full object-cover" />
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-primary-900">Administrator sign in</h1>
          <p className="mt-1 text-sm font-semibold text-accent-200 sm:text-primary-700">{BRAND_NAME}</p>
          <a href={BRAND_WEBSITE} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-primary-100 hover:text-white sm:text-neutral-600 sm:hover:text-primary-700">
            jaganwebsolutions.netlify.app
          </a>
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

        <p className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-5 text-neutral-500 sm:mt-6">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Administrator access is managed by the service owner.
        </p>
      </div>
    </div>
  );
}
