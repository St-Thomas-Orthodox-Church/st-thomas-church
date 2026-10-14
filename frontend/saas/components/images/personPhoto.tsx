'use client';

import React, {useState} from 'react';
import './personPhoto.css';
import Image from "next/image";

export default function PersonPhoto({src, imageDescription, width = null, height = null, className = ""}: {
    src: string,
    imageDescription?: string,
    width?: number | null,
    height?: number | null,
    className?: string
})   // Guard against missing image sources
{
    if (!src) return null;

    // Ensure double-slash URLs (e.g. from Contentful) get proper https scheme
    const formattedSrc = src.startsWith('//') ? `https:${src}` : src;

    const [isOpen, setIsOpen] = useState(false);


    return(
        <>
            {/* 1. Main Banner Image (Clickable) */}
            <div className={`person-photo   ${className}`} onClick={() => setIsOpen(true)}>
                <Image
                    src={formattedSrc}
                    alt={imageDescription || "Page banner image"}
                    width={width || 80}
                    height={height || 140}
                    sizes="(max-width: 80px) 10vw, 20vw" // Tells Next.js how to optimize for screen sizes
                    priority={true}
                />
            </div>
            {/* 2. Full-Screen Modal Backdrop (Opens on click) */
            }
            {
                isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
                        onClick={() => setIsOpen(false)}>
                        {/* Close button indicator */
                        }
                        <button
                            className="absolute top-4 right-4 text-white text-3xl font-light hover:text-gray-300 focus:outline-none"
                            onClick={() => setIsOpen(false)}> X
                        </button>

                        {/* Expanded Image Container */
                        }
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
                )
            }
        </>
    )
}