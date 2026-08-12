import { NextResponse } from 'next/server';
import { getCategoriesData } from '@/lib/db-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = getCategoriesData();
  return NextResponse.json(data);
}
