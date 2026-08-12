export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  txn_ref: string;
  merchant_name: string;
  category_id: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  amount_inr: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
  payment_method: string;
  card_last4?: string;
  reward_coins_earned: number;
  location?: string;
  description?: string;
}

export interface PaginatedTransactionsResponse {
  items: Transaction[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  total_amount_inr: number;
}

export interface CategoryAnalyticsItem {
  category_id: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  total_amount_inr: number;
  transaction_count: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  month_key: string;
  month_name: string;
  total_amount_inr: number;
  transaction_count: number;
}

export interface AnalyticsSummaryResponse {
  category_breakdown: CategoryAnalyticsItem[];
  monthly_trend: MonthlyTrendItem[];
  total_spend_inr: number;
  total_transactions: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  category: string;
  coin_cost: number;
  value_inr: number;
  partner_name: string;
  stock: number;
  is_active: boolean;
}

export interface CoinBalance {
  coin_balance: number;
  total_coins_earned: number;
  total_coins_redeemed: number;
  user_name: string;
  user_email: string;
}

export interface RedemptionResponse {
  success: boolean;
  message: string;
  redemption_id: string;
  reward_title: string;
  voucher_code: string;
  coins_spent: number;
  remaining_balance: number;
  redeemed_at: string;
}

export interface TransactionFilters {
  search: string;
  categoryId: string;
  status: string;
  minAmount?: number;
  maxAmount?: number;
  startDate: string;
  endDate: string;
  sortBy: 'date' | 'amount' | 'merchant';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}
