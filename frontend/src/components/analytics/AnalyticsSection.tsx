import React from 'react';
import { CategoryChart } from './CategoryChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { AnalyticsSummaryResponse } from '../../lib/types';

interface AnalyticsSectionProps {
  analytics: AnalyticsSummaryResponse | null;
  isLoading: boolean;
  selectedCategoryId: string;
  onCategoryClick: (categoryId: string) => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  analytics,
  isLoading,
  selectedCategoryId,
  onCategoryClick
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--cp-text-muted)' }}>
        Loading spend analytics...
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
      <CategoryChart
        data={analytics.category_breakdown}
        selectedCategoryId={selectedCategoryId}
        onCategoryClick={onCategoryClick}
      />
      <MonthlyTrendChart
        data={analytics.monthly_trend}
      />
    </div>
  );
};
