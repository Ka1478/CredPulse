import { useState, useEffect, useCallback } from 'react';
import { AnalyticsSummaryResponse, TransactionFilters } from '../lib/types';
import { fetchAnalyticsSummary } from '../lib/api';

export function useAnalytics(filters: TransactionFilters) {
  const [analytics, setAnalytics] = useState<AnalyticsSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAnalyticsSummary(filters);
      setAnalytics(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    reload: loadAnalytics
  };
}
