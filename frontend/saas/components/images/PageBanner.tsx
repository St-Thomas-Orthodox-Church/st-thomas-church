'use client';

import React, {useState} from 'react';
import './PageBanner.css';
import Image from "next/image";

export default function PageBanner({ src, imageDescription, width = null, height = null, className = "" }:{
    src: string , 
    imageDescription?: string,
    width?: number | null,
    height?: number | null,
    className?: string})   // Guard against missing image sources
{ 
    if (!src) return null;
    
    // Ensure double-slash URLs (e.g. from Contentful) get proper https scheme
    const formattedSrc = src.startsWith('//') ? `https:${src}` : src;
    
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            {/* 1. Main Banner Image (Clickable) */}
            <div className={`page-banner   ${className}`} onClick={() => setIsOpen(true)}>
                <Image className="img-blured"
                       src={formattedSrc}
                       alt={imageDescription || "Page banner image"}
                       width={width || 1200}
                       height={height || 400}
                       sizes="(max-width: 800px) 100vw, 50vw" // Tells Next.js how to optimize for screen sizes
                    priority={true}
                />
            </div>

            {/* 2. Full-Screen Modal Backdrop (Opens on click) */}
            { isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Close button indicator */}
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300 focus:outline-none"
                        onClick={() => setIsOpen(false)}
                    >
                        &times;
                    </button>

                    {/* Expanded Image Container */}
                    <div className="relative w-[90vw] h-[80vh] max-w-5xl">
                        <Image
                            src={formattedSrc}
                            alt={imageDescription || "Expanded page banner view"}
                            fill
                            className="object-contain"
                            sizes="100vw"
                        />
                    </div>
                </div>
            )}
        </>
    );
}