import { NextResponse } from 'next/server';
import { getRewardsCatalogueData } from '@/lib/db-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getRewardsCatalogueData();
  return NextResponse.json(data);
}
