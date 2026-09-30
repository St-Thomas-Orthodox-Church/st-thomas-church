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

async function fetcBlogsRaw():Promise<OrchardDataPayload> {
    const response : OrchardDataPayload  = await orchardFetch<OrchardDataPayload>({
        query: GET_ALL_BLOGS_QUERY,
    });
  
    return response;
}

export async function getBlogs(): Promise<BlogItem[] | null> {
    try {
        const response: OrchardDataPayload = await fetcBlogsRaw();

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
                    url: `${baseUrl}${file.url}`.replace(/([^:]\/)\/+/g, "\$1"),
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
    console.log('passsed blogID', blogID);
    const allBlogs = await getBlogs();
    console.log({'allBlogs from getBlogByid': allBlogs});  //delete YAC 
    // Assuming allBlogs is an array, use .find() to get a single item by ID
    const blog = allBlogs?.find(b => b.id === blogID.trim());
    console.log('blog', blog);
    return blog;
}

