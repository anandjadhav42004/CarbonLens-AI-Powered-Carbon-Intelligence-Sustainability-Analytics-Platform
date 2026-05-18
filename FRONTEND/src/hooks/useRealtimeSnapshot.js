import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export const useRealtimeSnapshot = (intervalMs = 8000) => {
  const [snapshot, setSnapshot] = useState(null);
  const [status, setStatus] = useState('syncing');

  const refresh = useCallback(async () => {
    try {
      const data = await api.getRealtimeSnapshot();
      setSnapshot(data);
      setStatus('live');
      return data;
    } catch {
      setStatus('offline');
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const data = await refresh();
      if (cancelled || !data) return;
      setSnapshot(data);
    };

    load();
    const timer = setInterval(load, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [intervalMs, refresh]);

  return { snapshot, status, refresh };
};
