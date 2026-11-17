'use client';

import React, { useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface MythicCelebrationProps {
  onNext: () => void;
}

// 40 deterministic confetti particles for continuous falling shower without SSR hydration mismatch
const CONFETTI_PARTICLES = [
  { id: 1, left: 3, width: 8, height: 14, color: '#E7BE72', duration: 4.2, delay: -1.2, shape: 'rect' },
  { id: 2, left: 8, width: 6, height: 6, color: '#F3A6CE', duration: 3.8, delay: -0.5, shape: 'circle' },
  { id: 3, left: 14, width: 9, height: 12, color: '#7650B8', duration: 4.5, delay: -2.3, shape: 'rect' },
  { id: 4, left: 19, width: 7, height: 7, color: '#f0d090', duration: 3.5, delay: -1.8, shape: 'diamond' },
  { id: 5, left: 24, width: 8, height: 13, color: '#FFFFFF', duration: 4.0, delay: -0.2, shape: 'rect' },
  { id: 6, left: 29, width: 6, height: 6, color: '#E7BE72', duration: 4.8, delay: -3.1, shape: 'circle' },
  { id: 7, left: 35, width: 10, height: 10, color: '#8b6bc9', duration: 3.7, delay: -1.5, shape: 'diamond' },
  { id: 8, left: 40, width: 8, height: 14, color: '#F3A6CE', duration: 4.3, delay: -0.9, shape: 'rect' },
  { id: 9, left: 46, width: 7, height: 7, color: '#E7BE72', duration: 3.9, delay: -2.7, shape: 'circle' },
  { id: 10, left: 51, width: 9, height: 12, color: '#FFFFFF', duration: 4.6, delay: -1.1, shape: 'rect' },
  { id: 11, left: 56, width: 8, height: 8, color: '#7650B8', duration: 3.6, delay: -0.4, shape: 'diamond' },
  { id: 12, left: 62, width: 7, height: 13, color: '#f0d090', duration: 4.4, delay: -2.0, shape: 'rect' },
  { id: 13, left: 67, width: 6, height: 6, color: '#F3A6CE', duration: 3.8, delay: -0.8, shape: 'circle' },
  { id: 14, left: 72, width: 9, height: 11, color: '#E7BE72', duration: 4.1, delay: -2.9, shape: 'rect' },
  { id: 15, left: 78, width: 8, height: 8, color: '#8b6bc9', duration: 4.7, delay: -1.4, shape: 'diamond' },
  { id: 16, left: 83, width: 7, height: 14, color: '#FFFFFF', duration: 3.9, delay: -0.3, shape: 'rect' },
  { id: 17, left: 89, width: 8, height: 8, color: '#E7BE72', duration: 4.3, delay: -2.2, shape: 'diamond' },
  { id: 18, left: 95, width: 6, height: 6, color: '#F3A6CE', duration: 3.7, delay: -1.7, shape: 'circle' },
  // Staggered positive delays for secondary continuous waves
  { id: 19, left: 6, width: 7, height: 12, color: '#7650B8', duration: 4.3, delay: 0.5, shape: 'rect' },
  { id: 20, left: 12, width: 8, height: 8, color: '#E7BE72', duration: 3.6, delay: 1.2, shape: 'diamond' },
  { id: 21, left: 17, width: 6, height: 6, color: '#FFFFFF', duration: 4.5, delay: 0.8, shape: 'circle' },
  { id: 22, left: 22, width: 9, height: 13, color: '#F3A6CE', duration: 4.0, delay: 1.6, shape: 'rect' },
  { id: 23, left: 27, width: 8, height: 8, color: '#f0d090', duration: 3.7, delay: 0.3, shape: 'diamond' },
  { id: 24, left: 32, width: 6, height: 6, color: '#8b6bc9', duration: 4.6, delay: 1.9, shape: 'circle' },
  { id: 25, left: 38, width: 10, height: 14, color: '#E7BE72', duration: 4.2, delay: 0.9, shape: 'rect' },
  { id: 26, left: 43, width: 7, height: 7, color: '#FFFFFF', duration: 3.5, delay: 1.4, shape: 'diamond' },
  { id: 27, left: 49, width: 8, height: 12, color: '#7650B8', duration: 4.4, delay: 0.2, shape: 'rect' },
  { id: 28, left: 54, width: 6, height: 6, color: '#F3A6CE', duration: 3.9, delay: 1.7, shape: 'circle' },
  { id: 29, left: 60, width: 9, height: 9, color: '#E7BE72', duration: 4.1, delay: 0.7, shape: 'diamond' },
  { id: 30, left: 65, width: 8, height: 13, color: '#f0d090', duration: 4.7, delay: 1.3, shape: 'rect' },
  { id: 31, left: 71, width: 6, height: 6, color: '#8b6bc9', duration: 3.8, delay: 0.4, shape: 'circle' },
  { id: 32, left: 76, width: 9, height: 12, color: '#FFFFFF', duration: 4.5, delay: 1.8, shape: 'rect' },
  { id: 33, left: 81, width: 7, height: 7, color: '#E7BE72', duration: 3.7, delay: 1.1, shape: 'diamond' },
  { id: 34, left: 87, width: 8, height: 14, color: '#F3A6CE', duration: 4.3, delay: 0.6, shape: 'rect' },
  { id: 35, left: 92, width: 6, height: 6, color: '#f0d090', duration: 4.0, delay: 1.5, shape: 'circle' },
  { id: 36, left: 97, width: 8, height: 8, color: '#7650B8', duration: 4.6, delay: 1.0, shape: 'diamond' },
  { id: 37, left: 16, width: 9, height: 12, color: '#E7BE72', duration: 3.6, delay: 2.1, shape: 'rect' },
  { id: 38, left: 45, width: 7, height: 7, color: '#FFFFFF', duration: 4.2, delay: 2.4, shape: 'circle' },
  { id: 39, left: 68, width: 8, height: 13, color: '#8b6bc9', duration: 3.9, delay: 2.2, shape: 'rect' },
  { id: 40, left: 85, width: 9, height: 9, color: '#F3A6CE', duration: 4.7, delay: 2.5, shape: 'diamond' },
];

// Initial radial explosion particles that burst outward from the emblem center
const BURST_PARTICLES = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * (360 / 16) * Math.PI) / 180;
  const distance = 95 + (i % 3) * 35;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: ['#E7BE72', '#f0d090', '#7650B8', '#F3A6CE', '#FFFFFF'][i % 5],
    size: 5 + (i % 3) * 2,
  };
});

export function MythicCelebration({ onNext }: MythicCelebrationProps) {
  const { playSfx } = useAudio();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Play celebratory sound effect on mount
    playSfx('fanfare');
  }, [playSfx]);

  const handleContinue = () => {
    playSfx('click');
    onNext();
  };

  // Words for the congratulatory message reveal
  const messageWords = [
    'Selamat,',
    `${RECIPIENT_NAME}!`,
    'Kamu',
    'telah',
    'mencapai',
    'rank',
    'MYTHIC!',
  ];

  const wordContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0.2 : 1.2,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 140,
      },
    },
  };

  const mythicWordVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.6, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 160,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-midnight text-white px-4 py-10 pb-16 md:py-14 select-none">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full bg-deep-purple/35 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] rounded-full bg-mystic-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-64 bg-royal-purple/20 blur-3xl pointer-events-none" />

      {/* Confetti Shower (CSS animation with absolute positioned colored divs) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {CONFETTI_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: `${p.left}%`,
              top: '-24px',
              width: `${p.width}px`,
              height: `${p.height}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '1px',
              transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined,
              animation: shouldReduceMotion
                ? 'none'
                : `confetti-fall ${p.duration}s ease-in-out ${p.delay}s infinite`,
              boxShadow: `0 0 6px ${p.color}88`,
              opacity: 0.85,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
        {/* RANK UP Banner */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -35, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 16,
            delay: shouldReduceMotion ? 0 : 0.6,
          }}
          className="mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-deep-purple/70 border border-mystic-gold/50 shadow-[0_0_20px_rgba(231,190,114,0.3)] backdrop-blur-sm">
            <span className="text-mystic-gold text-xs sm:text-sm animate-twinkle">✦</span>
            <span className="font-heading font-extrabold text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-gradient-gold">
              RANK UP
            </span>
            <span className="text-mystic-gold text-xs sm:text-sm animate-twinkle">✦</span>
          </div>
        </motion.div>

        {/* Emblem & Light Rays Section */}
        <div className="relative flex items-center justify-center w-full my-2 sm:my-4">
          {/* Glowing Divine Light Rays (Emanating from Emblem) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 0.9,
              scale: 1,
              rotate: shouldReduceMotion ? 0 : 360,
            }}
            transition={{
              opacity: { duration: 1, delay: 0.1 },
              scale: { duration: 1, delay: 0.1 },
              rotate: { repeat: Infinity, duration: 32, ease: 'linear' },
            }}
            className="absolute pointer-events-none w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px]"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(231,190,114,0.22) 0deg 11.25deg, transparent 11.25deg 22.5deg)',
              maskImage:
                'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage:
                'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0) 70%)',
            }}
          />

          {/* Counter-rotating Royal Purple Subtle Aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: 0.6,
              scale: 1,
              rotate: shouldReduceMotion ? 0 : -360,
            }}
            transition={{
              opacity: { duration: 1.2, delay: 0.2 },
              scale: { duration: 1.2, delay: 0.2 },
              rotate: { repeat: Infinity, duration: 48, ease: 'linear' },
            }}
            className="absolute pointer-events-none w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px]"
            style={{
              background:
                'repeating-conic-gradient(from 15deg, rgba(118,80,184,0.28) 0deg 15deg, transparent 15deg 30deg)',
              maskImage:
                'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage:
                'radial-gradient(circle at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 70%)',
            }}
          />

          {/* Concentric Glow Core */}
          <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-mystic-gold/25 blur-2xl animate-pulse-glow pointer-events-none" />

          {/* Radial Explosion Particles on Emblem Impact */}
          {!shouldReduceMotion &&
            BURST_PARTICLES.map((bp) => (
              <motion.div
                key={`burst-${bp.id}`}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: bp.x,
                  y: bp.y,
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.3, 0.9, 0],
                }}
                transition={{
                  duration: 1.2,
                  delay: 0.35,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full pointer-events-none z-10"
                style={{
                  width: bp.size,
                  height: bp.size,
                  backgroundColor: bp.color,
                  boxShadow: `0 0 10px ${bp.color}`,
                }}
              />
            ))}

          {/* Animated Mythic Emblem/Badge using SVG */}
          <motion.div
            initial={{ scale: shouldReduceMotion ? 1 : 0, rotate: shouldReduceMotion ? 0 : -25, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 190,
              damping: 17,
              delay: shouldReduceMotion ? 0 : 0.2,
            }}
            className="relative z-10"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-48 h-52 sm:w-56 sm:h-60 md:w-64 md:h-72"
            >
              <svg
                viewBox="0 0 260 280"
                className="w-full h-full filter drop-shadow-[0_0_25px_rgba(231,190,114,0.55)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Mythic Tier Crest Emblem"
              >
                <defs>
                  {/* Gold Gradients */}
                  <linearGradient id="emblem-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2C7" />
                    <stop offset="25%" stopColor="#E7BE72" />
                    <stop offset="65%" stopColor="#9C7023" />
                    <stop offset="100%" stopColor="#F0D090" />
                  </linearGradient>

                  <linearGradient id="emblem-gold-light" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E7BE72" />
                    <stop offset="50%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#E7BE72" />
                  </linearGradient>

                  {/* Purple Gradients */}
                  <linearGradient id="emblem-purple-shield" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4A2F82" />
                    <stop offset="45%" stopColor="#2D1C59" />
                    <stop offset="100%" stopColor="#140E26" />
                  </linearGradient>

                  <linearGradient id="emblem-purple-inner" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#251647" />
                    <stop offset="100%" stopColor="#0E0A1E" />
                  </linearGradient>

                  {/* Radial Star Aura */}
                  <radialGradient id="emblem-star-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#FFF2C7" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#E7BE72" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#7650B8" stopOpacity="0" />
                  </radialGradient>

                  {/* Glow Filter */}
                  <filter id="badge-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Left Wing Flourish */}
                <path
                  d="M 68 142 C 38 122 18 92 28 52 C 38 78 58 98 78 108 C 58 118 48 138 52 166 C 58 153 68 146 80 144 Z"
                  fill="url(#emblem-gold)"
                  opacity="0.9"
                />
                <path
                  d="M 62 136 C 38 118 24 94 32 62 C 40 82 56 98 72 106 Z"
                  fill="url(#emblem-purple-shield)"
                  opacity="0.75"
                />

                {/* Right Wing Flourish */}
                <path
                  d="M 192 142 C 222 122 242 92 232 52 C 222 78 202 98 182 108 C 202 118 212 138 208 166 C 202 153 192 146 180 144 Z"
                  fill="url(#emblem-gold)"
                  opacity="0.9"
                />
                <path
                  d="M 198 136 C 222 118 236 94 228 62 C 220 82 204 98 188 106 Z"
                  fill="url(#emblem-purple-shield)"
                  opacity="0.75"
                />

                {/* Outer Golden Shield Frame */}
                <path
                  d="M 130 14 L 180 38 L 208 86 L 188 178 L 130 254 L 72 178 L 52 86 L 80 38 Z"
                  fill="url(#emblem-purple-shield)"
                  stroke="url(#emblem-gold)"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />

                {/* Inner Shield Body */}
                <path
                  d="M 130 30 L 170 50 L 194 90 L 176 170 L 130 236 L 84 170 L 66 90 L 90 50 Z"
                  fill="url(#emblem-purple-inner)"
                  stroke="url(#emblem-gold)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  opacity="0.9"
                />

                {/* Fantasy Facet Engravings */}
                <line
                  x1="130"
                  y1="30"
                  x2="130"
                  y2="236"
                  stroke="url(#emblem-gold)"
                  strokeWidth="1.5"
                  opacity="0.35"
                />
                <line
                  x1="66"
                  y1="90"
                  x2="194"
                  y2="90"
                  stroke="url(#emblem-gold)"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
                <line
                  x1="84"
                  y1="170"
                  x2="176"
                  y2="170"
                  stroke="url(#emblem-gold)"
                  strokeWidth="1.5"
                  opacity="0.3"
                />

                {/* Central Diamond Plate */}
                <polygon
                  points="130,68 182,138 130,208 78,138"
                  fill="url(#emblem-purple-shield)"
                  stroke="url(#emblem-gold)"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Diamond Facet Shading */}
                <polygon points="130,68 182,138 130,138" fill="url(#emblem-gold)" opacity="0.18" />
                <polygon points="130,208 78,138 130,138" fill="#000000" opacity="0.4" />

                {/* Glowing Core behind Center Star */}
                <circle cx="130" cy="138" r="42" fill="url(#emblem-star-glow)" />

                {/* Grand 8-Pointed Golden Center Star */}
                <polygon
                  points="
                    130,88
                    134,124
                    162,106
                    146,130
                    180,138
                    146,146
                    162,170
                    134,152
                    130,188
                    126,152
                    98,170
                    114,146
                    80,138
                    114,130
                    98,106
                    126,124
                  "
                  fill="url(#emblem-gold-light)"
                  stroke="#FFFDF5"
                  strokeWidth="1.5"
                  filter="url(#badge-glow)"
                />

                {/* Center Core Diamond Gem */}
                <polygon
                  points="130,126 142,138 130,150 118,138"
                  fill="#FFFFFF"
                  stroke="url(#emblem-gold)"
                  strokeWidth="1.2"
                />
                <circle cx="130" cy="138" r="3.2" fill="#FFFCE6" />

                {/* Crest Golden Studs */}
                <circle cx="130" cy="22" r="4.5" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
                <circle cx="80" cy="44" r="3.5" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
                <circle cx="180" cy="44" r="3.5" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
                <circle cx="130" cy="224" r="3.5" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
                <circle cx="70" cy="138" r="3" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
                <circle cx="190" cy="138" r="3" fill="url(#emblem-gold)" stroke="#FFF9E6" strokeWidth="1" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Congratulatory Message (Word-by-word reveal) */}
        <div className="mt-4 sm:mt-6 px-2 max-w-xl">
          <motion.div
            variants={wordContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1.5"
          >
            {messageWords.map((word, index) => {
              const isMythic = word.includes('MYTHIC');
              const isName = word.includes(RECIPIENT_NAME);

              if (isMythic) {
                return (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={mythicWordVariants}
                    className="inline-block font-heading font-black text-2xl sm:text-3xl md:text-4xl text-gradient-gold drop-shadow-[0_0_16px_rgba(231,190,114,0.7)] px-1"
                  >
                    {word}
                  </motion.span>
                );
              }

              if (isName) {
                return (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={wordVariants}
                    className="inline-block font-heading font-bold text-xl sm:text-2xl md:text-3xl text-soft-pink drop-shadow-[0_0_10px_rgba(243,166,206,0.5)]"
                  >
                    {word}
                  </motion.span>
                );
              }

              return (
                <motion.span
                  key={`${word}-${index}`}
                  variants={wordVariants}
                  className="inline-block font-heading font-semibold text-lg sm:text-xl md:text-2xl text-white/95 tracking-wide"
                >
                  {word}
                </motion.span>
              );
            })}
          </motion.div>

          {/* Subtitle / Fantasy Lore Description */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldReduceMotion ? 0.3 : 2.0,
              ease: 'easeOut',
            }}
            className="mt-4 space-y-2"
          >
            <div className="flex items-center justify-center gap-3 text-mystic-gold/60 text-xs sm:text-sm">
              <span>✦</span>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent" />
              <span>⚔</span>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent" />
              <span>✦</span>
            </div>
            <p className="font-body text-xs sm:text-sm md:text-base text-white/80 max-w-md mx-auto leading-relaxed">
              Selamat atas pencapaian Mythic-nya! Perjalanan push rank yang keren dan seru buat diingat.
            </p>
          </motion.div>
        </div>

        {/* Continue Button (Appears after ~2.5s delay) */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: shouldReduceMotion ? 0.4 : 2.5,
            ease: 'easeOut',
          }}
          className="mt-8 sm:mt-10 flex flex-col items-center"
        >
          <motion.button
            onClick={handleContinue}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
            aria-label="Continue to next chapter"
            className="min-h-[48px] px-8 py-3.5 rounded-full bg-gradient-to-r from-deep-purple via-royal-purple to-deep-purple border-2 border-mystic-gold/80 hover:border-mystic-gold text-mystic-gold hover:text-white font-heading font-semibold text-base sm:text-lg tracking-wider shadow-[0_0_22px_rgba(231,190,114,0.35)] hover:shadow-[0_0_35px_rgba(231,190,114,0.65)] transition-all duration-300 flex items-center gap-3 cursor-pointer group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-mystic-gold focus:ring-offset-2 focus:ring-offset-midnight"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="relative z-10">Lanjutkan</span>
            <motion.span
              animate={shouldReduceMotion ? {} : { x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="relative z-10 text-mystic-gold-light font-bold"
            >
              ➜
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default MythicCelebration;
