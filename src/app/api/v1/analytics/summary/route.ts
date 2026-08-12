import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummaryData } from '@/lib/db-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('category_id') || undefined;
  const status = searchParams.get('status') || undefined;
  const minAmount = searchParams.get('min_amount') ? parseFloat(searchParams.get('min_amount')!) : undefined;
  const maxAmount = searchParams.get('max_amount') ? parseFloat(searchParams.get('max_amount')!) : undefined;
  const startDate = searchParams.get('start_date') || undefined;
  const endDate = searchParams.get('end_date') || undefined;

  const data = await getAnalyticsSummaryData({
    search,
    categoryId,
    status,
    minAmount,
    maxAmount,
    startDate,
    endDate
  });

  return NextResponse.json(data);
}
