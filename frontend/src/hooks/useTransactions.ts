import { useState, useEffect, useCallback } from 'react';
import { TransactionFilters, PaginatedTransactionsResponse, Category } from '../lib/types';
import { fetchTransactions, fetchCategories } from '../lib/api';
import { transactionsData } from '../data/transactions-dataset';

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

const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', slug: 'food-dining', icon: 'UtensilsCrossed', color: '#F59E0B' },
  { id: 'cat-2', name: 'Shopping', slug: 'shopping', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat-3', name: 'Travel & Transit', slug: 'travel', icon: 'Plane', color: '#3B82F6' },
  { id: 'cat-4', name: 'Bills & Utilities', slug: 'bills-utilities', icon: 'Zap', color: '#10B981' },
  { id: 'cat-5', name: 'Entertainment', slug: 'entertainment', icon: 'Film', color: '#8B5CF6' },
  { id: 'cat-6', name: 'Fuel & Transport', slug: 'fuel', icon: 'Fuel', color: '#EF4444' },
  { id: 'cat-7', name: 'Electronics & Tech', slug: 'electronics', icon: 'Laptop', color: '#6366F1' },
  { id: 'cat-8', name: 'Health & Grocery', slug: 'health-grocery', icon: 'HeartPulse', color: '#14B8A6' }
];

function findCategory(query?: string) {
  if (!query) return CATEGORIES[0];
  const q = query.toLowerCase().trim();
  const catAliases: Record<string, string[]> = {
    'cat-1': ['cat_dining', 'cat-1', 'food-dining'],
    'cat-2': ['cat_shopping', 'cat-2', 'shopping'],
    'cat-3': ['cat_travel', 'cat-3', 'travel-fuel', 'travel'],
    'cat-4': ['cat_utilities', 'cat-4', 'bills-utilities'],
    'cat-5': ['cat_entertainment', 'cat-5', 'entertainment'],
    'cat-6': ['cat_fuel', 'cat-6', 'fuel'],
    'cat-7': ['cat_electronics', 'cat-7', 'electronics'],
    'cat-8': ['cat_health', 'cat_groceries', 'cat-8', 'health-grocery', 'health-wellness']
  };
  return CATEGORIES.find(c =>
    c.id.toLowerCase() === q ||
    (catAliases[c.id] && catAliases[c.id].some(a => a.toLowerCase() === q)) ||
    c.name.toLowerCase() === q ||
    c.slug.toLowerCase() === q
  ) || CATEGORIES[0];
}

function computeClientTransactions(filters: TransactionFilters): PaginatedTransactionsResponse {
  let filtered = (transactionsData as any[]).map(t => {
    const cat = findCategory(t.category_id || t.category || t.category_name);
    return {
      ...t,
      category_id: cat.id,
      category_name: cat.name,
      category_color: cat.color,
      category_icon: cat.icon,
      amount_inr: Number(t.amount_inr || 0),
      reward_coins_earned: Number(t.reward_coins_earned || Math.floor(Number(t.amount_inr || 0) / 100))
    };
  }).filter(t => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchMerchant = t.merchant_name ? t.merchant_name.toLowerCase().includes(q) : false;
      const matchRef = t.txn_ref ? t.txn_ref.toLowerCase().includes(q) : false;
      const matchDesc = t.description ? t.description.toLowerCase().includes(q) : false;
      if (!matchMerchant && !matchRef && !matchDesc) return false;
    }
    if (filters.categoryId && filters.categoryId !== 'ALL') {
      const targetCat = findCategory(filters.categoryId);
      const isMatch = t.category_id === targetCat.id ||
                      t.category_name.toLowerCase() === targetCat.name.toLowerCase();
      if (!isMatch) return false;
    }
    if (filters.status && filters.status !== 'ALL' && t.status !== filters.status) {
      return false;
    }
    const amt = Number(t.amount_inr || 0);
    if (filters.minAmount !== undefined && !isNaN(filters.minAmount) && amt < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount !== undefined && !isNaN(filters.maxAmount) && amt > filters.maxAmount) {
      return false;
    }
    if (filters.startDate) {
      if (new Date(t.date) < new Date(filters.startDate)) return false;
    }
    if (filters.endDate) {
      if (new Date(t.date) > new Date(filters.endDate + 'T23:59:59')) return false;
    }
    return true;
  });

  const sortBy = filters.sortBy || 'date';
  const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

  filtered.sort((a, b) => {
    let comp = 0;
    if (sortBy === 'amount') {
      comp = a.amount_inr - b.amount_inr;
    } else if (sortBy === 'merchant') {
      comp = a.merchant_name.localeCompare(b.merchant_name);
    } else {
      comp = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return sortOrder === 'asc' ? comp : -comp;
  });

  const totalCount = filtered.length;
  const totalAmount = filtered.reduce((sum, t) => sum + t.amount_inr, 0);
  const pageSize = filters.pageSize || 15;
  const page = filters.page || 1;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    total_count: totalCount,
    page,
    page_size: pageSize,
    total_pages: totalPages,
    total_amount_inr: Math.round(totalAmount * 100) / 100
  };
}

export function useTransactions() {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<PaginatedTransactionsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(cats => {
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        else setCategories(CATEGORIES);
      })
      .catch(() => setCategories(CATEGORIES));
  }, []);

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTransactions(filters);
      if (res && Array.isArray(res.items)) {
        setData(res);
      } else {
        const clientData = computeClientTransactions(filters);
        setData(clientData);
      }
    } catch (err: any) {
      const clientData = computeClientTransactions(filters);
      setData(clientData);
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
