import { transactionsData } from '../data/transactions-dataset';

export interface RawTransaction {
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

const REWARDS = [
  { id: 'rew_amazon_500', title: 'Amazon Gift Card ₹500', description: 'Instant ₹500 Amazon Shopping Voucher', category: 'Shopping', coin_cost: 5000, value_inr: 500, partner_name: 'Amazon', stock: 50, is_active: true },
  { id: 'rew_swiggy_250', title: 'Swiggy Money ₹250', description: '₹250 Food Delivery Voucher on Swiggy', category: 'Dining', coin_cost: 2500, value_inr: 250, partner_name: 'Swiggy', stock: 100, is_active: true },
  { id: 'rew_cashback_100', title: 'Card Bill Cashback ₹100', description: 'Direct ₹100 statement credit on your next bill', category: 'Cashback', coin_cost: 1000, value_inr: 100, partner_name: 'CredPulse', stock: 999, is_active: true },
  { id: 'rew_mmt_1000', title: 'MakeMyTrip Flight Voucher ₹1,000', description: 'Flat ₹1,000 off domestic flight bookings', category: 'Travel', coin_cost: 9000, value_inr: 1000, partner_name: 'MakeMyTrip', stock: 25, is_active: true },
  { id: 'rew_bms_300', title: 'BookMyShow Movie Pass ₹300', description: '₹300 off movie tickets & event passes', category: 'Entertainment', coin_cost: 3000, value_inr: 300, partner_name: 'BookMyShow', stock: 75, is_active: true },
  { id: 'rew_uber_150', title: 'Uber Ride Pass ₹150', description: '₹150 off your next 3 Uber Premier rides', category: 'Travel', coin_cost: 1500, value_inr: 150, partner_name: 'Uber', stock: 150, is_active: true }
];

let userState = {
  coin_balance: 606658,
  total_coins_earned: 606658,
  total_coins_redeemed: 0,
  user_name: 'Priya Anand',
  user_email: 'priya@example.com'
};

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

function getBaseTransactions(): RawTransaction[] {
  try {
    if (Array.isArray(transactionsData) && transactionsData.length > 0) {
      return (transactionsData as any[]).map(t => {
        const cat = findCategory(t.category_id || t.category || t.category_name);
        return {
          ...t,
          category_id: cat.id,
          category_name: cat.name,
          category_color: cat.color,
          category_icon: cat.icon,
          amount_inr: Number(t.amount_inr),
          reward_coins_earned: Number(t.reward_coins_earned || Math.floor(Number(t.amount_inr) / 100))
        };
      });
    }
  } catch (e) {
    console.warn('JSON transactions load error:', e);
  }
  return [];
}

const allTransactions: RawTransaction[] = getBaseTransactions();

export function getCategoriesData() {
  return CATEGORIES;
}

export async function getTransactionsData(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(10000, Math.max(1, params.pageSize || 20));
  const sortBy = params.sortBy || 'date';
  const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

  let filtered = allTransactions.filter(t => {
    if (params.search) {
      const q = params.search.toLowerCase();
      const matchMerchant = t.merchant_name.toLowerCase().includes(q);
      const matchRef = t.txn_ref.toLowerCase().includes(q);
      const matchDesc = t.description ? t.description.toLowerCase().includes(q) : false;
      if (!matchMerchant && !matchRef && !matchDesc) return false;
    }
    if (params.categoryId && params.categoryId !== 'ALL') {
      const targetCat = findCategory(params.categoryId);
      const isMatch = t.category_id === targetCat.id ||
                      targetCat.aliases.includes(t.category_id) ||
                      targetCat.name.toLowerCase() === (t.category_name || (t as any).category || '').toLowerCase();
      if (!isMatch) return false;
    }
    if (params.status && params.status !== 'ALL' && t.status !== params.status) {
      return false;
    }
    if (params.minAmount !== undefined && !isNaN(params.minAmount) && t.amount_inr < params.minAmount) {
      return false;
    }
    if (params.maxAmount !== undefined && !isNaN(params.maxAmount) && t.amount_inr > params.maxAmount) {
      return false;
    }
    if (params.startDate) {
      if (new Date(t.date) < new Date(params.startDate)) return false;
    }
    if (params.endDate) {
      if (new Date(t.date) > new Date(params.endDate + 'T23:59:59')) return false;
    }
    return true;
  });

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

export async function getAnalyticsSummaryData(params: {
  search?: string;
  categoryId?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}) {
  const result = await getTransactionsData({ ...params, page: 1, pageSize: 10000 });
  const filtered = result.items;

  const totalSpend = filtered.reduce((sum, t) => sum + t.amount_inr, 0);
  const totalTransactions = filtered.length;

  const categoryMap: Record<string, { amount: number; count: number }> = {};
  filtered.forEach(t => {
    const matchedCat = findCategory(t.category_id || (t as any).category || t.category_name);
    const catId = matchedCat.id;
    if (!categoryMap[catId]) {
      categoryMap[catId] = { amount: 0, count: 0 };
    }
    categoryMap[catId].amount += t.amount_inr;
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
    monthlyMap[key].amount += t.amount_inr;
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

export function getCoinBalanceData() {
  return userState;
}

export function getRewardsCatalogueData() {
  return REWARDS;
}

export function redeemVoucherData(rewardId: string) {
  const reward = REWARDS.find(r => r.id === rewardId);
  if (!reward) {
    throw new Error('Reward voucher not found');
  }
  if (userState.coin_balance < reward.coin_cost) {
    throw new Error(`Insufficient CredCoins balance. Required: ${reward.coin_cost}, Available: ${userState.coin_balance}`);
  }

  userState.coin_balance -= reward.coin_cost;
  userState.total_coins_redeemed += reward.coin_cost;

  const voucherCode = `CP-${reward.partner_name.substring(0, 4).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const redemptionId = `rdm_${Math.random().toString(36).substring(2, 10)}`;

  return {
    success: true,
    message: `Successfully redeemed ${reward.title}!`,
    redemption_id: redemptionId,
    reward_title: reward.title,
    voucher_code: voucherCode,
    coins_spent: reward.coin_cost,
    remaining_balance: userState.coin_balance,
    redeemed_at: new Date().toISOString()
  };
}
