import React from 'react';
import { CreditCard, Coins, Sparkles, BarChart3, Receipt, Gift } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  coinBalance: number;
  activeTab: 'transactions' | 'analytics' | 'rewards';
  onTabChange: (tab: 'transactions' | 'analytics' | 'rewards') => void;
}

export const Header: React.FC<HeaderProps> = ({
  coinBalance,
  activeTab,
  onTabChange
}) => {
  return (
    <header style={{
      width: '100%',
      backgroundColor: 'var(--cp-bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--cp-border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Logo Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--cp-radius-md)',
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--cp-shadow-glow)'
          }}>
            <CreditCard size={22} color="#FFFFFF" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #F9FAFB, #9CA3AF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CredPulse
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', fontWeight: 500 }}>
              Credit Card Bill & Rewards Dashboard
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--cp-bg-surface)', padding: '4px', borderRadius: 'var(--cp-radius-md)', border: '1px solid var(--cp-border-subtle)' }}>
          <button
            onClick={() => onTabChange('transactions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--cp-radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'transactions' ? 'var(--cp-accent-primary)' : 'transparent',
              color: activeTab === 'transactions' ? '#FFFFFF' : 'var(--cp-text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--cp-transition-fast)'
            }}
          >
            <Receipt size={16} />
            Transactions
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--cp-radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'analytics' ? 'var(--cp-accent-primary)' : 'transparent',
              color: activeTab === 'analytics' ? '#FFFFFF' : 'var(--cp-text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--cp-transition-fast)'
            }}
          >
            <BarChart3 size={16} />
            Analytics
          </button>

          <button
            onClick={() => onTabChange('rewards')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--cp-radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'rewards' ? 'var(--cp-accent-primary)' : 'transparent',
              color: activeTab === 'rewards' ? '#FFFFFF' : 'var(--cp-text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--cp-transition-fast)'
            }}
          >
            <Gift size={16} />
            Rewards
          </button>
        </nav>

        {/* Coin Balance Header Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => onTabChange('rewards')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: 'var(--cp-radius-full)',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#FBBF24',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all var(--cp-transition-fast)'
            }}
          >
            <Coins size={18} color="#F59E0B" />
            <span>{coinBalance.toLocaleString()} CredCoins</span>
            <Sparkles size={14} color="#F59E0B" />
          </button>
        </div>
      </div>
    </header>
  );
};
