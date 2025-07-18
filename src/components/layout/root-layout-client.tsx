"use client";

import { useEffect, useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { useBadgeChecking } from '@/lib/hooks/use-badge-checking';
import { NavigationHeader } from './navigation-header';
import { LeaderboardProvider } from '@/lib/contexts/leaderboard-context';
import type { Session } from '@supabase/supabase-js';

interface RootLayoutClientProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

interface HeaderContextType {
  setRightButtons: (buttons: React.ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export function useHeaderButtons() {
  const context = useContext(HeaderContext);
  if (!context) {
    // Return a no-op function when context is not available
    return { setRightButtons: () => {} };
  }
  return context;
}

export function RootLayoutClient({ children, initialSession }: RootLayoutClientProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [mounted, setMounted] = useState(false);
  const [rightButtons, setRightButtons] = useState<React.ReactNode>(null);
  const pathname = usePathname();
  const supabase = useSupabase();
  const { checkBadges } = useBadgeChecking();

  useEffect(() => {
    setMounted(true);
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        // Check for badges when user signs in
        if (session && event === 'SIGNED_IN') {
          setTimeout(() => checkBadges(), 1000); // Small delay to ensure user data is loaded
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, checkBadges]);

  // Clear buttons when pathname changes
  useEffect(() => {
    setRightButtons(null);
  }, [pathname]);

  // During hydration, always render the same structure
  if (!mounted) {
    return (
      <LeaderboardProvider>
        {children}
      </LeaderboardProvider>
    );
  }

  const isSignedIn = !!session;
  const isAuthPage = pathname.startsWith('/auth');
  const isHomePage = pathname === '/';
  const isDemoPage = pathname === '/demo';
  const isLegalPage = pathname === '/terms' || pathname === '/privacy' || pathname === '/support';

  // Don't show navigation header for non-signed in users, auth pages, homepage, demo page, or legal pages
  if (!isSignedIn || isAuthPage || isHomePage || isDemoPage || isLegalPage) {
    return (
      <LeaderboardProvider>
        {children}
      </LeaderboardProvider>
    );
  }

  return (
    <LeaderboardProvider>
      <HeaderContext.Provider value={{ setRightButtons }}>
        <NavigationHeader isSignedIn={isSignedIn} rightButtons={rightButtons} />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </HeaderContext.Provider>
    </LeaderboardProvider>
  );
} 