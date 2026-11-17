import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const adminDb = createAdminClient();
    const { data, error } = await adminDb
      .from('proposal_responses')
      .select('id, session_id, response, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API Admin Responses] Database error:', error.message);
      return NextResponse.json({ error: error.message, data: [] }, { status: 200 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[API Admin Responses] Unexpected error:', message);
    return NextResponse.json({ error: message, data: [] }, { status: 200 });
  }
}
