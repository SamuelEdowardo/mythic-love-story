'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PROPOSAL_QUESTION, RECIPIENT_NAME } from '@/data/content';
import { getSessionId } from '@/lib/storage';
import { useAudio } from '@/hooks/useAudio';
import type { ProposalResponse, ApiResponse } from '@/types';

export interface ProposalProps {
  onNext?: () => void;
}

// Corner filigree SVG for fantasy ornamentation
function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 36V16C4 9.37 9.37 4 16 4H36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 36V18C9 13.03 13.03 9 18 9H36"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <path
        d="M4 4L14 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="26" cy="7" r="1.5" fill="currentColor" opacity="0.8" />
      <circle cx="7" cy="26" r="1.5" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

// Fantasy ornamental divider with glowing heart center
function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-2 ${className || ''}`}
      aria-hidden="true"
    >
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-mystic-gold to-mystic-gold/60" />
      <div className="flex items-center gap-1.5 text-mystic-gold">
        <span className="text-[10px]">✦</span>
        <svg
          className="w-4 h-4 fill-current text-mystic-gold filter drop-shadow-[0_0_8px_rgba(231,190,114,0.7)]"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-[10px]">✦</span>
      </div>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-mystic-gold to-mystic-gold/60" />
    </div>
  );
}

// Background floating romantic hearts data (module-scoped for React 19 purity)
const FLOATING_HEARTS = [
  { id: 1, left: '8%', delay: 0, duration: 6.5, size: 18, color: 'text-soft-pink/40' },
  { id: 2, left: '20%', delay: 2.2, duration: 7.5, size: 24, color: 'text-mystic-gold/30' },
  { id: 3, left: '35%', delay: 1.1, duration: 8.0, size: 16, color: 'text-royal-purple-light/40' },
  { id: 4, left: '50%', delay: 3.5, duration: 6.8, size: 22, color: 'text-soft-pink/50' },
  { id: 5, left: '68%', delay: 0.7, duration: 7.2, size: 20, color: 'text-mystic-gold-light/35' },
  { id: 6, left: '82%', delay: 2.8, duration: 8.5, size: 26, color: 'text-soft-pink/45' },
  { id: 7, left: '92%', delay: 1.8, duration: 6.2, size: 18, color: 'text-royal-purple/40' },
];

function FloatingHeartsBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {FLOATING_HEARTS.map((h) => (
          <div
            key={h.id}
            className={`absolute ${h.color}`}
            style={{ left: h.left, top: `${20 + h.id * 10}%` }}
          >
            <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {FLOATING_HEARTS.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0, scale: 0.6 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.7, 0.8, 0],
            scale: [0.6, 1.05, 0.9],
            x: [0, Math.sin(heart.id) * 25, 0],
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'easeInOut',
          }}
          className={`absolute select-none ${heart.color}`}
          style={{ left: heart.left }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="filter drop-shadow-[0_0_6px_currentColor]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// Precomputed particle explosion for celebration (deterministic & module-scoped for React 19 purity)
const EXPLOSION_PARTICLES = Array.from({ length: 36 }, (_, i) => {
  const seed1 = ((i * 127 + 31) % 1000) / 1000;
  const seed2 = ((i * 311 + 79) % 1000) / 1000;
  const seed3 = ((i * 541 + 13) % 1000) / 1000;
  const seed4 = ((i * 709 + 47) % 1000) / 1000;

  const angle = (i / 36) * 2 * Math.PI + (seed1 * 0.2 - 0.1);
  const distance = 80 + seed2 * 220;
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  const size = 12 + Math.floor(seed3 * 18);
  const isStar = i % 3 === 0;
  const isGold = i % 2 === 0;

  return {
    id: i,
    x,
    y,
    size,
    isStar,
    color: isGold ? '#E7BE72' : '#F3A6CE',
    rotation: (seed4 - 0.5) * 360,
    duration: 1.2 + seed1 * 0.8,
    delay: seed2 * 0.2,
  };
});

// Particle explosion when YES is clicked
function HeartsExplosion() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {EXPLOSION_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: [0, 1.4, 0.8, 0],
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute"
        >
          {p.isStar ? (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="filter drop-shadow-[0_0_10px_currentColor]"
            >
              <path d="M12 2l2.4 7.4h7.6l-6.1 4.5 2.3 7.1-6.2-4.5-6.2 4.5 2.3-7.1-6.1-4.5h7.6z" />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              fill={p.color}
              className="filter drop-shadow-[0_0_10px_currentColor]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Fantasy winged heart mythic emblem
function MythicHeartEmblem({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className || ''}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-soft-pink/20 blur-xl animate-pulse-glow" />
      <svg
        viewBox="0 0 100 80"
        className="w-24 h-20 sm:w-28 sm:h-24 filter drop-shadow-[0_0_15px_rgba(231,190,114,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Wing */}
        <path
          d="M32 38C22 30 14 34 6 22C4 32 10 40 22 45C14 48 10 54 8 62C16 58 24 54 30 46"
          stroke="#E7BE72"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(231, 190, 114, 0.15)"
        />
        {/* Right Wing */}
        <path
          d="M68 38C78 30 86 34 94 22C96 32 90 40 78 45C86 48 90 54 92 62C84 58 76 54 70 46"
          stroke="#E7BE72"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(231, 190, 114, 0.15)"
        />
        {/* Center Heart */}
        <path
          d="M50 66L46 62.2C31.5 49 22 40.5 22 30C22 21.5 28.5 15 37 15C41.8 15 46.4 17.2 50 20.8C53.6 17.2 58.2 15 63 15C71.5 15 78 21.5 78 30C78 40.5 68.5 49 54 62.2L50 66Z"
          fill="url(#heart-grad)"
          stroke="#E7BE72"
          strokeWidth="2"
        />
        {/* Small Crown at Top of Heart */}
        <path
          d="M44 14L41 7L46 10L50 5L54 10L59 7L56 14Z"
          fill="#E7BE72"
          stroke="#E7BE72"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Inner Sparkle Accent */}
        <circle cx="50" cy="34" r="2.5" fill="#FFFFFF" opacity="0.9" />
        <defs>
          <linearGradient id="heart-grad" x1="22" y1="15" x2="78" y2="66" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F3A6CE" />
            <stop offset="0.6" stopColor="#7650B8" />
            <stop offset="1" stopColor="#30205C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Gentle crescent moon emblem for need_moment state
function SereneMoonEmblem({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className || ''}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-royal-purple/20 blur-xl animate-pulse-glow" />
      <svg
        viewBox="0 0 80 80"
        className="w-20 h-20 sm:w-24 sm:h-24 filter drop-shadow-[0_0_16px_rgba(118,80,184,0.7)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crescent Moon */}
        <path
          d="M46 16C31.64 16 20 27.64 20 42C20 56.36 31.64 68 46 68C51.6 68 56.77 66.24 61 63.26C45.5 61.5 33.5 48.5 33.5 32.5C33.5 25.5 36.5 19.2 41.5 14.8C42.96 15.58 44.45 16 46 16Z"
          fill="url(#moon-grad)"
          stroke="#E7BE72"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Floating Stars Around Moon */}
        <path
          d="M58 24L59.2 27.8L63 29L59.2 30.2L58 34L56.8 30.2L53 29L56.8 27.8L58 24Z"
          fill="#E7BE72"
        />
        <path
          d="M26 22L26.8 24.5L29.3 25.3L26.8 26.1L26 28.6L25.2 26.1L22.7 25.3L25.2 24.5L26 22Z"
          fill="#F3A6CE"
        />
        <path
          d="M52 50L53 53.2L56.2 54.2L53 55.2L52 58.4L51 55.2L47.8 54.2L51 53.2L52 50Z"
          fill="#FFFFFF"
          opacity="0.8"
        />
        <defs>
          <linearGradient id="moon-grad" x1="20" y1="16" x2="61" y2="68" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8b6bc9" />
            <stop offset="0.6" stopColor="#30205C" />
            <stop offset="1" stopColor="#100E24" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Celestial loading spinner
function CelestialSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className || 'w-5 h-5 text-mystic-gold'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function Proposal({ onNext }: ProposalProps = {}) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx, switchTrack } = useAudio();

  // Component states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<ProposalResponse | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [burstKey, setBurstKey] = useState<number>(0);

  // Switch to romantic music when entering proposal
  useEffect(() => {
    switchTrack('romantic');
  }, [switchTrack]);

  // Handle user response
  const handleSelect = async (choice: ProposalResponse) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSelectedChoice(choice);
    setErrorMessage('');

    try {
      const sessionId = getSessionId();

      const res = await fetch('/api/proposal/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          response: choice,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to record your response. Please try again.');
      }

      // Successful recording
      if (choice === 'yes') {
        playSfx('sparkle');
        setBurstKey((prev) => prev + 1);
      } else {
        playSfx('chime');
      }

      setStatus('success');
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something unexpected happened while saving your answer. Please try again.';
      setErrorMessage(msg);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry sending response on error
  const handleRetry = () => {
    if (selectedChoice) {
      handleSelect(selectedChoice);
    } else {
      setStatus('idle');
    }
  };

  // Cancel error and re-choose
  const handleResetChoice = () => {
    setStatus('idle');
    setSelectedChoice(null);
    setErrorMessage('');
  };

  // Interactive celebratory heart trigger for YES screen
  const handleTriggerExtraHearts = () => {
    playSfx('sparkle');
    setBurstKey((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white flex flex-col items-center justify-center px-4 py-8 sm:py-16 pb-24 sm:pb-28 overflow-x-hidden selection:bg-mystic-gold/30 selection:text-white">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(118, 80, 184, 0.3) 0%, rgba(48, 32, 92, 0.4) 45%, rgba(16, 14, 36, 0.95) 85%)',
        }}
        aria-hidden="true"
      />

      {/* Floating hearts background animation */}
      <FloatingHeartsBackground />

      {/* Particle explosion triggered on YES */}
      {status === 'success' && selectedChoice === 'yes' && (
        <HeartsExplosion key={burstKey} />
      )}

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* STAGE 1: THE PROPOSAL QUESTION (IDLE / SUBMITTING)       */}
          {/* ========================================================= */}
          {status === 'idle' && (
            <motion.div
              key="proposal-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 bg-deep-purple/80 backdrop-blur-md border border-mystic-gold/40 shadow-[0_0_50px_rgba(48,32,92,0.8),0_0_30px_rgba(231,190,114,0.15)] flex flex-col items-center text-center overflow-hidden"
            >
              {/* Corner Filigrees */}
              <CornerFlourish className="absolute top-3 left-3 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/60" />
              <CornerFlourish className="absolute top-3 right-3 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/60 rotate-90" />
              <CornerFlourish className="absolute bottom-3 left-3 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/60 -rotate-90" />
              <CornerFlourish className="absolute bottom-3 right-3 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/60 rotate-180" />

              {/* Mythic Winged Heart Emblem */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-4"
              >
                <MythicHeartEmblem />
              </motion.div>

              {/* Eyebrow / Tag */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-3"
              >
                <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-mystic-gold uppercase px-3 py-1 rounded-full bg-mystic-gold/10 border border-mystic-gold/30">
                  Untuk Geget ✨
                </span>
              </motion.div>

              {/* The Core Question */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold tracking-wide leading-tight mt-2 mb-4"
              >
                {PROPOSAL_QUESTION}
              </motion.h1>

              {/* Ornamental Divider */}
              <OrnamentalDivider className="w-full max-w-xs mb-3" />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="font-body text-base sm:text-lg text-white/90 tracking-wide max-w-md mb-2 font-medium"
              >
                Bukan cuma soal game lagi, tapi tentang kita di kehidupan nyata.
              </motion.p>

              {/* Personal Reassurance */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="font-body text-xs sm:text-sm text-white/70 max-w-sm leading-relaxed mb-8"
              >
                Aku ngerasa nyaman dan bahagia tiap kali bareng kamu, dan aku pengen bisa jalanin hari-hari ke depan sama kamu.
              </motion.p>

              {/* Response Buttons with Equal Visual Dignity */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5 w-full max-w-md mx-auto">
                {/* 1. "YES, LET'S BEGIN" (Primary Button) */}
                <motion.button
                  type="button"
                  onClick={() => handleSelect('yes')}
                  disabled={isSubmitting}
                  aria-label="Yes, let's begin - Accept proposal"
                  whileHover={shouldReduceMotion ? {} : { scale: isSubmitting ? 1 : 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: isSubmitting ? 1 : 0.97 }}
                  className={`relative group flex items-center justify-center gap-2.5 px-8 py-4 sm:px-9 sm:py-4.5 rounded-full font-heading text-base sm:text-lg font-bold tracking-wider transition-all duration-300 min-h-[52px] cursor-pointer ${
                    isSubmitting && selectedChoice === 'yes'
                      ? 'bg-gradient-to-r from-soft-pink via-mystic-gold to-soft-pink text-midnight shadow-[0_0_35px_rgba(243,166,206,0.6)] ring-2 ring-mystic-gold'
                      : isSubmitting
                      ? 'opacity-40 cursor-not-allowed bg-soft-pink/40 text-midnight/70'
                      : 'bg-gradient-to-r from-soft-pink via-mystic-gold to-soft-pink text-midnight shadow-[0_0_30px_rgba(243,166,206,0.5),0_0_50px_rgba(231,190,114,0.3)] hover:shadow-[0_0_40px_rgba(243,166,206,0.8),0_0_60px_rgba(231,190,114,0.5)] active:opacity-95'
                  }`}
                >
                  {isSubmitting && selectedChoice === 'yes' ? (
                    <>
                      <CelestialSpinner className="w-5 h-5 text-midnight" />
                      <span>Entering Our Story...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 fill-current text-midnight transition-transform duration-300 group-hover:scale-125"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>YES, LET&apos;S BEGIN</span>
                    </>
                  )}
                </motion.button>

                {/* 2. "I NEED A MOMENT" (Secondary Button, Equal Dignity) */}
                <motion.button
                  type="button"
                  onClick={() => handleSelect('need_moment')}
                  disabled={isSubmitting}
                  aria-label="I need a moment - Request time"
                  whileHover={shouldReduceMotion ? {} : { scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={shouldReduceMotion ? {} : { scale: isSubmitting ? 1 : 0.98 }}
                  className={`relative flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full font-heading text-sm sm:text-base font-semibold tracking-wider transition-all duration-300 min-h-[52px] cursor-pointer ${
                    isSubmitting && selectedChoice === 'need_moment'
                      ? 'bg-deep-purple-light text-white border border-mystic-gold/60 shadow-[0_0_25px_rgba(118,80,184,0.6)]'
                      : isSubmitting
                      ? 'opacity-40 cursor-not-allowed bg-deep-purple-light/40 text-white/50 border border-royal-purple/30'
                      : 'bg-deep-purple-light/70 hover:bg-deep-purple-light text-white/95 hover:text-white border border-royal-purple/60 hover:border-mystic-gold/60 shadow-[0_0_20px_rgba(118,80,184,0.3)] hover:shadow-[0_0_30px_rgba(118,80,184,0.5)]'
                  }`}
                >
                  {isSubmitting && selectedChoice === 'need_moment' ? (
                    <>
                      <CelestialSpinner className="w-4 h-4 text-white" />
                      <span>Listening Closely...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 text-mystic-gold/80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>I NEED A MOMENT</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Status Note During Submit */}
              <div className="min-h-[24px] mt-4" aria-live="polite">
                {isSubmitting && (
                  <p className="font-body text-xs text-mystic-gold-light/90 animate-pulse">
                    Mengukir jawabanmu ke dalam bintang-bintang...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE 2: ERROR SCREEN WITH RETRY OPTION                   */}
          {/* ========================================================= */}
          {status === 'error' && (
            <motion.div
              key="error-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 bg-deep-purple/90 backdrop-blur-md border border-soft-pink/40 shadow-[0_0_50px_rgba(48,32,92,0.9),0_0_20px_rgba(243,166,206,0.2)] flex flex-col items-center text-center"
              role="alert"
            >
              <CornerFlourish className="absolute top-3 left-3 w-7 h-7 text-soft-pink/50" />
              <CornerFlourish className="absolute top-3 right-3 w-7 h-7 text-soft-pink/50 rotate-90" />
              <CornerFlourish className="absolute bottom-3 left-3 w-7 h-7 text-soft-pink/50 -rotate-90" />
              <CornerFlourish className="absolute bottom-3 right-3 w-7 h-7 text-soft-pink/50 rotate-180" />

              <div className="w-16 h-16 rounded-full bg-soft-pink/10 border border-soft-pink/40 flex items-center justify-center text-soft-pink mb-4">
                <svg
                  className="w-8 h-8"
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
              </div>

              <h2 className="font-heading text-xl sm:text-2xl text-gradient-gold mb-2">
                A Moment in the Stars
              </h2>

              <p className="font-body text-sm sm:text-base text-white/80 max-w-sm mb-4 leading-relaxed">
                {errorMessage ||
                  'Jaringan ke bintang-bintang sempat terputus, tapi jawaban hatimu tetap tersimpan aman.'}
              </p>

              <p className="font-body text-xs text-white/60 mb-6">
                Mau coba kirim jawabanmu lagi sekarang?
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-heading text-sm font-bold tracking-wider bg-mystic-gold hover:bg-mystic-gold-light text-midnight transition-colors min-h-[48px] cursor-pointer shadow-[0_0_20px_rgba(231,190,114,0.4)]"
                >
                  {isSubmitting ? (
                    <>
                      <CelestialSpinner className="w-4 h-4 text-midnight" />
                      <span>Mencoba Lagi...</span>
                    </>
                  ) : (
                    <span>Coba Kirim Lagi</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetChoice}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3.5 rounded-full font-heading text-sm font-medium tracking-wider bg-deep-purple-light/60 hover:bg-deep-purple-light text-white/80 hover:text-white border border-royal-purple/40 min-h-[48px] cursor-pointer transition-colors"
                >
                  Pilih Ulang
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE 3A: YES CELEBRATION & CLOSING SCREEN                */}
          {/* ========================================================= */}
          {status === 'success' && selectedChoice === 'yes' && (
            <motion.div
              key="yes-success-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 bg-deep-purple/85 backdrop-blur-md border border-mystic-gold/60 shadow-[0_0_60px_rgba(243,166,206,0.3),0_0_40px_rgba(231,190,114,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              <CornerFlourish className="absolute top-3 left-3 w-8 h-8 text-mystic-gold" />
              <CornerFlourish className="absolute top-3 right-3 w-8 h-8 text-mystic-gold rotate-90" />
              <CornerFlourish className="absolute bottom-3 left-3 w-8 h-8 text-mystic-gold -rotate-90" />
              <CornerFlourish className="absolute bottom-3 right-3 w-8 h-8 text-mystic-gold rotate-180" />

              {/* Radiant Heart Crest */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="mb-3"
              >
                <MythicHeartEmblem />
              </motion.div>

              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-2"
              >
                <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-mystic-gold uppercase px-4 py-1.5 rounded-full bg-mystic-gold/15 border border-mystic-gold/40 shadow-[0_0_15px_rgba(231,190,114,0.3)]">
                  Babak Baru Kita ✨
                </span>
              </motion.div>

              {/* Big Celebration Header */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-gold tracking-wide leading-tight mt-1 mb-2"
              >
                Makasih Banyak, {RECIPIENT_NAME} ❤️
              </motion.h2>

              <OrnamentalDivider className="w-full max-w-xs mb-4" />

              {/* Heartfelt celebration narrative */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="space-y-3 max-w-lg text-center"
              >
                <p className="font-body text-base sm:text-lg text-soft-pink font-medium leading-relaxed">
                  Senang dan bersyukur banget kamu mau jadi bagian dari hariku.
                </p>
                <p className="font-body text-sm sm:text-base text-white/90 leading-relaxed">
                  Semoga ke depannya kita bisa terus saling support, saling bikin ketawa, dan jalanin banyak hal seru bareng-bareng.
                </p>
              </motion.div>

              {/* Interactive celebration actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-sm"
              >
                <button
                  type="button"
                  onClick={handleTriggerExtraHearts}
                  aria-label="Send extra floating hearts"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-heading text-sm font-bold tracking-wider bg-gradient-to-r from-soft-pink to-mystic-gold text-midnight hover:opacity-95 shadow-[0_0_25px_rgba(243,166,206,0.6)] min-h-[48px] cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 fill-current text-midnight" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>Kirim Cinta Lagi ✨</span>
                </button>

                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="w-full px-6 py-3.5 rounded-full font-heading text-sm font-semibold tracking-wider bg-deep-purple-light/70 hover:bg-deep-purple-light text-white border border-mystic-gold/40 min-h-[48px] cursor-pointer transition-colors"
                  >
                    Lanjutkan Cerita →
                  </button>
                )}
              </motion.div>

              {/* Beautiful footer signature */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-4 border-t border-mystic-gold/20 w-full flex items-center justify-between text-[11px] sm:text-xs text-white/50"
              >
                <span>Status: Bersama Selamanya</span>
                <span>✦ Chapter: Real Life ✦</span>
              </motion.div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE 3B: NEED A MOMENT & GENTLE CLOSING SCREEN           */}
          {/* ========================================================= */}
          {status === 'success' && selectedChoice === 'need_moment' && (
            <motion.div
              key="moment-success-card"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 bg-deep-purple/85 backdrop-blur-md border border-royal-purple/50 shadow-[0_0_50px_rgba(48,32,92,0.8),0_0_30px_rgba(118,80,184,0.3)] flex flex-col items-center text-center overflow-hidden"
            >
              <CornerFlourish className="absolute top-3 left-3 w-8 h-8 text-royal-purple-light/60" />
              <CornerFlourish className="absolute top-3 right-3 w-8 h-8 text-royal-purple-light/60 rotate-90" />
              <CornerFlourish className="absolute bottom-3 left-3 w-8 h-8 text-royal-purple-light/60 -rotate-90" />
              <CornerFlourish className="absolute bottom-3 right-3 w-8 h-8 text-royal-purple-light/60 rotate-180" />

              {/* Serene Moon Emblem */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-3"
              >
                <SereneMoonEmblem />
              </motion.div>

              {/* Gentle Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-2"
              >
                <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-royal-purple-light uppercase px-3 py-1 rounded-full bg-royal-purple/20 border border-royal-purple/40">
                  Ruang & Kenyamananmu
                </span>
              </motion.div>

              {/* Gentle Title */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-gradient-purple tracking-wide leading-tight mb-2"
              >
                Take all the time you need. I&apos;ll be here. 💜
              </motion.h2>

              <OrnamentalDivider className="w-full max-w-xs mb-4" />

              {/* Respectful & Caring Reassurance */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 max-w-md text-center"
              >
                <p className="font-body text-base sm:text-lg text-white font-medium">
                  Santai aja ya, {RECIPIENT_NAME}.
                </p>
                <p className="font-body text-sm sm:text-base text-white/80 leading-relaxed">
                  Kenyamananmu adalah yang paling penting. Apapun itu, aku tetap senang bisa kenal dan dekat sama kamu seperti biasa.
                </p>
              </motion.div>

              {/* Calm Closing Options */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-xs"
              >
                {onNext && (
                  <button
                    type="button"
                    onClick={onNext}
                    className="w-full px-6 py-3.5 rounded-full font-heading text-sm font-semibold tracking-wider bg-deep-purple-light/80 hover:bg-deep-purple-light text-white border border-royal-purple/60 min-h-[48px] cursor-pointer transition-colors"
                  >
                    Selesaikan Perjalanan ✦
                  </button>
                )}
              </motion.div>

              {/* Footer reassurance */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-4 border-t border-royal-purple/20 w-full flex items-center justify-between text-[11px] sm:text-xs text-white/50"
              >
                <span>Hati yang tulus selalu sabar</span>
                <span>✦ Always With You ✦</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
