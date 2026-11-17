import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import ResponsesDashboard from '@/components/admin/ResponsesDashboard';
import type { ProposalRecord, DashboardStats } from '@/types';


export const metadata = {
  title: 'Admin Responses | MYTHIC: A Legendary Love Story',
  description: 'View recorded proposal responses and journey engagement analytics',
};

/**
 * Checks whether Supabase environment variables are properly configured
 * and not set to default template placeholders.
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return false;
  }

  if (
    url === 'your_supabase_project_url' ||
    anonKey === 'your_supabase_anon_key' ||
    url.includes('placeholder')
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async function AdminResponsesPage() {
  // 1. Verify if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    return (
      <main className="relative min-h-screen w-full bg-midnight text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-royal-purple selection:text-mystic-gold overflow-hidden">
        {/* Background atmospheric gradients */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(118,80,184,0.35),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_115%,rgba(48,32,92,0.6),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-2xl">
          {/* Ornate Card Container */}
          <div className="relative rounded-2xl border border-royal-purple/40 bg-deep-purple/40 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_50px_rgba(48,32,92,0.7)] text-center">
            {/* Top decorative rune accent */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-mystic-gold/50 bg-midnight/80 shadow-[0_0_25px_rgba(231,190,114,0.35)]">
              <svg
                className="h-10 w-10 text-mystic-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <path d="M12 12v6" />
                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-mystic-gold/30 bg-midnight/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-mystic-gold mb-4">
              <span className="h-2 w-2 rounded-full bg-mystic-gold animate-pulse" />
              Realm Archives Dormant
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-gradient-gold mb-3">
              Database Not Configured
            </h1>

            <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-lg mx-auto">
              The mystical connection to Supabase has not yet been forged. To record and view Geget&apos;s answers and journey milestones, please configure your Supabase credentials.
            </p>

            {/* Instruction Box */}
            <div className="rounded-xl border border-royal-purple/30 bg-midnight/70 p-4 sm:p-5 text-left mb-8">
              <h2 className="font-heading text-xs uppercase tracking-wider text-mystic-gold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-mystic-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Required Configuration in <code className="text-soft-pink font-mono">.env.local</code>:
              </h2>
              <div className="space-y-2 text-xs font-mono text-white/70 bg-deep-purple/30 p-3 rounded-lg border border-royal-purple/20 overflow-x-auto">
                <div className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                <div className="text-emerald-400">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                <div className="text-emerald-400">SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admin/responses"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-xl border border-mystic-gold bg-deep-purple hover:bg-royal-purple text-mystic-gold hover:text-white font-heading text-sm font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(231,190,114,0.25)] hover:shadow-[0_0_25px_rgba(231,190,114,0.4)]"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.038 8.038 0 01-15.357-2m15.357 2H15" />
                </svg>
                Check Connection Again
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-xl border border-royal-purple/40 bg-midnight/70 hover:bg-deep-purple/60 text-white/80 hover:text-white font-body text-sm font-medium transition-all"
              >
                Return to Realm
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 2. Authentication & Admin Role Verification
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // If unauthenticated or auth error, redirect to /admin/login
  if (authError || !user) {
    redirect('/admin/login');
  }

  // Verifies admin role from user's app_metadata
  const appMetadata = (user.app_metadata || {}) as Record<string, unknown>;
  const role = appMetadata.role;
  const isAdmin =
    user.email === 'samueledowardo1910@gmail.com' ||
    role === 'admin' ||
    appMetadata.is_admin === true ||
    (Array.isArray(appMetadata.roles) && appMetadata.roles.includes('admin'));

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // 3. Fetch proposal responses from Supabase ordered by created_at DESC using admin client
  let data: any[] | null = null;
  let dbError: any = null;

  try {
    const adminDb = createAdminClient();
    const result = await adminDb
      .from('proposal_responses')
      .select('id, session_id, response, created_at')
      .order('created_at', { ascending: false });
    data = result.data;
    dbError = result.error;
  } catch (err: any) {
    dbError = err;
  }

  if (dbError) {
    console.error('[Admin Responses] Database error while fetching responses:', dbError.message);
  }

  const proposalRecords: ProposalRecord[] = (data || []) as ProposalRecord[];

  // 4. Calculate stats: total responses, unique sessions, yes count, need_moment count
  const stats: DashboardStats = {
    totalResponses: proposalRecords.length,
    uniqueSessions: new Set(proposalRecords.map((r) => r.session_id)).size,
    yesCount: proposalRecords.filter((r) => r.response === 'yes').length,
    needMomentCount: proposalRecords.filter((r) => r.response === 'need_moment').length,
  };

  // 5. Pass data to client component ResponsesDashboard
  return <ResponsesDashboard responses={proposalRecords} stats={stats} />;
}
