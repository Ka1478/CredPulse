import { useState, useEffect, useCallback } from 'react';
import { CoinBalance, RewardItem, RedemptionResponse } from '../lib/types';
import { fetchCoinBalance, fetchRewardsCatalogue, redeemVoucher } from '../lib/api';

export function useRewards() {
  const [balance, setBalance] = useState<CoinBalance | null>(null);
  const [catalogue, setCatalogue] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRedemption, setLastRedemption] = useState<RedemptionResponse | null>(null);

  const loadRewardsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [balRes, catRes] = await Promise.all([
        fetchCoinBalance(),
        fetchRewardsCatalogue()
      ]);
      setBalance(balRes);
      setCatalogue(catRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load rewards data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewardsData();
  }, [loadRewardsData]);

  // Optimistic redemption with automatic rollback on error
  const handleRedeem = async (reward: RewardItem): Promise<boolean> => {
    if (!balance) return false;

    // Check client side balance
    if (balance.coin_balance < reward.coin_cost) {
      setError(`Insufficient coin balance. You need ${reward.coin_cost} coins.`);
      return false;
    }

    const previousBalance = balance;
    setIsRedeeming(true);
    setError(null);

    // 1. Optimistically deduct coin balance in UI
    setBalance({
      ...previousBalance,
      coin_balance: previousBalance.coin_balance - reward.coin_cost,
      total_coins_redeemed: previousBalance.total_coins_redeemed + reward.coin_cost
    });

    try {
      // 2. Dispatch backend call
      const res = await redeemVoucher(reward.id);
      setLastRedemption(res);
      
      // Update balance with authoritative backend return
      setBalance(prev => prev ? { ...prev, coin_balance: res.remaining_balance } : null);
      setIsRedeeming(false);
      return true;
    } catch (err: any) {
      // 3. Rollback balance cleanly on API error
      console.warn('Redemption failed! Rolling back balance.', err);
      setBalance(previousBalance);
      setError(err.message || 'Redemption failed. Balance has been restored.');
      setIsRedeeming(false);
      return false;
    }
  };

  return {
    balance,
    catalogue,
    isLoading,
    isRedeeming,
    error,
    lastRedemption,
    reload: loadRewardsData,
    redeemReward: handleRedeem,
    clearError: () => setError(null)
  };
}
