import { NextRequest } from 'next/server';

/**
 * Validates whether an incoming request has administrative authorization.
 * Allowed if:
 * 1. Running in local development mode (NODE_ENV !== 'production')
 * 2. Or providing a matching Bearer token in the Authorization header against
 *    ADMIN_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY
 */
export function isAuthorizedAdmin(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  const authHeader = request.headers.get('authorization') || '';
  const adminKeyHeader = request.headers.get('x-admin-key') || '';
  const adminSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!adminSecret) {
    // If running in production without any configured admin secret, block destructive routes
    return false;
  }

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === adminSecret) return true;
  }

  if (adminKeyHeader && adminKeyHeader === adminSecret) {
    return true;
  }

  return false;
}

/**
 * Validates corporate email format for human reviewer identity.
 */
export function isValidEmail(email?: string | null): boolean {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}
