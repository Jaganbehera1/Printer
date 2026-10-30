import { useEffect, useState } from 'react';
import { getAdminUser, subscribeToAuth } from '@/services/authService';
import { getUserErrorMessage } from '@/utils/errors';

export interface AdminAuthState {
  status: 'loading' | 'signed-out' | 'admin' | 'forbidden' | 'error';
  email: string | null;
  errorMessage: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({ status: 'loading', email: null, errorMessage: null });

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeToAuth(async (user) => {
      if (!user) {
        if (active) setState({ status: 'signed-out', email: null, errorMessage: null });
        return;
      }
      try {
        const admin = await getAdminUser(user.uid);
        if (active) setState({ status: admin ? 'admin' : 'forbidden', email: user.email, errorMessage: null });
      } catch (error) {
        if (active) setState({ status: 'error', email: user.email, errorMessage: getUserErrorMessage(error) });
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return state;
}
