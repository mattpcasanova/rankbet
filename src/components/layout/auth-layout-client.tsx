"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Loading } from '@/components/ui/loading';

// Dynamically import components with SSR disabled to prevent hydration issues
const FeatureHighlights = dynamic(() => Promise.resolve(function FeatureHighlightsComponent() {
  return (
    <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 p-8">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <div className="relative z-10 max-w-md text-center text-white mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <Link href="/" className="inline-block group transition-transform hover:scale-105">
            <Image
              src="/logo.svg"
              alt="RankBet"
              width={120}
              height={120}
              className="mx-auto drop-shadow-2xl transition-all duration-300 group-hover:drop-shadow-[0_0_2em_rgba(59,130,246,0.5)]"
              priority
            />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-6">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Start Ranking Today</h3>
            <p className="text-blue-100">Create your first fantasy football rankings and see how you stack up</p>
          </div>

          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Join the Community</h3>
            <p className="text-blue-100">Connect with thousands of fantasy football enthusiasts</p>
          </div>

          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Prove Your Skills</h3>
            <p className="text-blue-100">Climb the leaderboards and become a verified expert</p>
          </div>
        </div>
      </div>
    </div>
  );
}), { 
  ssr: false,
  loading: () => <div className="hidden lg:block flex-1 bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900" />
});

const MobileLogo = dynamic(() => Promise.resolve(function MobileLogoComponent() {
  return (
    <div className="lg:hidden text-center mb-8">
      <Link href="/" className="inline-block">
        <Image
          src="/logo.svg"
          alt="RankBet"
          width={80}
          height={80}
          className="mx-auto"
          priority
        />
      </Link>
    </div>
  );
}), { 
  ssr: false,
  loading: () => <div className="lg:hidden h-24 mb-8" />
});

export function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <FeatureHighlights />
      <div className="flex-1 bg-white dark:bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <MobileLogo />
          <Suspense fallback={<Loading className="w-full h-32" />}>
            {children}
          </Suspense>
        </div>
      </div>
    </div>
  )
} 