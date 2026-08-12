import { NextRequest, NextResponse } from 'next/server';
import { getTransactionsData } from '@/lib/db-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || '20', 10);
  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('category_id') || undefined;
  const status = searchParams.get('status') || undefined;
  const minAmount = searchParams.get('min_amount') ? parseFloat(searchParams.get('min_amount')!) : undefined;
  const maxAmount = searchParams.get('max_amount') ? parseFloat(searchParams.get('max_amount')!) : undefined;
  const startDate = searchParams.get('start_date') || undefined;
  const endDate = searchParams.get('end_date') || undefined;
  const sortBy = searchParams.get('sort_by') || 'date';
  const sortOrder = searchParams.get('sort_order') || 'desc';

  const data = await getTransactionsData({
    page,
    pageSize,
    search,
    categoryId,
    status,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    sortBy,
    sortOrder
  });

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store'
    }
  });
}
