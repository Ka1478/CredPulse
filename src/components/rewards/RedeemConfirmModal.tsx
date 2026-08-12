import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RewardItem, RedemptionResponse } from '../../lib/types';
import { Coins, Gift, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RedeemConfirmModalProps {
  reward: RewardItem | null;
  userBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRedeem: (reward: RewardItem) => void;
  isRedeeming: boolean;
  error: string | null;
  lastRedemption: RedemptionResponse | null;
}

export const RedeemConfirmModal: React.FC<RedeemConfirmModalProps> = ({
  reward,
  userBalance,
  isOpen,
  onClose,
  onConfirmRedeem,
  isRedeeming,
  error,
  lastRedemption
}) => {
  if (!reward || !isOpen) return null;

  const isSuccess = lastRedemption && lastRedemption.reward_title === reward.title;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuccess ? 'Voucher Redeemed Successfully!' : 'Confirm Reward Redemption'}
      footer={
        isSuccess ? (
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose} disabled={isRedeeming}>
              Cancel
            </Button>
            <Button
              variant="gold"
              onClick={() => onConfirmRedeem(reward)}
              isLoading={isRedeeming}
            >
              Confirm & Redeem ({reward.coin_cost} coins)
            </Button>
          </>
        )
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Error Alert Box with rollback explanation */}
        {error && (
          <div style={{
            backgroundColor: 'var(--cp-status-failed-bg)',
            border: '1px solid var(--cp-accent-rose)',
            padding: '12px 16px',
            borderRadius: 'var(--cp-radius-md)',
            color: 'var(--cp-status-failed-text)',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertTriangle size={20} color="var(--cp-accent-rose)" />
            <div>
              <strong>Redemption Failed:</strong> {error}
            </div>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} color="#34D399" />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cp-text-primary)' }}>
              {lastRedemption.reward_title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cp-text-secondary)', marginTop: '4px' }}>
              Your unique voucher e-code has been generated:
            </p>

            <div style={{
              backgroundColor: 'var(--cp-bg-surface)',
              border: '2px dashed var(--cp-accent-emerald)',
              padding: '14px 20px',
              borderRadius: 'var(--cp-radius-md)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#34D399',
              letterSpacing: '0.08em',
              margin: '16px 0',
              fontFamily: 'var(--cp-font-mono)'
            }}>
              {lastRedemption.voucher_code}
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-muted)' }}>
              Spent {lastRedemption.coins_spent} coins. Remaining coin balance: <strong style={{ color: '#FBBF24' }}>{lastRedemption.remaining_balance} coins</strong>.
            </p>
          </div>
        ) : (
          /* Confirmation View */
          <div>
            <div style={{
              backgroundColor: 'rgba(31, 41, 55, 0.6)',
              padding: '16px',
              borderRadius: 'var(--cp-radius-md)',
              border: '1px solid var(--cp-border-subtle)',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)' }}>
                {reward.title}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)', marginTop: '4px' }}>
                {reward.description}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cp-text-secondary)' }}>
                <span>Voucher Value:</span>
                <strong style={{ color: '#34D399' }}>₹{reward.value_inr}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cp-text-secondary)' }}>
                <span>Voucher Cost:</span>
                <strong style={{ color: '#FBBF24' }}>{reward.coin_cost} CredCoins</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cp-text-secondary)', paddingTop: '8px', borderTop: '1px solid var(--cp-border-subtle)' }}>
                <span>Balance After Redemption:</span>
                <strong style={{ color: 'var(--cp-text-primary)' }}>{userBalance - reward.coin_cost} coins</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
