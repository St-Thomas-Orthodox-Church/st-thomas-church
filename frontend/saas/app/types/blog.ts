import {type ImageFile} from '@/app/types/media';

export interface ImageSection {
    files: ImageFile[];
}

export interface MarkdownBodySection {
    html: string;
}

export interface BlogItem {
    id: string;
    created: string;
    lastModifiedUtc: string;
    image:ImageSection;
    displayText: string;
    markdownBody: MarkdownBodySection;
    blogType: string;
}

