import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

function getValidConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    url &&
    anonKey &&
    url !== 'your_supabase_project_url' &&
    anonKey !== 'your_supabase_anon_key' &&
    !url.includes('placeholder')
  ) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return { url, key: anonKey };
      }
    } catch {
      // Fall through to placeholder
    }
  }

  return {
    url: 'https://placeholder.supabase.co',
    key: 'placeholder-anon-key',
  };
}

const config = getValidConfig();

export const supabase: SupabaseClient = createBrowserClient(config.url, config.key);
