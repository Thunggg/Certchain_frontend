'use client';

import { useEffect, RefObject } from 'react';

export function useHeroScrollEffect(
  screenshotRef: RefObject<HTMLDivElement | null>,
  heroContentRef: RefObject<HTMLDivElement | null>,
  maxScroll: number = 400,
) {
  useEffect(() => {
    const handleScroll = () => {
      if (!screenshotRef.current || !heroContentRef.current) return;
      const y = window.pageYOffset;
      screenshotRef.current.style.transform = `translateY(-${y * 0.5}px)`;
      const opacity = 1 - Math.min(y / maxScroll, 1);
      heroContentRef.current.style.opacity = opacity.toString();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [screenshotRef, heroContentRef, maxScroll]);
}

export default useHeroScrollEffect;


