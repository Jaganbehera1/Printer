import { useEffect, useState } from 'react';
import { subscribeToPrintJob, subscribeToPrintJobs } from '@/services/printJobService';
import type { PrintJob } from '@/types/printJob';
import type { AsyncState } from '@/types/asyncState';
import { getUserErrorMessage } from '@/utils/errors';

export function usePrintJob(jobId: string): AsyncState<PrintJob | null> {
  const [state, setState] = useState<AsyncState<PrintJob | null>>({ data: null, loading: true, error: null });

  useEffect(
    () =>
      subscribeToPrintJob(
        jobId,
        (job) => setState({ data: job, loading: false, error: null }),
        (error) => setState({ data: null, loading: false, error: getUserErrorMessage(error) })
      ),
    [jobId]
  );

  return state;
}

export function usePrintJobs(): AsyncState<PrintJob[]> {
  const [state, setState] = useState<AsyncState<PrintJob[]>>({ data: [], loading: true, error: null });

  useEffect(
    () =>
      subscribeToPrintJobs(
        (jobs) => setState({ data: jobs, loading: false, error: null }),
        (error) => setState({ data: [], loading: false, error: getUserErrorMessage(error) })
      ),
    []
  );

  return state;
}
