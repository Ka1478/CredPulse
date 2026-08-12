import { NextRequest, NextResponse } from 'next/server';
import { redeemVoucherData } from '@/lib/db-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reward_id } = body;
    if (!reward_id) {
      return NextResponse.json({ detail: 'reward_id is required' }, { status: 400 });
    }
    const data = redeemVoucherData(reward_id);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || 'Redemption failed' }, { status: 400 });
  }
}
