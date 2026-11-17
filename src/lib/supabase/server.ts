import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const config = getValidConfig();

  return createServerClient(
    config.url,
    config.key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can't set cookies in Server Components, only in
            // Server Actions and Route Handlers
          }
        },
      },
    }
  );
}
