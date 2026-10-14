import {type ImageFile} from '@/app/types/media';

export interface ImageSection {
    files: ImageFile[];
}

export interface ClergyItem {
    contentItemId: string;
    contentType: string;
    sortOrder: number;
    imageDescription: string;
    level:string;
    image: ImageSection;
}
