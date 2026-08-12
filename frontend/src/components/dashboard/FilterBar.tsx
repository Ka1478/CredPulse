import React from 'react';
import { Search, Filter, RotateCcw, Calendar, DollarSign } from 'lucide-react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Category, TransactionFilters } from '../../lib/types';

interface FilterBarProps {
  filters: TransactionFilters;
  categories: Category[];
  onSearchChange: (val: string) => void;
  onCategoryChange: (catId: string) => void;
  onStatusChange: (status: string) => void;
  onAmountRangeChange: (min?: number, max?: number) => void;
  onDateRangeChange: (start: string, end: string) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAmountRangeChange,
  onDateRangeChange,
  onReset
}) => {
  const categoryOptions = [
    { value: 'ALL', label: 'All Categories' },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAILED', label: 'Failed' }
  ];

  return (
    <div style={{
      backgroundColor: 'var(--cp-bg-glass)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--cp-border-subtle)',
      borderRadius: 'var(--cp-radius-lg)',
      padding: '16px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top row: Search & Core Filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        alignItems: 'end'
      }}>
        {/* Search */}
        <Input
          placeholder="Search merchant name..."
          icon={<Search size={16} />}
          value={filters.search}
          onChange={e => onSearchChange(e.target.value)}
        />

        {/* Category */}
        <Select
          options={categoryOptions}
          value={filters.categoryId}
          onChange={e => onCategoryChange(e.target.value)}
        />

        {/* Payment Status */}
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={e => onStatusChange(e.target.value)}
        />

        {/* Reset Button */}
        <Button variant="secondary" onClick={onReset} style={{ height: '42px' }}>
          <RotateCcw size={16} />
          Reset Filters
        </Button>
      </div>

      {/* Advanced row: Amount & Date Ranges */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        paddingTop: '8px',
        borderTop: '1px solid var(--cp-border-subtle)'
      }}>
        {/* Min Amount */}
        <Input
          type="number"
          placeholder="Min Amount (₹)"
          value={filters.minAmount !== undefined ? filters.minAmount : ''}
          onChange={e => {
            const val = e.target.value ? parseFloat(e.target.value) : undefined;
            onAmountRangeChange(val, filters.maxAmount);
          }}
        />

        {/* Max Amount */}
        <Input
          type="number"
          placeholder="Max Amount (₹)"
          value={filters.maxAmount !== undefined ? filters.maxAmount : ''}
          onChange={e => {
            const val = e.target.value ? parseFloat(e.target.value) : undefined;
            onAmountRangeChange(filters.minAmount, val);
          }}
        />

        {/* Start Date */}
        <Input
          type="date"
          value={filters.startDate ? filters.startDate.split('T')[0] : ''}
          onChange={e => {
            const val = e.target.value ? new Date(e.target.value).toISOString() : '';
            onDateRangeChange(val, filters.endDate);
          }}
        />

        {/* End Date */}
        <Input
          type="date"
          value={filters.endDate ? filters.endDate.split('T')[0] : ''}
          onChange={e => {
            const val = e.target.value ? new Date(e.target.value).toISOString() : '';
            onDateRangeChange(filters.startDate, val);
          }}
        />
      </div>
    </div>
  );
};
