'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { createDeck, checkMatch, isGameComplete } from '@/lib/gameLogic';
import type { MemoryCard, CardSymbol } from '@/types';
import { RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface MemoryMatchProps {
  onNext: () => void;
}

// Fixed celebration particle data to adhere to React purity rules without Math.random in render
interface CelebrationParticle {
  id: number;
  x: number;
  y: number;
  targetY: number;
  driftX: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  symbol: string;
}

const CELEBRATION_PARTICLES: CelebrationParticle[] = [
  { id: 1, x: -140, y: 30, targetY: -160, driftX: -30, size: 18, delay: 0.1, duration: 2.8, color: 'text-mystic-gold', symbol: '✦' },
  { id: 2, x: -100, y: 10, targetY: -180, driftX: -20, size: 22, delay: 0.25, duration: 3.2, color: 'text-soft-pink', symbol: '❤️' },
  { id: 3, x: -60, y: 40, targetY: -150, driftX: -10, size: 16, delay: 0.4, duration: 2.6, color: 'text-mystic-gold-light', symbol: '⭐' },
  { id: 4, x: -20, y: 15, targetY: -190, driftX: -15, size: 20, delay: 0.15, duration: 3.4, color: 'text-white', symbol: '✨' },
  { id: 5, x: 20, y: 20, targetY: -175, driftX: 15, size: 24, delay: 0.3, duration: 3.0, color: 'text-mystic-gold', symbol: '⚔️' },
  { id: 6, x: 60, y: 35, targetY: -160, driftX: 20, size: 18, delay: 0.5, duration: 2.9, color: 'text-soft-pink', symbol: '🌙' },
  { id: 7, x: 100, y: 15, targetY: -185, driftX: 25, size: 20, delay: 0.2, duration: 3.1, color: 'text-mystic-gold-light', symbol: '⭐' },
  { id: 8, x: 140, y: 30, targetY: -155, driftX: 30, size: 16, delay: 0.45, duration: 2.7, color: 'text-white', symbol: '✦' },
  { id: 9, x: -80, y: -10, targetY: -210, driftX: -25, size: 14, delay: 0.35, duration: 3.5, color: 'text-soft-pink', symbol: '💖' },
  { id: 10, x: -40, y: -20, targetY: -220, driftX: 8, size: 18, delay: 0.55, duration: 3.2, color: 'text-mystic-gold', symbol: '✨' },
  { id: 11, x: 40, y: -15, targetY: -215, driftX: -8, size: 16, delay: 0.6, duration: 3.3, color: 'text-mystic-gold-light', symbol: '✦' },
  { id: 12, x: 80, y: -25, targetY: -225, driftX: 18, size: 22, delay: 0.4, duration: 3.6, color: 'text-soft-pink', symbol: '❤️' },
];

// Ornate card back SVG pattern
function CardBackGraphic() {
  return (
    <svg
      viewBox="0 0 100 140"
      className="w-full h-full select-none pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="backGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A8" />
          <stop offset="50%" stopColor="#E7BE72" />
          <stop offset="100%" stopColor="#9C6F19" />
        </linearGradient>
        <radialGradient id="backCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7650B8" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#30205C" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#100E24" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* Base background fill */}
      <rect x="2" y="2" width="96" height="136" rx="8" fill="url(#backCenterGlow)" />

      {/* Outer border */}
      <rect
        x="4"
        y="4"
        width="92"
        height="132"
        rx="7"
        stroke="url(#backGold)"
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />

      {/* Inner dashed frame */}
      <rect
        x="8"
        y="8"
        width="84"
        height="124"
        rx="5"
        stroke="url(#backGold)"
        strokeWidth="0.8"
        strokeDasharray="2.5 2.5"
        strokeOpacity="0.5"
      />

      {/* Corner diamond flourishes */}
      <polygon points="12,14 14,12 16,14 14,16" fill="#E7BE72" />
      <polygon points="84,14 86,12 88,14 86,16" fill="#E7BE72" />
      <polygon points="12,126 14,124 16,126 14,128" fill="#E7BE72" />
      <polygon points="84,126 86,124 88,126 86,128" fill="#E7BE72" />

      {/* Concentric mystical rings */}
      <circle cx="50" cy="70" r="28" stroke="url(#backGold)" strokeWidth="0.7" strokeOpacity="0.35" />
      <circle cx="50" cy="70" r="21" stroke="url(#backGold)" strokeWidth="1" strokeOpacity="0.7" />
      <circle
        cx="50"
        cy="70"
        r="15"
        stroke="url(#backGold)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.6"
      />

      {/* Primary 8-pointed star */}
      <path
        d="M50 48 L53 66 L71 70 L53 74 L50 92 L47 74 L29 70 L47 66 Z"
        fill="url(#backGold)"
      />
      {/* Secondary inner star highlights */}
      <path
        d="M50 54 L52 67 L65 70 L52 73 L50 86 L48 73 L35 70 L48 67 Z"
        fill="#FFF9E0"
        opacity="0.65"
      />

      {/* Diagonal rays */}
      <line x1="41" y1="61" x2="59" y2="79" stroke="url(#backGold)" strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="59" y1="61" x2="41" y2="79" stroke="url(#backGold)" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Central jewel diamond */}
      <circle cx="50" cy="70" r="3" fill="#FFFFFF" />
      <circle cx="50" cy="70" r="1.5" fill="#E7BE72" />

      {/* Subtle cardinal rune marks */}
      <circle cx="50" cy="24" r="1.5" fill="#E7BE72" opacity="0.7" />
      <circle cx="50" cy="116" r="1.5" fill="#E7BE72" opacity="0.7" />
      <circle cx="19" cy="70" r="1.5" fill="#E7BE72" opacity="0.7" />
      <circle cx="81" cy="70" r="1.5" fill="#E7BE72" opacity="0.7" />
    </svg>
  );
}

// Card Front Face SVGs
function CardFrontGraphic({ symbol }: { symbol: CardSymbol }) {
  if (symbol === 'heart') {
    return (
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(255,46,99,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF3366" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FF3366" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="heartGrad" x1="15%" y1="5%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#FF6B8B" />
              <stop offset="45%" stopColor="#E0115F" />
              <stop offset="100%" stopColor="#7E0021" />
            </linearGradient>
            <linearGradient id="heartShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#heartGlow)" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#E7BE72"
            strokeWidth="0.8"
            strokeOpacity="0.3"
            strokeDasharray="3 3"
          />
          <path
            d="M50 82 C50 82 18 61 18 38 C18 24 28 16 40 16 C46 16 49 19 50 22 C51 19 54 16 60 16 C72 16 82 24 82 38 C82 61 50 82 50 82 Z"
            fill="url(#heartGrad)"
            stroke="#FFA8BE"
            strokeWidth="1.5"
          />
          <path
            d="M40 21 C32 21 24 27 24 37 C24 45 32 54 44 64 C42 54 40 41 46 27 C44 23 42 21 40 21 Z"
            fill="url(#heartShine)"
            opacity="0.45"
          />
          <polygon
            points="32,27 34,31 38,33 34,35 32,39 30,35 26,33 30,31"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </svg>
        <span className="font-heading text-[10px] sm:text-xs font-bold text-soft-pink tracking-widest mt-1">
          HEART
        </span>
      </div>
    );
  }

  if (symbol === 'star') {
    return (
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(231,190,114,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E7BE72" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E7BE72" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E0" />
              <stop offset="45%" stopColor="#E7BE72" />
              <stop offset="100%" stopColor="#A87515" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#starGlow)" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#E7BE72"
            strokeWidth="0.8"
            strokeOpacity="0.4"
            strokeDasharray="3 3"
          />
          <path
            d="M50 12 L57 38 L83 33 L65 52 L85 68 L59 66 L50 92 L41 66 L15 68 L35 52 L17 33 L43 38 Z"
            fill="url(#starGrad)"
            stroke="#FFE89E"
            strokeWidth="1.2"
          />
          <polygon points="50,26 55,50 50,74 45,50" fill="#FFFCE6" opacity="0.85" />
          <polygon points="26,50 50,55 74,50 50,45" fill="#FFFCE6" opacity="0.85" />
          <circle cx="50" cy="50" r="3.5" fill="#FFFFFF" />
        </svg>
        <span className="font-heading text-[10px] sm:text-xs font-bold text-mystic-gold tracking-widest mt-1">
          STAR
        </span>
      </div>
    );
  }

  if (symbol === 'moon') {
    return (
      <div className="flex flex-col items-center justify-center p-2 text-center">
        <svg
          viewBox="0 0 100 100"
          className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(200,214,229,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C8D6E5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#C8D6E5" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#moonGlow)" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#94A3B8"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            strokeDasharray="3 3"
          />
          <path
            d="M62 18 C39 22 27 42 33 66 C37 80 52 88 64 86 C46 82 40 64 44 48 C48 34 56 24 62 18 Z"
            fill="url(#moonGrad)"
            stroke="#F1F5F9"
            strokeWidth="1.2"
          />
          <polygon
            points="68,44 70,48 74,50 70,52 68,56 66,52 62,50 66,48"
            fill="#FFFFFF"
          />
          <circle cx="28" cy="36" r="1.5" fill="#E2E8F0" opacity="0.8" />
          <circle cx="70" cy="70" r="1.5" fill="#E2E8F0" opacity="0.75" />
        </svg>
        <span className="font-heading text-[10px] sm:text-xs font-bold text-slate-200 tracking-widest mt-1">
          MOON
        </span>
      </div>
    );
  }

  // Symbol: sword
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center">
      <svg
        viewBox="0 0 100 100"
        className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-[0_0_12px_rgba(148,163,184,0.7)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="swordGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A8" />
            <stop offset="100%" stopColor="#B37D14" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="44" fill="url(#swordGlow)" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#E7BE72"
          strokeWidth="0.8"
          strokeOpacity="0.35"
          strokeDasharray="3 3"
        />
        {/* Left blade */}
        <g transform="rotate(45 50 50)">
          <path d="M48 14 L50 8 L52 14 L52 56 L48 56 Z" fill="url(#bladeGrad)" stroke="#F8FAFC" strokeWidth="0.8" />
          <line x1="50" y1="14" x2="50" y2="52" stroke="#64748B" strokeWidth="0.8" />
          <rect x="42" y="56" width="16" height="4" rx="1.5" fill="url(#goldHilt)" stroke="#E7BE72" strokeWidth="0.5" />
          <rect x="48" y="60" width="4" height="12" rx="1" fill="#30205C" stroke="#7650B8" strokeWidth="0.5" />
          <circle cx="50" cy="74" r="3.5" fill="url(#goldHilt)" stroke="#E7BE72" strokeWidth="0.5" />
          <circle cx="50" cy="74" r="1.5" fill="#E11D48" />
        </g>
        {/* Right blade */}
        <g transform="rotate(-45 50 50)">
          <path d="M48 14 L50 8 L52 14 L52 56 L48 56 Z" fill="url(#bladeGrad)" stroke="#F8FAFC" strokeWidth="0.8" />
          <line x1="50" y1="14" x2="50" y2="52" stroke="#64748B" strokeWidth="0.8" />
          <rect x="42" y="56" width="16" height="4" rx="1.5" fill="url(#goldHilt)" stroke="#E7BE72" strokeWidth="0.5" />
          <rect x="48" y="60" width="4" height="12" rx="1" fill="#30205C" stroke="#7650B8" strokeWidth="0.5" />
          <circle cx="50" cy="74" r="3.5" fill="url(#goldHilt)" stroke="#E7BE72" strokeWidth="0.5" />
          <circle cx="50" cy="74" r="1.5" fill="#E11D48" />
        </g>
        {/* Center gleam */}
        <polygon points="50,47 53,50 50,53 47,50" fill="#FFFCE6" />
      </svg>
      <span className="font-heading text-[10px] sm:text-xs font-bold text-slate-300 tracking-widest mt-1">
        SWORD
      </span>
    </div>
  );
}

export default function MemoryMatch({ onNext }: MemoryMatchProps) {
  const shouldReduceMotion = useReducedMotion();
  const { playSfx } = useAudio();

  const [cards, setCards] = useState<MemoryCard[]>(() => createDeck());
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);
  const [justMatchedIds, setJustMatchedIds] = useState<number[]>([]);
  const [mismatchedIds, setMismatchedIds] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Keep track of timeouts for clean teardown
  const comparisonTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const victoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (comparisonTimeoutRef.current) clearTimeout(comparisonTimeoutRef.current);
      if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current);
      if (victoryTimeoutRef.current) clearTimeout(victoryTimeoutRef.current);
    };
  }, []);

  // Calculate matched count
  const matchedCardsCount = cards.filter((c) => c.isMatched).length;
  const matchedPairs = Math.floor(matchedCardsCount / 2);
  const progressPercent = Math.min(100, Math.round((matchedPairs / 4) * 100));

  // Restart / shuffle deck handler
  const handleRestart = useCallback(() => {
    if (comparisonTimeoutRef.current) clearTimeout(comparisonTimeoutRef.current);
    if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current);
    if (victoryTimeoutRef.current) clearTimeout(victoryTimeoutRef.current);

    setCards(createDeck());
    setFlippedIds([]);
    setIsProcessing(false);
    setMoves(0);
    setJustMatchedIds([]);
    setMismatchedIds([]);
    setIsWon(false);
    playSfx('shuffle');
  }, [playSfx]);

  // Card click interaction
  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isProcessing) return;

      const targetCard = cards.find((c) => c.id === cardId);
      if (!targetCard || targetCard.isMatched || targetCard.isFlipped) return;
      if (flippedIds.includes(cardId)) return;

      playSfx('flip');

      // First card of pair
      if (flippedIds.length === 0) {
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
        );
        setFlippedIds([cardId]);
        return;
      }

      // Second card of pair
      if (flippedIds.length === 1) {
        const firstCardId = flippedIds[0];
        const firstCard = cards.find((c) => c.id === firstCardId);
        if (!firstCard) return;

        // Flip second card immediately
        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
        );
        setFlippedIds([firstCardId, cardId]);
        setMoves((m) => m + 1);
        setIsProcessing(true);

        const isMatch = checkMatch(firstCard, targetCard);

        if (isMatch) {
          // MATCH FOUND!
          playSfx('match');
          setJustMatchedIds([firstCardId, cardId]);

          const updatedCards = cards.map((c) =>
            c.id === firstCardId || c.id === cardId
              ? { ...c, isMatched: true, isFlipped: true }
              : c
          );
          setCards(updatedCards);
          setFlippedIds([]);

          // Clear green glow after 1000ms
          glowTimeoutRef.current = setTimeout(() => {
            setJustMatchedIds([]);
            setIsProcessing(false);
          }, 1000);

          // Check if game complete
          if (isGameComplete(updatedCards)) {
            victoryTimeoutRef.current = setTimeout(() => {
              setIsWon(true);
              playSfx('victory');
            }, 600);
          }
        } else {
          // NO MATCH: flash red/amber and flip back after 800ms
          setMismatchedIds([firstCardId, cardId]);

          comparisonTimeoutRef.current = setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstCardId || c.id === cardId
                  ? { ...c, isFlipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setMismatchedIds([]);
            setIsProcessing(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, isProcessing, playSfx]
  );

  return (
    <section
      aria-label="Chapter 3: Memory Match Mini-Game"
      className="relative min-h-screen w-full flex flex-col items-center justify-between px-3 sm:px-6 py-8 sm:py-12 pb-20 sm:pb-24 bg-midnight text-white overflow-hidden"
    >
      {/* Background ambient lighting effects */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-royal-purple/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-deep-purple/40 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-mystic-gold/10 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Chapter Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="flex flex-col items-center text-center mb-6 sm:mb-8"
        >
          {/* Chapter badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-deep-purple/80 border border-royal-purple/50 text-mystic-gold text-xs sm:text-sm font-heading tracking-widest uppercase shadow-md mb-3">
            <span className="text-soft-pink">✦</span>
            <span>Trial of Memory</span>
            <span className="text-soft-pink">✦</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-gradient-gold">
            Chapter 3: Memory Match
          </h1>

          <p className="font-body text-xs sm:text-sm md:text-base text-purple-200/80 max-w-md mx-auto mt-2 leading-relaxed">
            Cocokkan 4 pasang kartu untuk lanjut ke chapter berikutnya,{' '}
            <span className="text-mystic-gold font-semibold">{RECIPIENT_NAME}</span>.
          </p>
        </motion.div>

        {/* Stats & HUD Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.15 }}
          className="w-full bg-deep-purple/60 backdrop-blur-md border border-royal-purple/40 rounded-2xl p-4 sm:p-5 shadow-2xl mb-6"
        >
          {/* Top row: Moves, Pairs, Restart button */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Moves badge */}
            <div className="flex items-center gap-2.5 bg-midnight/80 border border-royal-purple/40 rounded-xl px-3 sm:px-4 py-2 min-h-[44px]">
              <span className="text-lg" aria-hidden="true">
                ⏳
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-heading text-purple-300 uppercase tracking-wider">
                  Langkah
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-white">
                  {moves}
                </span>
              </div>
            </div>

            {/* Pairs matched badge */}
            <div className="flex items-center gap-2.5 bg-midnight/80 border border-royal-purple/40 rounded-xl px-3 sm:px-4 py-2 min-h-[44px]">
              <span className="text-lg" aria-hidden="true">
                ✨
              </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] sm:text-xs font-heading text-purple-300 uppercase tracking-wider">
                  Pasangan
                </span>
                <span className="font-heading text-sm sm:text-base font-bold text-mystic-gold">
                  {matchedPairs} / 4
                </span>
              </div>
            </div>

            {/* Restart button with min 44x44px touch target */}
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl bg-deep-purple border border-royal-purple text-mystic-gold hover:bg-royal-purple/40 hover:border-mystic-gold/70 active:scale-95 transition-all text-xs sm:text-sm font-heading font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-mystic-gold cursor-pointer"
              title="Kocok ulang kartu dan mulai dari awal"
              aria-label="Restart permainan dan kocok ulang kartu"
            >
              <svg
                className="w-4 h-4 text-mystic-gold"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span className="hidden sm:inline">Ulangi</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between items-center text-[11px] sm:text-xs font-heading text-purple-200/80 mb-1.5">
              <span>Resonansi Memori</span>
              <span className="font-bold text-mystic-gold">{progressPercent}%</span>
            </div>
            <div className="relative w-full h-3 bg-midnight/90 rounded-full border border-royal-purple/40 overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-royal-purple via-mystic-gold to-soft-pink shadow-[0_0_12px_rgba(231,190,114,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* 4x2 Grid of Cards (Centered, Responsive) */}
        <div
          className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-4 w-full max-w-sm sm:max-w-lg md:max-w-xl mx-auto my-2"
          role="grid"
          aria-label="Rune Memory Match Grid"
        >
          {cards.map((card, index) => {
            const isFlipped = card.isFlipped || card.isMatched;
            const isJustMatched = justMatchedIds.includes(card.id);
            const isMismatched = mismatchedIds.includes(card.id);

            return (
              <div
                key={card.id}
                className="w-full aspect-[3/4] [perspective:1000px]"
                role="gridcell"
              >
                <motion.button
                  type="button"
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched || isFlipped || isProcessing}
                  whileHover={
                    !isFlipped && !card.isMatched && !isProcessing && !shouldReduceMotion
                      ? { scale: 1.05, y: -2 }
                      : undefined
                  }
                  whileTap={
                    !isFlipped && !card.isMatched && !isProcessing && !shouldReduceMotion
                      ? { scale: 0.95 }
                      : undefined
                  }
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                    scale: isJustMatched && !shouldReduceMotion ? [1, 1.08, 1] : 1,
                  }}
                  transition={{
                    rotateY: {
                      duration: shouldReduceMotion ? 0.01 : 0.55,
                      ease: [0.23, 1, 0.32, 1],
                    },
                    scale: { duration: 0.35 },
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className={`relative w-full h-full min-h-[44px] min-w-[44px] rounded-xl select-none focus:outline-none focus:ring-2 focus:ring-mystic-gold cursor-pointer transition-shadow ${card.isMatched
                    ? 'cursor-default ring-2 ring-mystic-gold/80 shadow-[0_0_15px_rgba(231,190,114,0.35)]'
                    : isJustMatched
                      ? 'ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)]'
                      : isMismatched
                        ? 'ring-2 ring-rose-500/80 shadow-[0_0_18px_rgba(244,63,94,0.7)]'
                        : 'hover:shadow-[0_0_15px_rgba(118,80,184,0.5)]'
                    }`}
                  aria-label={`Kartu ${index + 1}: ${isFlipped ? card.symbol : 'tertutup'
                    }${card.isMatched ? ' (sudah cocok)' : ''}`}
                >
                  {/* Card Back Face (visible when rotateY is 0) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg border border-royal-purple/60 bg-gradient-to-br from-royal-purple-light/90 via-deep-purple to-midnight"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <CardBackGraphic />
                  </div>

                  {/* Card Front Face (visible when rotateY is 180) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-deep-purple-light/95 via-midnight to-deep-purple/95 border-2 ${isJustMatched
                      ? 'border-emerald-400 bg-emerald-950/30'
                      : card.isMatched
                        ? 'border-mystic-gold/80 bg-deep-purple/40'
                        : isMismatched
                          ? 'border-rose-500 bg-rose-950/20'
                          : 'border-royal-purple/80'
                      }`}
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <CardFrontGraphic symbol={card.symbol} />

                    {/* Matched check indicator */}
                    {card.isMatched && (
                      <span
                        className="absolute top-1.5 right-1.5 text-[10px] text-mystic-gold bg-midnight/80 px-1 py-0.5 rounded-full border border-mystic-gold/50"
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Tip / Instruction footer */}
        <p className="font-body text-[11px] sm:text-xs text-purple-300/60 text-center mt-4">
          Sentuh kartu untuk membalikkan dan temukan pasangan rune yang selaras.
        </p>
      </div>

      {/* Victory Celebration Modal / Overlay */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/85 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="victory-title"
          >
            {/* Celebratory floating particles */}
            {!shouldReduceMotion &&
              CELEBRATION_PARTICLES.map((particle) => (
                <motion.div
                  key={particle.id}
                  className={`absolute pointer-events-none ${particle.color} font-bold select-none`}
                  style={{
                    fontSize: `${particle.size}px`,
                    left: `calc(50% + ${particle.x}px)`,
                    top: `calc(50% + ${particle.y}px)`,
                  }}
                  initial={{ opacity: 0, scale: 0.2, y: 0, x: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.3, 1.2, 1, 0.6],
                    y: [0, particle.targetY],
                    x: [0, particle.driftX],
                  }}
                  transition={{
                    duration: particle.duration,
                    delay: particle.delay,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  aria-hidden="true"
                >
                  {particle.symbol}
                </motion.div>
              ))}

            {/* Victory Card */}
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 260,
              }}
              className="relative w-full max-w-md bg-gradient-to-b from-deep-purple via-midnight to-midnight-light border-2 border-mystic-gold rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(231,190,114,0.4)] text-center flex flex-col items-center"
            >
              {/* Mythic Trophy Crest */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-deep-purple/80 border-2 border-mystic-gold flex items-center justify-center shadow-[0_0_25px_rgba(231,190,114,0.6)] mb-4 animate-float">
                <span className="text-3xl sm:text-4xl" aria-hidden="true">
                  👑
                </span>
              </div>

              {/* Victory Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-purple/40 border border-mystic-gold/60 text-mystic-gold text-xs font-heading tracking-widest uppercase mb-2">
                <span>✦ SELESAI ✦</span>
              </div>

              <h2
                id="victory-title"
                className="font-heading text-2xl sm:text-3xl font-extrabold text-gradient-gold mb-2"
              >
                Keren, Berhasil!
              </h2>

              <p className="font-body text-xs sm:text-sm text-purple-200/90 leading-relaxed mb-6">
                Mantap, <span className="text-mystic-gold font-bold">{RECIPIENT_NAME}</span>!
                Semua kartu berhasil kamu pasangkan. Sekarang kita lanjut ke tahap berikutnya.
              </p>

              {/* Stats Box */}
              <div className="w-full grid grid-cols-2 gap-3 bg-midnight/90 border border-royal-purple/40 rounded-2xl p-3.5 mb-6">
                <div className="flex flex-col items-center border-r border-royal-purple/30">
                  <span className="text-[11px] font-heading text-purple-300 uppercase tracking-wider">
                    Total Langkah
                  </span>
                  <span className="font-heading text-xl font-bold text-white mt-0.5">
                    {moves}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-heading text-purple-300 uppercase tracking-wider">
                    Peringkat Memori
                  </span>
                  <span className="font-heading text-xs font-bold text-mystic-gold mt-1">
                    {moves <= 6 ? '⭐⭐⭐ Mythic' : moves <= 10 ? '⭐⭐ Legendary' : '⭐ Master'}
                  </span>
                </div>
              </div>

              {/* Actions: Continue button (required) and Play Again */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="button"
                  onClick={onNext}
                  className="w-full flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-to-r from-mystic-gold via-mystic-gold-light to-mystic-gold text-midnight font-heading font-bold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(231,190,114,0.7)] hover:shadow-[0_0_35px_rgba(231,190,114,1)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span>Lanjutkan Perjalanan</span>
                  <span aria-hidden="true">→</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="sm:w-auto min-h-[44px] py-2.5 px-4 rounded-xl bg-deep-purple/70 border border-royal-purple text-purple-200 hover:text-white hover:border-mystic-gold/60 text-xs sm:text-sm font-heading font-semibold transition-all cursor-pointer focus:outline-none"
                >
                  Main Lagi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export { MemoryMatch };
