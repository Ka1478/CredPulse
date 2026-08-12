from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    color: str

    model_config = ConfigDict(from_attributes=True)

class TransactionResponse(BaseModel):
    id: str
    user_id: str
    txn_ref: str
    merchant_name: str
    category_id: str
    category_name: Optional[str] = None
    category_color: Optional[str] = None
    category_icon: Optional[str] = None
    amount_inr: float
    status: str
    date: datetime
    payment_method: str
    card_last4: Optional[str] = None
    reward_coins_earned: int
    location: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PaginatedTransactionsResponse(BaseModel):
    items: List[TransactionResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    total_amount_inr: float

class CategoryAnalyticsItem(BaseModel):
    category_id: str
    category_name: str
    category_color: str
    category_icon: str
    total_amount_inr: float
    transaction_count: int
    percentage: float

class MonthlyTrendItem(BaseModel):
    month_key: str  # YYYY-MM
    month_name: str # e.g. "Jan 2025"
    total_amount_inr: float
    transaction_count: int

class AnalyticsSummaryResponse(BaseModel):
    category_breakdown: List[CategoryAnalyticsItem]
    monthly_trend: List[MonthlyTrendItem]
    total_spend_inr: float
    total_transactions: int

class RewardItemResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    coin_cost: int
    value_inr: float
    partner_name: str
    stock: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class CoinBalanceResponse(BaseModel):
    coin_balance: int
    total_coins_earned: int
    total_coins_redeemed: int
    user_name: str
    user_email: str

class RedeemRequest(BaseModel):
    reward_id: str = Field(..., description="ID of the reward voucher to redeem")

class RedemptionResponse(BaseModel):
    success: bool
    message: str
    redemption_id: str
    reward_title: str
    voucher_code: str
    coins_spent: int
    remaining_balance: int
    redeemed_at: datetime
