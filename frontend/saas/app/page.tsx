import { Button } from '@/components/ui/button';
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
                        <h2> Contract US</h2>
                        <p dangerouslySetInnerHTML={{ __html: contactInfo || ''}}/>
                    </section>
                </section>

                <section className={'right'}>
                    <img
                        className={'img-main'}
                        src={'/church_Home_Image.png'}
                    />
                </section>
            </section>

        </>
    );
}
