import { useState, useEffect, useCallback } from 'react';
import { AnalyticsSummaryResponse, TransactionFilters } from '../lib/types';
import { fetchAnalyticsSummary } from '../lib/api';
import { transactionsData } from '../data/transactions-dataset';

const CATEGORIES = [
  { id: 'cat-1', aliases: ['cat_dining', 'cat-1', 'food-dining'], name: 'Food & Dining', slug: 'food-dining', icon: 'UtensilsCrossed', color: '#F59E0B' },
  { id: 'cat-2', aliases: ['cat_shopping', 'cat-2', 'shopping'], name: 'Shopping', slug: 'shopping', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat-3', aliases: ['cat_travel', 'cat-3', 'travel-fuel', 'travel'], name: 'Travel & Transit', slug: 'travel', icon: 'Plane', color: '#3B82F6' },
  { id: 'cat-4', aliases: ['cat_utilities', 'cat-4', 'bills-utilities'], name: 'Bills & Utilities', slug: 'bills-utilities', icon: 'Zap', color: '#10B981' },
  { id: 'cat-5', aliases: ['cat_entertainment', 'cat-5', 'entertainment'], name: 'Entertainment', slug: 'entertainment', icon: 'Film', color: '#8B5CF6' },
  { id: 'cat-6', aliases: ['cat_fuel', 'cat-6', 'fuel'], name: 'Fuel & Transport', slug: 'fuel', icon: 'Fuel', color: '#EF4444' },
  { id: 'cat-7', aliases: ['cat_electronics', 'cat-7', 'electronics'], name: 'Electronics & Tech', slug: 'electronics', icon: 'Laptop', color: '#6366F1' },
  { id: 'cat-8', aliases: ['cat_health', 'cat_groceries', 'cat-8', 'health-grocery', 'health-wellness'], name: 'Health & Grocery', slug: 'health-grocery', icon: 'HeartPulse', color: '#14B8A6' }
];

function findCategory(query?: string) {
  if (!query) return CATEGORIES[0];
  const q = query.toLowerCase().trim();
  return CATEGORIES.find(c =>
    c.id.toLowerCase() === q ||
    c.aliases.some(a => a.toLowerCase() === q) ||
    c.name.toLowerCase() === q ||
    c.slug.toLowerCase() === q
  ) || CATEGORIES[0];
}

function computeClientAnalytics(filters: TransactionFilters): AnalyticsSummaryResponse {
  let filtered = (transactionsData as any[]).filter(t => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchMerchant = t.merchant_name ? t.merchant_name.toLowerCase().includes(q) : false;
      const matchRef = t.txn_ref ? t.txn_ref.toLowerCase().includes(q) : false;
      const matchDesc = t.description ? t.description.toLowerCase().includes(q) : false;
      if (!matchMerchant && !matchRef && !matchDesc) return false;
    }
    if (filters.categoryId && filters.categoryId !== 'ALL') {
      const targetCat = findCategory(filters.categoryId);
      const catVal = t.category_id || t.category || t.category_name;
      const isMatch = targetCat.id === catVal ||
                      targetCat.aliases.includes(catVal) ||
                      targetCat.name.toLowerCase() === (t.category_name || t.category || '').toLowerCase();
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

  const totalSpend = filtered.reduce((sum, t) => sum + Number(t.amount_inr || 0), 0);
  const totalTransactions = filtered.length;

  const categoryMap: Record<string, { amount: number; count: number }> = {};
  filtered.forEach(t => {
    const matchedCat = findCategory(t.category_id || t.category || t.category_name);
    const catId = matchedCat.id;
    if (!categoryMap[catId]) {
      categoryMap[catId] = { amount: 0, count: 0 };
    }
    categoryMap[catId].amount += Number(t.amount_inr || 0);
    categoryMap[catId].count += 1;
  });

  const categoryBreakdown = CATEGORIES.map(cat => {
    const data = categoryMap[cat.id] || { amount: 0, count: 0 };
    return {
      category_id: cat.id,
      category_name: cat.name,
      category_color: cat.color,
      category_icon: cat.icon,
      total_amount_inr: Math.round(data.amount * 100) / 100,
      transaction_count: data.count,
      percentage: totalSpend > 0 ? Math.round((data.amount / totalSpend) * 1000) / 10 : 0
    };
  }).filter(c => c.transaction_count > 0);

  const monthlyMap: Record<string, { amount: number; count: number; name: string }> = {};
  filtered.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const name = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!monthlyMap[key]) {
      monthlyMap[key] = { amount: 0, count: 0, name };
    }
    monthlyMap[key].amount += Number(t.amount_inr || 0);
    monthlyMap[key].count += 1;
  });

  const monthlyTrend = Object.keys(monthlyMap).sort().map(key => ({
    month_key: key,
    month_name: monthlyMap[key].name,
    total_amount_inr: Math.round(monthlyMap[key].amount * 100) / 100,
    transaction_count: monthlyMap[key].count
  }));

  return {
    category_breakdown: categoryBreakdown,
    monthly_trend: monthlyTrend,
    total_spend_inr: Math.round(totalSpend * 100) / 100,
    total_transactions: totalTransactions
  };
}

export function useAnalytics(filters: TransactionFilters) {
  const [analytics, setAnalytics] = useState<AnalyticsSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAnalyticsSummary(filters);
      if (res && Array.isArray(res.category_breakdown) && res.category_breakdown.length > 0 && res.total_transactions > 100) {
        setAnalytics(res);
      } else {
        const clientData = computeClientAnalytics(filters);
        setAnalytics(clientData);
      }
    } catch (err: any) {
      const clientData = computeClientAnalytics(filters);
      setAnalytics(clientData);
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
