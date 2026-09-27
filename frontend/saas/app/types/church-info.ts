import {ImageFile} from "@/app/types/media";

export interface Address {
    city:string;
    country:string;
    postalZIPCode: string;
    stateRegion: string;
    streetAddress:string;
}


export interface AboutUsData {
    headerMain:string;
    subtitle:string;
    additionalinformation:string;
    mainInformation:{
        info:string
    };
    pageBanner:ImageFile[];
    relatedBlogIDs:string[];
}