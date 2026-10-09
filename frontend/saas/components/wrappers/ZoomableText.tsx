'use client';

import { useState, useRef, TouchEvent } from 'react';

interface ZoomableTextProps {
  children: React.ReactNode;
  className?: string;
  initialSize?: number; // In pixels
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
  const startDistRef = useRef<number | null>(null);
  const startSizeRef = useRef<number>(initialSize);

  // Helper to calculate the pixel distance between two touch points
  const getDistance = (e: TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const t1 = e.touches[0];
    const t2 = e.touches[1];
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // User placed two fingers down: record starting distance and current font size
      startDistRef.current = getDistance(e);
      startSizeRef.current = fontSize;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && startDistRef.current !== null) {
      // Keep background screen from scrolling while pinching text
      if (e.cancelable) e.preventDefault();

      const currentDist = getDistance(e);
      const ratio = currentDist / startDistRef.current;
      
      // Calculate new font size based on finger expansion ratio
      let newSize = startSizeRef.current * ratio;
      
      // Constrain size within your safe limits
      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      
      setFontSize(newSize);
    }
  };

  const handleTouchEnd = () => {
    // Reset references when fingers lift off screen
    startDistRef.current = null;
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ fontSize: `${fontSize}px` }}
      className={`transition-shadow duration-150 select-none touch-none leading-relaxed ${className}`}
    >
      {children}
    </div>
  );
}
