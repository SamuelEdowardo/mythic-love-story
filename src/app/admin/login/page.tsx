'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated with admin privileges
  useEffect(() => {
    let isMounted = true;

    async function checkCurrentSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (session?.user) {
          router.replace('/admin/responses');
          return;
        }
      } catch {
        // If session check fails or network is unready, proceed to login form
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    // Safety timeout to prevent infinite session verification
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsCheckingSession(false);
      }
    }, 2000);

    checkCurrentSession();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError('Login failed: Invalid credentials.');
        setIsLoading(false);
        return;
      }

      // Success: Any user created in this private Supabase project has admin access
      router.push('/admin/responses');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during authentication.';
      setError(message);
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="min-h-screen w-full bg-midnight flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-deep-purple/30 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-royal-purple/20 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-royal-purple border-t-mystic-gold animate-spin" />
          <p className="font-heading text-sm text-mystic-gold tracking-widest uppercase">
            Verifying Realm Clearance...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-midnight flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Mystical Background Atmospheric Accents */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-deep-purple/40 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-royal-purple/30 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 rounded-full bg-deep-purple/20 blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Star Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-12 left-[15%] w-1.5 h-1.5 bg-mystic-gold/60 rounded-full animate-twinkle" />
        <div className="absolute top-1/3 right-[12%] w-1 h-1 bg-soft-pink/50 rounded-full animate-twinkle [animation-delay:1s]" />
        <div className="absolute bottom-24 left-[20%] w-1.5 h-1.5 bg-white/40 rounded-full animate-twinkle [animation-delay:2s]" />
        <div className="absolute bottom-1/3 right-[22%] w-1 h-1 bg-mystic-gold-light/60 rounded-full animate-twinkle [animation-delay:1.5s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-deep-purple/40 backdrop-blur-xl border border-royal-purple/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-midnight/80">
          {/* Header & Crest */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-deep-purple/80 border border-mystic-gold/50 flex items-center justify-center shadow-lg shadow-royal-purple/20 mb-4 animate-pulse-glow">
              {/* Arcane Crest Shield Lock SVG */}
              <svg
                className="w-7 h-7 text-mystic-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.25" />
                <path d="M10 11V9a2 2 0 114 0v2" />
                <circle cx="12" cy="13.5" r="0.75" fill="currentColor" />
              </svg>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gradient-gold tracking-wider">
              Admin Login
            </h1>
            <p className="text-xs sm:text-sm text-soft-pink/70 mt-1.5 font-body">
              Restricted portal for realm administrators
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Error Message Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="login-error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                  role="alert"
                >
                  <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 flex items-start gap-2.5 text-xs sm:text-sm text-red-200 shadow-inner">
                    <svg
                      className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span className="leading-snug">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold text-mystic-gold uppercase tracking-wider font-body"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mystic-gold/70">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="keeper@mythic.realm"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="w-full h-11 min-h-[44px] pl-10 pr-4 bg-midnight/90 border border-royal-purple/40 rounded-xl text-white placeholder-white/30 text-sm font-body transition-colors focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold/50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold text-mystic-gold uppercase tracking-wider font-body"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-mystic-gold/70">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="w-full h-11 min-h-[44px] pl-10 pr-12 bg-midnight/90 border border-royal-purple/40 rounded-xl text-white placeholder-white/30 text-sm font-body transition-colors focus:outline-none focus:border-mystic-gold focus:ring-1 focus:ring-mystic-gold/50 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3.5 pl-2 flex items-center justify-center min-w-[44px] min-h-[44px] text-white/50 hover:text-mystic-gold transition-colors cursor-pointer disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 min-h-[44px] mt-6 rounded-xl font-heading font-semibold text-midnight text-sm tracking-widest uppercase bg-gradient-to-r from-mystic-gold to-mystic-gold-light hover:from-mystic-gold-light hover:to-mystic-gold active:scale-[0.98] transition-all duration-200 shadow-md shadow-mystic-gold/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin text-midnight"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter Realm</span>
                  <svg
                    className="w-4 h-4 text-midnight"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation Link */}
          <div className="mt-6 pt-4 border-t border-royal-purple/20 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-3 text-xs text-soft-pink/60 hover:text-mystic-gold transition-colors font-body"
            >
              ← Return to Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
