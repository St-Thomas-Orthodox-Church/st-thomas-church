import React from 'react';
import './PageBanner.css';

export default function PageBanner({ src, imageDescription, width = null, height = null, className = "" }:{
    src: string , 
    imageDescription?: string,
    width?: string | null,
    height?: string | null,
    className?: string})   // Guard against missing image sources
{ if (!src) return null;
    
    // Ensure double-slash URLs (e.g. from Contentful) get proper https scheme
    const formattedSrc = src.startsWith('//') ? `https:${src}` : src;

    return (
        <div className={`page-banner   ${className}`}>
                <img className="img-blured"
                    src={formattedSrc}
                    alt={imageDescription || "Page banner image"}
                    width={width || undefined}
                    height={height || undefined}
                    loading="lazy"
                    decoding="async"
                />
        </div>
    );
}