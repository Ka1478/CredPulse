'use client';

import React, { useState } from 'react';
import { Header } from '../components/dashboard/Header';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { FilterBar } from '../components/dashboard/FilterBar';
import { TransactionsTable } from '../components/dashboard/TransactionsTable';
import { TransactionDetailModal } from '../components/dashboard/TransactionDetailModal';
import { AnalyticsSection } from '../components/analytics/AnalyticsSection';
import { CoinBalanceCard } from '../components/rewards/CoinBalanceCard';
import { RewardsCatalogue } from '../components/rewards/RewardsCatalogue';
import { RedeemConfirmModal } from '../components/rewards/RedeemConfirmModal';
import { useTransactions } from '../hooks/useTransactions';
import { useAnalytics } from '../hooks/useAnalytics';
import { useRewards } from '../hooks/useRewards';
import { Transaction, RewardItem } from '../lib/types';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics' | 'rewards'>('transactions');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);

  // Core Hooks
  const {
    filters,
    data: txnData,
    categories,
    isLoading: txnsLoading,
    error: txnsError,
    reload: reloadTxns,
    setPage,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    handleAmountRangeChange,
    handleDateRangeChange,
    handleSort,
    resetFilters
  } = useTransactions();

  // Spend Analytics (2-way cross-filtered with table filters)
  const {
    analytics,
    isLoading: analyticsLoading
  } = useAnalytics(filters);

  // Rewards & Optimistic Redemptions
  const {
    balance,
    catalogue,
    isLoading: rewardsLoading,
    isRedeeming,
    error: rewardError,
    lastRedemption,
    redeemReward,
    clearError
  } = useRewards();

  const handleConfirmRedeem = async (reward: RewardItem) => {
    const success = await redeemReward(reward);
    if (success) {
      reloadTxns(); // Refresh transactions list if needed
    }
  };

  const currentCoinBalance = balance ? balance.coin_balance : 0;
  const totalEarnedCoins = balance ? balance.total_coins_earned : 0;
  const totalSpend = analytics ? analytics.total_spend_inr : (txnData ? txnData.total_amount_inr : 0);
  const totalTxnCount = txnData ? txnData.total_count : (analytics ? analytics.total_transactions : 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cp-bg-dark)', color: 'var(--cp-text-primary)' }}>
      {/* Top sticky navigation header */}
      <Header
        coinBalance={currentCoinBalance}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px 64px 16px' }}>
        {/* Top Key Performance Stats Overview */}
        <StatsOverview
          totalSpend={totalSpend}
          totalTransactions={totalTxnCount}
          coinBalance={currentCoinBalance}
          totalEarnedCoins={totalEarnedCoins}
        />

        {/* Global Error Banner */}
        {rewardError && (
          <div style={{
            backgroundColor: 'var(--cp-status-failed-bg)',
            border: '1px solid var(--cp-accent-rose)',
            padding: '12px 16px',
            borderRadius: 'var(--cp-radius-md)',
            color: 'var(--cp-status-failed-text)',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{rewardError}</span>
            </div>
            <button
              onClick={clearError}
              style={{ background: 'none', border: 'none', color: 'currentColor', cursor: 'pointer', fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: TRANSACTIONS & ANALYTICS INTEGRATED VIEW */}
        {activeTab === 'transactions' && (
          <div>
            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
              onAmountRangeChange={handleAmountRangeChange}
              onDateRangeChange={handleDateRangeChange}
              onReset={resetFilters}
            />

            {/* Spend Analytics Section (Interactive Slice Click filters category) */}
            <AnalyticsSection
              analytics={analytics}
              isLoading={analyticsLoading}
              selectedCategoryId={filters.categoryId}
              onCategoryClick={handleCategoryChange}
            />

            {/* Transactions Table */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cp-text-primary)' }}>
                  Credit Card Transactions ({totalTxnCount.toLocaleString()})
                </h3>
                {filters.categoryId !== 'ALL' && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--cp-accent-primary)', fontWeight: 600 }}>
                    Filtered by category
                  </span>
                )}
              </div>

              <TransactionsTable
                transactions={txnData ? txnData.items : []}
                totalCount={totalTxnCount}
                totalPages={txnData ? txnData.total_pages : 1}
                filters={filters}
                isLoading={txnsLoading}
                error={txnsError}
                onSort={handleSort}
                onPageChange={setPage}
                onRowClick={setSelectedTransaction}
                onRetry={reloadTxns}
              />
            </div>
          </div>
        )}

        {/* TAB 2: SPEND ANALYTICS DEDICATED VIEW */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cp-text-primary)' }}>
                Spend Analytics Overview
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--cp-text-secondary)', marginTop: '4px' }}>
                Detailed categorization breakdown and historical monthly spending trends across 10,000 transactions.
              </p>
            </div>

            <FilterBar
              filters={filters}
              categories={categories}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onStatusChange={handleStatusChange}
              onAmountRangeChange={handleAmountRangeChange}
              onDateRangeChange={handleDateRangeChange}
              onReset={resetFilters}
            />

            <AnalyticsSection
              analytics={analytics}
              isLoading={analyticsLoading}
              selectedCategoryId={filters.categoryId}
              onCategoryClick={handleCategoryChange}
            />
          </div>
        )}

        {/* TAB 3: REWARDS & VOUCHERS CATALOGUE VIEW */}
        {activeTab === 'rewards' && (
          <div>
            <CoinBalanceCard balance={balance} />

            <RewardsCatalogue
              rewards={catalogue}
              userBalance={currentCoinBalance}
              onSelectReward={setSelectedReward}
              isLoading={rewardsLoading}
            />
          </div>
        )}

        {/* Row Detail Modal */}
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />

        {/* Redeem Confirmation Modal */}
        <RedeemConfirmModal
          reward={selectedReward}
          userBalance={currentCoinBalance}
          isOpen={!!selectedReward}
          onClose={() => setSelectedReward(null)}
          onConfirmRedeem={handleConfirmRedeem}
          isRedeeming={isRedeeming}
          error={rewardError}
          lastRedemption={lastRedemption}
        />
      </main>
    </div>
  );
}
