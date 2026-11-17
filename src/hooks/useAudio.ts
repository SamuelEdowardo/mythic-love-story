'use client';

import { useState, useCallback, useEffect } from 'react';

export type AudioTrack = 'intro' | 'romantic';

// Global singleton state so all components share the exact same audio playback
let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;
let globalCurrentTrack: AudioTrack = 'intro';
let currentSrcIndex = 0;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// Support both /audio/filename.mp3 and /filename.mp3 paths
const TRACK_PATHS: Record<AudioTrack, string[]> = {
  intro: ['/audio/intro.mp3', '/intro.mp3'],
  romantic: ['/audio/romantic.mp3', '/romantic.mp3'],
};

function getTrackVolume(track: AudioTrack) {
  return track === 'intro' ? 0.75 : 0.8;
}

function createOrGetAudio(track: AudioTrack = globalCurrentTrack): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;

  // If previous instance has an error, reset it cleanly
  if (globalAudio && globalAudio.error) {
    try {
      globalAudio.pause();
      globalAudio.removeAttribute('src');
      globalAudio.load();
    } catch {
      // ignore cleanup errors
    }
    globalAudio = null;
  }

  if (!globalAudio) {
    const paths = TRACK_PATHS[track];
    const src = paths[currentSrcIndex % paths.length];

    globalAudio = new Audio(src);
    globalAudio.loop = true;
    globalAudio.volume = getTrackVolume(track);
    globalAudio.preload = 'auto';

    globalAudio.addEventListener('play', () => {
      globalIsPlaying = true;
      notify();
    });

    globalAudio.addEventListener('pause', () => {
      globalIsPlaying = false;
      notify();
    });

    globalAudio.addEventListener('ended', () => {
      globalIsPlaying = false;
      notify();
    });

    // Fallback if primary path fails
    globalAudio.addEventListener('error', () => {
      if (globalAudio && currentSrcIndex === 0) {
        currentSrcIndex = 1;
        const fallbackSrc = TRACK_PATHS[globalCurrentTrack][1];
        globalAudio.src = fallbackSrc;
        globalAudio.load();
        if (globalIsPlaying) {
          globalAudio.play().catch(() => {});
        }
      }
    });
  }

  return globalAudio;
}

// Synchronous trigger to preserve browser user-gesture tokens (critical for Chrome & iOS Safari)
function startPlayback(): boolean {
  const audio = createOrGetAudio();
  if (!audio) return false;

  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          globalIsPlaying = true;
          notify();
        })
        .catch((err) => {
          // Normal when browser blocks unmuted sound before user touches the page
          console.log('[Audio] Waiting for user interaction to enable sound:', err);
        });
    }
    return true;
  } catch (err) {
    console.log('[Audio] Play error:', err);
    return false;
  }
}

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(globalIsPlaying);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(globalCurrentTrack);

  useEffect(() => {
    const update = () => {
      setIsPlaying(globalIsPlaying);
      setCurrentTrack(globalCurrentTrack);
    };
    listeners.add(update);

    // Initial audio element creation
    createOrGetAudio();

    // 1. Attempt immediate autoplay on page load
    startPlayback();

    // 2. Global interaction unlocker:
    // When the browser blocks unmuted audio before user gesture,
    // the very first click, tap, pointerdown, or touch anywhere on the screen
    // will instantly start the music smoothly!
    const unlockAndPlay = () => {
      if (!globalIsPlaying) {
        startPlayback();
      }
    };

    window.addEventListener('click', unlockAndPlay, { passive: true });
    window.addEventListener('touchstart', unlockAndPlay, { passive: true });
    window.addEventListener('pointerdown', unlockAndPlay, { passive: true });
    window.addEventListener('keydown', unlockAndPlay, { passive: true });

    return () => {
      listeners.delete(update);
      window.removeEventListener('click', unlockAndPlay);
      window.removeEventListener('touchstart', unlockAndPlay);
      window.removeEventListener('pointerdown', unlockAndPlay);
      window.removeEventListener('keydown', unlockAndPlay);
    };
  }, []);

  const playAudio = useCallback(() => {
    return startPlayback();
  }, []);

  const pauseAudio = useCallback(() => {
    if (globalAudio) {
      globalAudio.pause();
      globalIsPlaying = false;
      notify();
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (globalIsPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }, [playAudio, pauseAudio]);

  const switchTrack = useCallback((track: AudioTrack) => {
    if (typeof window === 'undefined') return;
    if (globalCurrentTrack === track && globalAudio && !globalAudio.error) return;

    globalCurrentTrack = track;
    currentSrcIndex = 0;
    const paths = TRACK_PATHS[track];
    const newSrc = paths[0];

    if (globalAudio) {
      const wasPlaying = globalIsPlaying;
      globalAudio.pause();
      globalAudio.src = newSrc;
      globalAudio.volume = getTrackVolume(track);
      globalAudio.load();
      notify();

      if (wasPlaying) {
        globalAudio.play().catch(() => {});
      }
    } else {
      createOrGetAudio(track);
      startPlayback();
    }
  }, []);

  const playSfx = useCallback((sfxName: string) => {
    if (typeof window === 'undefined') return;
    try {
      const sfx = new Audio(`/audio/sfx/${sfxName}.mp3`);
      sfx.volume = 0.5;
      sfx.play().catch(() => {});
    } catch {
      // SFX gracefully skipped if not present
    }
  }, []);

  return {
    isPlaying,
    currentTrack,
    playAudio,
    pauseAudio,
    toggleAudio,
    switchTrack,
    playSfx,
  };
}
