import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { CategoryAnalyticsItem } from '../../lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryChartProps {
  data: CategoryAnalyticsItem[];
  selectedCategoryId: string;
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  data,
  selectedCategoryId,
  onCategoryClick
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe numerical aggregation of total spend across all categories in the filtered dataset
  const totalFilteredAmount = data.reduce((sum, item) => sum + Number(item.total_amount_inr || 0), 0);

  // Transform and sort chart data by total spend amount in descending order
  const chartData = data
    .filter(item => Number(item.total_amount_inr || 0) > 0 || item.transaction_count > 0)
    .sort((a, b) => Number(b.total_amount_inr || 0) - Number(a.total_amount_inr || 0))
    .map(item => {
      const val = Number(item.total_amount_inr || 0);
      const pct = totalFilteredAmount > 0 ? Math.round((val / totalFilteredAmount) * 1000) / 10 : 0;
      return {
        name: item.category_name,
        value: val,
        color: item.category_color,
        id: item.category_id,
        count: item.transaction_count,
        percentage: pct
      };
    });

  // Handler for slice / cell / legend clicks to toggle category filtering
  const handleSliceClick = (entry: any) => {
    const catId = entry?.id || entry?.payload?.id;
    if (catId) {
      if (selectedCategoryId === catId) {
        onCategoryClick('ALL');
      } else {
        onCategoryClick(catId);
      }
    }
  };

  return (
    <Card padding="lg" style={{ height: '100%', minHeight: '380px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)' }}>
            Spend by Category
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>
            Click a slice to filter transaction table
          </p>
        </div>
        {selectedCategoryId !== 'ALL' && (
          <button
            onClick={() => onCategoryClick('ALL')}
            style={{
              fontSize: '0.75rem',
              color: 'var(--cp-accent-primary)',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: 'none',
              padding: '4px 10px',
              borderRadius: 'var(--cp-radius-full)',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'background-color 0.2s ease'
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div style={{ width: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!isMounted || chartData.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--cp-text-muted)', fontSize: '0.875rem', padding: '40px 0' }}>
            No category spend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320} minHeight={300}>
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="42%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                onClick={handleSliceClick}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.color}
                    stroke={selectedCategoryId === entry.id ? '#FFFFFF' : 'transparent'}
                    strokeWidth={selectedCategoryId === entry.id ? 3 : 1}
                    opacity={selectedCategoryId === 'ALL' || selectedCategoryId === entry.id ? 1 : 0.45}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => handleSliceClick(entry)}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const formattedAmount = item.value.toLocaleString('en-IN', {
                      maximumFractionDigits: 2
                    });
                    return (
                      <div style={{
                        backgroundColor: 'var(--cp-bg-surface-elevated)',
                        border: '1px solid var(--cp-border-default)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        boxShadow: 'var(--cp-shadow-md)'
                      }}>
                        <div style={{ fontWeight: 700, color: item.color }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#F9FAFB', marginTop: '4px', fontWeight: 600 }}>
                          ₹{formattedAmount} — ({item.percentage}%)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '2px' }}>
                          {item.count.toLocaleString('en-IN')} transactions
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '16px', lineHeight: '1.6' }}
                formatter={(value, entry: any) => {
                  const item = entry.payload;
                  if (!item) return value;
                  const formattedAmount = item.value.toLocaleString('en-IN', {
                    maximumFractionDigits: 2
                  });
                  return (
                    <span
                      onClick={() => handleSliceClick(item)}
                      style={{
                        color: 'var(--cp-text-secondary)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        padding: '2px 4px',
                        borderRadius: '4px'
                      }}
                    >
                      <strong style={{ color: item.color }}>{item.name}</strong> — ₹{formattedAmount} — <span style={{ fontWeight: 700, color: 'var(--cp-text-primary)' }}>{item.percentage}%</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
