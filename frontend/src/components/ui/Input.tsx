import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  style,
  className = '',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--cp-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {icon && (
          <span style={{ position: 'absolute', left: '12px', color: 'var(--cp-text-muted)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            backgroundColor: 'var(--cp-bg-surface-elevated)',
            color: 'var(--cp-text-primary)',
            border: '1px solid var(--cp-border-default)',
            borderRadius: 'var(--cp-radius-md)',
            padding: icon ? '10px 12px 10px 38px' : '10px 12px',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color var(--cp-transition-fast)',
            ...style
          }}
          className={className}
          {...props}
        />
      </div>
    </div>
  );
};
