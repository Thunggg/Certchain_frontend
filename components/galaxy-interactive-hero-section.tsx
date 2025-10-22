"use client";

import React, { useRef } from 'react';
// Link is not directly used in this file since Navbar is external
// Navbar is global; no per-page import here
import { SplineBackground } from '@/components/backgrounds/SplineBackground'
import { ScreenshotFrame } from '@/components/media/ScreenshotFrame'
import { useHeroScrollEffect } from '@/hooks/useHeroScrollEffect'


function HeroSplineBackground() {
  return (
    <SplineBackground
        scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
      overlay={
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
              radial-gradient(60% 50% at 50% 15%, rgba(124,58,237,0.20) 0%, rgba(6,182,212,0.12) 35%, rgba(0,0,0,0) 70%),
              linear-gradient(to bottom, rgba(10,12,24,0.65), rgba(10,12,24,0.35) 40%, rgba(10,12,24,0.85))
          `,
          pointerEvents: 'none',
        }}
      />
      }
    />
  );
}

function ScreenshotSection({ screenshotRef }: { screenshotRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-11 md:mt-12">
      <div ref={screenshotRef} className="w-full md:w-[80%] lg:w-[70%] mx-auto">
        <ScreenshotFrame
          src="https://cdn.sanity.io/images/s6lu43cv/production-v4/13b6177b537aee0fc311a867ea938f16416e8670-3840x2160.jpg?w=1920&q=85&auto=format&fm=jpg"
            alt="App Screenshot"
          />
      </div>
    </section>
  );
}

function HeroContent() {
  return (
    <div className="text-left text-white pt-16 sm:pt-24 md:pt-32 px-4 max-w-3xl">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 leading-tight tracking-wide">
        Elevate your <br className="sm:hidden" />creative workflow<br className="sm:hidden" /> to an art form.
      </h1>
      <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-80 max-w-xl">
        Manage all of your media and assets — video, photos, design files, docs, PDFs, and more — on a single secure surface to create and deliver high-quality content faster.
      </p>
      <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
        <button className="bg-[#8200DB29] hover:bg-black/50 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 w-full sm:w-auto border border-[#322D36]" style={{ backdropFilter: 'blur(8px)' }}>
          Start Free Trial
        </button>
        <button className="pointer-events-auto bg-[#0009] border border-gray-600 hover:border-gray-400 text-gray-200 hover:text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-full transition duration-300 flex items-center justify-center w-full sm:w-auto">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Watch the Video
        </button>
      </div>
    </div>
  );
}

// Legacy Navbar placeholder removed

export const HeroSection = () => {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  useHeroScrollEffect(screenshotRef, heroContentRef, 400);

  // Navbar items are provided globally via layout

  return (
    <div className="relative">
      {/* Navbar is global via app/layout.tsx to avoid overlapping and duplication */}

      <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>

        <div ref={heroContentRef} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
          display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
        }}>
          <div className="container mx-auto">
            <HeroContent />
          </div>
        </div>
      </div>

      <div className="bg-black relative z-10" style={{ marginTop: '-10vh' }}>
        <ScreenshotSection screenshotRef={screenshotRef} />
        <div className="container mx-auto px-4 py-16 text-white">
            <h2 className="text-4xl font-bold text-center mb-8">Other Content Below</h2>
             <p className="text-center max-w-xl mx-auto opacity-80">This is where additional sections of your landing page would go.</p>
        </div>
      </div>
    </div>
  );
};

  
