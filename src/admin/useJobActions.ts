import { useCallback, useState } from 'react';
import { JOB_ACTIONS, type JobAction } from '@/admin/jobActions';
import { getUserErrorMessage } from '@/utils/errors';

export function useJobActions() {
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const perform = useCallback(async (jobId: string, action: JobAction) => {
    const definition = JOB_ACTIONS[action];
    if (definition.confirmMessage && !window.confirm(definition.confirmMessage)) return;

    setBusyJobId(jobId);
    setActionError(null);
    try {
      await definition.run(jobId);
    } catch (error) {
      setActionError(getUserErrorMessage(error));
    } finally {
      setBusyJobId(null);
    }
  }, []);

  return { perform, busyJobId, actionError };
}
