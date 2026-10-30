import { useEffect, useState } from 'react';
import { subscribeToSettings } from '@/services/settingsService';
import type { PrintSettings } from '@/types/printSettings';
import type { AsyncState } from '@/types/asyncState';
import { DEFAULT_SETTINGS } from '@/utils/constants';
import { getUserErrorMessage } from '@/utils/errors';

export function useSettings(): AsyncState<PrintSettings> {
  const [state, setState] = useState<AsyncState<PrintSettings>>({
    data: DEFAULT_SETTINGS,
    loading: true,
    error: null,
  });

  useEffect(
    () =>
      subscribeToSettings(
        (settings) => setState({ data: settings, loading: false, error: null }),
        (error) => setState((previous) => ({ ...previous, loading: false, error: getUserErrorMessage(error) }))
      ),
    []
  );

  return state;
}
