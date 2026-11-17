'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MILESTONES, RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface QuestJourneyProps {
  onNext: () => void;
}

// Ornate corner filigree for RPG quest log styling
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

// Fantasy divider with star and filigree
function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-2 ${className || ''}`}
      aria-hidden="true"
    >
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-mystic-gold to-mystic-gold/60" />
      <div className="flex items-center gap-1.5 text-mystic-gold">
        <span className="text-[10px]">✦</span>
        <svg className="w-4 h-4 fill-current text-mystic-gold" viewBox="0 0 24 24">
          <path d="M12 2L14.4 9.6H22.4L15.9 14.3L18.4 22L12 17.3L5.6 22L8.1 14.3L1.6 9.6H9.6L12 2Z" />
        </svg>
        <span className="text-[10px]">✦</span>
      </div>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-mystic-gold to-mystic-gold/60" />
    </div>
  );
}

// Crossed swords SVG icon for quest headers
function CrossedSwordsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
      <polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5" />
      <line x1="11" y1="19" x2="5" y2="13" />
      <line x1="8" y1="16" x2="4" y2="20" />
      <line x1="5" y1="21" x2="3" y2="19" />
    </svg>
  );
}

// Background stardust coordinates
const STARDUST_PARTICLES = [
  { id: 1, top: '10%', left: '6%', size: 'w-1 h-1', anim: 'animate-twinkle' },
  { id: 2, top: '22%', right: '8%', size: 'w-2 h-2', anim: 'animate-float' },
  { id: 3, top: '48%', left: '12%', size: 'w-1.5 h-1.5', anim: 'animate-pulse-glow' },
  { id: 4, top: '68%', right: '14%', size: 'w-1 h-1', anim: 'animate-twinkle' },
  { id: 5, top: '85%', left: '8%', size: 'w-2 h-2', anim: 'animate-float' },
  { id: 6, top: '92%', right: '10%', size: 'w-1.5 h-1.5', anim: 'animate-pulse-glow' },
];

// Milestone RPG reward badges
const MILESTONE_REWARDS: Record<string, { exp: string; title: string }> = {
  'first-battle': { exp: '+500 EXP', title: 'Challenger Awoken' },
  'endless-challenges': { exp: '+1,000 EXP', title: 'Iron Resolve' },
  'never-give-up': { exp: '+1,500 EXP', title: 'Unbreakable Spirit' },
  'final-victory': { exp: '+2,500 EXP', title: 'Throne Conqueror' },
  'mythic-unlocked': { exp: '+5,000 EXP', title: 'Mythic Legend' },
};

export default function QuestJourney({ onNext }: QuestJourneyProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx } = useAudio();

  // Sequential reveal state: starts at 1, auto-reveals up to MILESTONES.length (5)
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const latestItemRef = useRef<HTMLDivElement | null>(null);

  // Auto-reveal milestones with 800ms delay between each
  useEffect(() => {
    if (shouldReduceMotion) {
      setRevealedCount(MILESTONES.length);
      return;
    }

    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev < MILESTONES.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Play sound effect as new milestones unlock
  useEffect(() => {
    if (revealedCount > 1) {
      playSfx('milestone');
    }
  }, [revealedCount, playSfx]);

  // Gentle smooth scroll to newly revealed milestone on mobile
  useEffect(() => {
    if (revealedCount > 1 && latestItemRef.current) {
      latestItemRef.current.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    }
  }, [revealedCount, shouldReduceMotion]);

  const isAllRevealed = revealedCount >= MILESTONES.length;
  const progressPercent = Math.round((revealedCount / MILESTONES.length) * 100);

  const handleFastForward = () => {
    setRevealedCount(MILESTONES.length);
  };

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white flex flex-col items-center justify-start px-4 py-8 sm:py-12 md:py-16 pb-24 sm:pb-28 overflow-x-hidden selection:bg-mystic-gold/30 selection:text-white">
      {/* Mystical background atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, rgba(118,80,184,0.28) 0%, rgba(48,32,92,0.35) 45%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient floating stardust */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {STARDUST_PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${particle.size} rounded-full bg-mystic-gold ${particle.anim} opacity-60`}
            style={{
              top: particle.top,
              left: particle.left,
              right: particle.right,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* ========================================================= */}
        {/* CHAPTER TITLE & HEADER HUD                                */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-6 sm:mb-8 w-full"
        >
          {/* RPG Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-royal-purple/60 bg-deep-purple/60 backdrop-blur-sm text-mystic-gold text-xs sm:text-sm font-heading font-semibold tracking-[0.2em] uppercase mb-3 shadow-[0_0_15px_rgba(118,80,184,0.4)]">
            <CrossedSwordsIcon className="w-3.5 h-3.5 text-mystic-gold" />
            <span>Act I • Chronicles of Ascension</span>
            <CrossedSwordsIcon className="w-3.5 h-3.5 text-mystic-gold" />
          </div>

          {/* Chapter Title: REQUIRED EXACT TEXT */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-gradient-gold tracking-wide drop-shadow-md">
            Chapter 1: The Journey
          </h1>

          {/* Subtitle */}
          <p className="font-body text-slate-300/90 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
            Menelusuri jejak perjuangan <span className="text-mystic-gold font-semibold">{RECIPIENT_NAME}</span> dari pertempuran pertama hingga menduduki singgasana <span className="text-soft-pink font-semibold">Rank Mythic</span>.
          </p>

          <OrnamentalDivider className="mt-3" />
        </motion.div>

        {/* ========================================================= */}
        {/* QUEST PANEL (FR-03)                                       */}
        {/* Semi-transparent deep-purple bg with royal-purple border  */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="w-full relative bg-deep-purple/80 backdrop-blur-md border border-royal-purple/70 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 shadow-[0_0_35px_rgba(118,80,184,0.3)] overflow-hidden"
        >
          {/* Decorative Corner Filigrees */}
          <CornerFlourish className="absolute top-2 left-2 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/70 pointer-events-none" />
          <CornerFlourish className="absolute top-2 right-2 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/70 rotate-90 pointer-events-none" />
          <CornerFlourish className="absolute bottom-2 left-2 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/70 -rotate-90 pointer-events-none" />
          <CornerFlourish className="absolute bottom-2 right-2 w-7 h-7 sm:w-9 sm:h-9 text-mystic-gold/70 rotate-180 pointer-events-none" />

          {/* Quest Log Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-royal-purple/40">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-mystic-gold animate-pulse-glow" />
              <span className="font-heading text-xs sm:text-sm font-semibold tracking-wider text-mystic-gold uppercase">
                Quest Log: Path of the Champion
              </span>
            </div>

            {/* Progress counter & Fast Forward */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-heading font-medium text-slate-300">
                Memories: <span className="text-mystic-gold font-bold">{revealedCount}</span> / {MILESTONES.length}
              </div>

              {!isAllRevealed && (
                <button
                  type="button"
                  onClick={handleFastForward}
                  className="min-h-[32px] px-2.5 py-1 text-xs font-body font-medium text-mystic-gold/80 hover:text-mystic-gold bg-midnight/70 hover:bg-midnight border border-royal-purple/50 hover:border-mystic-gold/60 rounded-md transition-all cursor-pointer"
                  title="Fast-forward reveal animation"
                >
                  Skip ⏩
                </button>
              )}
            </div>
          </div>

          {/* Quest Progress Bar */}
          <div className="w-full bg-midnight/80 rounded-full h-2 mb-6 sm:mb-8 overflow-hidden border border-royal-purple/50 p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-royal-purple via-mystic-gold to-mystic-gold-light rounded-full shadow-[0_0_10px_rgba(231,190,114,0.6)]"
              initial={{ width: '20%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* ========================================================= */}
          {/* VERTICAL TIMELINE / PATH VISUAL (FR-03)                   */}
          {/* Vertical line connecting 5 milestones                     */}
          {/* ========================================================= */}
          <div className="relative flex flex-col gap-6 sm:gap-8 my-2">
            {/* Continuous Vertical Quest Path Line */}
            <div
              className="absolute left-[24px] sm:left-[28px] top-6 sm:top-7 bottom-6 sm:bottom-7 w-1 -translate-x-1/2 z-0 pointer-events-none rounded-full overflow-hidden"
              aria-hidden="true"
            >
              {/* Background inactive line */}
              <div className="w-full h-full bg-deep-purple-light/40 border-l border-royal-purple/40" />

              {/* Glowing active path gradient */}
              <motion.div
                className="absolute top-0 w-full bg-gradient-to-b from-mystic-gold via-royal-purple to-soft-pink shadow-[0_0_12px_rgba(231,190,114,0.7)]"
                initial={{ height: '0%' }}
                animate={{
                  height: shouldReduceMotion
                    ? '100%'
                    : `${((Math.max(1, revealedCount) - 1) / (MILESTONES.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
            </div>

            {/* Milestones list with stagger animation */}
            {MILESTONES.map((milestone, index) => {
              const isRevealed = index < revealedCount;
              if (!isRevealed) return null;

              const isLatest = index === revealedCount - 1;
              const isFinal = index === MILESTONES.length - 1;
              const reward = MILESTONE_REWARDS[milestone.id];

              return (
                <motion.div
                  key={milestone.id}
                  ref={isLatest ? latestItemRef : null}
                  initial={{ opacity: 0, x: -24, y: 16 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="relative z-10 flex items-start gap-3.5 sm:gap-6 group"
                >
                  {/* Timeline Glowing Node */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl sm:text-2xl select-none transition-all duration-300 z-10 bg-midnight border-2 ${
                      isFinal
                        ? 'border-mystic-gold ring-2 ring-mystic-gold/60 ring-offset-2 ring-offset-midnight shadow-[0_0_25px_rgba(231,190,114,0.8)]'
                        : 'border-mystic-gold shadow-[0_0_20px_rgba(231,190,114,0.5)]'
                    } animate-pulse-glow`}
                    aria-label={`Milestone node ${index + 1}: ${milestone.title}`}
                  >
                    <span className="transform transition-transform duration-300 group-hover:scale-115">
                      {milestone.icon}
                    </span>
                  </div>

                  {/* Milestone Quest Card */}
                  <div
                    className={`flex-1 rounded-xl sm:rounded-2xl p-4 sm:p-5 sm:px-6 transition-all duration-300 shadow-md ${
                      isFinal
                        ? 'bg-gradient-to-br from-deep-purple/95 via-midnight/90 to-royal-purple/35 border-2 border-mystic-gold shadow-[0_0_30px_rgba(231,190,114,0.35)]'
                        : 'bg-midnight/75 border border-royal-purple/60 hover:border-mystic-gold/60 hover:shadow-[0_0_20px_rgba(118,80,184,0.35)]'
                    }`}
                  >
                    {/* Card Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-heading font-semibold text-mystic-gold/90 tracking-widest uppercase">
                          Stage 0{index + 1}
                        </span>
                        {reward && (
                          <span className="text-[10px] sm:text-[11px] font-body px-2 py-0.5 rounded-full bg-royal-purple/40 border border-royal-purple/60 text-mystic-gold-light">
                            {reward.exp}
                          </span>
                        )}
                      </div>

                      {/* Status Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-mystic-gold">
                        <svg className="w-3.5 h-3.5 text-mystic-gold fill-current" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>CLEARED</span>
                      </span>
                    </div>

                    {/* Milestone Title */}
                    <h3
                      className={`font-heading font-bold text-lg sm:text-xl tracking-wide ${
                        isFinal ? 'text-gradient-gold text-xl sm:text-2xl' : 'text-mystic-gold'
                      }`}
                    >
                      {milestone.title}
                    </h3>

                    {/* Milestone Description */}
                    <p className="font-body text-slate-200 text-sm sm:text-base leading-relaxed mt-1.5">
                      {milestone.description}
                    </p>

                    {/* Extra Grand Finale Accent for Milestone 5 */}
                    {isFinal && (
                      <div className="mt-3 pt-3 border-t border-mystic-gold/30 flex items-center gap-2 text-xs font-heading text-mystic-gold">
                        <span>🏆</span>
                        <span className="tracking-wider uppercase">
                          Mythic Achieved • {RECIPIENT_NAME}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ========================================================= */}
          {/* CONTINUE BUTTON (FR-03)                                   */}
          {/* Displayed after all 5 milestones are shown                */}
          {/* ========================================================= */}
          <AnimatePresence>
            {isAllRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="mt-8 sm:mt-10 pt-5 border-t border-royal-purple/50 flex flex-col items-center justify-center text-center gap-3 relative z-20"
              >
                <div className="flex items-center gap-2 text-mystic-gold text-xs sm:text-sm font-heading tracking-widest uppercase">
                  <span>✦</span>
                  <span>Chapter 1 Selesai</span>
                  <span>✦</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playSfx('click');
                    onNext();
                  }}
                  className="group relative inline-flex items-center justify-center min-h-[48px] min-w-[220px] px-8 py-3.5 rounded-full font-heading font-bold text-base sm:text-lg text-midnight bg-gradient-to-r from-mystic-gold via-mystic-gold-light to-mystic-gold shadow-[0_0_25px_rgba(231,190,114,0.6)] hover:shadow-[0_0_35px_rgba(231,190,114,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden border border-white/40"
                  aria-label="Continue to next chapter"
                >
                  <span className="relative z-10 flex items-center gap-2.5">
                    <span>Lanjutkan</span>
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                <p className="font-body text-xs sm:text-sm text-soft-pink/80">
                  Ada hadiah kecil menunggumu di babak berikutnya...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
