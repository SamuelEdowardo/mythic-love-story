import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'mythic-love-story-session';

export function getSessionId(): string {
  if (typeof window === 'undefined') return uuidv4();

  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return uuidv4();
  }
}
