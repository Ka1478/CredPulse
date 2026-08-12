import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  error?: string | null;
  onRetry?: () => void;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No transactions found matching criteria.',
  error = null,
  onRetry
}: TableProps<T>) {
  if (error) {
    return (
      <div className="cp-table-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--cp-accent-rose)', fontWeight: 600, marginBottom: '12px' }}>
          Failed to load table data: {error}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--cp-bg-surface-elevated)',
              color: 'var(--cp-text-primary)',
              border: '1px solid var(--cp-border-default)',
              borderRadius: 'var(--cp-radius-md)',
              cursor: 'pointer'
            }}
          >
            Retry Loading
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="cp-table-container">
      <table className="cp-table">
        <thead>
          <tr>
            {columns.map(col => {
              const isSorted = sortBy === col.key;
              return (
                <th
                  key={col.key}
                  className={col.sortable ? 'sortable' : ''}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  style={{ textAlign: col.align || 'left', width: col.width }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {col.header}
                    {col.sortable && (
                      <span style={{ display: 'inline-flex', opacity: isSorted ? 1 : 0.4 }}>
                        {isSorted ? (
                          sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        ) : (
                          <ArrowUpDown size={14} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`}>
                {columns.map(col => (
                  <td key={col.key}>
                    <div
                      style={{
                        height: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '4px',
                        width: '80%',
                        animation: 'pulse 1.5s ease-in-out infinite'
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : isEmpty || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--cp-text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(item => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRowClick && onRowClick(item);
                  }
                }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
