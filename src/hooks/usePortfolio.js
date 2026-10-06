import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  listHoldings,
  upsertHolding,
  removeHolding
} from '../services/portfolio';

export function usePortfolio() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listHoldings(user.id);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  return {
    items,
    loading,
    error,
    reload,
    add: async (asset) => {
      await upsertHolding(user.id, asset);
      await reload();
    },
    remove: async (id) => {
      await removeHolding(id);
      await reload();
    }
  };
}