import {
  PaginatedTransactionsResponse,
  AnalyticsSummaryResponse,
  CoinBalance,
  RewardItem,
  RedemptionResponse,
  TransactionFilters,
  Category
} from './types';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return '/api/v1';
}

const API_BASE_URL = getApiBaseUrl();

export async function fetchTransactions(filters: TransactionFilters): Promise<PaginatedTransactionsResponse> {
  const params = new URLSearchParams();
  params.set('page', filters.page.toString());
  params.set('page_size', filters.pageSize.toString());
  params.set('sort_by', filters.sortBy);
  params.set('sort_order', filters.sortOrder);

  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId && filters.categoryId !== 'ALL') params.set('category_id', filters.categoryId);
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.minAmount !== undefined && !isNaN(filters.minAmount)) params.set('min_amount', filters.minAmount.toString());
  if (filters.maxAmount !== undefined && !isNaN(filters.maxAmount)) params.set('max_amount', filters.maxAmount.toString());
  if (filters.startDate) params.set('start_date', filters.startDate);
  if (filters.endDate) params.set('end_date', filters.endDate);

  const res = await fetch(`${API_BASE_URL}/transactions?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions (${res.status})`);
  }
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/transactions/categories`);
  if (!res.ok) {
    throw new Error(`Failed to fetch categories (${res.status})`);
  }
  return res.json();
}

export async function fetchAnalyticsSummary(filters: TransactionFilters): Promise<AnalyticsSummaryResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.categoryId && filters.categoryId !== 'ALL') params.set('category_id', filters.categoryId);
  if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
  if (filters.minAmount !== undefined && !isNaN(filters.minAmount)) params.set('min_amount', filters.minAmount.toString());
  if (filters.maxAmount !== undefined && !isNaN(filters.maxAmount)) params.set('max_amount', filters.maxAmount.toString());
  if (filters.startDate) params.set('start_date', filters.startDate);
  if (filters.endDate) params.set('end_date', filters.endDate);

  const res = await fetch(`${API_BASE_URL}/analytics/summary?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics summary (${res.status})`);
  }
  return res.json();
}

export async function fetchCoinBalance(): Promise<CoinBalance> {
  const res = await fetch(`${API_BASE_URL}/rewards/balance`);
  if (!res.ok) {
    throw new Error(`Failed to fetch coin balance (${res.status})`);
  }
  return res.json();
}

export async function fetchRewardsCatalogue(): Promise<RewardItem[]> {
  const res = await fetch(`${API_BASE_URL}/rewards/catalogue`);
  if (!res.ok) {
    throw new Error(`Failed to fetch rewards catalogue (${res.status})`);
  }
  return res.json();
}

export async function redeemVoucher(rewardId: string): Promise<RedemptionResponse> {
  const res = await fetch(`${API_BASE_URL}/rewards/redeem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reward_id: rewardId })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || 'Redemption failed. Please try again.');
  }

  return data;
}
