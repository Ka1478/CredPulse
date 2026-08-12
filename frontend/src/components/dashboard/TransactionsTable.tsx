import React from 'react';
import { Table, Column } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { Transaction, TransactionFilters } from '../../lib/types';
import { ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import { Button } from '../ui/Button';

interface TransactionsTableProps {
  transactions: Transaction[];
  totalCount: number;
  totalPages: number;
  filters: TransactionFilters;
  isLoading: boolean;
  error: string | null;
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  onRowClick: (txn: Transaction) => void;
  onRetry: () => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  totalCount,
  totalPages,
  filters,
  isLoading,
  error,
  onSort,
  onPageChange,
  onRowClick,
  onRetry
}) => {
  const columns: Column<Transaction>[] = [
    {
      key: 'merchant_name',
      header: 'Merchant / Description',
      sortable: true,
      render: txn => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--cp-text-primary)' }}>{txn.merchant_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)', marginTop: '2px' }}>
            {txn.txn_ref} • {txn.payment_method}
          </div>
        </div>
      )
    },
    {
      key: 'category_name',
      header: 'Category',
      render: txn => (
        <Badge variant="accent">
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: txn.category_color || '#6366F1' }} />
          {txn.category_name || 'General'}
        </Badge>
      )
    },
    {
      key: 'date',
      header: 'Date & Time',
      sortable: true,
      render: txn => {
        const dt = new Date(txn.date);
        return (
          <span style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)' }}>
            {dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} at {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        );
      }
    },
    {
      key: 'amount_inr',
      header: 'Amount (₹)',
      sortable: true,
      align: 'right',
      render: txn => (
        <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--cp-text-primary)' }}>
          ₹{txn.amount_inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: txn => {
        const variant = txn.status === 'SUCCESS' ? 'success' : txn.status === 'PENDING' ? 'pending' : 'failed';
        return <Badge variant={variant}>{txn.status}</Badge>;
      }
    },
    {
      key: 'reward_coins_earned',
      header: 'Coins Earned',
      align: 'right',
      render: txn => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 600, fontSize: '0.8125rem' }}>
          <Coins size={14} color="#F59E0B" />
          +{txn.reward_coins_earned}
        </span>
      )
    }
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={transactions}
        keyExtractor={item => item.id}
        onRowClick={onRowClick}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
        onSort={onSort}
        isLoading={isLoading}
        isEmpty={!isLoading && transactions.length === 0}
        error={error}
        onRetry={onRetry}
      />

      {/* Pagination Footer Controls */}
      {!isLoading && !error && totalPages > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 4px',
          marginTop: '8px'
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cp-text-secondary)' }}>
            Showing page <strong style={{ color: 'var(--cp-text-primary)' }}>{filters.page}</strong> of <strong style={{ color: 'var(--cp-text-primary)' }}>{totalPages}</strong> ({totalCount.toLocaleString()} total transactions)
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page <= 1}
              onClick={() => onPageChange(filters.page - 1)}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 8px', color: 'var(--cp-text-primary)' }}>
              Page {filters.page}
            </span>

            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page >= totalPages}
              onClick={() => onPageChange(filters.page + 1)}
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
