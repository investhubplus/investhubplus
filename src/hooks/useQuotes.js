import { useEffect, useState, useCallback } from 'react';
import { fetchQuotes } from '../services/brapi';

const REFRESH_MS = 5 * 60 * 1000;

export function useQuotes(tickers) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const key = tickers.slice().sort().join(',');

  const load = useCallback(async () => {
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuotes(key.split(','));
      setQuotes((prev) => ({ ...prev, ...data }));
      setLastUpdate(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return { quotes, loading, error, lastUpdate, refresh: load };
}