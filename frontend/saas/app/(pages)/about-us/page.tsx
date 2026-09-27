import getAboutUs, {AboutUsQueryResponse} from '@/app/api/orchard/about-us';
import  {getChurchContactInfo, getChurchAdderss} from '@/app/api/orchard/church-info';
import { notFound } from 'next/navigation';
import PageBanner from '@/components/images/PageBanner';
import {BlogPost} from '@/components/ui/blogPost';
import {getSanitizedHtml} from '@/app/utils/sanitize';
import {AboutUsData} from '@/app/types/church-info';
import './about-us.css';
import {getBlogByID} from "@/app/api/orchard/blogs";
import {BlogItem} from "@/app/types/blog";


export default async function AboutUsPage() {
    
    const aboutUsData:AboutUsData= await getAboutUs();
    if (!aboutUsData) {
        notFound();
    }
    
    const {headerMain,subtitle, mainInformation, pageBanner, relatedBlogIDs, additionalinformation} = await aboutUsData;
    const rawUrl = pageBanner[0]?.url;
    const pageBannerUrl = rawUrl?.startsWith('//') ? `https:${rawUrl}` : rawUrl;
    
    //subtitle
    const subtitleCleanHtml=getSanitizedHtml(aboutUsData?.subtitle);
    
    //get address and contact info

    const contactInfoHtml = await getChurchContactInfo();
    
    const churchAddress=await getChurchAdderss();
    if(churchAddress){
        const {city, country, postalZIPCode,stateRegion, streetAddress }= churchAddress;
    }
    
    
    
   //related blog
    const relatedBlog =await getBlogByID(relatedBlogIDs[0]);

    return (
        <div className="about-page-container">
            <h1>{headerMain}</h1>
            <h2
                dangerouslySetInnerHTML={{ __html: subtitleCleanHtml }}
            />
            <p>{mainInformation.info} </p>
            <PageBanner
                src={pageBannerUrl}
                imageDescription={pageBanner?.[0]?.fileName || "Banner"}
            />
            
            <p className="contact-info-block"
               dangerouslySetInnerHTML={{ __html: contactInfoHtml || '' }}
            />
            
            <p className="additional-info"
                dangerouslySetInnerHTML={{__html:additionalinformation || ''}} 
                >
            </p>

            {relatedBlog &&  <BlogPost blog={relatedBlog}/> }
       </div>
    )
}