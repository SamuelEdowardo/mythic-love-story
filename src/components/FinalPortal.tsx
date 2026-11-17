'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface FinalPortalProps {
  onNext: () => void;
  onSwitchMusic?: () => void;
}

// Data model for floating hearts drifting up through the scene
interface FloatingHeartData {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  color: string;
  swayX: number;
  initialBottom: string;
}

// Data model for fading gaming particles
interface GamingParticleData {
  id: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  size: number;
  symbol: string;
}

// Portal Arcane Rune Ring SVG component
function ArcaneRuneRing({ isAccelerating }: { isAccelerating: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="absolute inset-0 w-full h-full pointer-events-none"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotate: [0, 360],
            }
      }
      transition={{
        duration: isAccelerating ? 3 : 42,
        repeat: Infinity,
        ease: isAccelerating ? 'easeInOut' : 'linear',
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="portalRuneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7650B8" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#F3A6CE" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#E7BE72" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7650B8" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#F3A6CE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7650B8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outermost glyph circle */}
      <circle
        cx="250"
        cy="250"
        r="236"
        fill="none"
        stroke="url(#portalRuneGrad)"
        strokeWidth="1.5"
        strokeDasharray="6 8"
        opacity="0.65"
      />

      {/* Middle concentric ring with celestial tick marks */}
      <circle
        cx="250"
        cy="250"
        r="220"
        fill="none"
        stroke="url(#portalRuneGrad)"
        strokeWidth="2"
        opacity="0.8"
      />

      {/* Inner dashed ring */}
      <circle
        cx="250"
        cy="250"
        r="204"
        fill="none"
        stroke="#F3A6CE"
        strokeWidth="1"
        strokeDasharray="2 12"
        opacity="0.75"
      />

      {/* Cardinal & diagonal celestial nodes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 250 + 220 * Math.cos(rad);
        const cy = 250 + 220 * Math.sin(rad);
        const isCardinal = index % 2 === 0;

        return (
          <g key={angle} transform={`translate(${cx}, ${cy})`}>
            {isCardinal ? (
              <>
                <circle r="4.5" fill="#E7BE72" />
                <circle r="8" fill="none" stroke="#F3A6CE" strokeWidth="1" opacity="0.8" />
              </>
            ) : (
              <circle r="2.5" fill="#F3A6CE" opacity="0.9" />
            )}
          </g>
        );
      })}

      {/* Ancient gaming runes & celestial markers inscribed along the ring */}
      {[15, 60, 105, 150, 195, 240, 285, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 250 + 228 * Math.cos(rad);
        const y = 250 + 228 * Math.sin(rad);
        const glyphs = ['✦', '⚔', '✧', '♥', '★', '♦', '✦', '♥'];
        return (
          <text
            key={angle}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#E7BE72"
            fontSize="10"
            opacity="0.7"
            fontFamily="sans-serif"
          >
            {glyphs[i % glyphs.length]}
          </text>
        );
      })}
    </motion.svg>
  );
}

// Counter-rotating inner starry ring
function InnerConstellationRing({ isAccelerating }: { isAccelerating: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="absolute inset-0 w-full h-full pointer-events-none"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              rotate: [360, 0],
            }
      }
      transition={{
        duration: isAccelerating ? 2.5 : 28,
        repeat: Infinity,
        ease: isAccelerating ? 'easeInOut' : 'linear',
      }}
      aria-hidden="true"
    >
      <circle
        cx="200"
        cy="200"
        r="170"
        fill="none"
        stroke="#E7BE72"
        strokeWidth="1.2"
        strokeDasharray="4 16"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke="#F3A6CE"
        strokeWidth="1.5"
        strokeDasharray="18 8 2 8"
        opacity="0.7"
      />
      {/* Delicate floating constellation stars */}
      {[30, 90, 150, 210, 270, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 200 + 160 * Math.cos(rad);
        const cy = 200 + 160 * Math.sin(rad);
        return (
          <polygon
            key={angle}
            points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2"
            fill="#FFF"
            opacity="0.85"
            transform={`translate(${cx}, ${cy})`}
          />
        );
      })}
    </motion.svg>
  );
}

// Single Floating Heart Component with gentle sway and fade
function FloatingHeartElement({ data }: { data: FloatingHeartData }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className="absolute pointer-events-none opacity-40 select-none z-10"
        style={{ left: data.left, bottom: data.initialBottom }}
        aria-hidden="true"
      >
        <svg width={data.size} height={data.size} viewBox="0 0 24 24" fill="currentColor" className={data.color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0, scale: 0.6 }}
      animate={{
        y: [-10, -220],
        opacity: [0, 0.9, 0.95, 0],
        scale: [0.6, 1.15, 1, 0.85],
        x: [0, data.swayX, -data.swayX * 0.7, 0],
      }}
      transition={{
        duration: data.duration,
        repeat: Infinity,
        delay: data.delay,
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none select-none z-10"
      style={{ left: data.left, bottom: data.initialBottom }}
      aria-hidden="true"
    >
      <svg
        width={data.size}
        height={data.size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`${data.color} drop-shadow-[0_0_8px_rgba(243,166,206,0.6)]`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
}

export default function FinalPortal({ onNext, onSwitchMusic }: FinalPortalProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx, switchTrack } = useAudio();

  // State: whether the portal is absorbing the screen upon clicking "Step Through"
  const [isAbsorbing, setIsAbsorbing] = useState(false);

  // Floating hearts data replacement for gaming particles
  const floatingHearts: FloatingHeartData[] = useMemo(
    () => [
      { id: 1, left: '8%', delay: 0.2, duration: 5.5, size: 16, color: 'text-soft-pink/80', swayX: 18, initialBottom: '12%' },
      { id: 2, left: '18%', delay: 1.8, duration: 6.2, size: 22, color: 'text-mystic-gold/85', swayX: -22, initialBottom: '15%' },
      { id: 3, left: '26%', delay: 0.7, duration: 4.8, size: 26, color: 'text-soft-pink', swayX: 14, initialBottom: '8%' },
      { id: 4, left: '38%', delay: 2.4, duration: 5.8, size: 18, color: 'text-white/80', swayX: -16, initialBottom: '22%' },
      { id: 5, left: '48%', delay: 1.1, duration: 5.0, size: 28, color: 'text-soft-pink/90', swayX: 20, initialBottom: '18%' },
      { id: 6, left: '58%', delay: 2.9, duration: 6.5, size: 20, color: 'text-mystic-gold-light', swayX: -18, initialBottom: '10%' },
      { id: 7, left: '68%', delay: 0.4, duration: 5.2, size: 24, color: 'text-soft-pink/85', swayX: 15, initialBottom: '14%' },
      { id: 8, left: '78%', delay: 1.9, duration: 6.0, size: 18, color: 'text-mystic-gold/80', swayX: -20, initialBottom: '20%' },
      { id: 9, left: '88%', delay: 1.3, duration: 4.6, size: 22, color: 'text-soft-pink/90', swayX: 16, initialBottom: '16%' },
      { id: 10, left: '94%', delay: 2.7, duration: 5.4, size: 14, color: 'text-white/85', swayX: -12, initialBottom: '10%' },
      // Central portal fountain hearts
      { id: 11, left: '44%', delay: 0.1, duration: 4.2, size: 20, color: 'text-soft-pink', swayX: -14, initialBottom: '45%' },
      { id: 12, left: '52%', delay: 1.5, duration: 4.5, size: 24, color: 'text-mystic-gold', swayX: 18, initialBottom: '42%' },
      { id: 13, left: '47%', delay: 3.1, duration: 5.1, size: 22, color: 'text-soft-pink/90', swayX: -10, initialBottom: '48%' },
    ],
    []
  );

  // Fading gaming particles (representing the transition from gaming to romantic)
  const gamingParticles: GamingParticleData[] = useMemo(
    () => [
      { id: 1, left: '12%', top: '25%', delay: 0.2, duration: 3.5, size: 12, symbol: '⚔' },
      { id: 2, left: '22%', top: '35%', delay: 0.6, duration: 4.0, size: 14, symbol: '✦' },
      { id: 3, left: '75%', top: '28%', delay: 0.4, duration: 3.8, size: 13, symbol: '★' },
      { id: 4, left: '84%', top: '40%', delay: 0.9, duration: 4.2, size: 15, symbol: '♦' },
      { id: 5, left: '30%', top: '65%', delay: 0.5, duration: 3.2, size: 11, symbol: '✧' },
      { id: 6, left: '70%', top: '68%', delay: 0.8, duration: 3.6, size: 12, symbol: '✦' },
    ],
    []
  );

  // Trigger absorption transition and chapter advance
  const handleStepThrough = () => {
    if (isAbsorbing) return;
    setIsAbsorbing(true);

    // Call switchTrack('romantic') or parent provided callback
    if (onSwitchMusic) {
      onSwitchMusic();
    } else {
      switchTrack('romantic');
    }

    // Play portal sound effect
    playSfx('portal');

    // Absorption animation duration before advancing to the next chapter (LoveLetter)
    const transitionDelay = shouldReduceMotion ? 800 : 2000;
    setTimeout(() => {
      onNext();
    }, transitionDelay);
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 py-8 sm:py-12 pb-20 sm:pb-24 overflow-hidden selection:bg-soft-pink/30 selection:text-white">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKGROUND COLOR SHIFT: MIDNIGHT -> WARM ROMANTIC TWILIGHT */}
      {/* ========================================================================= */}

      {/* Base deep midnight canvas */}
      <div className="fixed inset-0 pointer-events-none bg-midnight z-0" aria-hidden="true" />

      {/* Gaming atmosphere aura (deep-purple & midnight), gradually softening */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0.75 }}
        animate={{ opacity: isAbsorbing ? 0.1 : 0.35 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(48, 32, 92, 0.8) 0%, rgba(16, 14, 36, 0.95) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Romantic atmosphere shift: softer tones, warm amethyst, velvety rose & soft-pink bloom */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAbsorbing ? 0.9 : 0.65 }}
        transition={{ duration: 3.0, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(243, 166, 206, 0.18) 0%, rgba(118, 80, 184, 0.28) 35%, rgba(48, 32, 92, 0.4) 65%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle bottom warm glow welcoming romance */}
      <motion.div
        className="fixed bottom-0 inset-x-0 h-96 pointer-events-none z-0"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.45, y: 0 }}
        transition={{ duration: 2.2, delay: 0.5 }}
        style={{
          background:
            'linear-gradient(to top, rgba(243, 166, 206, 0.15) 0%, rgba(118, 80, 184, 0.1) 40%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 2. PARTICLES TRANSITION: GAMING PARTICLES FADE -> FLOATING HEARTS EMERGE */}
      {/* ========================================================================= */}

      {/* Residual gaming particles fading out gently */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: isAbsorbing ? 0 : 0.15 }}
        transition={{ duration: 4.0, ease: 'easeOut' }}
        aria-hidden="true"
      >
        {gamingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              shouldReduceMotion
                ? { opacity: 0.3 }
                : {
                    opacity: [0.1, 0.5, 0.1],
                    y: [0, -15, 0],
                    scale: [0.8, 1, 0.8],
                  }
            }
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            className="absolute font-mono text-mystic-gold select-none"
            style={{
              left: particle.left,
              top: particle.top,
              fontSize: `${particle.size}px`,
            }}
          >
            {particle.symbol}
          </motion.div>
        ))}
      </motion.div>

      {/* Floating hearts replacing gaming particles */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isAbsorbing ? 0.3 : 1 }}
        transition={{ duration: 1.8, delay: 0.6 }}
        aria-hidden="true"
      >
        {floatingHearts.map((heart) => (
          <FloatingHeartElement key={heart.id} data={heart} />
        ))}
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. CINEMATIC HEADER & EMOTIONAL TEXT NARRATIVE                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isAbsorbing && (
          <motion.header
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.6 } }}
            transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            className="relative z-20 w-full max-w-2xl mx-auto text-center flex flex-col items-center pt-2 sm:pt-4"
          >
            {/* Chapter Pill / Arcane Marker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-purple/60 border border-royal-purple/50 shadow-[0_0_15px_rgba(118,80,184,0.3)] mb-4 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-soft-pink animate-pulse" />
              <span className="font-heading text-xs sm:text-sm font-semibold tracking-[0.25em] text-mystic-gold uppercase">
                Chapter VII • The Threshold
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-soft-pink animate-pulse" />
            </motion.div>

            {/* Main Emotional Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide leading-tight sm:leading-snug max-w-xl sm:max-w-2xl"
            >
              <span className="bg-gradient-to-r from-mystic-gold via-soft-pink to-mystic-gold-light bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(243,166,206,0.35)]">
                Setelah semua petualangan di dalam game...
              </span>
            </motion.h1>

            {/* Secondary Tender Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-body text-base sm:text-lg md:text-xl text-soft-pink font-normal tracking-wide mt-3 sm:mt-4 flex items-center justify-center gap-3"
            >
              <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-soft-pink/70" />
              <span>Ada satu pesan yang ingin aku sampaikan langsung ke kamu.</span>
              <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-soft-pink/70" />
            </motion.p>

            {/* Dedication Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 1.0, delay: 1.2 }}
              className="mt-2 text-xs sm:text-sm font-heading tracking-widest text-mystic-gold/80"
            >
              Khusus untuk {RECIPIENT_NAME} ✨
            </motion.div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 4. THE GLOWING PORTAL VISUAL (CIRCULAR/OVAL GRADIENT & PULSE EFFECT)      */}
      {/* ========================================================================= */}
      <div className="relative z-20 my-auto flex items-center justify-center py-6 sm:py-8">
        {/* Main interactive portal hub */}
        <div className="relative flex items-center justify-center">
          {/* Ambient Outer Halo: Expands massively when absorbing */}
          <motion.div
            animate={
              isAbsorbing
                ? {
                    scale: shouldReduceMotion ? 2 : [1, 3, 12, 35],
                    opacity: [0.7, 0.95, 1],
                  }
                : shouldReduceMotion
                ? { scale: 1, opacity: 0.6 }
                : {
                    scale: [1, 1.12, 0.98, 1.08, 1],
                    opacity: [0.55, 0.8, 0.55],
                  }
            }
            transition={
              isAbsorbing
                ? { duration: 2.0, ease: 'easeInOut' }
                : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="absolute rounded-full pointer-events-none blur-3xl w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px]"
            style={{
              background:
                'radial-gradient(circle, rgba(243, 166, 206, 0.55) 0%, rgba(118, 80, 184, 0.45) 45%, rgba(48, 32, 92, 0.2) 75%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          {/* Secondary Soft-Pink Intense Core Flare */}
          <motion.div
            animate={
              isAbsorbing
                ? { scale: [1, 4, 25], opacity: [0.8, 1, 1] }
                : shouldReduceMotion
                ? { scale: 1, opacity: 0.7 }
                : {
                    scale: [0.95, 1.08, 0.95],
                    opacity: [0.65, 0.9, 0.65],
                  }
            }
            transition={
              isAbsorbing
                ? { duration: 1.8, ease: 'easeIn' }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            className="absolute rounded-full pointer-events-none blur-2xl w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-tr from-royal-purple via-soft-pink to-mystic-gold"
            aria-hidden="true"
          />

          {/* The Portal Structure Body */}
          <motion.div
            animate={
              isAbsorbing
                ? {
                    scale: shouldReduceMotion ? [1, 2] : [1, 1.4, 6, 28, 48],
                    rotate: shouldReduceMotion ? 0 : [0, 90, 360, 720],
                    opacity: [1, 1, 1, 0.9, 0.2],
                  }
                : shouldReduceMotion
                ? { scale: 1 }
                : {
                    scale: [1, 1.05, 0.97, 1.03, 1],
                  }
            }
            transition={
              isAbsorbing
                ? { duration: 2.0, ease: [0.22, 1, 0.36, 1] }
                : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
            }
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] flex items-center justify-center select-none"
          >
            {/* Outer Arcane Celestial Rune Ring */}
            <ArcaneRuneRing isAccelerating={isAbsorbing} />

            {/* Counter-rotating Inner Constellation Ring */}
            <InnerConstellationRing isAccelerating={isAbsorbing} />

            {/* Rotating Swirling Vortex Ring (CSS Gradient transition purple to pink) */}
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      rotate: [0, 360],
                    }
              }
              transition={{
                duration: isAbsorbing ? 1.5 : 18,
                repeat: Infinity,
                ease: isAbsorbing ? 'easeInOut' : 'linear',
              }}
              className="absolute inset-4 sm:inset-6 md:inset-8 rounded-full p-1.5 shadow-[0_0_35px_rgba(243,166,206,0.5),inset_0_0_30px_rgba(118,80,184,0.6)]"
              style={{
                background:
                  'conic-gradient(from 0deg, #7650B8 0%, #30205C 20%, #F3A6CE 45%, #E7BE72 65%, #F3A6CE 85%, #7650B8 100%)',
              }}
            >
              {/* Counter-flow Swirling Layer for realistic vortex depth */}
              <div
                className="w-full h-full rounded-full opacity-90 p-2"
                style={{
                  background:
                    'radial-gradient(circle at 40% 40%, rgba(243,166,206,0.8) 0%, rgba(118,80,184,0.6) 50%, rgba(48,32,92,0.9) 100%)',
                }}
              >
                {/* Luminous Inner Heart Vortex / Dimensional Gateway Core */}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_40px_rgba(243,166,206,0.8),inset_0_0_70px_rgba(16,14,36,0.9)]"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, #FFF2F8 0%, #F3A6CE 28%, #8B59B3 55%, #30205C 80%, #100E24 100%)',
                  }}
                >
                  {/* Subtle swirling star nebulae within core */}
                  <div
                    className="absolute inset-0 opacity-40 mix-blend-overlay animate-shimmer"
                    style={{
                      background:
                        'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.7) 50%, transparent 75%)',
                      backgroundSize: '200% 200%',
                    }}
                  />

                  {/* Radiating Light Beams across the core */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-75 blur-[1px]" />
                    <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-white to-transparent opacity-75 blur-[1px]" />
                    <div className="absolute w-3/4 h-[1px] rotate-45 bg-gradient-to-r from-transparent via-soft-pink to-transparent opacity-60" />
                    <div className="absolute w-3/4 h-[1px] -rotate-45 bg-gradient-to-r from-transparent via-soft-pink to-transparent opacity-60" />
                  </div>

                  {/* Pulsating Beating Heart in Center of Portal */}
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { scale: 1 }
                        : {
                            scale: [1, 1.2, 1.05, 1.18, 1],
                            filter: [
                              'drop-shadow(0 0 10px rgba(255,255,255,0.9))',
                              'drop-shadow(0 0 25px rgba(243,166,206,1))',
                              'drop-shadow(0 0 10px rgba(255,255,255,0.9))',
                            ],
                          }
                    }
                    transition={{
                      duration: isAbsorbing ? 0.6 : 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative z-10 text-white flex items-center justify-center"
                  >
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 fill-current drop-shadow-[0_0_20px_rgba(243,166,206,0.95)]"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>

                    {/* Golden central star within heart */}
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              rotate: [0, 360],
                              scale: [0.85, 1.15, 0.85],
                            }
                      }
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none text-mystic-gold opacity-90"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. "STEP THROUGH" CALL-TO-ACTION BUTTON                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {!isAbsorbing && (
          <motion.footer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30, transition: { duration: 0.5 } }}
            transition={{ duration: 1.0, delay: 1.4, ease: 'easeOut' }}
            className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center pb-2 sm:pb-4"
          >
            {/* The "Step Through" Button */}
            <motion.button
              onClick={handleStepThrough}
              disabled={isAbsorbing}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              className="group relative min-h-[52px] px-10 sm:px-12 py-3.5 sm:py-4 rounded-full overflow-hidden font-heading text-base sm:text-lg font-semibold tracking-wider text-white border-2 border-soft-pink/90 hover:border-white shadow-[0_0_25px_rgba(243,166,206,0.55),0_0_50px_rgba(118,80,184,0.35)] hover:shadow-[0_0_40px_rgba(243,166,206,0.85),0_0_70px_rgba(243,166,206,0.45)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-3 backdrop-blur-md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(48, 32, 92, 0.95) 0%, rgba(118, 80, 184, 0.9) 45%, rgba(243, 166, 206, 0.95) 100%)',
              }}
              aria-label="Step through the portal to read the message from the heart"
            >
              {/* Shimmer sweep animation across the button */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

              {/* Pulsing glow aura behind button */}
              <div className="absolute inset-0 rounded-full bg-soft-pink/20 blur-md group-hover:bg-soft-pink/40 transition-colors duration-300 pointer-events-none" />

              {/* Button text */}
              <span className="relative z-10 text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Buka Pesan
              </span>

              {/* Glowing Heart / Gateway Icon */}
              <motion.svg
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: [1, 1.25, 1],
                      }
                }
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10 w-5 h-5 text-soft-pink drop-shadow-[0_0_8px_rgba(243,166,206,0.9)] transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </motion.svg>
            </motion.button>

            {/* Guiding footnote */}
            <p className="font-body text-xs sm:text-sm text-soft-pink/70 mt-3.5 text-center tracking-wide">
              Klik untuk membuka surat pribadi
            </p>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. SCREEN ABSORPTION FULL-SCREEN OVERLAY (WHEN STEPPING THROUGH)          */}
      {/* ========================================================================= */}
      {isAbsorbing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0.85, 1] }}
          transition={{ duration: shouldReduceMotion ? 0.8 : 1.9, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at center, #FFFFFF 0%, #FFF0F7 25%, #F3A6CE 55%, #7650B8 85%, #30205C 100%)',
          }}
          aria-hidden="true"
        >
          {/* Central expanding heart pulse during absorption */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 3, 15], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="text-white select-none"
          >
            <svg className="w-24 h-24 fill-current drop-shadow-[0_0_35px_rgba(255,255,255,1)]" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
