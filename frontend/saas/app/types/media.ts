export interface MediaItem {
    id:string;
    lastModifiedUtc: Date;
    name: string;
    url: string | null;
}

export interface ImageFile{
    id: string;
    url: string | null;
    fileName: string;
}