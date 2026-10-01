import getAboutUs, {AboutUsQueryResponse} from '@/app/api/orchard/about-us';
import  {getChurchContactInfo, getChurchAdderss} from '@/app/api/orchard/church-info';
import PageBanner from '@/components/images/PageBanner';
import {BlogPost} from '@/components/ui/blogPost';
import {getSanitizedHtml} from '@/app/utils/sanitize';
import {AboutUsData} from '@/app/types/church-info';
import './about-us.css';
import {getBlogByID} from "@/app/api/orchard/blogs";
import {BlogItem} from "@/app/types/blog";


export default async function AboutUsPage() {
    
    const aboutUsData:AboutUsData | null= await getAboutUs().catch(()=>null);
    if (!aboutUsData) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>About Us</h1>
                <p>Content is temporarily unavailable. Please try again later.</p>
            </div>
        );
    }
    
    const {headerMain,subtitle, mainInformation, pageBanner, relatedBlogIDs, additionalinformation} = aboutUsData;
    const rawUrl = pageBanner?.[0]?.url;
    
    const pageBannerUrl = rawUrl?.startsWith('//') ? `https:${rawUrl}` : rawUrl;
    
    //subtitle
    const subtitleCleanHtml=getSanitizedHtml(aboutUsData?.subtitle);
    
    //get address and contact info

    const contactInfoHtml = await getChurchContactInfo().catch(()=>null);
    
    //const churchAddress=await getChurchAdderss();
    
   //related blog
    
    let relatedBlog=null;
   
    if (relatedBlogIDs && relatedBlogIDs.length > 0 && relatedBlogIDs[0]) {
        relatedBlog = await getBlogByID(relatedBlogIDs[0]).catch(() => null);
    }

    return (
        <div className="about-page-container">
            <h1>{headerMain}</h1>
            <h2
                dangerouslySetInnerHTML={{ __html: subtitleCleanHtml }}
            />
            <p>{mainInformation?.info} </p>
            {pageBannerUrl && (
                <PageBanner
                    src={pageBannerUrl}
                    imageDescription={pageBanner?.[0]?.fileName || "Banner"}
                />
            )}
            
            <p className="contact-info-block"
               dangerouslySetInnerHTML={{ __html: contactInfoHtml || '' }}
            />

            <p className="additional-info"
               dangerouslySetInnerHTML={{__html: additionalinformation || ''}}
            />
            
            {relatedBlog &&  <BlogPost blog={relatedBlog}/> }
       </div>
    )
}