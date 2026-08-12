import React from 'react';
import { Card } from '../ui/Card';
import { IndianRupee, CreditCard, Coins, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  totalSpend: number;
  totalTransactions: number;
  coinBalance: number;
  totalEarnedCoins: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalSpend,
  totalTransactions,
  coinBalance,
  totalEarnedCoins
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Total Spend */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Card Spend
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cp-text-primary)', marginTop: '4px' }}>
              ₹{totalSpend.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--cp-radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={20} color="#818CF8" />
          </div>
        </div>
      </Card>

      {/* Total Transactions */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Transactions
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cp-text-primary)', marginTop: '4px' }}>
              {totalTransactions.toLocaleString()}
            </h2>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--cp-radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={20} color="#34D399" />
          </div>
        </div>
      </Card>

      {/* Available Coin Balance */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CredCoin Balance
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FBBF24', marginTop: '4px' }}>
              {coinBalance.toLocaleString()} coins
            </h2>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--cp-radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={20} color="#F59E0B" />
          </div>
        </div>
      </Card>

      {/* Total Earned Coins */}
      <Card padding="md">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cp-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Coins Earned
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cp-text-primary)', marginTop: '4px' }}>
              {totalEarnedCoins.toLocaleString()} coins
            </h2>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: 'var(--cp-radius-md)', backgroundColor: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="#A78BFA" />
          </div>
        </div>
      </Card>
    </div>
  );
};
