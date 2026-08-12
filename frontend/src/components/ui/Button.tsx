import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--cp-radius-md)',
    transition: 'all var(--cp-transition-fast)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    border: 'none',
    outline: 'none',
    opacity: disabled || isLoading ? 0.6 : 1,
    whiteSpace: 'nowrap'
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '0.8125rem' },
    md: { padding: '8px 16px', fontSize: '0.875rem' },
    lg: { padding: '12px 24px', fontSize: '1rem' }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--cp-accent-primary)',
      color: '#FFFFFF',
      boxShadow: '0 2px 4px rgba(99, 102, 241, 0.3)'
    },
    secondary: {
      backgroundColor: 'var(--cp-bg-surface-elevated)',
      color: 'var(--cp-text-primary)',
      border: '1px solid var(--cp-border-default)'
    },
    danger: {
      backgroundColor: 'var(--cp-accent-rose)',
      color: '#FFFFFF'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--cp-text-secondary)'
    },
    gold: {
      background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      color: '#000000',
      fontWeight: 700,
      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
    }
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      }}
      className={className}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      ) : null}
      {children}
    </button>
  );
};
