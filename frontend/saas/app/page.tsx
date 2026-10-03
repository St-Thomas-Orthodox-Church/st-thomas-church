import Image from 'next/image';
import { ArrowRight, CreditCard, Database } from 'lucide-react';
import {getChurchContactInfo, getChurchAdderss} from '@/app/api/orchard/church-info';
import {Address} from '@/app/types/church-info';
import './home.css';

export default async function HomePage() {
    
    const contactInfo = await getChurchContactInfo();
    const address: Address | null =await getChurchAdderss();

    return (
     <>
         <h1 className={'greeting-large'}>Welcome to St Thomas Orthodox Church ! </h1>
            <section className="first-row">
                <section className={'left'}>
                    <section className={'service-times'}>
                        <h2>SCHEDULE OF SERVICES</h2>
                            <p> Hours and Divine Liturgy: <time> Sunday, 10:00am </time></p>
                            <p> Please contact us for seasonal service schedules.</p>
                    </section>
                    <section className={'address'}>
                        <h2> Visit Us</h2>
                        at {address?.streetAddress },  {address?.city}, {address?.stateRegion}, {address?.postalZIPCode}
                    </section>
                    <section className={'contact-info'}>
                        <h2> Contact US</h2>
                        <p dangerouslySetInnerHTML={{ __html: contactInfo || ''}}/>
                    </section>
                </section>

                <section className={'right'}>
                    <Image
                        className={'img-main'}
                        src={'/church_Home_Image.png'}
                        alt={'photo of the church'}
                        width={800}  // maximum estimated width it will ever be on screen
                        height={600} // e matching estimated height
                        sizes="(max-width: 768px) 100vw, 50vw" // Tells Next.js how to optimize for screen sizes
                    />
                </section>
            </section>

        </>
    );
}
