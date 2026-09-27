import '@/components/ui/footer.css';
import {getChurchContactInfo, getChurchAdderss} from "@/app/api/orchard/church-info";
import {Address} from '@/app/types/church-info';


export default async function Footer() {

    const contactInfoHtml =  await getChurchContactInfo();
    
    const churchAddress= await getChurchAdderss(); 
   
   
    return (
        <footer>
            <section className={'content'}>
                <section className={'section-left'}>
                    St. Thomas Orthodox Church <br/>
                    Diocese of Chicago and Mid-America ROCOR <br/>
                    SIOUX CITY, IOWA <br/>
                </section>
                <section className={'section-middle'}>
                    <h4>Contact Us</h4>
                    <p dangerouslySetInnerHTML={{__html: contactInfoHtml || ''}}/>
                </section>
                <section className={'section-right'}>
                {churchAddress && (
                    <>
                        <h4>Address</h4>
                        {churchAddress?.streetAddress ?? ''},{churchAddress?.city}
                        {churchAddress?.postalZIPCode},<br/>
                        {churchAddress?.stateRegion}, {churchAddress?.country}
                    </>
                )}
                </section>
            </section>
        </footer>
    )
}
