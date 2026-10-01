import { cache } from 'react';
import {orchardFetch} from '@/app/api/orchard/orchard-client';
import {getSanitizedHtml} from "@/app/utils/sanitize";
import {Address} from "@/app/types/church-info";
import ts from "typescript";
import ThrowProjectDoesNotContainDocument = ts.server.Errors.ThrowProjectDoesNotContainDocument;

/*
Instead of fetching media directly from Orcharch media folders, we are using media that is stored in the media content items
 Content items that store media:
    smallLogo
    gallery

 */


const GET_INFO_QUERY = `
query {
     contactinfo(first: 1) {
    markdownBody {
      html
    }
  }
  churchAddress(first: 1) {
    address {
      city
      country
      postalZIPCode
      stateRegion
      streetAddress
    }
  }
 }
`;


interface OrchardDataPayload {
        contactinfo: {
            markdownBody:{
                html: string
            };
        }[];

        churchAddress: {
            address:{
                city:string;
                country:string;
                postalZIPCode: string;
                stateRegion: string;
                streetAddress: string;
                };
            }[];
        
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: Array<string | number>;
        extensions?: Record<string, any>;
    }>;
}


let cachedPayload: OrchardDataPayload | null = null;
async function fetchChurchInfoRaw():Promise<OrchardDataPayload> {
    if (cachedPayload) {
        return cachedPayload;
    }
    
    const response = await orchardFetch<OrchardDataPayload>({
        query: GET_INFO_QUERY,
    });

    cachedPayload = response;
    return response;
}

/**
 * Gets and sanitizes the church contact info HTML.
 *
 */
export const getChurchContactInfo=cache(async (): Promise<string | null> => {
    try {
        const response :OrchardDataPayload = await fetchChurchInfoRaw();
        
        // 1. Check for missing response or GraphQL errors
        if (!response || response.errors ) {
            console.warn('⚠️ Request failed or returned errors:', response?.errors);
            return null;
        }
        
        // 2. Correct path to access html string based on your interface
        const rawHtml = response?.contactinfo?.[0]?.markdownBody.html;
        
        if (!rawHtml) {
            console.warn('⚠️ contactinfo markdownBody HTML is missing:', response);
            return null;
        }
        
        // 3. Sanitize and return
        const contactinfoCleanHtml = getSanitizedHtml(rawHtml);
        
        return contactinfoCleanHtml;

    } catch (error) {
        console.error('🚨 Error inside getChurchContactInfo:', error);
        return null;
    }
});

/**
 * Gets and formats the church address.
 */
export const getChurchAdderss=cache(async (): Promise<Address | null> =>{
    try {
        const response = await fetchChurchInfoRaw();

        // 1. Check for missing response or GraphQL errors
        if (!response || response.errors ) {
            console.warn('⚠️ Request failed or returned errors:', response?.errors);
            return null;
        }

        // 2. Correct path to access html string based on your interface
        const church_address :Address | null= response?.churchAddress[0]?.address ?? null;


        if (!church_address) {
            console.warn('⚠️ response?.data?.churchAddress; is missing:', response);
            return null;
        }

        const address:Address = {
            city:church_address?.city,
            country:church_address.country,
            postalZIPCode: church_address.postalZIPCode,
            stateRegion: church_address.stateRegion,
            streetAddress:church_address.streetAddress
        }

    return  address;

    } catch (error) {
        console.error('🚨 Error inside getChurchContactInfo:', error);
        return null;
    }
   
});