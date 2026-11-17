'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LandingPageProps {
  onNext: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

interface StarParticle {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
  opacity: number;
}

interface FloatingMote {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  floatDuration: string;
}

export default function LandingPage({
  onNext,
  isAudioPlaying,
  onToggleAudio,
}: LandingPageProps) {
  // Deterministic star field to prevent hydration mismatch while creating a rich cosmos
  const stars: StarParticle[] = useMemo(
    () => [
      { id: 1, top: '8%', left: '12%', size: 2, delay: '0.2s', duration: '2.4s', color: '#E7BE72', opacity: 0.8 },
      { id: 2, top: '15%', left: '28%', size: 3, delay: '1.1s', duration: '3.1s', color: '#FFFFFF', opacity: 0.9 },
      { id: 3, top: '22%', left: '8%', size: 1.5, delay: '0.7s', duration: '2.8s', color: '#F3A6CE', opacity: 0.7 },
      { id: 4, top: '11%', left: '75%', size: 2.5, delay: '1.8s', duration: '2.2s', color: '#E7BE72', opacity: 0.85 },
      { id: 5, top: '19%', left: '89%', size: 2, delay: '0.4s', duration: '3.5s', color: '#FFFFFF', opacity: 0.75 },
      { id: 6, top: '29%', left: '68%', size: 3, delay: '1.5s', duration: '2.7s', color: '#8b6bc9', opacity: 0.8 },
      { id: 7, top: '35%', left: '18%', size: 2, delay: '0.9s', duration: '2.5s', color: '#E7BE72', opacity: 0.7 },
      { id: 8, top: '42%', left: '84%', size: 2, delay: '2.1s', duration: '3.3s', color: '#F3A6CE', opacity: 0.8 },
      { id: 9, top: '48%', left: '6%', size: 3.5, delay: '0.3s', duration: '2.9s', color: '#FFFFFF', opacity: 0.9 },
      { id: 10, top: '55%', left: '22%', size: 1.5, delay: '1.4s', duration: '2.1s', color: '#E7BE72', opacity: 0.75 },
      { id: 11, top: '61%', left: '79%', size: 2.5, delay: '0.8s', duration: '3.2s', color: '#FFFFFF', opacity: 0.85 },
      { id: 12, top: '68%', left: '92%', size: 2, delay: '1.9s', duration: '2.6s', color: '#8b6bc9', opacity: 0.7 },
      { id: 13, top: '74%', left: '14%', size: 3, delay: '0.5s', duration: '2.8s', color: '#E7BE72', opacity: 0.9 },
      { id: 14, top: '82%', left: '27%', size: 1.5, delay: '2.3s', duration: '3.4s', color: '#F3A6CE', opacity: 0.75 },
      { id: 15, top: '87%', left: '71%', size: 2.5, delay: '1.2s', duration: '2.3s', color: '#FFFFFF', opacity: 0.8 },
      { id: 16, top: '91%', left: '85%', size: 2, delay: '0.6s', duration: '3.0s', color: '#E7BE72', opacity: 0.85 },
      { id: 17, top: '6%', left: '45%', size: 1.5, delay: '1.7s', duration: '2.5s', color: '#FFFFFF', opacity: 0.6 },
      { id: 18, top: '25%', left: '42%', size: 2, delay: '2.5s', duration: '2.9s', color: '#E7BE72', opacity: 0.7 },
      { id: 19, top: '78%', left: '52%', size: 2, delay: '0.4s', duration: '3.1s', color: '#F3A6CE', opacity: 0.65 },
      { id: 20, top: '94%', left: '38%', size: 3, delay: '1.6s', duration: '2.7s', color: '#FFFFFF', opacity: 0.8 },
      { id: 21, top: '38%', left: '94%', size: 1.5, delay: '0.8s', duration: '2.2s', color: '#E7BE72', opacity: 0.75 },
      { id: 22, top: '16%', left: '60%', size: 2, delay: '2.0s', duration: '3.0s', color: '#8b6bc9', opacity: 0.7 },
      { id: 23, top: '52%', left: '91%', size: 2.5, delay: '1.3s', duration: '2.8s', color: '#FFFFFF', opacity: 0.85 },
      { id: 24, top: '66%', left: '3%', size: 2, delay: '0.1s', duration: '2.4s', color: '#E7BE72', opacity: 0.7 },
      { id: 25, top: '85%', left: '9%', size: 2, delay: '2.2s', duration: '3.2s', color: '#F3A6CE', opacity: 0.8 },
      { id: 26, top: '4%', left: '90%', size: 2.5, delay: '1.0s', duration: '2.5s', color: '#FFFFFF', opacity: 0.75 },
      { id: 27, top: '33%', left: '32%', size: 1.5, delay: '0.5s', duration: '3.3s', color: '#E7BE72', opacity: 0.7 },
      { id: 28, top: '58%', left: '11%', size: 2.5, delay: '1.7s', duration: '2.9s', color: '#8b6bc9', opacity: 0.8 },
      { id: 29, top: '71%', left: '62%', size: 2, delay: '2.4s', duration: '2.6s', color: '#FFFFFF', opacity: 0.85 },
      { id: 30, top: '89%', left: '48%', size: 1.5, delay: '0.9s', duration: '3.1s', color: '#E7BE72', opacity: 0.75 },
    ],
    []
  );

  // Floating magical motes drifting upward with ambient motion
  const floatingMotes: FloatingMote[] = useMemo(
    () => [
      { id: 1, top: '80%', left: '16%', size: 4, delay: '0.3s', duration: '2.2s', floatDuration: '4.5s' },
      { id: 2, top: '70%', left: '34%', size: 5, delay: '1.2s', duration: '3.0s', floatDuration: '5.2s' },
      { id: 3, top: '60%', left: '76%', size: 4, delay: '0.7s', duration: '2.6s', floatDuration: '4.8s' },
      { id: 4, top: '85%', left: '64%', size: 6, delay: '2.0s', duration: '3.4s', floatDuration: '5.8s' },
      { id: 5, top: '50%', left: '20%', size: 4, delay: '1.5s', duration: '2.8s', floatDuration: '4.2s' },
      { id: 6, top: '75%', left: '82%', size: 5, delay: '0.9s', duration: '2.5s', floatDuration: '5.0s' },
      { id: 7, top: '40%', left: '88%', size: 4, delay: '1.8s', duration: '3.2s', floatDuration: '4.6s' },
      { id: 8, top: '30%', left: '15%', size: 5, delay: '0.4s', duration: '2.9s', floatDuration: '5.4s' },
    ],
    []
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-midnight text-white flex flex-col justify-between items-center pb-14 selection:bg-royal-purple selection:text-mystic-gold">
      {/* ─── ATMOSPHERIC BACKGROUND LAYERS ─── */}
      {/* Deep Space & Magical Radial Gradients */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(118,80,184,0.35),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_115%,rgba(48,32,92,0.6),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_45%,rgba(231,190,114,0.08),transparent_55%)]"
        aria-hidden="true"
      />

      {/* Decorative Runic Halo behind Hero (SVG Art) */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] z-0 opacity-20"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full animate-[spin_60s_linear_infinite]"
          fill="none"
          stroke="#E7BE72"
          strokeWidth="0.75"
        >
          <circle cx="250" cy="250" r="230" strokeDasharray="6 6" />
          <circle cx="250" cy="250" r="200" strokeOpacity="0.6" />
          <circle cx="250" cy="250" r="160" strokeDasharray="3 8" />
          <polygon
            points="250,50 391,150 391,350 250,450 109,350 109,150"
            strokeOpacity="0.4"
          />
          <polygon
            points="250,70 374,160 374,340 250,430 126,340 126,160"
            strokeOpacity="0.3"
            transform="rotate(30 250 250)"
          />
          <circle cx="250" cy="250" r="40" strokeDasharray="2 4" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* ─── STARRY BACKGROUND & MAGICAL PARTICLES ─── */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {/* Twinkling Star Field */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}

        {/* Floating Magical Motes */}
        {floatingMotes.map((mote) => (
          <div
            key={mote.id}
            className="absolute rounded-full animate-float"
            style={{
              top: mote.top,
              left: mote.left,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              backgroundColor: '#E7BE72',
              boxShadow: '0 0 10px rgba(231,190,114,0.8), 0 0 20px rgba(243,166,206,0.5)',
              animationDelay: mote.delay,
              animationDuration: mote.floatDuration,
            }}
          >
            <div
              className="w-full h-full rounded-full animate-twinkle"
              style={{
                animationDelay: mote.delay,
                animationDuration: mote.duration,
              }}
            />
          </div>
        ))}
      </div>

      {/* ─── CORNER RPG ORNAMENTS (CSS & SVG ART) ─── */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 z-20 opacity-60">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M0 16V2C0 0.89543 0.89543 0 2 0H16" stroke="#E7BE72" strokeWidth="1.5" />
          <path d="M4 12V4H12" stroke="#7650B8" strokeWidth="1" />
          <circle cx="4" cy="4" r="1.5" fill="#E7BE72" />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 opacity-60">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M0 24V38C0 39.1046 0.89543 40 2 40H16" stroke="#E7BE72" strokeWidth="1.5" />
          <path d="M4 28V36H12" stroke="#7650B8" strokeWidth="1" />
          <circle cx="4" cy="36" r="1.5" fill="#E7BE72" />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 opacity-60">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M40 24V38C40 39.1046 39.1046 40 38 40H24" stroke="#E7BE72" strokeWidth="1.5" />
          <path d="M36 28V36H28" stroke="#7650B8" strokeWidth="1" />
          <circle cx="36" cy="36" r="1.5" fill="#E7BE72" />
        </svg>
      </div>

      {/* ─── TOP BAR: AUDIO TOGGLE & PROLOGUE BADGE ─── */}
      <header className="relative z-30 w-full max-w-7xl px-5 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Left Badge: RPG Chapter Indicator */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-center gap-2"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-royal-purple/50 bg-deep-purple/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-mystic-gold animate-twinkle" />
            <span className="font-heading text-[11px] sm:text-xs tracking-[0.2em] uppercase text-mystic-gold/90 font-semibold">
              PROLOGUE
            </span>
          </div>
        </motion.div>

        {/* Right Button: Audio Toggle (Music Note Icon) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <button
            type="button"
            onClick={onToggleAudio}
            aria-label={isAudioPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
            title={isAudioPlaying ? 'Jeda musik' : 'Putar musik latar'}
            className={`group relative flex items-center justify-center min-w-[44px] min-h-[44px] w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer border ${
              isAudioPlaying
                ? 'border-mystic-gold bg-deep-purple/70 text-mystic-gold shadow-[0_0_15px_rgba(231,190,114,0.4)]'
                : 'border-mystic-gold/60 bg-midnight-light/90 text-mystic-gold/90 hover:text-mystic-gold hover:border-mystic-gold hover:bg-deep-purple/70 shadow-[0_0_12px_rgba(231,190,114,0.25)] animate-pulse'
            }`}
          >
            {/* Ambient Pulse Ring when Playing or Waiting */}
            <span
              className={`absolute inset-0 rounded-full border border-mystic-gold/40 opacity-40 pointer-events-none ${
                isAudioPlaying ? 'animate-ping' : 'animate-pulse'
              }`}
              aria-hidden="true"
            />

            {/* Music Note SVG with Dynamic Sound Wave Visual */}
            <div className="relative flex items-center justify-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:scale-110"
              >
                {/* Note stem and heads */}
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" fill="currentColor" />
                <circle cx="18" cy="16" r="3" fill="currentColor" />
              </svg>
            </div>

            {/* Tiny Animated Wave Bar Indicators */}
            {isAudioPlaying && (
              <span className="absolute -bottom-1.5 flex items-end gap-0.5 h-2">
                <span className="w-0.5 h-1.5 bg-mystic-gold rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-mystic-gold rounded-full animate-[pulse_1.4s_ease-in-out_infinite_0.2s]" />
                <span className="w-0.5 h-1 bg-mystic-gold rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]" />
              </span>
            )}
          </button>
        </motion.div>
      </header>

      {/* ─── MAIN HERO CONTENT ─── */}
      <main className="relative z-10 w-full max-w-4xl px-6 py-10 flex flex-col items-center text-center my-auto">
        {/* Emblem / Mythic Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          className="mb-5 sm:mb-6 animate-float flex flex-col items-center"
        >
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
            {/* Soft Glow behind Emblem */}
            <div
              className="absolute inset-0 rounded-full bg-mystic-gold/20 blur-xl animate-pulse-glow"
              aria-hidden="true"
            />

            {/* High Fantasy Winged Sword & Star Crest SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_0_12px_rgba(231,190,114,0.6)]"
              fill="none"
            >
              {/* Central Glowing Gem */}
              <circle cx="50" cy="50" r="10" fill="#E7BE72" fillOpacity="0.25" stroke="#E7BE72" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="5" fill="#F3A6CE" />

              {/* Mythic Sword Blade */}
              <path d="M50 12 L53 45 L50 48 L47 45 Z" fill="#E7BE72" />
              <path d="M50 12 L50 48" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M50 52 L50 84" stroke="#E7BE72" strokeWidth="2.5" />
              {/* Crossguard */}
              <path d="M36 50 Q50 54 64 50" stroke="#E7BE72" strokeWidth="2.5" strokeLinecap="round" />
              {/* Pommel Star */}
              <polygon points="50,84 52,87 55,87 53,89 54,92 50,90 46,92 47,89 45,87 48,87" fill="#E7BE72" />

              {/* Arc Wings / Laurel */}
              <path
                d="M32 40 C22 36 18 24 20 18 C28 26 36 34 38 42"
                stroke="#E7BE72"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M68 40 C78 36 82 24 80 18 C72 26 64 34 62 42"
                stroke="#E7BE72"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Sparkle Points */}
              <circle cx="50" cy="10" r="1.5" fill="#FFFFFF" />
              <circle cx="20" cy="18" r="1.5" fill="#E7BE72" />
              <circle cx="80" cy="18" r="1.5" fill="#E7BE72" />
            </svg>
          </div>

          {/* Sub-label: Rank Tribute */}
          <span className="mt-2 font-heading text-xs tracking-[0.35em] uppercase text-mystic-gold/80 font-medium">
            RANK: MYTHIC
          </span>
        </motion.div>

        {/* Hero Title: "MYTHIC" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Subtle Ambient Back-Glow for Title */}
          <div
            className="absolute -inset-x-8 -inset-y-4 bg-radial from-mystic-gold/15 to-transparent blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <motion.h1
            className="relative font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.16em] sm:tracking-[0.22em] uppercase text-gradient-gold select-none leading-none"
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(231,190,114,0.35))',
                'drop-shadow(0 0 45px rgba(231,190,114,0.65)) drop-shadow(0 0 80px rgba(118,80,184,0.4))',
                'drop-shadow(0 0 20px rgba(231,190,114,0.35))',
              ],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            MYTHIC
          </motion.h1>
        </motion.div>

        {/* Ornate Fantasy Divider with Star Motif */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
          className="w-full max-w-xs sm:max-w-md my-4 sm:my-5 flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-mystic-gold/60 to-mystic-gold" />
          <div className="flex items-center gap-1 text-mystic-gold">
            <span className="text-[10px] opacity-70">◆</span>
            <span className="text-sm">✦</span>
            <span className="text-[10px] opacity-70">◆</span>
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-mystic-gold/60 to-mystic-gold" />
        </motion.div>

        {/* Subtitle: "A Legendary Love Story" */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="font-heading text-lg sm:text-2xl md:text-3xl text-mystic-gold tracking-[0.2em] sm:tracking-[0.28em] uppercase font-semibold text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          A Legendary Love Story
        </motion.h2>

        {/* Narrative Teaser */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8, ease: 'easeOut' }}
          className="font-body mt-4 text-xs sm:text-sm md:text-base text-white/80 max-w-md sm:max-w-lg leading-relaxed font-normal"
        >
          Sebuah petualangan singkat untuk merayakan pencapaian Mythic kamu, Geget.
        </motion.p>

        {/* Optional Audio Invitation if waiting for user gesture */}
        {!isAudioPlaying && (
          <motion.button
            type="button"
            onClick={onToggleAudio}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-purple/80 hover:bg-royal-purple/70 border border-mystic-gold/60 text-mystic-gold text-xs font-heading tracking-wider shadow-[0_0_15px_rgba(231,190,114,0.3)] animate-pulse transition-all cursor-pointer"
          >
            <span>🎵</span>
            <span>Ketuk untuk menyalakan musik latar</span>
          </motion.button>
        )}

        {/* ─── "BEGIN ADVENTURE" BUTTON ─── */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.8, ease: 'easeOut' }}
          className="mt-8 sm:mt-10"
        >
          <motion.button
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="animate-pulse-glow group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-full bg-gradient-to-r from-deep-purple via-royal-purple to-deep-purple border border-mystic-gold/75 hover:border-mystic-gold text-mystic-gold hover:text-white font-heading font-bold text-base sm:text-lg tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(118,80,184,0.5)] hover:shadow-[0_0_35px_rgba(231,190,114,0.6)] cursor-pointer min-h-[48px] min-w-[220px]"
          >
            {/* Shimmer Light Reflection Overlay */}
            <span
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer pointer-events-none"
              aria-hidden="true"
            />

            {/* Left Sparkle Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-300 group-hover:rotate-45 text-mystic-gold group-hover:text-mystic-gold-light"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>

            {/* Button Label */}
            <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Begin Adventure
            </span>

            {/* Right Sword / Pointer Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-1.5 text-mystic-gold group-hover:text-white"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </motion.div>
      </main>

      {/* ─── FOOTER PROMPT / AMBIENT TOUCH ─── */}
      <footer className="relative z-20 pb-6 sm:pb-8 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col items-center gap-1 text-mystic-gold/60"
        >
          <span className="font-heading text-[10px] sm:text-xs tracking-[0.25em] uppercase">
            {isAudioPlaying ? 'PRESS TO ENTER THE REALM' : 'TAP ANYWHERE TO ACTIVATE MUSIC & ENTER'}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bounce opacity-70"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </footer>
    </div>
  );
}
