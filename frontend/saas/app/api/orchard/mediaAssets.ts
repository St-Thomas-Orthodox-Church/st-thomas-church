'use server';

import { cache } from 'react';
import  {type MediaItem } from '@/app/types/media';
import {orchardFetch} from '@/app/api/orchard/orchard-client';

/*
Instead of fetching media directly from Orcharch media folders, we are using media that is stored in the media content items
 Content items that store media:
    smallLogo
    gallery

 */

const BASE_URL = process.env.NEXT_PUBLIC_CMS_MEDIA_URL || '';

const GET_MEDIA_QUERY = `
query {
  smallLogo {
    contentItemId
    contentType
    image {
          files {
            url
            fileName
            mediaText
          }
        }
  }
  gallery {
    contentItemId
    contentType
     image {
          files {
            url
            fileName
            mediaText
          }
        }
  }
}
`;

interface OrchardFile{
        mediaText: string;
        fileName: string;
        url: string | null;
    
}


interface OrchardDataPayload {
    smallLogo?: Array<{
        contentType: string;
        contentItemId: string;
        image: {
            files: {
                url: string;
                fileName: string;
                mediaText: string
            }[]
        };
    }>;
    gallery?: Array<{
        contentItemId: string;
        image: { files: {
                url: string;
                fileName: string;
                mediaText: string
            }[] };
    }>;
}

async function fetchMediaRaw():Promise<OrchardDataPayload> {
    const content_types=['SmallLogo','Gallery']; //Content type MUST match orchard content type. 
    /* This is important because on content update, orchard triggers workflow sends post request with conetn type that has been modified
    the function in teh revalidate/route.js captures this request and refreshes fetch with content type tag
    */
    
    const response = await orchardFetch<OrchardDataPayload>({
        query: GET_MEDIA_QUERY,
        tags:content_types,
    });
    
    return response;
}


// 3. Extract and return the smallLogo property specifically
export async function getLogo() {
    try {
        const response = await fetchMediaRaw();
        //console.log({'get Logo response ':response}); //uncomment to debug
        if (!response || !response.smallLogo || response.smallLogo.length === 0) {
            console.warn('⚠️ smallLogo is missing or empty in response:', response);
            return null;
        }
        // Target the first item in the returned content array
        const firstLogoItem = response.smallLogo[0];
        const firstFile = firstLogoItem?.image?.files?.[0];
        
       let logoUrl: string | null= null;
        if (firstFile?.url) {
            // Ensure base URL cleanly joins with the file path
            logoUrl = `${BASE_URL}/${firstFile.url}`;
        }
        
        // Directly access smallLogo from response
        const smallLogo: MediaItem = {
            id: firstLogoItem?.contentItemId ?? '',
            lastModifiedUtc: new Date(),
            name: firstFile?.fileName || 'Church Logo',
            url: logoUrl
        };
        
        return smallLogo;
        
    } catch (error) {
        console.error('🚨 Error inside getLogo:', error);
        return null;
    }
}

// TODO: Write get gallery photos
