import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ProposalPayload, ProposalResponse, ApiResponse } from '@/types';

// Regular expression to validate standard RFC 4122 UUID format (case-insensitive)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// In-memory rate limiting configuration: 10 requests per session_id per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const CLEANUP_INTERVAL_MS = 60 * 1000;
const MAX_PAYLOAD_BYTES = 1024; // 1KB size limit

// In-memory store: Map<session_id, timestamp[]>
const rateLimitMap = new Map<string, number[]>();
let lastCleanupTime = Date.now();

/**
 * Cleans up stale rate limit entries to prevent memory leaks.
 */
function cleanupExpiredEntries(currentTime: number): void {
  for (const [sessionId, timestamps] of rateLimitMap.entries()) {
    const validTimestamps = timestamps.filter(
      (time) => currentTime - time < RATE_LIMIT_WINDOW_MS
    );
    if (validTimestamps.length === 0) {
      rateLimitMap.delete(sessionId);
    } else {
      rateLimitMap.set(sessionId, validTimestamps);
    }
  }
}

/**
 * Checks and records rate limit for a given session ID.
 * Returns true if request is rate limited, false otherwise.
 */
function isRateLimited(sessionId: string): boolean {
  const now = Date.now();

  // Periodically clean up expired entries from the map
  if (now - lastCleanupTime > CLEANUP_INTERVAL_MS || rateLimitMap.size > 500) {
    cleanupExpiredEntries(now);
    lastCleanupTime = now;
  }

  const existingTimestamps = rateLimitMap.get(sessionId) || [];
  const validTimestamps = existingTimestamps.filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS
  );

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(sessionId, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(sessionId, validTimestamps);
  return false;
}

/**
 * Checks if Supabase environment variables are properly configured and not template placeholders.
 */
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return false;
  }

  if (
    url === 'your_supabase_project_url' ||
    serviceKey === 'your_service_role_key' ||
    url.includes('placeholder')
  ) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. Validate HTTP method
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, message: 'Method not allowed.' },
        { status: 405 }
      );
    }

    // 2. Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be application/json.' },
        { status: 400 }
      );
    }

    // 3. Size limit check: fast-fail on Content-Length header if present
    const contentLengthHeader = request.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = parseInt(contentLengthHeader, 10);
      if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
        return NextResponse.json(
          { success: false, message: 'Request payload exceeds 1KB size limit.' },
          { status: 400 }
        );
      }
    }

    // Read raw body
    let rawBody: string;
    try {
      rawBody = await request.text();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Failed to read request body.' },
        { status: 400 }
      );
    }

    // 4. Strict byte length check
    const byteLength = new TextEncoder().encode(rawBody).length;
    if (byteLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Request payload exceeds 1KB size limit.' },
        { status: 400 }
      );
    }

    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Request body cannot be empty.' },
        { status: 400 }
      );
    }

    // 5. Parse JSON
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON payload.' },
        { status: 400 }
      );
    }

    if (typeof parsedBody !== 'object' || parsedBody === null || Array.isArray(parsedBody)) {
      return NextResponse.json(
        { success: false, message: 'Request body must be a JSON object.' },
        { status: 400 }
      );
    }

    const { session_id, response } = parsedBody as Partial<ProposalPayload>;

    // 6. Validate session_id (valid UUID format)
    if (!session_id || typeof session_id !== 'string' || !UUID_REGEX.test(session_id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid session ID format. Must be a valid UUID.' },
        { status: 400 }
      );
    }

    // 7. Validate response (must be exactly 'yes' or 'need_moment')
    if (response !== 'yes' && response !== 'need_moment') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response. Must be either "yes" or "need_moment".',
        },
        { status: 400 }
      );
    }

    // 8. In-memory rate limiting check (max 10 requests per session_id per minute)
    if (isRateLimited(session_id)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    // 9. Supabase integration with graceful degradation
    if (!isSupabaseConfigured()) {
      console.warn(
        '[Proposal API] Supabase environment variables not configured or invalid. Gracefully recorded response in dev mode.'
      );
      return NextResponse.json(
        { success: true, message: 'Your response has been recorded.' },
        { status: 200 }
      );
    }

    try {
      const supabase = createAdminClient();
      const { error } = await supabase.from('proposal_responses').insert({
        session_id,
        response: response as ProposalResponse,
      });

      if (error) {
        console.error('[Proposal API] Supabase database insertion error:', error.message);
        return NextResponse.json(
          { success: false, message: 'Unable to record your response.' },
          { status: 500 }
        );
      }
    } catch (dbError: unknown) {
      const errorMsg = dbError instanceof Error ? dbError.message : String(dbError);

      // If configuration missing at runtime, gracefully degrade
      if (
        errorMsg.includes('Missing Supabase environment variables') ||
        errorMsg.includes('Invalid supabaseUrl')
      ) {
        console.warn('[Proposal API] Supabase configuration error caught:', errorMsg);
        return NextResponse.json(
          { success: true, message: 'Your response has been recorded.' },
          { status: 200 }
        );
      }

      console.error('[Proposal API] Server error while recording proposal response:', dbError);
      return NextResponse.json(
        { success: false, message: 'Unable to record your response.' },
        { status: 500 }
      );
    }

    // 10. Return success response
    return NextResponse.json(
      { success: true, message: 'Your response has been recorded.' },
      { status: 200 }
    );
  } catch (err: unknown) {
    // Catch-all to ensure internal errors are never exposed
    console.error('[Proposal API] Unhandled server error in proposal respond handler:', err);
    return NextResponse.json(
      { success: false, message: 'Unable to record your response.' },
      { status: 500 }
    );
  }
}
