export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again in a moment.';

export function getUserErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;

  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';
  const rawMessage = error instanceof Error ? error.message : '';

  if (code.includes('network') || code === 'unavailable' || code.includes('retry-limit')) {
    return 'Network problem. Check your internet connection and try again.';
  }
  if (code.includes('too-many-requests')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found') ||
    code.includes('invalid-email')
  ) {
    return 'The email or password is incorrect.';
  }
  if (
    code.includes('unauthorized') ||
    code.includes('permission') ||
    /permission_denied/i.test(rawMessage)
  ) {
    return 'You do not have permission to do this. Please contact the administrator.';
  }
  return GENERIC_MESSAGE;
}
