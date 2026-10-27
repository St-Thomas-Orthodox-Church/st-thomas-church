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
        epistle: [],
        gospel: [],
        link: ''
    };
    const text= event.extendedProps.description;
   
    if (!text) return day;

    
    
    //  Split lines and isolate the URL link
    const lines: string[] = text.split('\n').map((line: string)  => line.trim()).filter(Boolean);
    console.log('lines',lines);
    
    lines.forEach((line: string )=>{
       const trimmedLine = line.trim();
       if (!trimmedLine)  return;  //skip empty line
        
        const lowerLine=trimmedLine.toLowerCase();
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        switch (true) {
            //remove 'Follow this link for full readings" text
                case lowerLine.startsWith('follow'):
                    break;
            //fasting
            case lowerLine.includes('fast'):
                if (lowerLine.includes('no')) {
                    day.fast = false;
                } else {
                    day.fast = true;
                }
                break;
            //link
            case urlRegex.test(line):
                const foundLink = line.match(urlRegex);
                day.link = foundLink ? foundLink[0] : '';
                break;
            //epistle
            case lowerLine.includes('epistle'):
                day.epistle.push(line);
                break;
            //gospel
            case lowerLine.includes('gospel'):
                day.gospel.push(line);
                break;
            default:
               // day.commemorations.push(trimmedLine);
                break;
        }
        
    })
    
    day.commemorations= lines[1]; //commemorations alwsays returned on line 1; 
    return day;
}