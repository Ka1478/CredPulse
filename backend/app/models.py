import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Boolean, Index, Text
from sqlalchemy.orm import relationship
from app.db import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    coin_balance = Column(Integer, default=0, nullable=False)
    total_spent_inr = Column(Numeric(12, 2), default=0.00, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    transactions = relationship("Transaction", back_populates="user")
    redemptions = relationship("Redemption", back_populates="user")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), nullable=False, unique=True)
    slug = Column(String(50), nullable=False, unique=True)
    icon = Column(String(50), nullable=False)
    color = Column(String(20), nullable=False)

    transactions = relationship("Transaction", back_populates="category")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    txn_ref = Column(String(60), unique=True, nullable=False)
    merchant_name = Column(String(100), nullable=False)
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    amount_inr = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False, default="SUCCESS")  # SUCCESS, PENDING, FAILED
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    payment_method = Column(String(50), nullable=False)  # Credit Card, UPI, Net Banking
    card_last4 = Column(String(4), nullable=True)
    reward_coins_earned = Column(Integer, default=0, nullable=False)
    location = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")

    __table_args__ = (
        Index("idx_txn_user_date", "user_id", "date"),
        Index("idx_txn_category", "category_id"),
        Index("idx_txn_status", "status"),
        Index("idx_txn_merchant", "merchant_name"),
    )


class RewardItem(Base):
    __tablename__ = "rewards_catalogue"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    coin_cost = Column(Integer, nullable=False)
    value_inr = Column(Numeric(10, 2), nullable=False)
    partner_name = Column(String(100), nullable=False)
    stock = Column(Integer, default=100, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    redemptions = relationship("Redemption", back_populates="reward")


class Redemption(Base):
    __tablename__ = "redemptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reward_id = Column(String(36), ForeignKey("rewards_catalogue.id"), nullable=False)
    coins_spent = Column(Integer, nullable=False)
    voucher_code = Column(String(50), nullable=False)
    status = Column(String(20), default="COMPLETED", nullable=False)
    redeemed_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="redemptions")
    reward = relationship("RewardItem", back_populates="redemptions")
