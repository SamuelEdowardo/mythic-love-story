import type { MemoryCard, CardSymbol } from '@/types';
import { CARD_SYMBOLS } from '@/data/content';

export function createDeck(): MemoryCard[] {
  const symbols: CardSymbol[] = [...CARD_SYMBOLS, ...CARD_SYMBOLS];

  // Fisher-Yates shuffle
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  return symbols.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
}

export function checkMatch(card1: MemoryCard, card2: MemoryCard): boolean {
  return card1.symbol === card2.symbol;
}

export function isGameComplete(cards: MemoryCard[]): boolean {
  return cards.every((card) => card.isMatched);
}
