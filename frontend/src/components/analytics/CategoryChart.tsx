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

  const chartData = data.map(item => ({
    name: item.category_name,
    value: item.total_amount_inr,
    color: item.category_color,
    id: item.category_id,
    count: item.transaction_count,
    percentage: item.percentage
  }));

  const handleSliceClick = (entry: any) => {
    if (entry && entry.id) {
      if (selectedCategoryId === entry.id) {
        onCategoryClick('ALL');
      } else {
        onCategoryClick(entry.id);
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
              fontWeight: 600
            }}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div style={{ width: '100%', height: '280px', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!isMounted || chartData.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--cp-text-muted)', fontSize: '0.875rem' }}>
            No category spend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280} minHeight={280}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
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
                    opacity={selectedCategoryId === 'ALL' || selectedCategoryId === entry.id ? 1 : 0.4}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div style={{
                        backgroundColor: 'var(--cp-bg-surface-elevated)',
                        border: '1px solid var(--cp-border-default)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        boxShadow: 'var(--cp-shadow-md)'
                      }}>
                        <div style={{ fontWeight: 700, color: item.color }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#F9FAFB', marginTop: '4px' }}>
                          ₹{item.value.toLocaleString('en-IN')} ({item.percentage}%)
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {item.count} transactions
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
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
