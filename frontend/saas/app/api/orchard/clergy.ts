import {cache} from 'react';
import {orchardFetch} from '@/app/api/orchard/orchard-client';
import {type ClergyItem, ImageSection} from '@/app/types/clergy';

const GET_CLERGY_QUERY = `
query MyQuery {
  clergy {
    contentType
    contentItems {
      ... on ImageWithCaption {
        contentItemId
         contentType
        sortOrder
        imageDescription
        level
        image {
          files {
            url
          }
        }
       
      }
    }
  }
}
`;

interface OrchardDataPayload {
    clergy: {
        contentType: string;
        contentItems: {
            contentItemId: string;
            contentType: string;
            sortOrder: number;
            imageDescription: string;
            level: string;
            image: {
                files: {
                    url: string;
                }[]
            }
        }[]
    }[];
}

async function fetchClergyRaw(): Promise<OrchardDataPayload> {
    return await orchardFetch<OrchardDataPayload>({
        query: GET_CLERGY_QUERY,
        tags: ["Clergy"]
    })
}

export const getClergy = cache(async (): Promise<ClergyItem[] | null> => {
    try {
        const response: OrchardDataPayload = await fetchClergyRaw();

        if (!response) {
            console.error('No response from getClergy() found');
            return null;
        }
        const baseUrl = process.env.NEXT_PUBLIC_CMS_MEDIA_URL || '';

        const clergy: ClergyItem[] = (response?.clergy?.[0].contentItems || []).map((item) => ({
            contentItemId: item.contentItemId,
            contentType: item.contentType,
            sortOrder: item.sortOrder,
            imageDescription: item.imageDescription,
            level: item.level,
            image: {
                // Map over the files array to inject the missing 'id' property
                files: item.image.files.map((file) => ({
                    id: "", // Using fileName as the required id fallback
                    url: file.url ? `${baseUrl}${file.url}`.replace(/([^:]\/)\/+/g, "\$1") : null,
                    fileName: "",
                })),
            }
        }));
        return clergy;

    } catch (error) {
        console.error('🚨 Error inside getClergy:', error);
        return null;
    }

})