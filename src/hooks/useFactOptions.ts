import { useEffect, useState } from 'react';
import { fetchFactOptions } from '../api/factOptions';
import type { FactOptions } from '../types/factOptions';

type OptionsState =
  | { status: 'loading' }
  | { status: 'ready'; options: FactOptions }
  | { status: 'error'; message: string };

export function useFactOptions() {
  const [state, setState] = useState<OptionsState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchFactOptions(controller.signal)
      .then(options => {
        if (!controller.signal.aborted) setState({ status: 'ready', options });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', message: 'Review options could not be loaded. Please try again.' });
        }
      });
    return () => controller.abort();
  }, [attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt(current => current + 1);
  }

  return { state, retry };
}
