import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { RewardItem } from '../../lib/types';
import { Coins, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

interface RewardsCatalogueProps {
  rewards: RewardItem[];
  userBalance: number;
  onSelectReward: (reward: RewardItem) => void;
  isLoading: boolean;
}

export const RewardsCatalogue: React.FC<RewardsCatalogueProps> = ({
  rewards,
  userBalance,
  onSelectReward,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cp-text-muted)' }}>
        Loading rewards catalogue...
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--cp-text-primary)' }}>
          Rewards & Voucher Catalogue
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)', marginTop: '2px' }}>
          Redeem your CredCoins instantly for partner vouchers, bill cashbacks, and discount coupons.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {rewards.map(reward => {
          const canAfford = userBalance >= reward.coin_cost;
          const isOutOfStock = reward.stock <= 0;

          return (
            <Card
              key={reward.id}
              padding="lg"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                position: 'relative',
                overflow: 'hidden',
                opacity: isOutOfStock ? 0.6 : 1
              }}
            >
              {/* Top Row: Partner & Category */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Badge variant="accent">{reward.category}</Badge>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 800, fontSize: '1rem' }}>
                  <Coins size={18} color="#F59E0B" />
                  {reward.coin_cost} coins
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)' }}>
                  {reward.title}
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                  {reward.description}
                </p>
              </div>

              {/* Partner Name & Value */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--cp-border-subtle)',
                fontSize: '0.8125rem'
              }}>
                <span style={{ color: 'var(--cp-text-muted)', fontWeight: 500 }}>
                  Partner: <strong style={{ color: 'var(--cp-text-primary)' }}>{reward.partner_name}</strong>
                </span>
                <span style={{ color: '#34D399', fontWeight: 700 }}>
                  Value: ₹{reward.value_inr.toLocaleString()}
                </span>
              </div>

              {/* Redeem Button */}
              <Button
                variant={canAfford && !isOutOfStock ? 'gold' : 'secondary'}
                disabled={!canAfford || isOutOfStock}
                onClick={() => onSelectReward(reward)}
                style={{ width: '100%' }}
              >
                <Gift size={16} />
                {isOutOfStock ? 'Out of Stock' : canAfford ? 'Redeem Voucher' : `Need ${reward.coin_cost - userBalance} More Coins`}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
