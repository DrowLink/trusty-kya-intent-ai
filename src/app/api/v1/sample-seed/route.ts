import { NextRequest, NextResponse } from 'next/server';
import { intentStore } from '@/lib/storage/intentStore';
import { SAMPLE_MANDATES, SAMPLE_APPROVAL_QUEUE, SAMPLE_DECISIONS_AUDIT } from '@/lib/data/consoleData';
import { isAuthorizedAdmin } from '@/lib/security/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authorization required to re-seed demo data in production' },
      { status: 403 }
    );
  }

  try {
    await intentStore.loadSampleData(SAMPLE_MANDATES, SAMPLE_APPROVAL_QUEUE, SAMPLE_DECISIONS_AUDIT);
    return NextResponse.json({
      success: true,
      message: 'Sample pitch scenarios loaded into store',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorizedAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authorization required to purge data store' },
      { status: 403 }
    );
  }

  try {
    await intentStore.clearAll();
    return NextResponse.json({
      success: true,
      message: 'Store cleared to empty state',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
