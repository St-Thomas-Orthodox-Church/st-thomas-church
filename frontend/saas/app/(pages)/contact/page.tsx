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

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2941.5050394823925!2d-96.40323392314974!3d42.502074271180035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x878dfd64f396d08f%3A0xc0469146a2d0efde!2sSt.%20Thomas%20Orthodox%20Church%20(ROCOR)!5e0!3m2!1sen!2sus!4v1793218248365!5m2!1sen!2sus"
                        width="600" height="450" style={{border:'0'}} allowFullScreen loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"></iframe>
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