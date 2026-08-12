import { useState, useEffect, useCallback } from 'react';
import { TransactionFilters, PaginatedTransactionsResponse, Category } from '../lib/types';
import { fetchTransactions, fetchCategories } from '../lib/api';

const DEFAULT_FILTERS: TransactionFilters = {
  search: '',
  categoryId: 'ALL',
  status: 'ALL',
  startDate: '',
  endDate: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 15
};

export function useTransactions() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<PaginatedTransactionsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load category list once
  useEffect(() => {
    fetchCategories()
      .then(cats => setCategories(cats))
      .catch(err => console.error('Failed loading categories', err));
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTransactions(filters);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const setPage = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setFilters(prev => ({ ...prev, pageSize, page: 1 }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, categoryId, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleAmountRangeChange = (minAmount?: number, maxAmount?: number) => {
    setFilters(prev => ({ ...prev, minAmount, maxAmount, page: 1 }));
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setFilters(prev => ({ ...prev, startDate, endDate, page: 1 }));
  };

  const handleSort = (key: string) => {
    setFilters(prev => {
      const isSameKey = prev.sortBy === key;
      const newOrder = isSameKey && prev.sortOrder === 'desc' ? 'asc' : 'desc';
      return {
        ...prev,
        sortBy: key as 'date' | 'amount' | 'merchant',
        sortOrder: newOrder,
        page: 1
      };
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return {
    filters,
    setFilters,
    data,
    categories,
    isLoading,
    error,
    reload: loadTransactions,
    setPage,
    setPageSize,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleAmountRangeChange,
    handleDateRangeChange,
    handleSort,
    resetFilters
  };
}
