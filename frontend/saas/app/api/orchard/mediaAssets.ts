import { cache } from 'react';
import  {type MediaItem } from '@/app/types/media';
import {orchardFetch} from '@/app/api/orchard/orchard-client';

/*
Instead of fetching media directly from Orcharch media folders, we are using media that is stored in the media content items
 Content items that store media:
    smallLogo
    gallery

 */


const GET_MEDIA_QUERY = `
query {
      smallLogo {
        image {
          files(first: 1) {
            url
          }
        }
        contentType
        contentItemId
      }
      
      gallery(orderBy: { modifiedUtc: DESC, contentItemId: ASC }, first: 200) {
        contentItemId
        image {
          files {
            mediaText
            fileName
            url
          }
        }
      }
  }
`;
interface File{
    
        mediaText: string;
        fileName: string;
        url: string;
    
};
interface  Image {
    files: File[]
};

interface OrchardDataPayload {
    smallLogo?: {
        image: Image;
        contentType: string;
        contentItemId: string;
    };
    gallery?: {
        contentItemId: string;
        image: Array<{
            mediaText: string;
            fileName: string;
            url: string;
        }>;
    };
}

async function fetchMediaRaw():Promise<OrchardDataPayload> {
    const response = await orchardFetch<OrchardDataPayload>({
        query: GET_MEDIA_QUERY,
    });
    
    return response;
}

// 3. Extract and return the smallLogo property specifically
export async function getLogo() {
    try {
        const response = await fetchMediaRaw();
        
       if (!response){
           return null;
       }
        
        // Directly access smallLogo from response
        const smallLogo: MediaItem= ({
            id: response?.smallLogo?.contentItemId ?? '',
            lastModifiedUtc: new Date(),
            name: 'Church Logo',
            url: response?.smallLogo?.image?.files[0]?.url ?? ''
        });
       
       
        if (!smallLogo) {
            console.warn('⚠️ smallLogo is missing from response:', response);
            return null;
        }
        
        return smallLogo;
        
    } catch (error) {
        console.error('🚨 Error inside getLogo:', error);
        return null;
    }
}

//TODO: Write get gallery photos
