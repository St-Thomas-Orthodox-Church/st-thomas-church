import  {type BlogItem } from '@/app/types/blog';
import {orchardFetch} from '@/app/api/orchard/orchard-client';
import {getSanitizedHtml} from "@/app/utils/sanitize";




const GET_ALL_BLOGS_QUERY = `
  query {
      blogPost(orderBy: {modifiedUtc: DESC}) {
         contentItemId
         createdUtc
         modifiedUtc
         displayText
         image {
          files {
            url
            fileName
          }
        }
        markdownBody {
          html
        }
        blogType
     }
  }
`;


export interface OrchardDataPayload {
    blogPost: ContentItem[];
}


export type ContentItem = {
    contentItemId: string;
    createdUtc: string;
    modifiedUtc: string;
    displayText:string;
    image: {
        files: Array<{
            url: string;
            fileName: string;
        }>;
    };
    markdownBody: {
        html: string;
    };
    blogType:string;
};

async function fetchBlogsRaw():Promise<OrchardDataPayload> {
    const content_type='BlogPost'; //Content type MUST match orchard content type. 
    /* This is important because on content update, orchard triggers workflow sends post request with conetn type that has been modified
    the function in teh revalidate/route.js captures this request and refreshes fetch with content type tag
    */
    
   return   orchardFetch<OrchardDataPayload>({
        query: GET_ALL_BLOGS_QUERY,
        tags:[content_type],
    });
   
}

export async function getBlogs(): Promise<BlogItem[] | null> {
    try {
        const response: OrchardDataPayload = await fetchBlogsRaw();

        if (!response) {
            console.error('No response from getBlogs() found');
            return null;
        }
        console.log({'response from getBlogs()' : response});
        // 2. Extract the JSON body array from the response
     //   const rawData: OrchardDataPayload[] = await response;

        const blogList: ContentItem[] = response?.blogPost;
        const baseUrl = process.env.NEXT_PUBLIC_CMS_MEDIA_URL || '';
        
        const blogs: BlogItem[] = blogList?.map((raw: ContentItem) => ({
            id: raw.contentItemId,
            created: raw.createdUtc,
            lastModifiedUtc: raw.modifiedUtc,
            displayText: raw.displayText,
            image: {
                // Map over the files array to inject the missing 'id' property
                files: raw.image.files.map((file) => ({
                    id: file.fileName, // Using fileName as the required id fallback
                    url: file.url ? `${baseUrl}${file.url}`.replace(/([^:]\/)\/+/g, "\$1"): null,
                    fileName: file.fileName,
                })),
            },
            markdownBody: {html:getSanitizedHtml(raw.markdownBody.html)} ,
            blogType: raw.blogType,
        }));
      //  console.log({'blogs from getBlogs()': blogs}); //dele YAC
        return blogs;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export async function getBlogByID(blogID: string) {
    const allBlogs = await getBlogs();
    // Assuming allBlogs is an array, use .find() to get a single item by ID
    return  allBlogs?.find(b => b.id === blogID.trim());
}

