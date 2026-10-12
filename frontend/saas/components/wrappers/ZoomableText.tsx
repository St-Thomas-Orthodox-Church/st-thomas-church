'use client';

import { useState, useRef, useEffect, TouchEvent } from 'react';

interface ZoomableTextProps {
  children: React.ReactNode;
  className?: string;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
}

export default function ZoomableText({
                                       children,
                                       className = '',
                                       initialSize = 16,
                                       minSize = 14,
                                       maxSize = 40,
                                     }: ZoomableTextProps) {
  const [fontSize, setFontSize] = useState(initialSize);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startDistRef = useRef<number | null>(null);
  const startSizeRef = useRef<number>(initialSize);

  // Helper to calculate the pixel distance between two touch points
  const getDistance = (e: globalThis.TouchEvent | TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: globalThis.TouchEvent) => {
      if (e.touches.length === 2) {
        startDistRef.current = getDistance(e);
        // Always use the latest state-reflected size from a ref or the state wrapper
        startSizeRef.current = fontSize;
      }
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (e.touches.length === 2 && startDistRef.current !== null && startDistRef.current > 0) {
        // Prevent default zooming / scrolling behavior safely
        if (e.cancelable) e.preventDefault();

        const currentDist = getDistance(e);
        const ratio = currentDist / startDistRef.current;

        let newSize = startSizeRef.current * ratio;
        newSize = Math.max(minSize, Math.min(maxSize, newSize));
        setFontSize(newSize);
      }
    };

    const handleTouchEnd = () => {
      startDistRef.current = null;
    };

    // Attach listeners natively to bypass passive event restrictions
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fontSize, minSize, maxSize]); // Re-bind when fontSize updates to keep startSizeRef accurate

  return (
      <div
          ref={containerRef}
          style={{ fontSize: `${fontSize}px` }}
          className={`transition-shadow duration-150 select-none leading-relaxed ${className}`}
      >
        {children}
      </div>
  );
}
