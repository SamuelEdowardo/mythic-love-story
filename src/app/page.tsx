'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import { useAudio } from '@/hooks/useAudio';
import { Chapter, CHAPTER_ORDER } from '@/types';
import { RECIPIENT_NAME } from '@/data/content';

// Import all chapter components
import LandingPage from '@/components/LandingPage';
import MythicCelebration from '@/components/MythicCelebration';
import QuestJourney from '@/components/QuestJourney';
import SecretReward from '@/components/SecretReward';
import MemoryMatch from '@/components/MemoryMatch';
import Achievement from '@/components/Achievement';
import FinalPortal from '@/components/FinalPortal';
import LoveLetter from '@/components/LoveLetter';
import Proposal from '@/components/Proposal';

// Chapter metadata for tooltips and progress bar
interface ChapterMeta {
  title: string;
  shortLabel: string;
}

const CHAPTER_METADATA: Record<Chapter, ChapterMeta> = {
  landing: { title: 'Prologue: The Invitation', shortLabel: 'Prologue' },
  celebration: { title: 'Mythic Celebration', shortLabel: 'Mythic' },
  journey: { title: 'The Quest Journey', shortLabel: 'Journey' },
  'secret-reward': { title: 'Secret Treasure', shortLabel: 'Reward' },
  'memory-match': { title: 'Trial of Synergy', shortLabel: 'Trial' },
  achievement: { title: 'Achievement Unlocked', shortLabel: 'Victory' },
  'final-portal': { title: 'The Final Portal', shortLabel: 'Portal' },
  'love-letter': { title: 'Personal Love Letter', shortLabel: 'Letter' },
  proposal: { title: 'A Legendary Question', shortLabel: 'Proposal' },
  ending: { title: 'Epilogue: New Dawn', shortLabel: 'Epilogue' },
};

export default function Home() {
  const { currentChapter, isLoaded, goToChapter, nextChapter, resetProgress } =
    useProgress();
  const { isPlaying, toggleAudio, switchTrack, playAudio } = useAudio();
  const shouldReduceMotion = useReducedMotion();

  // Reset progress and return audio track to intro
  const handleReplayJourney = () => {
    switchTrack('intro');
    resetProgress();
  };

  // Loading screen while progress is reading from localStorage
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen w-full bg-midnight flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_center,_var(--color-royal-purple)_0%,_transparent_70%)]"
          aria-hidden="true"
        />

        {/* Arcane Rune Spinner */}
        <div className="relative flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full border-2 border-dashed border-mystic-gold/60 animate-spin"
            style={{ animationDuration: '6s' }}
            aria-hidden="true"
          />
          <div
            className="absolute w-12 h-12 rounded-full border border-soft-pink/50 animate-ping"
            style={{ animationDuration: '2.5s' }}
            aria-hidden="true"
          />
          <svg
            className="w-8 h-8 text-mystic-gold animate-pulse-glow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <h2 className="font-heading text-lg sm:text-xl tracking-[0.25em] uppercase text-gradient-gold mb-2 font-semibold">
          Summoning the Realm
        </h2>
        <p className="font-body text-xs sm:text-sm text-white/60 tracking-wider">
          Menyiapkan petualangan untuk {RECIPIENT_NAME}...
        </p>
      </div>
    );
  }

  // Active index for progress calculation
  const currentChapterIndex = CHAPTER_ORDER.indexOf(currentChapter);

  return (
    <div className="relative min-h-screen w-full bg-midnight text-white overflow-x-hidden flex flex-col selection:bg-royal-purple selection:text-mystic-gold">
      {/* ─── PERSISTENT AUDIO TOGGLE BUTTON (ALL CHAPTERS) ─── */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Jeda musik latar' : 'Putar musik latar'}
          title={isPlaying ? 'Jeda musik' : 'Putar musik latar'}
          className={`group relative flex items-center justify-center min-w-[44px] min-h-[44px] w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer border ${
            isPlaying
              ? 'border-mystic-gold bg-deep-purple/80 text-mystic-gold shadow-[0_0_18px_rgba(231,190,114,0.4)] hover:shadow-[0_0_24px_rgba(231,190,114,0.6)]'
              : 'border-mystic-gold/60 bg-midnight-light/90 text-mystic-gold/90 hover:text-mystic-gold hover:border-mystic-gold hover:bg-deep-purple/70 shadow-[0_0_12px_rgba(231,190,114,0.25)] animate-pulse'
          }`}
        >
          {/* Subtle pulse ring while playing or waiting to play */}
          <span
            className={`absolute inset-0 rounded-full border border-mystic-gold/40 animate-ping opacity-30 pointer-events-none ${
              isPlaying ? 'animate-ping' : 'opacity-20'
            }`}
            aria-hidden="true"
          />

          {/* Icon */}
          <div className="relative flex items-center justify-center">
            {isPlaying ? (
              // Speaker with Sound Wave SVG (Playing)
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
                aria-hidden="true"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.25" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              // Music Note SVG (Tap to Play)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" fill="currentColor" />
                <circle cx="18" cy="16" r="3" fill="currentColor" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* ─── MAIN CONTENT: CHAPTER ORCHESTRATION WITH ANIMATEPRESENCE ─── */}
      <main className="relative flex-1 flex flex-col w-full pb-8 sm:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{
              duration: shouldReduceMotion ? 0.05 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 flex flex-col w-full"
          >
            {renderChapter(currentChapter)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );

  // Helper function to render active chapter component
  function renderChapter(chapter: Chapter) {
    switch (chapter) {
      case 'landing':
        return (
          // Hide duplicate header button in LandingPage so persistent top-right button acts as unified control
          <div className="w-full flex-1 flex flex-col [&_header>div:last-child]:hidden">
            <LandingPage
              onNext={() => {
                playAudio();
                nextChapter();
              }}
              isAudioPlaying={isPlaying}
              onToggleAudio={toggleAudio}
            />
          </div>
        );

      case 'celebration':
        return <MythicCelebration onNext={nextChapter} />;

      case 'journey':
        return <QuestJourney onNext={nextChapter} />;

      case 'secret-reward':
        return <SecretReward onNext={nextChapter} />;

      case 'memory-match':
        return <MemoryMatch onNext={nextChapter} />;

      case 'achievement':
        return <Achievement onNext={nextChapter} />;

      case 'final-portal':
        return (
          <FinalPortal
            onNext={nextChapter}
            onSwitchMusic={() => switchTrack('romantic')}
          />
        );

      case 'love-letter':
        return <LoveLetter onNext={nextChapter} />;

      case 'proposal':
        return <Proposal onNext={nextChapter} />;

      case 'ending':
        return (
          <EndingChapter
            onReplay={handleReplayJourney}
            onBackToProposal={() => goToChapter('proposal')}
          />
        );

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="font-heading text-xl text-mystic-gold">Petualangan Berlanjut...</p>
            <button
              type="button"
              onClick={() => goToChapter('landing')}
              className="mt-4 px-6 py-3 rounded-full bg-royal-purple text-white font-heading text-sm min-h-[44px]"
            >
              Kembali ke Prologue
            </button>
          </div>
        );
    }
  }
}

// ─── INLINE ENDING CHAPTER COMPONENT ───
interface EndingChapterProps {
  onReplay: () => void;
  onBackToProposal: () => void;
}

function EndingChapter({ onReplay, onBackToProposal }: EndingChapterProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center overflow-hidden">
      {/* Ambient Celestial Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-radial from-royal-purple/30 via-deep-purple/20 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-radial from-soft-pink/20 to-transparent blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Decorative Floating Starfield */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <span className="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-mystic-gold animate-twinkle opacity-75" />
        <span className="absolute top-[22%] right-[20%] w-2 h-2 rounded-full bg-soft-pink animate-float opacity-80" />
        <span className="absolute top-[40%] left-[10%] w-2.5 h-2.5 rounded-full bg-white animate-twinkle opacity-60" />
        <span className="absolute top-[68%] right-[14%] w-2 h-2 rounded-full bg-mystic-gold animate-float opacity-80" />
        <span className="absolute bottom-[20%] left-[22%] w-1.5 h-1.5 rounded-full bg-soft-pink animate-twinkle opacity-70" />
      </div>

      <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col items-center">
        {/* RPG Chapter Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-mystic-gold/40 bg-deep-purple/60 backdrop-blur-md mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-mystic-gold animate-twinkle" />
          <span className="font-heading text-xs tracking-[0.25em] uppercase text-mystic-gold font-semibold">
            EPILOGUE • A NEW BEGINNING
          </span>
        </motion.div>

        {/* Central Emblem: Mythic Love Crest */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mb-6"
        >
          <div
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-royal-purple/50 via-deep-purple/60 to-midnight border-2 border-mystic-gold/60 flex items-center justify-center shadow-[0_0_35px_rgba(231,190,114,0.35)]"
          >
            {/* Ornate Heart & Wings SVG */}
            <svg
              className="w-16 h-16 sm:w-18 sm:h-18 text-soft-pink animate-float"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="#E7BE72"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          {/* Circling Accent Sparkles */}
          <div
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-mystic-gold/20 flex items-center justify-center border border-mystic-gold/50 animate-twinkle"
            aria-hidden="true"
          >
            <span className="text-[10px] text-mystic-gold">✨</span>
          </div>
        </motion.div>

        {/* Main Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-gradient-gold mb-3"
        >
          A Legendary Love Story
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-heading text-xs sm:text-sm text-soft-pink/90 tracking-widest uppercase mb-8"
        >
          Terima kasih sudah menyelesaikan cerita ini
        </motion.p>

        {/* Glassmorphic Thank You Scroll Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full bg-deep-purple/40 backdrop-blur-md border border-royal-purple/50 rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] mb-8 text-center relative overflow-hidden"
        >
          {/* Top golden decorative line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-mystic-gold to-transparent opacity-80"
            aria-hidden="true"
          />

          <h3 className="font-heading text-lg sm:text-xl text-mystic-gold font-semibold mb-3">
            Terima Kasih, {RECIPIENT_NAME} ✨
          </h3>

          <div className="space-y-3 font-body text-sm sm:text-base text-white/85 leading-relaxed">
            <p>
              Makasih ya sudah mau luangkan waktu dan lihat web ini sampai selesai.
            </p>
            <p>
              Dari main game bareng sampai obrolan tiap hari, aku selalu senang bisa kenal dan dekat sama kamu.
            </p>
            <p className="text-soft-pink font-medium">
              Apapun responmu, yang terpenting kamu nyaman dan tahu kalau kehadiranmu selalu bikin hari-hariku lebih seru.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-royal-purple/30 flex flex-col items-center">
            <span className="font-heading text-xs tracking-widest text-mystic-gold/80 uppercase">
              Player 1 &amp; Player 2
            </span>
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
        >
          {/* Replay Journey Button */}
          <button
            type="button"
            onClick={onReplay}
            className="group relative flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full font-heading text-sm font-semibold tracking-wider text-mystic-gold bg-gradient-to-r from-deep-purple to-royal-purple hover:from-deep-purple-light hover:to-royal-purple-light border border-mystic-gold/60 shadow-[0_0_20px_rgba(231,190,114,0.3)] hover:shadow-[0_0_28px_rgba(231,190,114,0.5)] transition-all duration-300 min-h-[48px] cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-mystic-gold transition-transform duration-300 group-hover:-rotate-90"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Ulangi Petualangan</span>
          </button>

          {/* Re-read Proposal Response Button */}
          <button
            type="button"
            onClick={onBackToProposal}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full font-heading text-xs sm:text-sm font-medium tracking-wider text-white/70 hover:text-white bg-midnight-light/80 hover:bg-deep-purple/50 border border-royal-purple/50 transition-colors min-h-[48px] cursor-pointer"
          >
            Lihat Proposal Lagi
          </button>
        </motion.div>

        {/* Footer Credit */}
        <p className="mt-12 text-[11px] sm:text-xs text-white/40 tracking-wider">
          MYTHIC: A Legendary Love Story • Created with ❤️ for {RECIPIENT_NAME}
        </p>
      </div>
    </div>
  );
}
