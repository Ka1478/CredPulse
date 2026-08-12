import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { MonthlyTrendItem } from '../../lib/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTrendChartProps {
  data: MonthlyTrendItem[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Card padding="lg" style={{ height: '100%', minHeight: '380px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--cp-text-primary)' }}>
          Monthly Spend Trend
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>
          Credit card expenditure over time (INR)
        </p>
      </div>

      <div style={{ width: '100%', height: '280px', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {!isMounted || !data || data.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--cp-text-muted)', fontSize: '0.875rem' }}>
            No trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280} minHeight={280}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
              <XAxis
                dataKey="month_name"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const val = payload[0].value as number;
                    const count = payload[0].payload.transaction_count;
                    return (
                      <div style={{
                        backgroundColor: 'var(--cp-bg-surface-elevated)',
                        border: '1px solid var(--cp-border-default)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        boxShadow: 'var(--cp-shadow-md)'
                      }}>
                        <div style={{ fontWeight: 700, color: 'var(--cp-text-primary)' }}>{label}</div>
                        <div style={{ fontSize: '0.875rem', color: '#818CF8', fontWeight: 700, marginTop: '4px' }}>
                          ₹{val.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                          {count} transactions
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="total_amount_inr"
                stroke="#6366F1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#spendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
