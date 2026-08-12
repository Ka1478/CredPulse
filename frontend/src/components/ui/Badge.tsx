import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'pending' | 'failed' | 'neutral' | 'accent' | 'gold';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md'
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    success: { backgroundColor: 'var(--cp-status-success-bg)', color: 'var(--cp-status-success-text)' },
    pending: { backgroundColor: 'var(--cp-status-pending-bg)', color: 'var(--cp-status-pending-text)' },
    failed: { backgroundColor: 'var(--cp-status-failed-bg)', color: 'var(--cp-status-failed-text)' },
    neutral: { backgroundColor: 'rgba(156, 163, 175, 0.15)', color: '#D1D5DB' },
    accent: { backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' },
    gold: { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '2px 8px', fontSize: '0.75rem' },
    md: { padding: '4px 10px', fontSize: '0.8125rem' }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        borderRadius: 'var(--cp-radius-full)',
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
    >
      {children}
    </span>
  );
};
