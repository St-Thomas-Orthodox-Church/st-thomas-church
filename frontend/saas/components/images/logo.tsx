'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import  {getLogo} from  '@/app/api/orchard/mediaAssets';
import {MediaItem} from "@/app/types/media";

export default  function Logo({ className }: {className:string} ) {

    // 1. Set state to hold the logo data
    const [logo, setLogo] = useState< MediaItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 2. Call the async getLogo function inside useEffect
        async function fetchLogoData() {
            try {
                const logoData = await getLogo();
                if(!logoData){
                    return null;
                }
                setLogo(logoData);
                
            } catch (error) {
                console.error('Failed to fetch logo:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLogoData();
    }, []);

    if (loading) {
        return <div className="w-[120px] h-[40px] bg-gray-200 animate-pulse" />;
    }

    let logoUrl = logo?.url;

    if (!logoUrl) {
        logoUrl='/logo.png'; // Fallback text if logo is missing
    }
    //to keep transparancy of the logo, we must replace jpg format with png
    const transparentUrl=logoUrl.replace('jpg','png');
    logoUrl=transparentUrl;
    
    return (
        <div style={{ backgroundColor: 'transparent' }}>
        <img
                src={logoUrl}
                alt="☦ Orthodox Church Logo"
                style={{ display: 'block', maxWidth: 'auto', height: '50px' }}
            />
        </div>
    );
}
