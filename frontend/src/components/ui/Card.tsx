import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  const paddings: Record<string, string> = {
    none: '0px',
    sm: '12px',
    md: '20px',
    lg: '28px'
  };

  const variants: Record<string, React.CSSProperties> = {
    glass: {
      backgroundColor: 'var(--cp-bg-glass)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--cp-border-subtle)',
      boxShadow: 'var(--cp-shadow-md)'
    },
    solid: {
      backgroundColor: 'var(--cp-bg-surface-elevated)',
      border: '1px solid var(--cp-border-subtle)'
    },
    bordered: {
      backgroundColor: 'transparent',
      border: '1px solid var(--cp-border-default)'
    }
  };

  return (
    <div
      style={{
        borderRadius: 'var(--cp-radius-lg)',
        padding: paddings[padding],
        transition: 'all var(--cp-transition-normal)',
        ...variants[variant],
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
