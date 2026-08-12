import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
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
      <select
        style={{
          width: '100%',
          backgroundColor: 'var(--cp-bg-surface-elevated)',
          color: 'var(--cp-text-primary)',
          border: '1px solid var(--cp-border-default)',
          borderRadius: 'var(--cp-radius-md)',
          padding: '10px 12px',
          fontSize: '0.875rem',
          outline: 'none',
          cursor: 'pointer',
          ...style
        }}
        className={className}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1F2937', color: '#F9FAFB' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
