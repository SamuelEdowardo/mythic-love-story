'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { LOVE_LETTER_CONTENT, RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface LoveLetterProps {
  onNext: () => void;
}

// Corner filigree SVG for parchment ornamentation
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

// Elegant fantasy divider
function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 py-2 ${className || ''}`} aria-hidden="true">
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-mystic-gold to-mystic-gold/60" />
      <div className="flex items-center gap-1.5 text-mystic-gold">
        <span className="text-[10px]">✦</span>
        <svg className="w-4 h-4 fill-current text-mystic-gold" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-[10px]">✦</span>
      </div>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-mystic-gold to-mystic-gold/60" />
    </div>
  );
}

// Gentle floating heart element
function FloatingHeart({
  left,
  delay,
  duration,
  size,
  color,
}: {
  left: string;
  delay: number;
  duration: number;
  size: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.5 }}
      animate={{
        y: [-10, -110],
        opacity: [0, 0.85, 0],
        scale: [0.6, 1.1, 0.8],
        x: [0, Math.sin(delay * 3) * 16, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none select-none z-20"
      style={{ left, bottom: '40px' }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={color}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

const FLOATING_HEARTS_DATA = [
  { id: 1, left: '10%', delay: 0.2, duration: 4.5, size: 18, color: 'text-soft-pink/80' },
  { id: 2, left: '25%', delay: 1.5, duration: 5.2, size: 22, color: 'text-mystic-gold/80' },
  { id: 3, left: '42%', delay: 0.8, duration: 4.8, size: 26, color: 'text-soft-pink/90' },
  { id: 4, left: '60%', delay: 2.1, duration: 5.0, size: 16, color: 'text-mystic-gold-light/80' },
  { id: 5, left: '76%', delay: 1.1, duration: 4.2, size: 24, color: 'text-soft-pink/85' },
  { id: 6, left: '90%', delay: 2.6, duration: 5.5, size: 20, color: 'text-mystic-gold/75' },
];

export default function LoveLetter({ onNext }: LoveLetterProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx, switchTrack } = useAudio();

  // Lifecycle states:
  // 'sealed' -> envelope with glowing wax seal
  // 'breaking' -> wax seal fractures with golden spark burst
  // 'reading' -> parchment unfolded, paragraphs revealing
  const [letterState, setLetterState] = useState<'sealed' | 'breaking' | 'reading'>('sealed');

  // Reveal steps:
  // 0: greeting only
  // 1 to 5: paragraphs 0 to 4
  // 6: closing & signature
  // 7: fully revealed (hearts & continue button)
  const [revealedStep, setRevealedStep] = useState(0);

  const letterContainerRef = useRef<HTMLDivElement | null>(null);
  const latestItemRef = useRef<HTMLDivElement | null>(null);

  // Trigger seal break
  const handleBreakSeal = () => {
    if (letterState !== 'sealed') return;

    playSfx('seal-break');

    if (shouldReduceMotion) {
      setLetterState('reading');
      switchTrack('romantic');
      return;
    }

    setLetterState('breaking');

    // After seal fracture animation (700ms), transition to unfolded parchment
    setTimeout(() => {
      setLetterState('reading');
      switchTrack('romantic');
    }, 700);
  };

  // Sequential reveal timer: 1.5s delay between paragraphs
  useEffect(() => {
    if (letterState !== 'reading') return;
    if (revealedStep >= 7) return;

    if (shouldReduceMotion) {
      setRevealedStep(7);
      return;
    }

    const timer = setTimeout(() => {
      setRevealedStep((prev) => prev + 1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [letterState, revealedStep, shouldReduceMotion]);

  // Gentle smooth scroll to newly revealed paragraph on mobile
  useEffect(() => {
    if (revealedStep > 0 && latestItemRef.current) {
      latestItemRef.current.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }
  }, [revealedStep, shouldReduceMotion]);

  // Skip delay to reveal all content immediately
  const handleFastForward = () => {
    setRevealedStep(7);
  };

  const isFullyRevealed = revealedStep >= 7;

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white flex flex-col items-center justify-center px-4 py-8 sm:py-14 pb-24 sm:pb-28 overflow-x-hidden selection:bg-mystic-gold/30 selection:text-white">
      {/* Mystical background atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(118,80,184,0.25) 0%, rgba(48,32,92,0.3) 50%, transparent 80%)',
        }}
      />

      {/* Floating stardust in background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-mystic-gold rounded-full animate-twinkle opacity-60" />
        <div className="absolute top-1/3 right-1/5 w-1.5 h-1.5 bg-soft-pink rounded-full animate-float opacity-50" />
        <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle opacity-40" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-mystic-gold-light rounded-full animate-pulse-glow opacity-30" />
      </div>

      <AnimatePresence mode="wait">
        {letterState === 'sealed' || letterState === 'breaking' ? (
          /* ========================================================= */
          /* STAGE 1: SEALED ENVELOPE WITH INTERACTIVE WAX SEAL        */
          /* ========================================================= */
          <motion.div
            key="sealed-envelope"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center"
          >
            {/* Header hint */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-mystic-gold uppercase">
                A Message From The Heart
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl text-gradient-gold mt-1">
                For {RECIPIENT_NAME}
              </h1>
            </motion.div>

            {/* Folded Parchment Envelope */}
            <div
              onClick={handleBreakSeal}
              className="group relative w-full aspect-[4/3] max-w-md rounded-2xl p-6 sm:p-8 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(118,80,184,0.3)] transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] flex flex-col items-center justify-center overflow-hidden border border-mystic-gold/40"
              style={{
                background:
                  'linear-gradient(135deg, #FBF6E9 0%, #F5ECD5 50%, #ECE0C3 100%)',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleBreakSeal();
                }
              }}
              aria-label="Break wax seal to open love letter"
            >
              {/* Parchment envelope flap lines */}
              <div className="absolute inset-0 pointer-events-none opacity-25">
                <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                  <path
                    d="M0 0 L200 150 L400 0"
                    fill="none"
                    stroke="#8B5A2B"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M0 300 L200 150 L400 300"
                    fill="none"
                    stroke="#8B5A2B"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <rect
                    x="12"
                    y="12"
                    width="376"
                    height="276"
                    rx="8"
                    fill="none"
                    stroke="#8B5A2B"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                </svg>
              </div>

              {/* Gold corners on envelope */}
              <CornerFlourish className="absolute top-3 left-3 w-7 h-7 text-mystic-gold/70" />
              <CornerFlourish className="absolute top-3 right-3 w-7 h-7 text-mystic-gold/70 rotate-90" />
              <CornerFlourish className="absolute bottom-3 right-3 w-7 h-7 text-mystic-gold/70 rotate-180" />
              <CornerFlourish className="absolute bottom-3 left-3 w-7 h-7 text-mystic-gold/70 -rotate-90" />

              {/* Envelope Recipient Stamp */}
              <div className="text-center mb-6 z-10 pointer-events-none">
                <span className="font-heading italic text-sm text-[#5B3E26]/80 block">
                  Private &amp; Confidential
                </span>
                <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-[#351F10]">
                  To: My Dearest Geget
                </span>
              </div>

              {/* Wax Seal with break animation */}
              <div className="relative z-20 flex flex-col items-center">
                <motion.div
                  animate={
                    letterState === 'breaking'
                      ? {
                          scale: [1, 1.15, 0.9],
                          filter: [
                            'drop-shadow(0 0 0px #E7BE72)',
                            'drop-shadow(0 0 25px #E7BE72)',
                            'drop-shadow(0 0 0px #E7BE72)',
                          ],
                        }
                      : { scale: [1, 1.04, 1] }
                  }
                  transition={
                    letterState === 'breaking'
                      ? { duration: 0.7 }
                      : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
                  }
                  className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center select-none"
                >
                  {/* Wax Seal Outer Glow */}
                  <div className="absolute inset-0 rounded-full bg-royal-purple/40 blur-md group-hover:bg-mystic-gold/40 transition-colors duration-300" />

                  {/* Left half of breaking wax seal */}
                  <motion.div
                    animate={
                      letterState === 'breaking'
                        ? { x: -14, rotate: -15, opacity: 0 }
                        : { x: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0"
                    style={{ clipPath: 'polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%)' }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="url(#waxGradientLeft)"
                        stroke="#60142B"
                        strokeWidth="2"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="37"
                        fill="none"
                        stroke="#E7BE72"
                        strokeWidth="1.5"
                        strokeOpacity="0.7"
                        strokeDasharray="4 2"
                      />
                      <defs>
                        <radialGradient id="waxGradientLeft" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#A82046" />
                          <stop offset="50%" stopColor="#7A1331" />
                          <stop offset="100%" stopColor="#4A081B" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Right half of breaking wax seal */}
                  <motion.div
                    animate={
                      letterState === 'breaking'
                        ? { x: 14, rotate: 15, opacity: 0 }
                        : { x: 0, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className="absolute inset-0"
                    style={{ clipPath: 'polygon(55% 0%, 100% 0%, 100% 100%, 45% 100%)' }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="url(#waxGradientRight)"
                        stroke="#60142B"
                        strokeWidth="2"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="37"
                        fill="none"
                        stroke="#E7BE72"
                        strokeWidth="1.5"
                        strokeOpacity="0.7"
                        strokeDasharray="4 2"
                      />
                      <defs>
                        <radialGradient id="waxGradientRight" cx="35%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#A82046" />
                          <stop offset="50%" stopColor="#7A1331" />
                          <stop offset="100%" stopColor="#4A081B" />
                        </radialGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Golden Stamped Emblem (Heart + Laurel) */}
                  <motion.div
                    animate={
                      letterState === 'breaking'
                        ? { scale: [1, 1.4], opacity: [1, 0] }
                        : { scale: 1, opacity: 1 }
                    }
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex items-center justify-center text-mystic-gold"
                  >
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </motion.div>

                  {/* Golden energy burst when broken */}
                  {letterState === 'breaking' && (
                    <motion.div
                      initial={{ scale: 0.2, opacity: 0 }}
                      animate={{ scale: 2.2, opacity: [0, 1, 0] }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-mystic-gold via-soft-pink to-mystic-gold blur-sm pointer-events-none"
                    />
                  )}
                </motion.div>

                {/* Seal Action Prompt */}
                <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-[#351F10]/10 border border-[#8B5A2B]/30 group-hover:border-mystic-gold/60 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold animate-pulse" />
                  <span className="font-heading text-xs font-semibold tracking-wider text-[#351F10] uppercase">
                    {letterState === 'breaking' ? 'Unsealing...' : 'Tap to Break Seal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Subtitle instructions */}
            <p className="font-body text-xs sm:text-sm text-mystic-gold/70 mt-4 text-center">
              Click the wax seal to unveil the letter written for you
            </p>
          </motion.div>
        ) : (
          /* ========================================================= */
          /* STAGE 2: UNFOLDED PARCHMENT LOVE LETTER                   */
          /* ========================================================= */
          <motion.div
            key="unfolded-letter"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scaleY: 0.85, y: 30 }
            }
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* The Parchment Letter Sheet */}
            <div
              ref={letterContainerRef}
              className="relative w-full rounded-xl sm:rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(231,190,114,0.2),0_0_50px_rgba(48,32,92,0.7)] border-2 border-mystic-gold/60 overflow-hidden"
              style={{
                background:
                  'radial-gradient(circle at 50% 20%, #FFFDF9 0%, #FAF3E3 50%, #F4E7CB 100%)',
              }}
            >
              {/* Subtle inner gold frame border */}
              <div
                className="pointer-events-none absolute inset-2.5 sm:inset-4 rounded-lg sm:rounded-xl border border-mystic-gold/30"
                aria-hidden="true"
              />

              {/* Vintage Corner Ornaments */}
              <CornerFlourish className="absolute top-4 left-4 w-6 h-6 sm:w-8 sm:h-8 text-mystic-gold/70" />
              <CornerFlourish className="absolute top-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-mystic-gold/70 rotate-90" />
              <CornerFlourish className="absolute bottom-4 right-4 w-6 h-6 sm:w-8 sm:h-8 text-mystic-gold/70 rotate-180" />
              <CornerFlourish className="absolute bottom-4 left-4 w-6 h-6 sm:w-8 sm:h-8 text-mystic-gold/70 -rotate-90" />

              {/* Floating Hearts Effect (appears when letter is fully revealed) */}
              {isFullyRevealed && !shouldReduceMotion && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                  {FLOATING_HEARTS_DATA.map((heart) => (
                    <FloatingHeart
                      key={heart.id}
                      left={heart.left}
                      delay={heart.delay}
                      duration={heart.duration}
                      size={heart.size}
                      color={heart.color}
                    />
                  ))}
                </div>
              )}

              {/* Top Ornamental Header */}
              <div className="text-center mb-6 sm:mb-8">
                <span className="font-heading text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-[#8C6D3B] uppercase block mb-1">
                  From My Heart To Yours
                </span>
                <OrnamentalDivider />
              </div>

              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E132D] tracking-wide">
                  {LOVE_LETTER_CONTENT.greeting}
                </h2>
                <div className="h-0.5 w-16 bg-gradient-to-r from-mystic-gold to-transparent mt-2" />
              </motion.div>

              {/* Paragraphs revealed step-by-step */}
              <div className="space-y-5 sm:space-y-6">
                {LOVE_LETTER_CONTENT.paragraphs.map((paragraph, index) => {
                  const isVisible = revealedStep > index;

                  return (
                    <AnimatePresence key={index}>
                      {isVisible && (
                        <motion.div
                          ref={revealedStep === index + 1 ? latestItemRef : null}
                          initial={
                            shouldReduceMotion
                              ? { opacity: 0 }
                              : { opacity: 0, y: 16 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <p className="font-body text-base sm:text-lg md:text-[1.125rem] leading-relaxed sm:leading-loose text-[#27193C] font-normal tracking-normal text-left">
                            {paragraph}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>

              {/* Closing & Signature */}
              <AnimatePresence>
                {revealedStep >= 6 && (
                  <motion.div
                    ref={revealedStep === 6 ? latestItemRef : null}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 16 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-8 sm:mt-10 pt-6 border-t border-[#8C6D3B]/20"
                  >
                    <p className="font-body italic text-[#4B3466] text-base sm:text-lg mb-2">
                      {LOVE_LETTER_CONTENT.closing}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-[#1E132D]">
                        {LOVE_LETTER_CONTENT.signature}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Decorative Element */}
              <div className="mt-8 pt-4">
                <OrnamentalDivider className="opacity-75" />
              </div>
            </div>

            {/* Fast-forward helper during sequential reveal */}
            {!isFullyRevealed && revealedStep > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
                onClick={handleFastForward}
                className="mt-4 px-4 py-2 min-h-[44px] text-xs font-heading tracking-wider text-mystic-gold/80 hover:text-mystic-gold underline underline-offset-4 cursor-pointer transition-colors"
                aria-label="Skip waiting and read full letter"
              >
                Tampilkan Seluruh Surat ✦
              </motion.button>
            )}

            {/* Continue Button (Revealed after all paragraphs and signature are shown) */}
            <AnimatePresence>
              {isFullyRevealed && (
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 20, scale: 0.95 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 sm:mt-10 w-full flex flex-col items-center"
                >
                  <motion.button
                    onClick={onNext}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative px-8 sm:px-12 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden font-heading text-base sm:text-lg font-bold tracking-wider text-white bg-gradient-to-r from-deep-purple via-royal-purple to-deep-purple border-2 border-mystic-gold/80 hover:border-mystic-gold shadow-[0_0_25px_rgba(118,80,184,0.5),0_0_15px_rgba(231,190,114,0.3)] hover:shadow-[0_0_35px_rgba(231,190,114,0.6)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3"
                    aria-label="Continue to the next chapter"
                  >
                    {/* Glowing shimmer sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-mystic-gold/25 to-transparent pointer-events-none" />

                    <span className="relative z-10 text-mystic-gold-light group-hover:text-white transition-colors">
                      Lanjutkan
                    </span>

                    <svg
                      className="relative z-10 w-5 h-5 text-mystic-gold transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </motion.button>

                  <p className="font-body text-xs text-mystic-gold/60 mt-3 text-center">
                    Satu pertanyaan terakhir untuk Geget
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
