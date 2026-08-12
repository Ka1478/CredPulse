-- PostgreSQL 17 DDL Schema for CredPulse
-- Run this script to recreate database tables and indexes

DROP TABLE IF EXISTS redemptions CASCADE;
DROP TABLE IF EXISTS rewards_catalogue CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    coin_balance INTEGER NOT NULL DEFAULT 0,
    total_spent_inr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL
);

-- 3. Transactions Table (Core dataset table)
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    txn_ref VARCHAR(60) UNIQUE NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    category_id VARCHAR(36) NOT NULL REFERENCES categories(id),
    amount_inr NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    date TIMESTAMPTZ NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    card_last4 VARCHAR(4),
    reward_coins_earned INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(100),
    description TEXT
);

-- High-performance indexes for 10k transactions query optimization
CREATE INDEX idx_txn_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_txn_category ON transactions(category_id);
CREATE INDEX idx_txn_status ON transactions(status);
CREATE INDEX idx_txn_amount ON transactions(amount_inr);
CREATE INDEX idx_txn_merchant ON transactions USING btree (merchant_name text_pattern_ops);

-- 4. Rewards Catalogue Table
CREATE TABLE rewards_catalogue (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    coin_cost INTEGER NOT NULL,
    value_inr NUMERIC(10, 2) NOT NULL,
    partner_name VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Redemptions Table
CREATE TABLE redemptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reward_id VARCHAR(36) NOT NULL REFERENCES rewards_catalogue(id),
    coins_spent INTEGER NOT NULL,
    voucher_code VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    redeemed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
