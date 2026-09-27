import {AboutUsData} from '@/app/types/church-info';
import {ImageFile} from "@/app/types/media";
import {getSanitizedHtml} from "@/app/utils/sanitize";



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
    };
}

export default async function getAboutUs(): Promise<AboutUsData> {

    const queryParam: string = encodeURIComponent(GET_ABOUT_US_QUERY);
    const endpoint = `${process.env.NEXT_PUBLIC_ORCHARD_URL}/api/graphql/?query=${queryParam}`;

    try {
         
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                query:  GET_ABOUT_US_QUERY ,
            }),
            next: {revalidate: 60},
        });
        
         const raw:AboutUsQueryResponse = await res.json(); //delete YAC 
        const rawItem = raw?.data?.aboutUs?.[0];
        
        const aboutUsData: AboutUsData = {
            headerMain: rawItem?.headerMain?.header || "",
            subtitle: rawItem?.subtitle?.html || "",
            mainInformation: {info: rawItem?.mainInformation?.info || ""},

            // Safely drill down to the files array, default to empty array if missing
            pageBanner: (rawItem?.pageBanner?.image?.files || []).map((file: any) => ({
                url: file?.url || "",
                id: file?.id || "",          // Fallback if id is missing in raw data
                fileName: file?.fileName || "" // Fallback if fileName is missing in raw data
            })),

            // Maps contentItemIds array to your target property
            relatedBlogIDs: rawItem?.relatedBlog?.contentItemIds || [],
            additionalinformation: getSanitizedHtml(rawItem?.additionalinformation?.html)
        };
        
        return aboutUsData;
        
    } catch (networkError: any) {
        // This catches low-level network issues (DNS failure, CORS, connection refused)
        console.log("🚨 Low-Level Fetch Network Failure:", networkError.message || networkError);
        throw networkError;
    }
}