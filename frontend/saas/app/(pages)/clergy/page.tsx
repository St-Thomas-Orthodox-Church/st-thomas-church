import {notFound} from "next/navigation";
import {getClergy} from "@/app/api/orchard/clergy";
import {type ClergyItem} from '@/app/types/clergy';
import PersonPhoto from "@/components/images/personPhoto";

import "./clergy.css";

export default async function ClergyPage() {

    let clergyList: ClergyItem[] | null = await getClergy();
    //console.log('clergyList from clergy page ',clergyList);   // uncomment for debugging
    if (clergyList === null) {
        return notFound();
    }
    //sort clergy list
    clergyList = clergyList.sort((a, b) => a.sortOrder - b.sortOrder);
    //create two lists one for leadership and another one for St Thomas Clergy
    let leadershipList: ClergyItem[] = [];
    let stThomasClergyList: ClergyItem[] = [];

    for (let clergy of clergyList) {
        if (clergy.level === 'leadership') {
            leadershipList.push(clergy);
        } else if (clergy.level === 'clergy') {
            stThomasClergyList.push(clergy);
        }
    }
    // uncomment for debugging
    // console.log('stThomasClergyList ',stThomasClergyList); 
    // console.log('leadershipList',leadershipList);


    return (
        <>
            <section className={'clergy-block'}>
                <h1 className={'gradient-dark-header-large'}>Our Leadership</h1>
                <section className={'clergy-images'}>
                    {leadershipList.map(l => (
                        <figure>
                            <PersonPhoto
                                src={l.image?.files?.[0]?.url?.toString() || ""}
                                className={'clergy-photo'}
                                imageDescription={l.imageDescription || ""}
                            />
                            <figcaption> {l.imageDescription} </figcaption>
                        </figure>
                    ))}
                </section>
            </section>

            <section className={'clergy-block'}>
                <h1 className={'gradient-dark-header-large'}>Our Clergy</h1>
                <section className={'clergy-images'}>
                    {stThomasClergyList.map(l => (
                        <figure>
                            <PersonPhoto
                                src={l.image?.files?.[0]?.url?.toString() || ""}
                                className={'clergy-photo'}
                                imageDescription={l.imageDescription || ""}
                            />
                            <figcaption> {l.imageDescription} </figcaption>
                        </figure>
                    ))}
                </section>
            </section>
        </>
    )
}