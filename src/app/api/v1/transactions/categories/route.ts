import { NextResponse } from 'next/server';
import { getCategoriesData } from '@/lib/db-server';

export async function GET() {
  const data = getCategoriesData();
  return NextResponse.json(data);
}
