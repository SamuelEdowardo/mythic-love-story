// Chapter/phase types
export type Chapter =
  | 'landing'
  | 'celebration'
  | 'journey'
  | 'secret-reward'
  | 'memory-match'
  | 'achievement'
  | 'final-portal'
  | 'love-letter'
  | 'proposal'
  | 'ending';

export const CHAPTER_ORDER: Chapter[] = [
  'landing',
  'celebration',
  'journey',
  'secret-reward',
  'memory-match',
  'achievement',
  'final-portal',
  'love-letter',
  'proposal',
  'ending',
];

// Memory Match types
export type CardSymbol = 'heart' | 'star' | 'moon' | 'sword';

export interface MemoryCard {
  id: number;
  symbol: CardSymbol;
  isFlipped: boolean;
  isMatched: boolean;
}

// Proposal types
export type ProposalResponse = 'yes' | 'need_moment';

export interface ProposalPayload {
  session_id: string;
  response: ProposalResponse;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Journey milestone types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Admin dashboard types
export interface ProposalRecord {
  id: string;
  session_id: string;
  response: ProposalResponse;
  created_at: string;
}

export interface DashboardStats {
  totalResponses: number;
  uniqueSessions: number;
  yesCount: number;
  needMomentCount: number;
}
