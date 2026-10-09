import {AboutUsData} from '@/app/types/church-info';
import {getSanitizedHtml} from "@/app/utils/sanitize";
import {orchardFetch} from "@/app/api/orchard/orchard-client";


const BASE_URL = process.env.NEXT_PUBLIC_CMS_MEDIA_URL || '';

const GET_ABOUT_US_QUERY = `
query {
    aboutUs (first: 1) {
       mainInformation {
          info
        }
        pageBanner {
          imageDescription
          image {
            files {
              url
            }
          }
        }
        headerMain {
          header
        }
        subtitle {
         
            html
          
        }
        relatedBlog {
          contentItemIds(first: 10)
        }
        additionalinformation {
          html
        }
        displayText
      }
  }
`


export interface AboutUsQueryResponse {
    data?: {
        aboutUs?: {
            mainInformation?: {
                info?: string;
            };
            pageBanner?: {
                imageDescription?: string;
                image?: {
                    files?: {
                        url?: string;
                    }[];
                };
            };
            headerMain?: {
                header?: string;
            };
            subtitle?: {
                    html?: string;
            };
            relatedBlog?: {
                contentItemIds?: string[];
            };
            additionalinformation?: {
                html?: string;
            };
            displayText?: string;
        }[]; // Array because Orchard returns list queries as arrays
    
}

async function fetchBlogsRaw(): Promise<AboutUsQueryResponse> {
    const content_type = 'AboutUs'; //Content type MUST match orchard content type. 
    /* This is important because on content update, orchard triggers workflow sends post request with conetn type that has been modified
    the function in teh revalidate/route.js captures this request and refreshes fetch with content type tag
    */
    return orchardFetch<AboutUsQueryResponse>({
        query: GET_ABOUT_US_QUERY,
        tags: [content_type],
    });
}

export default async function getAboutUs(): Promise<AboutUsData> {
    try {
        const raw: AboutUsQueryResponse = await fetchBlogsRaw();
        const rawItem = raw?.data?.aboutUs?.[0];

        return {
            headerMain: rawItem?.headerMain?.header || "",
            subtitle: rawItem?.subtitle?.html || "",
            mainInformation: {info: rawItem?.mainInformation?.info || ""},

            // Safely drill down to the files array, default to empty array if missing
            pageBanner: (rawItem?.pageBanner?.image?.files || []).map((file: any) => ({
                url: `${BASE_URL}/${file?.url || ""}`,
                id: file?.id || "",          // Fallback if id is missing in raw data
                fileName: file?.fileName || "" // Fallback if fileName is missing in raw data
            })),

            // Maps contentItemIds array to your target property
            relatedBlogIDs: rawItem?.relatedBlog?.contentItemIds || [],
            additionalinformation: getSanitizedHtml(rawItem?.additionalinformation?.html)
        };
    } catch (networkError: any) {
        // This catches low-level network issues (DNS failure, CORS, connection refused)
        console.log("🚨 Low-Level Fetch Network Failure:", networkError.message || networkError);
        throw networkError;
    }
}