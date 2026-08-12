import { NextResponse } from 'next/server';
import { getCoinBalanceData } from '@/lib/db-server';

export async function GET() {
  const data = getCoinBalanceData();
  return NextResponse.json(data);
}
