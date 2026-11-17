'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RECIPIENT_NAME } from '@/data/content';
import { useAudio } from '@/hooks/useAudio';

export interface AchievementProps {
  onNext: () => void;
}

// Particle shape types for the celebration burst
type ParticleShape = 'diamond' | 'star' | 'circle' | 'square' | 'heart';

interface BurstParticle {
  id: number;
  shape: ParticleShape;
  color: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
}

interface AmbientMote {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

// Pre-defined golden and royal color palette
const CELEBRATION_COLORS = [
  '#E7BE72', // mystic-gold
  '#F0D090', // mystic-gold-light
  '#F3A6CE', // soft-pink
  '#FFFFFF', // white
  '#7650B8', // royal-purple
  '#8B6BC9', // royal-purple-light
];

// Helper to generate deterministic burst particles
function generateParticles(count = 42): BurstParticle[] {
  const shapes: ParticleShape[] = ['diamond', 'star', 'circle', 'square', 'heart'];
  const particles: BurstParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI + (Math.sin(i * 99) * 0.2);
    const distance = 130 + Math.abs(Math.sin(i * 13)) * 220; // 130px to 350px
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance + (distance * 0.15); // slight gravity bias
    const shape = shapes[i % shapes.length];
    const color = CELEBRATION_COLORS[i % CELEBRATION_COLORS.length];
    const size = 6 + (i % 5) * 2.5; // 6px to 16px
    const rotate = (i % 2 === 0 ? 1 : -1) * (180 + (i * 35));
    const duration = 2.0 + (i % 4) * 0.3;
    const delay = (i % 6) * 0.05;

    particles.push({
      id: i,
      shape,
      color,
      x,
      y,
      size,
      rotate,
      duration,
      delay,
    });
  }

  return particles;
}

// Floating ambient sparks in background
const AMBIENT_MOTES: AmbientMote[] = [
  { id: 1, top: '12%', left: '15%', size: 4, duration: 4.2, delay: 0.1, color: '#E7BE72' },
  { id: 2, top: '22%', left: '85%', size: 6, duration: 5.5, delay: 0.8, color: '#F3A6CE' },
  { id: 3, top: '35%', left: '8%', size: 3, duration: 3.8, delay: 1.2, color: '#F0D090' },
  { id: 4, top: '48%', left: '92%', size: 5, duration: 4.6, delay: 0.4, color: '#7650B8' },
  { id: 5, top: '65%', left: '18%', size: 4, duration: 5.1, delay: 1.8, color: '#E7BE72' },
  { id: 6, top: '78%', left: '82%', size: 6, duration: 4.9, delay: 0.9, color: '#F3A6CE' },
  { id: 7, top: '88%', left: '28%', size: 3, duration: 3.5, delay: 1.5, color: '#FFFFFF' },
  { id: 8, top: '15%', left: '72%', size: 5, duration: 4.4, delay: 2.1, color: '#E7BE72' },
  { id: 9, top: '70%', left: '50%', size: 4, duration: 5.8, delay: 0.3, color: '#F0D090' },
  { id: 10, top: '28%', left: '42%', size: 3, duration: 3.9, delay: 1.1, color: '#F3A6CE' },
];

// SVG Golden Sunburst Light Rays behind badge
function GoldenLightRays({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  // 24 radiant beams radiating from center (300, 300)
  const rayPaths = useMemo(() => {
    const rays: string[] = [];
    const count = 24;
    const cx = 300;
    const cy = 300;
    const radius = 320;

    for (let i = 0; i < count; i++) {
      const angleCenter = (i * 360) / count;
      const halfWidth = 3.6; // half-angle of each beam
      const a1 = ((angleCenter - halfWidth) * Math.PI) / 180;
      const a2 = ((angleCenter + halfWidth) * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(a1);
      const y1 = cy + radius * Math.sin(a1);
      const x2 = cx + radius * Math.cos(a2);
      const y2 = cy + radius * Math.sin(a2);

      rays.push(`M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`);
    }
    return rays;
  }, []);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Primary rotating golden rays */}
      <motion.div
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] md:w-[680px] md:h-[680px] origin-center flex items-center justify-center"
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="rayRadialMask" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <mask id="rayMask">
              <rect width="600" height="600" fill="url(#rayRadialMask)" />
            </mask>
            <linearGradient id="goldRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2BF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#E7BE72" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#B3852A" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          <g mask="url(#rayMask)">
            {rayPaths.map((path, idx) => (
              <path
                key={idx}
                d={path}
                fill="url(#goldRayGrad)"
                opacity={idx % 2 === 0 ? 0.6 : 0.35}
              />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* Pulsing golden aura disc */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.65, 0.35],
              }
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-mystic-gold/30 via-royal-purple/20 to-soft-pink/30 blur-2xl pointer-events-none"
      />
    </div>
  );
}

// Particle shape renderer
function ParticleItem({ particle }: { particle: BurstParticle }) {
  const { shape, color, size } = particle;

  if (shape === 'diamond') {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          transform: 'rotate(45deg)',
          boxShadow: `0 0 8px ${color}`,
        }}
        className="rounded-[1px]"
      />
    );
  }

  if (shape === 'star') {
    return (
      <svg
        width={size * 1.3}
        height={size * 1.3}
        viewBox="0 0 24 24"
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      >
        <path d="M12 2l2.6 6.8 7.4.4-5.6 4.7 1.8 7.1-6.2-4.1-6.2 4.1 1.8-7.1-5.6-4.7 7.4-.4z" />
      </svg>
    );
  }

  if (shape === 'heart') {
    return (
      <svg
        width={size * 1.2}
        height={size * 1.2}
        viewBox="0 0 24 24"
        fill={color}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }

  if (shape === 'square') {
    return (
      <div
        style={{
          width: size * 0.9,
          height: size * 0.9,
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}`,
        }}
        className="rounded-[1px]"
      />
    );
  }

  // circle
  return (
    <div
      style={{
        width: size * 0.85,
        height: size * 0.85,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
      }}
      className="rounded-full"
    />
  );
}

// Epic RPG Badge SVG: Shield + Heart + Crown + Wings + Golden Banner
function EpicAchievementBadge({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <div className="relative flex items-center justify-center select-none pointer-events-none">
      <svg
        viewBox="0 0 420 460"
        className="w-64 sm:w-80 md:w-[350px] h-auto overflow-visible drop-shadow-[0_0_35px_rgba(231,190,114,0.45)]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Metallic Gold Gradient */}
          <linearGradient id="badgeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5CC" />
            <stop offset="25%" stopColor="#E7BE72" />
            <stop offset="50%" stopColor="#C89736" />
            <stop offset="75%" stopColor="#F0D090" />
            <stop offset="100%" stopColor="#946C1E" />
          </linearGradient>

          {/* Bright Gold Highlight */}
          <linearGradient id="badgeGoldLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFF1BA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E7BE72" stopOpacity="0.1" />
          </linearGradient>

          {/* Deep Purple Shield Body */}
          <linearGradient id="badgeShieldBody" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#3D2875" />
            <stop offset="40%" stopColor="#2A1B54" />
            <stop offset="100%" stopColor="#100A24" />
          </linearGradient>

          {/* Radiant Gem Heart Gradient */}
          <radialGradient id="badgeHeartGem" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFD3E8" />
            <stop offset="30%" stopColor="#F3A6CE" />
            <stop offset="70%" stopColor="#D9488C" />
            <stop offset="100%" stopColor="#7E1D4E" />
          </radialGradient>

          {/* Banner Gradient */}
          <linearGradient id="badgeBannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#946C1E" />
            <stop offset="20%" stopColor="#E7BE72" />
            <stop offset="50%" stopColor="#FFF6D6" />
            <stop offset="80%" stopColor="#E7BE72" />
            <stop offset="100%" stopColor="#946C1E" />
          </linearGradient>

          {/* Banner Shadow Fold */}
          <linearGradient id="bannerFoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5E3F0A" />
            <stop offset="100%" stopColor="#2B1D04" />
          </linearGradient>

          {/* Text Gradient for Banner */}
          <linearGradient id="bannerTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#FFF4D0" />
            <stop offset="70%" stopColor="#E7BE72" />
            <stop offset="100%" stopColor="#C4932D" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ======================================================== */}
        {/* 1. HERALDIC WINGS (FLANKING THE SHIELD)                  */}
        {/* ======================================================== */}
        {/* Left Wing */}
        <g id="leftWing" opacity="0.95">
          {/* Upper Primary Feather */}
          <path
            d="M 130 180 C 80 150 25 110 15 55 C 35 85 70 115 110 150 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          {/* Second Feather */}
          <path
            d="M 120 200 C 65 180 20 150 10 115 C 35 135 75 165 110 185 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          {/* Third Feather */}
          <path
            d="M 115 225 C 70 215 30 195 20 165 C 45 180 80 205 110 215 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          {/* Lower Feather */}
          <path
            d="M 125 245 C 90 245 50 235 40 210 C 65 220 95 235 120 240 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
        </g>

        {/* Right Wing (Mirrored) */}
        <g transform="translate(420, 0) scale(-1, 1)" opacity="0.95">
          <path
            d="M 130 180 C 80 150 25 110 15 55 C 35 85 70 115 110 150 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          <path
            d="M 120 200 C 65 180 20 150 10 115 C 35 135 75 165 110 185 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          <path
            d="M 115 225 C 70 215 30 195 20 165 C 45 180 80 205 110 215 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          <path
            d="M 125 245 C 90 245 50 235 40 210 C 65 220 95 235 120 240 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
        </g>

        {/* ======================================================== */}
        {/* 2. THE MAIN HERALDIC SHIELD                              */}
        {/* ======================================================== */}
        {/* Outer Gold Shield Bezel */}
        <path
          d="M 210 75 C 160 75 105 70 92 88 C 76 106 72 150 72 200 C 72 265 115 330 210 382 C 305 330 348 265 348 200 C 348 150 344 106 328 88 C 315 70 260 75 210 75 Z"
          fill="url(#badgeGoldGrad)"
          stroke="#FFF4D0"
          strokeWidth="2"
          filter="url(#badgeGlow)"
        />

        {/* Shield Body (Deep Mystic Purple) */}
        <path
          d="M 210 84 C 165 84 114 80 102 96 C 88 112 84 152 84 198 C 84 256 124 316 210 365 C 296 316 336 256 336 198 C 336 152 332 112 318 96 C 306 80 255 84 210 84 Z"
          fill="url(#badgeShieldBody)"
          stroke="#C89736"
          strokeWidth="3"
        />

        {/* Inner Golden Filigree Inset Border */}
        <path
          d="M 210 94 C 172 94 125 90 114 104 C 102 118 98 154 98 196 C 98 248 132 302 210 348 C 288 302 322 248 322 196 C 322 154 318 118 306 104 C 295 90 248 94 210 94 Z"
          fill="none"
          stroke="#E7BE72"
          strokeWidth="1.5"
          strokeOpacity="0.75"
          strokeDasharray="4 2"
        />

        {/* Shield Inner Starburst / Sunlight Rays */}
        <g opacity="0.25">
          <line x1="210" y1="95" x2="210" y2="340" stroke="#FFF2BF" strokeWidth="1" />
          <line x1="105" y1="195" x2="315" y2="195" stroke="#FFF2BF" strokeWidth="1" />
          <line x1="135" y1="125" x2="285" y2="265" stroke="#FFF2BF" strokeWidth="1" />
          <line x1="285" y1="125" x2="135" y2="265" stroke="#FFF2BF" strokeWidth="1" />
        </g>

        {/* Diamond Rivets on Shield Rim */}
        {[
          { cx: 210, cy: 80 },
          { cx: 140, cy: 83 },
          { cx: 280, cy: 83 },
          { cx: 96, cy: 92 },
          { cx: 324, cy: 92 },
          { cx: 78, cy: 195 },
          { cx: 342, cy: 195 },
          { cx: 130, cy: 330 },
          { cx: 290, cy: 330 },
          { cx: 210, cy: 374 },
        ].map((rivet, idx) => (
          <circle
            key={idx}
            cx={rivet.cx}
            cy={rivet.cy}
            r="3"
            fill="#FFF4D0"
            stroke="#946C1E"
            strokeWidth="1"
          />
        ))}

        {/* ======================================================== */}
        {/* 3. VICTORY LAUREL WREATH (EMBRACING THE HEART)           */}
        {/* ======================================================== */}
        <g id="laurelWreath" opacity="0.85">
          {/* Left Laurel Sprig */}
          <path
            d="M 148 240 C 145 220 148 190 162 170"
            fill="none"
            stroke="#E7BE72"
            strokeWidth="1.5"
          />
          <path d="M 148 240 Q 138 235 142 225 Q 150 230 148 240 Z" fill="#E7BE72" />
          <path d="M 145 218 Q 132 214 138 204 Q 148 209 145 218 Z" fill="#E7BE72" />
          <path d="M 149 196 Q 136 190 144 180 Q 153 186 149 196 Z" fill="#E7BE72" />
          <path d="M 160 174 Q 150 165 160 156 Q 168 165 160 174 Z" fill="#E7BE72" />

          {/* Right Laurel Sprig */}
          <path
            d="M 272 240 C 275 220 272 190 258 170"
            fill="none"
            stroke="#E7BE72"
            strokeWidth="1.5"
          />
          <path d="M 272 240 Q 282 235 278 225 Q 270 230 272 240 Z" fill="#E7BE72" />
          <path d="M 275 218 Q 288 214 282 204 Q 272 209 275 218 Z" fill="#E7BE72" />
          <path d="M 271 196 Q 284 190 276 180 Q 267 186 271 196 Z" fill="#E7BE72" />
          <path d="M 260 174 Q 270 165 260 156 Q 252 165 260 174 Z" fill="#E7BE72" />
        </g>

        {/* ======================================================== */}
        {/* 4. THE GLOWING RADIANT HEART (CENTERPIECE)               */}
        {/* ======================================================== */}
        <motion.g
          id="radiantHeart"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.05, 1],
                }
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '210px 198px' }}
        >
          {/* Heart Ambient Glow Aura */}
          <circle
            cx="210"
            cy="198"
            r="48"
            fill="#F3A6CE"
            opacity="0.25"
            filter="url(#badgeGlow)"
          />

          {/* Heart Bezel (Gold outer edge) */}
          <path
            d="M 210 165 C 192 135 145 135 145 180 C 145 222 192 254 210 274 C 228 254 275 222 275 180 C 275 135 228 135 210 165 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#FFF4D0"
            strokeWidth="2.5"
            filter="url(#badgeGlow)"
          />

          {/* Heart Gem (Ruby / Soft-Pink Jewel Core) */}
          <path
            d="M 210 170 C 194 142 153 142 153 182 C 153 218 194 248 210 266 C 226 248 267 218 267 182 C 267 142 226 142 210 170 Z"
            fill="url(#badgeHeartGem)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />

          {/* Facet Highlights (Crystalline Heart Effect) */}
          <path
            d="M 210 170 L 175 195 L 210 266 L 245 195 Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
          />
          <path
            d="M 175 195 L 153 182 L 180 160 Z"
            fill="#FFFFFF"
            fillOpacity="0.22"
          />
          <path
            d="M 245 195 L 267 182 L 240 160 Z"
            fill="#000000"
            fillOpacity="0.15"
          />

          {/* Heart Top-Left Glint / Specular Arc */}
          <path
            d="M 165 170 C 165 156 180 150 192 156"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />

          {/* Mythic Radiant Star at the Heart Core */}
          <g transform="translate(210, 198) scale(0.9)">
            <path
              d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
              fill="#FFF6D6"
              stroke="#E7BE72"
              strokeWidth="1"
              filter="url(#badgeGlow)"
            />
            <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
          </g>
        </motion.g>

        {/* ======================================================== */}
        {/* 5. THE MYTHIC CROWN ATOP THE SHIELD                      */}
        {/* ======================================================== */}
        <g id="mythicCrown" transform="translate(0, -6)">
          {/* Crown Base Arc */}
          <path
            d="M 165 68 Q 210 63 255 68 L 252 74 Q 210 70 168 74 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#FFF4D0"
            strokeWidth="1"
          />

          {/* Crown Peaks */}
          <path
            d="M 165 68 L 158 42 L 182 56 L 210 28 L 238 56 L 262 42 L 255 68 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
            filter="url(#badgeGlow)"
          />

          {/* Crown Jewel: Center Mythic Star */}
          <circle cx="210" cy="28" r="4.5" fill="#FFF4D0" stroke="#946C1E" strokeWidth="1" />
          <circle cx="210" cy="28" r="2" fill="#FFFFFF" />

          {/* Left/Right Crown Jewels (Amethysts and Rubies) */}
          <circle cx="158" cy="42" r="3.5" fill="#F3A6CE" stroke="#946C1E" strokeWidth="1" />
          <circle cx="262" cy="42" r="3.5" fill="#F3A6CE" stroke="#946C1E" strokeWidth="1" />
          <circle cx="182" cy="56" r="3" fill="#8B6BC9" stroke="#946C1E" strokeWidth="1" />
          <circle cx="238" cy="56" r="3" fill="#8B6BC9" stroke="#946C1E" strokeWidth="1" />
        </g>

        {/* ======================================================== */}
        {/* 6. GRAND GOLDEN BANNER: "THE HEART OF A LEGEND"           */}
        {/* ======================================================== */}
        <g id="goldenBanner" className="overflow-visible">
          {/* Left Ribbon Fold / Tail */}
          <path
            d="M 75 352 L 40 338 L 52 360 L 38 382 L 80 372 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          {/* Left Darker Underfold */}
          <path
            d="M 75 352 L 82 372 L 72 372 Z"
            fill="url(#bannerFoldGrad)"
          />

          {/* Right Ribbon Fold / Tail */}
          <path
            d="M 345 352 L 380 338 L 368 360 L 382 382 L 340 372 Z"
            fill="url(#badgeGoldGrad)"
            stroke="#946C1E"
            strokeWidth="1.5"
          />
          {/* Right Darker Underfold */}
          <path
            d="M 345 352 L 338 372 L 348 372 Z"
            fill="url(#bannerFoldGrad)"
          />

          {/* Main Front Banner Plaque */}
          <path
            d="M 66 342 Q 210 330 354 342 L 346 384 Q 210 372 74 384 Z"
            fill="#1E1238"
            stroke="url(#badgeGoldGrad)"
            strokeWidth="3.5"
            filter="url(#badgeGlow)"
          />

          {/* Inner Golden Border on Banner */}
          <path
            d="M 72 346 Q 210 335 348 346 L 342 380 Q 210 369 78 380 Z"
            fill="none"
            stroke="#FFF4D0"
            strokeWidth="1"
            strokeOpacity="0.8"
          />

          {/* Left & Right Decorative Flourish Stars */}
          <text
            x="88"
            y="364"
            fill="#E7BE72"
            fontSize="11"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            ✦
          </text>
          <text
            x="332"
            y="364"
            fill="#E7BE72"
            fontSize="11"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            ✦
          </text>

          {/* Banner Text: "THE HEART OF A LEGEND" using font-heading */}
          <text
            x="210"
            y="364"
            textAnchor="middle"
            dominantBaseline="central"
            fill="url(#bannerTextGrad)"
            className="font-heading"
            fontSize="14.5"
            fontWeight="800"
            letterSpacing="0.14em"
            style={{
              fontFamily: 'var(--font-heading), Cinzel, serif',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.85)) drop-shadow(0 0 6px rgba(231,190,114,0.6))',
            }}
          >
            THE HEART OF A LEGEND
          </text>
        </g>
      </svg>
    </div>
  );
}

// Swirling portal icon for the "Enter the Portal" button
function PortalSwirlIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-gold animate-spin"
      style={{ animationDuration: '8s' }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity="0.6"
      />
      <circle
        cx="12"
        cy="12"
        r="6"
        stroke="#F3A6CE"
        strokeWidth="1.8"
        strokeDasharray="5 2"
        strokeOpacity="0.8"
      />
      <path
        d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
    </svg>
  );
}

// =========================================================================
// MAIN COMPONENT: Achievement
// =========================================================================
export default function Achievement({ onNext }: AchievementProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const { playSfx } = useAudio();

  // Allow fast-forward if user taps to skip sequencing
  const [isSkipped, setIsSkipped] = useState(false);

  // Play epic achievement sound at badge reveal (0.5s)
  useEffect(() => {
    const sfxTimer = setTimeout(() => {
      playSfx('achievement');
    }, shouldReduceMotion ? 50 : 500);

    return () => clearTimeout(sfxTimer);
  }, [playSfx, shouldReduceMotion]);

  // Generate confetti burst particles deterministically
  const burstParticles = useMemo(() => generateParticles(44), []);

  // Handle portal button press
  const handleEnterPortal = useCallback(() => {
    playSfx('portal');
    onNext();
  }, [playSfx, onNext]);

  // Animation timing constants
  // Dramatic timing: badge at 0.5s, text at 1.5s, button at 3.0s
  const badgeDelay = isSkipped || shouldReduceMotion ? 0 : 0.5;
  const textDelay = isSkipped || shouldReduceMotion ? 0 : 1.5;
  const buttonDelay = isSkipped || shouldReduceMotion ? 0 : 3.0;

  return (
    <main
      role="region"
      aria-label="Achievement Unlocked: The Heart of a Legend"
      className="relative min-h-screen w-full bg-midnight text-white flex flex-col items-center justify-center px-4 py-8 sm:py-12 pb-20 sm:pb-24 overflow-x-hidden selection:bg-mystic-gold/30 selection:text-white"
    >
      {/* ============================================================== */}
      {/* ATMOSPHERIC BACKGROUND EFFECTS                                 */}
      {/* ============================================================== */}
      {/* Deep purple radial core glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(118,80,184,0.22)_0%,rgba(48,32,92,0.35)_40%,rgba(16,14,36,0.98)_85%)]"
        aria-hidden="true"
      />

      {/* Subtle fantasy grid/vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25 bg-[radial-gradient(#E7BE72_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* Drifting ambient stars/motes */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {AMBIENT_MOTES.map((mote) => (
          <div
            key={mote.id}
            className="absolute rounded-full animate-float"
            style={{
              top: mote.top,
              left: mote.left,
              width: mote.size,
              height: mote.size,
              backgroundColor: mote.color,
              boxShadow: `0 0 ${mote.size * 2}px ${mote.color}`,
              animationDuration: `${mote.duration}s`,
              animationDelay: `${mote.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Optional Skip sequence button for accessibility and testing */}
      {!isSkipped && (
        <button
          type="button"
          onClick={() => setIsSkipped(true)}
          className="absolute top-4 right-4 z-40 text-xs font-body tracking-wider text-mystic-gold/60 hover:text-mystic-gold px-3 py-1.5 rounded-full border border-mystic-gold/20 hover:border-mystic-gold/50 bg-deep-purple/40 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mystic-gold"
          aria-label="Skip unlock animation"
        >
          Skip animation ⏭
        </button>
      )}

      {/* ============================================================== */}
      {/* MAIN EPIC CONTAINER                                            */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* ============================================================ */}
        {/* STAGE 1: BADGE REVEAL & GOLDEN LIGHT RAYS (0.5s)             */}
        {/* ============================================================ */}
        <div className="relative w-full flex items-center justify-center my-4 sm:my-6 min-h-[300px] sm:min-h-[380px]">
          {/* Golden Light Rays behind the badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 1.2,
              delay: badgeDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <GoldenLightRays shouldReduceMotion={shouldReduceMotion} />
          </motion.div>

          {/* Confetti & Particle Explosion at badge appear */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
            aria-hidden="true"
          >
            <AnimatePresence>
              {burstParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: particle.x,
                    y: particle.y,
                    scale: [0, 1.3, 0.9],
                    opacity: [0, 1, 1, 0],
                    rotate: particle.rotate,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0.01 : particle.duration,
                    delay: badgeDelay + (shouldReduceMotion ? 0 : particle.delay),
                    ease: [0.12, 0.8, 0.32, 1],
                  }}
                  className="absolute"
                >
                  <ParticleItem particle={particle} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* The Epic Badge: Slides in from center with scale + glow */}
          <motion.div
            initial={{
              scale: 0.15,
              opacity: 0,
              y: 50,
              filter: 'brightness(2.5) drop-shadow(0 0 60px rgba(231,190,114,1))',
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              filter: 'brightness(1) drop-shadow(0 0 35px rgba(231,190,114,0.5))',
            }}
            transition={{
              duration: shouldReduceMotion ? 0.01 : 1.0,
              delay: badgeDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-20"
          >
            <EpicAchievementBadge shouldReduceMotion={shouldReduceMotion} />
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* STAGE 2: "ACHIEVEMENT UNLOCKED!" & SUBTITLE (1.5s)           */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.85,
            delay: textDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-20 flex flex-col items-center mt-2 px-2"
        >
          {/* RPG Tier Header Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-deep-purple/80 border border-mystic-gold/40 shadow-[0_0_20px_rgba(231,190,114,0.25)] backdrop-blur-md mb-3">
            <span className="text-mystic-gold text-xs">✦</span>
            <span className="font-heading text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-mystic-gold uppercase">
              Mythic Quest Complete
            </span>
            <span className="text-mystic-gold text-xs">✦</span>
          </div>

          {/* Heading: Achievement Unlocked! with text-gradient-gold */}
          <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-gradient-gold uppercase tracking-wider mb-2 drop-shadow-[0_4px_20px_rgba(231,190,114,0.45)]">
            Achievement Unlocked!
          </h1>

          {/* Subtitle */}
          <p className="font-body text-base sm:text-lg text-mystic-gold-light/95 max-w-md mx-auto leading-relaxed font-medium">
            Satu tantangan lagi selesai. Tinggal langkah terakhir.
          </p>

          {/* RPG Lore Plaque Card */}
          <div className="mt-5 w-full max-w-md p-4 rounded-xl bg-deep-purple/50 border border-royal-purple/40 shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_20px_rgba(118,80,184,0.2)] backdrop-blur-md text-left">
            <div className="flex items-center justify-between border-b border-royal-purple/30 pb-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
                  Player: {RECIPIENT_NAME}
                </span>
              </div>
              <span className="text-[11px] font-heading font-semibold text-mystic-gold bg-midnight/80 px-2.5 py-0.5 rounded-md border border-mystic-gold/30">
                RANK: MYTHIC
              </span>
            </div>

            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              Perjalanan push rank sampai ke Mythic bukan hal yang mudah, tapi kamu lewatin semuanya dengan seru dan konsisten.
            </p>

            <div className="mt-3 flex items-center justify-between text-[11px] text-mystic-gold-light font-body border-t border-royal-purple/20 pt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Portal Siap Dibuka</span>
              </span>
              <span className="font-heading text-soft-pink font-semibold">
                CHAPTER TERAKHIR
              </span>
            </div>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* STAGE 3: "ENTER THE PORTAL" BUTTON (3.0s)                    */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.75,
            delay: buttonDelay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-30 mt-8 mb-4 w-full flex flex-col items-center"
        >
          {/* Mysterious Glowing Outer Ring */}
          <div className="relative group">
            {/* Pulsing ambient halo behind button */}
            <div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-royal-purple via-mystic-gold to-soft-pink opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"
              aria-hidden="true"
            />

            {/* Main Interactive Button with Mysterious Glow Effect */}
            <motion.button
              type="button"
              onClick={handleEnterPortal}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              className="relative min-h-[52px] min-w-[260px] sm:min-w-[300px] px-8 py-3.5 rounded-full bg-gradient-to-r from-deep-purple via-royal-purple to-deep-purple border-2 border-mystic-gold/80 hover:border-mystic-gold text-white font-heading font-bold text-base sm:text-lg tracking-[0.16em] uppercase shadow-[0_0_30px_rgba(118,80,184,0.65),0_0_60px_rgba(231,190,114,0.4)] hover:shadow-[0_0_40px_rgba(118,80,184,0.85),0_0_80px_rgba(231,190,114,0.6)] flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-mystic-gold"
              aria-label="Enter the Portal to proceed to the next chapter"
            >
              {/* Shimmer light bar across button */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
                aria-hidden="true"
              />

              {/* Portal swirl icon */}
              <PortalSwirlIcon />

              {/* Button text */}
              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Lanjut ke Portal
              </span>

              {/* Forward portal rune arrow */}
              <svg
                className="w-5 h-5 text-mystic-gold transform group-hover:translate-x-1 transition-transform duration-300"
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
          </div>

          {/* Subtext beneath button */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: buttonDelay + 0.3 }}
            className="mt-3 text-xs sm:text-sm font-body text-mystic-gold-light/75 tracking-wider"
          >
            Klik tombol di atas untuk membuka pesan spesial.
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
