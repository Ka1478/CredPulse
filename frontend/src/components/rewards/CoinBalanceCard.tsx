import React from 'react';
import { Card } from '../ui/Card';
import { CoinBalance } from '../../lib/types';
import { Coins, Sparkles, Award, ShieldCheck } from 'lucide-react';

interface CoinBalanceCardProps {
  balance: CoinBalance | null;
}

export const CoinBalanceCard: React.FC<CoinBalanceCardProps> = ({ balance }) => {
  if (!balance) return null;

  return (
    <Card padding="lg" style={{
      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {/* Left balance display */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Coins size={22} color="#F59E0B" />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your CredCoin Vault
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            {balance.coin_balance.toLocaleString()} <span style={{ fontSize: '1.25rem', color: '#FBBF24', fontWeight: 600 }}>coins</span>
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#F59E0B" />
            Earn 1 CredCoin per ₹100 spent on all successful bill payments & purchases.
          </p>
        </div>

        {/* Right summary stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          padding: '12px 20px',
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          borderRadius: 'var(--cp-radius-md)',
          border: '1px solid var(--cp-border-subtle)'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>TOTAL EARNED</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)', marginTop: '2px' }}>
              {balance.total_coins_earned.toLocaleString()} coins
            </p>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--cp-border-subtle)' }} />
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 600 }}>TOTAL REDEEMED</p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#34D399', marginTop: '2px' }}>
              {balance.total_coins_redeemed.toLocaleString()} coins
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
