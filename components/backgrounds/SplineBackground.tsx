'use client';

import React, { lazy, Suspense } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

type SplineBackgroundProps = {
  scene: string;
  className?: string;
  overlay?: React.ReactNode;
};

export function SplineBackground({ scene, className, overlay }: SplineBackgroundProps) {
  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100vh', pointerEvents: 'auto', overflow: 'hidden' }}
    >
      <Suspense>
        <Spline scene={scene} style={{ width: '100%', height: '100vh', pointerEvents: 'auto' }} />
      </Suspense>
      {overlay}
    </div>
  );
}

export default SplineBackground;


