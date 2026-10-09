import React from 'react';
import './PageBanner.css';
import Image from "next/image";

export default function PageBanner({ src, imageDescription, width = null, height = null, className = "" }:{
    src: string , 
    imageDescription?: string,
    width?: number | null,
    height?: number | null,
    className?: string})   // Guard against missing image sources
{ if (!src) return null;
    
    // Ensure double-slash URLs (e.g. from Contentful) get proper https scheme
    const formattedSrc = src.startsWith('//') ? `https:${src}` : src;

    return (
        <div className={`page-banner   ${className}`}>
                <Image className="img-blured"
                    src={formattedSrc}
                    alt={imageDescription || "Page banner image"}
                    width={width || 1200}
                    height={height || 400}
                />
        </div>
    );
}