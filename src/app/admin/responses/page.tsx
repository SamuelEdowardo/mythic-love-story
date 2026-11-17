'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ResponsesDashboard from '@/components/admin/ResponsesDashboard';
import type { ProposalRecord, DashboardStats } from '@/types';

export default function AdminResponsesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ProposalRecord[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        // 1. Verify user session via client
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session?.user) {
          router.replace('/admin/login');
          return;
        }

        // 2. Fetch responses via API route
        const res = await fetch('/api/admin/responses');
        const json = await res.json();

        if (isMounted && Array.isArray(json.data)) {
          setResponses(json.data);
        }
      } catch (err) {
        console.error('[Admin Responses Page] Error loading responses:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-mystic-gold animate-spin mb-4" />
        <p className="font-heading text-mystic-gold tracking-widest text-sm uppercase">
          Memuat Arsip Tanggapan...
        </p>
      </main>
    );
  }

  const stats: DashboardStats = {
    totalResponses: responses.length,
    uniqueSessions: new Set(responses.map((r) => r.session_id)).size,
    yesCount: responses.filter((r) => r.response === 'yes').length,
    needMomentCount: responses.filter((r) => r.response === 'need_moment').length,
  };

  return <ResponsesDashboard responses={responses} stats={stats} />;
}
