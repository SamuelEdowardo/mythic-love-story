'use client';

import { useState, useCallback, useEffect } from 'react';
import { Chapter, CHAPTER_ORDER } from '@/types';

const STORAGE_KEY = 'mythic-love-story-progress';

export function useProgress() {
  // Selalu mulai dari halaman pertama ('landing')
  const [currentChapter, setCurrentChapter] = useState<Chapter>('landing');
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    // Pastikan setiap kali halaman dimuat / direfresh selalu mulai dari landing page
    setCurrentChapter('landing');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const goToChapter = useCallback((chapter: Chapter) => {
    setCurrentChapter(chapter);
  }, []);

  const nextChapter = useCallback(() => {
    const currentIndex = CHAPTER_ORDER.indexOf(currentChapter);
    if (currentIndex < CHAPTER_ORDER.length - 1) {
      goToChapter(CHAPTER_ORDER[currentIndex + 1]);
    }
  }, [currentChapter, goToChapter]);

  const resetProgress = useCallback(() => {
    goToChapter('landing');
  }, [goToChapter]);

  return {
    currentChapter,
    isLoaded,
    goToChapter,
    nextChapter,
    resetProgress,
  };
}
