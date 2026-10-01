import {getChurchAdderss, getChurchContactInfo} from "@/app/api/orchard/church-info";
import './contact.css';

export default async function ContactPage() {
    const churchAddress = await getChurchAdderss();
    const contactInfo = await getChurchContactInfo();

    return (
        <section className={'section-center'}>
            {churchAddress && (
                <section className={'church-address'}>
                    <h1 className={'gradient-dark-header-large'}>Meeting at </h1>
                   
                    {churchAddress?.streetAddress ?? ''},{churchAddress?.city}
                    {churchAddress?.postalZIPCode},
                    {churchAddress?.stateRegion}, {churchAddress?.country}
                </section>
            )}
            {contactInfo &&
                <section className={'section-contact'}>
                   <h2> Have any questions? Call or write us today.</h2>
                    <p dangerouslySetInnerHTML={{__html: contactInfo}}/>
                </section>
            }
        </section>)
}