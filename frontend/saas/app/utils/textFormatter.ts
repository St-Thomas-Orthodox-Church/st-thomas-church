import {LiturgicalDay} from '@/app/types/calendar';

export function parseCalendarDescription(event: any): LiturgicalDay {
    let day: LiturgicalDay = {
        id:event.id,
        title: event.title,
        start: event.start, 
        end: event.end, 
        class: event.class,
        fast: false,
        commemorations: '',
        epistle: '',
        gospel: '',
        link: ''
    };
    const text= event.description; 
    if (!text) return day;

    
    
    //  Split lines and isolate the URL link
    const lines: string[] = text.split('\n').map((line: string)  => line.trim()).filter(Boolean);
   
    // Extracts the first URL found anywhere inside the description string
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLink = text.match(urlRegex);
    day.link = foundLink ? foundLink[0] : '';
    
    //Is fast . If line includes 'no fast' then it's not a fasting day 
    day.fast=!lines.find((line: string)  => line.includes('fast') && line.includes('no'));
    
    // Identify readings (lines containing "Epistle" or "Gospel")
    day.epistle = lines.find(line => line.includes('Epistle')) ?? '';
    day.gospel = lines.find(line => line.includes('Gospel')) ?? '';

    // Separate everything else as Commemorations/Feasts
    const commemorations = lines.filter(line =>
        !line.startsWith('https://') &&
        !line.startsWith('Follow this link') &&
        !line.includes('(Epistle)') &&
        !line.includes('(Gospel)') &&
        !line.toLowerCase().includes('no fast') &&
        !line.toLowerCase().includes('fast day')
    );
    
    day.commemorations =commemorations?.join('\n') ?? '';

    return day;
}