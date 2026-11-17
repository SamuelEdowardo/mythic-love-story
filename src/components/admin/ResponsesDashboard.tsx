'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { ProposalRecord, DashboardStats } from '@/types';

export interface ResponsesDashboardProps {
  responses: ProposalRecord[];
  stats: DashboardStats;
}

type FilterType = 'all' | 'yes' | 'need_moment';

export default function ResponsesDashboard({
  responses = [],
  stats = {
    totalResponses: 0,
    uniqueSessions: 0,
    yesCount: 0,
    needMomentCount: 0,
  },
}: ResponsesDashboardProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSessionId, setCopiedSessionId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered and searched responses
  const filteredResponses = useMemo(() => {
    return responses.filter((item) => {
      // 1. Filter by response type
      if (activeFilter === 'yes' && item.response !== 'yes') {
        return false;
      }
      if (activeFilter === 'need_moment' && item.response !== 'need_moment') {
        return false;
      }

      // 2. Filter by search query (matches session_id or response or timestamp)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesSession = item.session_id.toLowerCase().includes(query);
        const matchesResponse = item.response.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        return matchesSession || matchesResponse || matchesId;
      }

      return true;
    });
  }, [responses, activeFilter, searchQuery]);

  // Handle Admin Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('[ResponsesDashboard] Logout error:', err);
    } finally {
      router.push('/admin/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  // Handle Manual Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Handle Copy Session ID
  const handleCopySession = async (sessionId: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(sessionId);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = sessionId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedSessionId(sessionId);
      setTimeout(() => setCopiedSessionId(null), 2000);
    } catch (err) {
      console.error('[ResponsesDashboard] Failed to copy session ID:', err);
    }
  };

  // Truncate UUID for clean table display
  const truncateSessionId = (id: string): string => {
    if (!id) return '';
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  };

  // Format ISO timestamp to readable locale string
  const formatTimestamp = (isoString: string): string => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Export records to CSV for record keeping
  const handleExportCSV = () => {
    if (responses.length === 0) return;
    const headers = ['ID', 'Session ID', 'Response', 'Timestamp'];
    const rows = responses.map((r) => [
      `"${r.id}"`,
      `"${r.session_id}"`,
      `"${r.response}"`,
      `"${r.created_at}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mythic_proposal_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate percentage of yes responses
  const yesPercentage = stats.totalResponses > 0
    ? Math.round((stats.yesCount / stats.totalResponses) * 100)
    : 0;

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white selection:bg-royal-purple selection:text-mystic-gold overflow-x-hidden">
      {/* ─── ATMOSPHERIC BACKGROUND GRADIENTS ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(118,80,184,0.3),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_115%,rgba(48,32,92,0.5),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── TOP HEADER BAR ─── */}
        <header className="mb-8 flex flex-col gap-4 border-b border-royal-purple/30 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mystic-gold/40 bg-deep-purple/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-mystic-gold mb-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-mystic-gold animate-pulse" />
              Sanctuary of Answers
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide text-gradient-gold">
              Mythic Proposal Responses
            </h1>
            <p className="font-body text-xs sm:text-sm text-white/70 mt-1">
              Live chronicles of Geget&apos;s journey decisions and sacred answers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh responses"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-royal-purple/40 bg-deep-purple/40 hover:bg-royal-purple/30 text-white/90 hover:text-mystic-gold font-body text-sm font-medium transition-all active:scale-95 disabled:opacity-50"
              aria-label="Refresh data"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-mystic-gold' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.038 8.038 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline ml-2 text-xs font-heading">Refresh</span>
            </button>

            {/* Export CSV Button */}
            {responses.length > 0 && (
              <button
                onClick={handleExportCSV}
                title="Download CSV report"
                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl border border-mystic-gold/40 bg-midnight-light hover:bg-deep-purple/50 text-mystic-gold font-body text-sm font-medium transition-all active:scale-95"
                aria-label="Export to CSV"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline ml-2 text-xs font-heading">Export CSV</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 hover:text-white font-heading text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)] active:scale-95 disabled:opacity-50"
              aria-label="Log out of admin session"
            >
              {isLoggingOut ? (
                <svg className="h-4 w-4 animate-spin text-rose-300" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
              <span>{isLoggingOut ? 'Sealing...' : 'Logout'}</span>
            </button>
          </div>
        </header>

        {/* ─── 4 STAT CARDS ─── */}
        <section aria-label="Proposal Response Statistics" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Card 1: Total Responses */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-royal-purple/40 bg-deep-purple/30 backdrop-blur-md p-5 sm:p-6 shadow-[0_0_25px_rgba(48,32,92,0.4)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-white/70">
                  Total Responses
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mystic-gold/40 bg-midnight/80 text-mystic-gold shadow-[0_0_12px_rgba(231,190,114,0.25)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1">
                {stats.totalResponses}
              </div>
              <p className="font-body text-xs text-white/60">
                All submitted scrolls from visitors
              </p>
            </motion.div>

            {/* Card 2: Unique Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-royal-purple/40 bg-deep-purple/30 backdrop-blur-md p-5 sm:p-6 shadow-[0_0_25px_rgba(48,32,92,0.4)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-white/70">
                  Unique Sessions
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-royal-purple-light/40 bg-midnight/80 text-royal-purple-light shadow-[0_0_12px_rgba(139,107,201,0.25)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1">
                {stats.uniqueSessions}
              </div>
              <p className="font-body text-xs text-white/60">
                Distinct travelers throughout the realm
              </p>
            </motion.div>

            {/* Card 3: "Yes" Count */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-soft-pink/40 bg-deep-purple/30 backdrop-blur-md p-5 sm:p-6 shadow-[0_0_30px_rgba(243,166,206,0.18)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-soft-pink">
                  &ldquo;Yes&rdquo; Count
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-soft-pink/50 bg-soft-pink/15 text-soft-pink shadow-[0_0_15px_rgba(243,166,206,0.3)]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-soft-pink">
                  {stats.yesCount}
                </div>
                {stats.totalResponses > 0 && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-soft-pink/20 text-soft-pink border border-soft-pink/30">
                    {yesPercentage}%
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-soft-pink/70">
                Sacred answers of eternal love
              </p>
            </motion.div>

            {/* Card 4: "Need Moment" Count */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ y: -3 }}
              className="relative overflow-hidden rounded-2xl border border-royal-purple/40 bg-deep-purple/30 backdrop-blur-md p-5 sm:p-6 shadow-[0_0_25px_rgba(48,32,92,0.4)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading text-xs uppercase tracking-wider text-mystic-gold-light">
                  &ldquo;Need Moment&rdquo; Count
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-royal-purple/50 bg-midnight/80 text-mystic-gold shadow-[0_0_12px_rgba(118,80,184,0.25)]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-mystic-gold-light mb-1">
                {stats.needMomentCount}
              </div>
              <p className="font-body text-xs text-white/60">
                Moments of contemplation requested
              </p>
            </motion.div>
          </div>
        </section>

        {/* ─── FILTERS & SEARCH CONTROLS ─── */}
        <section aria-label="Response Table Controls" className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-royal-purple/30 bg-deep-purple/20 backdrop-blur-md p-4">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter responses">
              {/* All */}
              <button
                onClick={() => setActiveFilter('all')}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl font-heading text-xs uppercase tracking-wider transition-all ${
                  activeFilter === 'all'
                    ? 'border border-mystic-gold bg-deep-purple text-mystic-gold shadow-[0_0_15px_rgba(231,190,114,0.3)]'
                    : 'border border-royal-purple/30 bg-midnight/60 text-white/70 hover:border-royal-purple/70 hover:text-white'
                }`}
              >
                <span>All Responses</span>
                <span className="ml-2 rounded-full bg-midnight/70 px-2 py-0.5 text-[11px] font-bold">
                  {responses.length}
                </span>
              </button>

              {/* Yes Only */}
              <button
                onClick={() => setActiveFilter('yes')}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl font-heading text-xs uppercase tracking-wider transition-all ${
                  activeFilter === 'yes'
                    ? 'border border-soft-pink bg-soft-pink/20 text-soft-pink shadow-[0_0_15px_rgba(243,166,206,0.3)]'
                    : 'border border-royal-purple/30 bg-midnight/60 text-white/70 hover:border-soft-pink/50 hover:text-soft-pink'
                }`}
              >
                <svg className="h-3.5 w-3.5 mr-1.5 text-soft-pink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>Yes Only</span>
                <span className="ml-2 rounded-full bg-midnight/70 px-2 py-0.5 text-[11px] font-bold text-soft-pink">
                  {stats.yesCount}
                </span>
              </button>

              {/* Need Moment Only */}
              <button
                onClick={() => setActiveFilter('need_moment')}
                className={`inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl font-heading text-xs uppercase tracking-wider transition-all ${
                  activeFilter === 'need_moment'
                    ? 'border border-royal-purple-light bg-royal-purple/30 text-mystic-gold-light shadow-[0_0_15px_rgba(139,107,201,0.3)]'
                    : 'border border-royal-purple/30 bg-midnight/60 text-white/70 hover:border-royal-purple/70 hover:text-white'
                }`}
              >
                <svg className="h-3.5 w-3.5 mr-1.5 text-mystic-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Need Moment Only</span>
                <span className="ml-2 rounded-full bg-midnight/70 px-2 py-0.5 text-[11px] font-bold text-mystic-gold-light">
                  {stats.needMomentCount}
                </span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] rounded-xl border border-royal-purple/40 bg-midnight/80 px-4 py-2 pl-10 text-xs sm:text-sm text-white placeholder-white/40 focus:border-mystic-gold focus:outline-none focus:ring-1 focus:ring-mystic-gold transition-all"
              />
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ─── RESPONSES TABLE (RESPONSIVE CONTAINER) ─── */}
        <section aria-label="Proposal Responses List">
          <div className="overflow-hidden rounded-2xl border border-royal-purple/30 bg-deep-purple/20 backdrop-blur-md shadow-[0_0_35px_rgba(48,32,92,0.3)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-royal-purple/30 bg-deep-purple/40">
                    <th scope="col" className="px-6 py-4 font-heading text-xs font-semibold uppercase tracking-wider text-mystic-gold">
                      #
                    </th>
                    <th scope="col" className="px-6 py-4 font-heading text-xs font-semibold uppercase tracking-wider text-mystic-gold">
                      Session ID
                    </th>
                    <th scope="col" className="px-6 py-4 font-heading text-xs font-semibold uppercase tracking-wider text-mystic-gold">
                      Response
                    </th>
                    <th scope="col" className="px-6 py-4 font-heading text-xs font-semibold uppercase tracking-wider text-mystic-gold">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-royal-purple/20">
                  <AnimatePresence mode="popLayout">
                    {filteredResponses.length > 0 ? (
                      filteredResponses.map((item, index) => {
                        const isCopied = copiedSessionId === item.session_id;
                        const isYes = item.response === 'yes';

                        return (
                          <motion.tr
                            key={item.id || `${item.session_id}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-deep-purple/30 transition-colors"
                          >
                            {/* Row Index */}
                            <td className="px-6 py-4 text-xs font-mono text-white/50">
                              {index + 1}
                            </td>

                            {/* Session ID */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-mono text-xs sm:text-sm text-mystic-gold-light select-all"
                                  title={item.session_id}
                                >
                                  {truncateSessionId(item.session_id)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopySession(item.session_id)}
                                  aria-label="Copy session ID"
                                  title="Copy session UUID to clipboard"
                                  className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-lg text-white/50 hover:bg-royal-purple/30 hover:text-mystic-gold transition-colors"
                                >
                                  {isCopied ? (
                                    <span className="flex items-center text-[11px] text-emerald-400 font-sans">
                                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                      Copied
                                    </span>
                                  ) : (
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </td>

                            {/* Response Badge */}
                            <td className="px-6 py-4">
                              {isYes ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-soft-pink/50 bg-soft-pink/15 px-3 py-1 font-heading text-xs font-semibold text-soft-pink shadow-[0_0_12px_rgba(243,166,206,0.25)]">
                                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                  </svg>
                                  YES
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-royal-purple/50 bg-royal-purple/20 px-3 py-1 font-heading text-xs font-semibold text-mystic-gold-light shadow-[0_0_12px_rgba(118,80,184,0.2)]">
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Need Moment
                                </span>
                              )}
                            </td>

                            {/* Timestamp */}
                            <td className="px-6 py-4">
                              <span
                                suppressHydrationWarning
                                className="font-body text-xs sm:text-sm text-white/80"
                              >
                                {formatTimestamp(item.created_at)}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      /* Empty State Row */
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-royal-purple/40 bg-midnight/60 text-mystic-gold mb-4 shadow-[0_0_20px_rgba(118,80,184,0.2)]">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <h3 className="font-heading text-base sm:text-lg font-semibold text-gradient-gold mb-1">
                            {responses.length === 0
                              ? 'No Responses Recorded Yet'
                              : 'No Matching Responses Found'}
                          </h3>
                          <p className="font-body text-xs sm:text-sm text-white/60 max-w-sm mx-auto">
                            {responses.length === 0
                              ? 'When Geget responds to the proposal at the climax of the story, her answer will appear here in real time.'
                              : 'Try adjusting your filter or search query to find the desired records.'}
                          </p>
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery('')}
                              className="mt-4 inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl border border-royal-purple/40 bg-midnight/80 hover:bg-deep-purple/60 text-xs font-heading text-mystic-gold transition-all"
                            >
                              Clear Search
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            {filteredResponses.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-royal-purple/20 bg-midnight/40 px-6 py-3 text-xs text-white/60">
                <div>
                  Showing <span className="text-mystic-gold font-semibold">{filteredResponses.length}</span> of{' '}
                  <span className="text-white/80">{responses.length}</span> recorded response{responses.length === 1 ? '' : 's'}
                </div>
                <div className="font-heading text-[11px] text-white/40 tracking-wider uppercase mt-1 sm:mt-0">
                  MYTHIC Archive • Proposal Sanctuary
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
