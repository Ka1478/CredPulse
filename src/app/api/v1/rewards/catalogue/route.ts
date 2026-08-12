import { NextResponse } from 'next/server';
import { getRewardsCatalogueData } from '@/lib/db-server';

export async function GET() {
  const data = getRewardsCatalogueData();
  return NextResponse.json(data);
}
