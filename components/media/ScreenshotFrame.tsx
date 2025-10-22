'use client';

import Image from 'next/image';
import React from 'react';

type ScreenshotFrameProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ScreenshotFrame({ src, alt, className, priority }: ScreenshotFrameProps) {
  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 ${className || ''}`}>
      <Image src={src} alt={alt} width={1920} height={1080} className="w-full h-auto block rounded-lg" priority={priority} />
    </div>
  );
}

export default ScreenshotFrame;


