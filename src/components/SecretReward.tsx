'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SECRET_REWARD_MESSAGE } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface SecretRewardProps {
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

// Fantasy divider for parchment
function OrnamentalDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 py-2 ${className || ''}`}
      aria-hidden="true"
    >
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-mystic-gold to-mystic-gold/60" />
      <div className="flex items-center gap-1.5 text-mystic-gold">
        <span className="text-[10px]">✦</span>
        <svg
          className="w-4 h-4 fill-current text-mystic-gold"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
        <span className="text-[10px]">✦</span>
      </div>
      <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-mystic-gold to-mystic-gold/60" />
    </div>
  );
}

// Sparkle Particle definitions
interface Particle {
  id: number;
  x: number;
  y: number;
  targetY: number;
  driftX: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const SPARKLE_PARTICLES: Particle[] = [
  { id: 1, x: -90, y: 10, targetY: -110, driftX: -25, size: 16, delay: 0.1, duration: 3.2, color: 'text-mystic-gold' },
  { id: 2, x: -60, y: -10, targetY: -140, driftX: -15, size: 20, delay: 0.3, duration: 3.6, color: 'text-soft-pink' },
  { id: 3, x: -30, y: 15, targetY: -120, driftX: 10, size: 14, delay: 0.6, duration: 2.8, color: 'text-mystic-gold-light' },
  { id: 4, x: 0, y: -20, targetY: -160, driftX: -8, size: 24, delay: 0.2, duration: 3.8, color: 'text-mystic-gold' },
  { id: 5, x: 35, y: 5, targetY: -130, driftX: 20, size: 18, delay: 0.5, duration: 3.4, color: 'text-soft-pink' },
  { id: 6, x: 70, y: -5, targetY: -150, driftX: 15, size: 22, delay: 0.4, duration: 3.5, color: 'text-mystic-gold-light' },
  { id: 7, x: 95, y: 15, targetY: -115, driftX: 25, size: 15, delay: 0.7, duration: 3.0, color: 'text-mystic-gold' },
  { id: 8, x: -110, y: 0, targetY: -100, driftX: -20, size: 12, delay: 0.8, duration: 3.1, color: 'text-white' },
  { id: 9, x: 110, y: 0, targetY: -95, driftX: 22, size: 13, delay: 0.9, duration: 3.3, color: 'text-mystic-gold-light' },
  { id: 10, x: -15, y: -30, targetY: -170, driftX: 12, size: 18, delay: 0.4, duration: 4.0, color: 'text-soft-pink' },
  { id: 11, x: 20, y: -25, targetY: -165, driftX: -14, size: 16, delay: 0.7, duration: 3.7, color: 'text-mystic-gold' },
  { id: 12, x: -45, y: 5, targetY: -135, driftX: 18, size: 14, delay: 1.1, duration: 3.2, color: 'text-white' },
];

export default function SecretReward({ onNext }: SecretRewardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx } = useAudio();

  // State: 'closed' | 'opening' | 'opened'
  const [chestState, setChestState] = useState<'closed' | 'opening' | 'opened'>('closed');
  const [burstKey, setBurstKey] = useState(0);

  const isOpen = chestState === 'opened';
  const isOpening = chestState === 'opening';

  const handleOpenChest = () => {
    if (chestState !== 'closed') return;

    playSfx('chest-open');

    if (shouldReduceMotion) {
      setChestState('opened');
      return;
    }

    setChestState('opening');

    // Slight anticipation rumble before the lid swings open
    setTimeout(() => {
      setChestState('opened');
    }, 450);
  };

  const handleExtraSparkle = () => {
    if (isOpen) {
      setBurstKey((prev) => prev + 1);
      playSfx('sparkle');
    }
  };

  const handleAcceptChallenge = () => {
    playSfx('click');
    onNext();
  };

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white flex flex-col items-center justify-center px-4 py-8 sm:py-14 pb-20 sm:pb-24 overflow-x-hidden selection:bg-mystic-gold/30 selection:text-white">
      {/* Background mystical atmosphere */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(118,80,184,0.3) 0%, rgba(48,32,92,0.35) 50%, transparent 80%)',
        }}
      />

      {/* Floating stardust / particles in background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/5 left-1/10 w-1.5 h-1.5 bg-mystic-gold rounded-full animate-twinkle opacity-70" />
        <div className="absolute top-1/3 right-1/8 w-2 h-2 bg-soft-pink rounded-full animate-float opacity-50" />
        <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-twinkle opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-mystic-gold-light rounded-full animate-pulse-glow opacity-40" />
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-royal-purple-light rounded-full animate-float opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* ========================================================= */}
        {/* CHAPTER TITLE & HEADER                                    */}
        {/* ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-deep-purple/60 border border-mystic-gold/30 shadow-[0_0_15px_rgba(118,80,184,0.3)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold animate-pulse" />
            <span className="font-heading text-xs sm:text-sm tracking-[0.25em] text-mystic-gold uppercase font-semibold">
              Chapter 2: Secret Reward
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-gold tracking-wide">
            The Hidden Chest
          </h1>

          <p className="font-body text-xs sm:text-sm text-mystic-gold/75 mt-2 max-w-md mx-auto">
            {isOpen
              ? 'A legendary relic has revealed its power from within!'
              : 'A mysterious locked chest radiates ancient arcane energy...'}
          </p>
        </motion.div>

        {/* ========================================================= */}
        {/* TREASURE CHEST DISPLAY AREA                              */}
        {/* ========================================================= */}
        <div
          className={`relative w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center my-4 sm:my-6 ${!isOpen && !isOpening ? 'animate-float' : ''
            }`}
          onClick={handleExtraSparkle}
        >
          {/* Floor pedestal glow effect */}
          <div
            className={`absolute bottom-2 w-64 sm:w-80 h-16 rounded-full blur-xl pointer-events-none transition-all duration-700 ${isOpen
              ? 'bg-gradient-to-r from-mystic-gold/50 via-soft-pink/30 to-mystic-gold/50 scale-125'
              : 'bg-royal-purple/35 animate-pulse-glow'
              }`}
          />

          {/* Golden Light burst rays (emanates when chest is opened) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key={`burst-${burstKey}`}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute -top-20 z-0 pointer-events-none flex items-center justify-center w-80 sm:w-96 h-80 sm:h-96"
              >
                {/* Rotating sunburst rays */}
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? { rotate: 0 }
                      : { rotate: 360 }
                  }
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-full h-full relative flex items-center justify-center"
                >
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-3.5 sm:w-4.5 h-full opacity-60"
                      style={{
                        transform: `rotate(${deg}deg)`,
                        background:
                          'linear-gradient(to top, transparent 20%, rgba(231,190,114,0.45) 50%, rgba(243,166,206,0.2) 80%, transparent 100%)',
                      }}
                    />
                  ))}
                </motion.div>

                {/* Intense central radial bloom */}
                <div className="absolute w-44 h-44 rounded-full bg-gradient-to-t from-mystic-gold via-soft-pink/40 to-transparent blur-2xl opacity-90 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Sparkle / Glitter particles */}
          <AnimatePresence>
            {isOpen && (
              <div className="absolute inset-0 pointer-events-none z-30" aria-hidden="true">
                {SPARKLE_PARTICLES.map((particle) => (
                  <motion.div
                    key={`${particle.id}-${burstKey}`}
                    initial={{
                      x: particle.x,
                      y: particle.y,
                      opacity: 0,
                      scale: 0.2,
                    }}
                    animate={
                      shouldReduceMotion
                        ? { opacity: 0.7, scale: 1 }
                        : {
                          x: [particle.x, particle.x + particle.driftX, particle.x],
                          y: [particle.y, particle.targetY],
                          opacity: [0, 1, 0.9, 0],
                          scale: [0.3, 1.2, 0.8, 0],
                        }
                    }
                    transition={{
                      duration: particle.duration,
                      repeat: Infinity,
                      delay: particle.delay,
                      ease: 'easeInOut',
                    }}
                    className={`absolute left-1/2 top-1/2 ${particle.color} select-none drop-shadow-[0_0_8px_rgba(231,190,114,0.8)]`}
                  >
                    <svg
                      width={particle.size}
                      height={particle.size}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Floating Legendary Item / Relic ascending from the chest */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 0, y: 0 }
                    : { opacity: 0, y: 20, scale: 0.4 }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1, y: -65, scale: 1 }
                    : {
                      opacity: 1,
                      y: [-62, -72, -62],
                      scale: 1,
                    }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.5 }
                    : {
                      y: {
                        repeat: Infinity,
                        duration: 3,
                        ease: 'easeInOut',
                      },
                      opacity: { duration: 0.6 },
                      scale: { type: 'spring', damping: 12, stiffness: 100 },
                    }
                }
                className="absolute z-20 top-2 flex flex-col items-center pointer-events-none select-none"
              >
                {/* Rarity Tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mb-2 px-3 py-0.5 rounded-full bg-midnight/90 border border-mystic-gold shadow-[0_0_15px_rgba(231,190,114,0.6)]"
                >
                  <span className="font-heading text-[10px] tracking-widest text-mystic-gold uppercase font-bold">
                    ★ MYTHIC RELIC UNLOCKED ★
                  </span>
                </motion.div>

                {/* Floating Relic SVG: Winged Golden Heart with Runes */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-[0_0_20px_rgba(231,190,114,0.85)]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Outer glow ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#E7BE72"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ transformOrigin: '50% 50%', animationDuration: '14s' }}
                    />
                    {/* Wing left */}
                    <path
                      d="M20 50 C10 38 18 20 36 28 C30 36 32 46 42 50 Z"
                      fill="url(#goldRelicGrad)"
                      stroke="#8B651B"
                      strokeWidth="1"
                    />
                    {/* Wing right */}
                    <path
                      d="M80 50 C90 38 82 20 64 28 C70 36 68 46 58 50 Z"
                      fill="url(#goldRelicGrad)"
                      stroke="#8B651B"
                      strokeWidth="1"
                    />
                    {/* Golden Crown */}
                    <path
                      d="M40 32 L50 20 L60 32 L56 36 L44 36 Z"
                      fill="url(#goldRelicGrad)"
                    />
                    <circle cx="50" cy="22" r="2.5" fill="#F3A6CE" />
                    {/* Crystal Heart */}
                    <path
                      d="M50 78 C32 60 26 44 34 34 C42 24 50 35 50 35 C50 35 58 24 66 34 C74 44 68 60 50 78 Z"
                      fill="url(#heartGemGrad)"
                      stroke="#E7BE72"
                      strokeWidth="2"
                    />
                    {/* Heart facets */}
                    <path
                      d="M50 36 L42 46 L50 72 L58 46 Z"
                      fill="#FFFFFF"
                      fillOpacity="0.3"
                    />
                    {/* Defs */}
                    <defs>
                      <linearGradient id="goldRelicGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF0B8" />
                        <stop offset="50%" stopColor="#E7BE72" />
                        <stop offset="100%" stopColor="#9C6E18" />
                      </linearGradient>
                      <radialGradient id="heartGemGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#FFB3D9" />
                        <stop offset="40%" stopColor="#F3A6CE" />
                        <stop offset="80%" stopColor="#C43B7A" />
                        <stop offset="100%" stopColor="#5E1135" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Chest Container */}
          <div
            className="relative w-72 sm:w-80 h-52 flex flex-col items-center justify-end"
            style={{ perspective: '850px' }}
          >
            {/* Chest Cavity & Golden Interior Light (behind base) */}
            <div className="absolute top-18 w-60 sm:w-68 h-20 rounded-t-xl bg-[#140827] border-t-2 border-mystic-gold/40 flex items-center justify-center overflow-hidden">
              {/* Inner velvet shading */}
              <div
                className="w-full h-full"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 80%, rgba(231,190,114,0.95) 0%, rgba(118,80,184,0.6) 50%, rgba(20,8,39,0.9) 80%)',
                }}
              />
            </div>

            {/* Chest Lid (with 3D perspective flip) */}
            <motion.div
              className="absolute top-5 w-64 sm:w-72 h-20 z-20 origin-bottom"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'bottom center',
              }}
              animate={
                isOpen
                  ? { rotateX: -110, y: -8 }
                  : isOpening
                    ? {
                      x: [-4, 4, -3, 3, 0],
                      y: [0, -4, 0],
                      rotateX: [-3, 3, 0],
                    }
                    : { rotateX: 0, y: 0, x: 0 }
              }
              transition={
                isOpen
                  ? {
                    type: 'spring',
                    damping: 14,
                    stiffness: 110,
                    mass: 0.9,
                  }
                  : { duration: 0.4 }
              }
            >
              {/* Front of Chest Lid */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <svg
                  viewBox="0 0 320 90"
                  className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
                >
                  <defs>
                    <linearGradient id="lidWoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A2E78" />
                      <stop offset="40%" stopColor="#30205C" />
                      <stop offset="100%" stopColor="#1E123B" />
                    </linearGradient>
                    <linearGradient id="goldTrimGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#FFF0B8" />
                      <stop offset="35%" stopColor="#E7BE72" />
                      <stop offset="70%" stopColor="#D4A145" />
                      <stop offset="100%" stopColor="#8C651B" />
                    </linearGradient>
                    <linearGradient id="gemLidGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FF9EC6" />
                      <stop offset="100%" stopColor="#9C27B0" />
                    </linearGradient>
                  </defs>

                  {/* Arched Lid Vault */}
                  <path
                    d="M 25 80 C 25 16, 295 16, 295 80 Z"
                    fill="url(#lidWoodGrad)"
                    stroke="#100E24"
                    strokeWidth="2"
                  />

                  {/* Dome Curved Highlights */}
                  <path
                    d="M 50 50 C 90 28, 230 28, 270 50"
                    fill="none"
                    stroke="#5A3A94"
                    strokeWidth="2.5"
                    strokeOpacity="0.7"
                  />
                  <path
                    d="M 65 36 C 105 22, 215 22, 255 36"
                    fill="none"
                    stroke="#7D55BE"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />

                  {/* Gold Arch Rim */}
                  <path
                    d="M 25 80 C 25 16, 295 16, 295 80"
                    fill="none"
                    stroke="url(#goldTrimGrad)"
                    strokeWidth="6"
                  />

                  {/* Gold Reinforcement Bands */}
                  <rect x="85" y="24" width="14" height="54" fill="url(#goldTrimGrad)" rx="1" />
                  <rect x="221" y="24" width="14" height="54" fill="url(#goldTrimGrad)" rx="1" />

                  {/* Gold Rivets */}
                  <circle cx="92" cy="38" r="2.5" fill="#FFEAA7" />
                  <circle cx="92" cy="56" r="2.5" fill="#FFEAA7" />
                  <circle cx="92" cy="72" r="2.5" fill="#FFEAA7" />
                  <circle cx="228" cy="38" r="2.5" fill="#FFEAA7" />
                  <circle cx="228" cy="56" r="2.5" fill="#FFEAA7" />
                  <circle cx="228" cy="72" r="2.5" fill="#FFEAA7" />

                  {/* Top Crown Emblem */}
                  <path
                    d="M 148 24 L 160 14 L 172 24 L 167 28 L 153 28 Z"
                    fill="url(#goldTrimGrad)"
                  />
                  <circle cx="160" cy="22" r="2" fill="url(#gemLidGrad)" />

                  {/* Bottom Rim of Lid */}
                  <rect
                    x="20"
                    y="74"
                    width="280"
                    height="12"
                    rx="3"
                    fill="url(#goldTrimGrad)"
                    stroke="#523A0E"
                    strokeWidth="1.5"
                  />

                  {/* Center Latch Hasp */}
                  <path
                    d="M 146 72 L 174 72 L 172 90 C 172 95, 148 95, 148 90 Z"
                    fill="url(#goldTrimGrad)"
                    stroke="#523A0E"
                    strokeWidth="1.5"
                  />
                  <circle cx="160" cy="82" r="3.5" fill="url(#gemLidGrad)" />
                </svg>
              </div>

              {/* Inside/Back of Lid (Visible when lid opens up and back) */}
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                }}
              >
                <svg viewBox="0 0 320 90" className="w-full h-full">
                  <defs>
                    <linearGradient id="innerLidVelvet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1B0E33" />
                      <stop offset="100%" stopColor="#120824" />
                    </linearGradient>
                    <radialGradient id="innerGlow" cx="50%" cy="100%" r="80%">
                      <stop offset="0%" stopColor="#E7BE72" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#7650B8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Inner Lid Vault */}
                  <path
                    d="M 25 80 C 25 16, 295 16, 295 80 Z"
                    fill="url(#innerLidVelvet)"
                    stroke="#E7BE72"
                    strokeWidth="3"
                  />

                  {/* Inner Reflected Gold Glow */}
                  <path
                    d="M 35 78 C 45 30, 275 30, 285 78 Z"
                    fill="url(#innerGlow)"
                  />

                  {/* Inner Gold Frame */}
                  <path
                    d="M 38 78 C 38 28, 282 28, 282 78"
                    fill="none"
                    stroke="#E7BE72"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                    strokeOpacity="0.6"
                  />

                  {/* Inner Lip */}
                  <rect
                    x="20"
                    y="75"
                    width="280"
                    height="10"
                    rx="2"
                    fill="#C99B3B"
                    stroke="#523A0E"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Chest Base (Bottom) */}
            <div className="relative w-64 sm:w-72 h-32 z-10">
              <svg
                viewBox="0 0 320 145"
                className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient id="baseWoodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#30205C" />
                    <stop offset="50%" stopColor="#221543" />
                    <stop offset="100%" stopColor="#140C29" />
                  </linearGradient>
                  <linearGradient id="lockPlateGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF2BF" />
                    <stop offset="45%" stopColor="#E7BE72" />
                    <stop offset="80%" stopColor="#B38424" />
                    <stop offset="100%" stopColor="#6E4A0C" />
                  </linearGradient>
                </defs>

                {/* Chest Base Body */}
                <path
                  d="M 25 10 L 295 10 L 285 132 C 285 138, 278 142, 270 142 L 50 142 C 42 142, 35 138, 35 132 Z"
                  fill="url(#baseWoodGrad)"
                  stroke="#100E24"
                  strokeWidth="2"
                />

                {/* Left Corner Metal Reinforcement */}
                <path
                  d="M 25 10 L 65 10 L 65 24 L 46 24 L 48 126 L 68 126 L 68 142 L 50 142 C 42 142, 35 138, 35 132 L 25 10 Z"
                  fill="url(#goldTrimGrad)"
                  stroke="#523A0E"
                  strokeWidth="1"
                />

                {/* Right Corner Metal Reinforcement */}
                <path
                  d="M 295 10 L 255 10 L 255 24 L 274 24 L 272 126 L 252 126 L 252 142 L 270 142 C 278 142, 285 138, 285 132 L 295 10 Z"
                  fill="url(#goldTrimGrad)"
                  stroke="#523A0E"
                  strokeWidth="1"
                />

                {/* Corner Rivets */}
                <circle cx="43" cy="20" r="2.5" fill="#FFEAA7" />
                <circle cx="44" cy="50" r="2.5" fill="#FFEAA7" />
                <circle cx="46" cy="85" r="2.5" fill="#FFEAA7" />
                <circle cx="48" cy="120" r="2.5" fill="#FFEAA7" />
                <circle cx="277" cy="20" r="2.5" fill="#FFEAA7" />
                <circle cx="276" cy="50" r="2.5" fill="#FFEAA7" />
                <circle cx="274" cy="85" r="2.5" fill="#FFEAA7" />
                <circle cx="272" cy="120" r="2.5" fill="#FFEAA7" />

                {/* Vertical Gold Straps on Base */}
                <rect x="85" y="10" width="14" height="130" fill="url(#goldTrimGrad)" />
                <rect x="221" y="10" width="14" height="130" fill="url(#goldTrimGrad)" />

                {/* Strap Rivets */}
                <circle cx="92" cy="30" r="2.5" fill="#FFEAA7" />
                <circle cx="92" cy="65" r="2.5" fill="#FFEAA7" />
                <circle cx="92" cy="100" r="2.5" fill="#FFEAA7" />
                <circle cx="92" cy="125" r="2.5" fill="#FFEAA7" />
                <circle cx="228" cy="30" r="2.5" fill="#FFEAA7" />
                <circle cx="228" cy="65" r="2.5" fill="#FFEAA7" />
                <circle cx="228" cy="100" r="2.5" fill="#FFEAA7" />
                <circle cx="228" cy="125" r="2.5" fill="#FFEAA7" />

                {/* Side Ring Handles */}
                <circle cx="16" cy="70" r="7" fill="none" stroke="url(#goldTrimGrad)" strokeWidth="3" />
                <circle cx="304" cy="70" r="7" fill="none" stroke="url(#goldTrimGrad)" strokeWidth="3" />

                {/* Center Lock Escutcheon Plate */}
                <path
                  d="M 136 10 L 184 10 L 184 45 C 184 64, 160 74, 160 74 C 160 74, 136 64, 136 45 Z"
                  fill="url(#lockPlateGrad)"
                  stroke="#523A0E"
                  strokeWidth="1.5"
                />

                {/* Lock Inscriptions */}
                <path
                  d="M 142 16 L 178 16"
                  stroke="#523A0E"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Center Gemstone in Lock Plate */}
                <circle
                  cx="160"
                  cy="32"
                  r="7"
                  fill="url(#gemLidGrad)"
                  stroke="#FFEAA7"
                  strokeWidth="1.5"
                />

                {/* Keyhole */}
                <circle cx="160" cy="50" r="3.5" fill="#140824" />
                <polygon points="158,50 162,50 164,60 156,60" fill="#140824" />

                {/* Top Rim of Base */}
                <rect
                  x="20"
                  y="8"
                  width="280"
                  height="6"
                  rx="2"
                  fill="url(#goldTrimGrad)"
                  stroke="#523A0E"
                  strokeWidth="0.8"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTION BUTTON / STAGE CONTROL                       */}
        {/* ========================================================= */}
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              key="closed-controls"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center mt-4 sm:mt-6 z-20"
            >
              <motion.button
                onClick={handleOpenChest}
                disabled={isOpening}
                whileHover={!isOpening ? { scale: 1.05 } : {}}
                whileTap={!isOpening ? { scale: 0.96 } : {}}
                className="group relative px-8 sm:px-10 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden font-heading text-base sm:text-lg font-bold tracking-wider text-midnight bg-gradient-to-r from-mystic-gold via-mystic-gold-light to-mystic-gold border-2 border-mystic-gold-light shadow-[0_0_25px_rgba(231,190,114,0.5),0_0_10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(231,190,114,0.8)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                aria-label="Open the secret treasure chest"
              >
                {/* Glowing light shimmer across the button */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                <svg
                  className="w-5 h-5 text-midnight fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>

                <span className="relative z-10 font-bold uppercase tracking-wider">
                  {isOpening ? 'Unlocking Chest...' : 'Open Chest'}
                </span>

                <span className="text-midnight text-sm">✦</span>
              </motion.button>

              <p className="font-body text-xs text-mystic-gold/60 mt-3 text-center">
                Tap to unlock the ancient chest and reveal what lies within
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* PARCHMENT / SCROLL REVEAL MESSAGE                         */}
        {/* ========================================================= */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="scroll-container"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 35, scale: 0.94 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-20 w-full max-w-xl mx-auto flex flex-col items-center mt-6 sm:mt-8 px-2"
            >
              {/* Top Scroll Spindle */}
              <div
                className="relative w-full flex items-center justify-between px-2 sm:px-4 z-20"
                aria-hidden="true"
              >
                {/* Left Finial */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-mystic-gold-light via-mystic-gold to-[#8B651B] border border-[#523A0E] shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#523A0E]/40" />
                </div>
                {/* Roller Body */}
                <div className="flex-1 h-3 sm:h-4 mx-1 rounded-full bg-gradient-to-b from-[#8B5A2B] via-[#5C3818] to-[#3B220B] border-y border-mystic-gold/40 shadow-inner" />
                {/* Right Finial */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-mystic-gold-light via-mystic-gold to-[#8B651B] border border-[#523A0E] shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#523A0E]/40" />
                </div>
              </div>

              {/* Scroll Parchment Body */}
              <div
                className="relative w-full -my-1 rounded-sm p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(231,190,114,0.25)] border-x-2 border-mystic-gold/70 overflow-hidden"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 25%, #FFFDF7 0%, #FAF2E1 50%, #EEDBB2 100%)',
                }}
              >
                {/* Inner decorative border */}
                <div
                  className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded border border-mystic-gold/40"
                  aria-hidden="true"
                />

                {/* Corner flourishes */}
                <CornerFlourish className="absolute top-3 left-3 w-6 h-6 sm:w-7 sm:h-7 text-mystic-gold/80" />
                <CornerFlourish className="absolute top-3 right-3 w-6 h-6 sm:w-7 sm:h-7 text-mystic-gold/80 rotate-90" />
                <CornerFlourish className="absolute bottom-3 right-3 w-6 h-6 sm:w-7 sm:h-7 text-mystic-gold/80 rotate-180" />
                <CornerFlourish className="absolute bottom-3 left-3 w-6 h-6 sm:w-7 sm:h-7 text-mystic-gold/80 -rotate-90" />

                {/* Scroll Header */}
                <div className="text-center mb-3">
                  <span className="font-heading text-[11px] sm:text-xs font-bold tracking-[0.3em] text-[#8C642A] uppercase block">
                    ✦ QUEST SCROLL DISCOVERY ✦
                  </span>
                  <OrnamentalDivider className="my-1" />
                </div>

                {/* Reveal Message */}
                <div className="my-4 sm:my-6 px-1 sm:px-4">
                  <p className="font-body text-base sm:text-lg md:text-xl font-medium leading-relaxed sm:leading-loose text-[#26153E] text-center">
                    &ldquo;{SECRET_REWARD_MESSAGE}&rdquo;
                  </p>
                </div>

                {/* RPG Quest Objective Footer inside scroll */}
                <div className="mt-4 pt-4 border-t border-[#8C642A]/25 flex flex-col items-center gap-2">
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#351F10]/10 text-[#5B3E26] font-heading font-semibold border border-[#8C642A]/30 uppercase tracking-wider">
                      Status: Discovered
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E7BE72]/20 text-[#7D5311] font-heading font-semibold border border-mystic-gold/40 uppercase tracking-wider">
                      Next: Memory Match
                    </span>
                  </div>

                  <p className="font-body text-xs text-[#5B3E26]/85 text-center">
                    Coba selesaikan permainan kartu di tantangan berikutnya ya!
                  </p>
                </div>
              </div>

              {/* Bottom Scroll Spindle */}
              <div
                className="relative w-full flex items-center justify-between px-2 sm:px-4 z-20"
                aria-hidden="true"
              >
                {/* Left Finial */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-mystic-gold-light via-mystic-gold to-[#8B651B] border border-[#523A0E] shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#523A0E]/40" />
                </div>
                {/* Roller Body */}
                <div className="flex-1 h-3 sm:h-4 mx-1 rounded-full bg-gradient-to-b from-[#8B5A2B] via-[#5C3818] to-[#3B220B] border-y border-mystic-gold/40 shadow-inner" />
                {/* Right Finial */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-mystic-gold-light via-mystic-gold to-[#8B651B] border border-[#523A0E] shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#523A0E]/40" />
                </div>
              </div>

              {/* ===================================================== */}
              {/* ACCEPT CHALLENGE BUTTON                               */}
              {/* ===================================================== */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, scale: 0.95 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.95, duration: 0.55 }}
                className="mt-8 sm:mt-10 w-full flex flex-col items-center"
              >
                <motion.button
                  onClick={handleAcceptChallenge}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative px-8 sm:px-12 py-3.5 sm:py-4 min-h-[48px] rounded-full overflow-hidden font-heading text-base sm:text-lg font-bold tracking-wider text-white bg-gradient-to-r from-deep-purple via-royal-purple to-deep-purple border-2 border-mystic-gold/80 hover:border-mystic-gold shadow-[0_0_25px_rgba(118,80,184,0.5),0_0_15px_rgba(231,190,114,0.3)] hover:shadow-[0_0_35px_rgba(231,190,114,0.6)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3"
                  aria-label="Mulai mini game kartu"
                >
                  {/* Glowing shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-mystic-gold/25 to-transparent pointer-events-none" />

                  {/* Crossed Swords Icon */}
                  <svg
                    className="relative z-10 w-5 h-5 text-mystic-gold"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                    <path d="M13 19l6-6" />
                    <path d="M16 16l4 4" />
                    <path d="M19 21l2-2" />
                    <path d="M9.5 6.5L21 18v3h-3L6.5 9.5" />
                    <path d="M11 5L5 11" />
                    <path d="M8 8L4 4" />
                    <path d="M5 3L3 5" />
                  </svg>

                  <span className="relative z-10 text-mystic-gold-light group-hover:text-white transition-colors">
                    Mulai Mini Game
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
                  Chapter 3: Memory Match (Cocokkan 4 Pasangan)
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
