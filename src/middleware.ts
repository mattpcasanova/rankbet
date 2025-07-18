import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './lib/supabase/types';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = req.cookies.get(name);
            return cookie?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    // Define protected paths that require authentication
    const protectedPaths = [
      '/dashboard',
      '/rankings',
      '/profile',
      '/find-friends',
      '/find-groups',
      '/settings',
      '/leaderboard'
    ];

    const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    // Redirect to sign in if accessing protected route without session
    if (isProtectedPath && !session) {
      console.log('Middleware: Redirecting unauthenticated user from', req.nextUrl.pathname, 'to sign in');
      const redirectUrl = new URL('/auth/signin', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect to dashboard if accessing auth pages while logged in
    if (session && (
      req.nextUrl.pathname.startsWith('/auth/signin') || 
      req.nextUrl.pathname.startsWith('/auth/signup')
    )) {
      console.log('Middleware: Redirecting authenticated user from', req.nextUrl.pathname, 'to dashboard');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware: Error processing request:', error);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 