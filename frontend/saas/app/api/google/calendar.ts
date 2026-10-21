import {LiturgicalDay} from '@/app/types/calendar';

// app/services/page.tsx (or wherever your route sits)
import {parseCalendarDescription} from "@/app/utils/textFormatter";


const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY; // Kept secure on server!
const CALENDAR_ID = 'signapp46@gmail.com';
const ORTHO_CALENDAR_ID = 'ha9t75ni2au0610ef2o258i9bcltqhg1@import.calendar.google.com';

async function fetchGoogleCalendarEvents(calendarId: string, className: string): Promise<LiturgicalDay[]> {
    if (!API_KEY) return [];

    const url=`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime`;
    try {
        console.log('fetchGoogleCalendarEvents before response. url',url);
        // Next.js caches this fetch request natively. Revalidates every hour (3600 seconds)
        const response = await fetch(url, {
            next: {revalidate: 3600}
        });
        
        const data = await response.json();

        if (!data.items) return [];

        // Map Google Event Object properties to native FullCalendar options
        return data.items.map((event: any) => {

            let eventMapped = {
                id: event.id,
                title: event.summary || 'No Title',
                start: event.start?.dateTime || event.start?.date,
                end: event.end?.dateTime || event.end?.date,
                className: className,
                // Pass description cleanly down to the client modal hook
                extendedProps: {
                    description: event.description || "No additional description available."
                }
            };
            return parseCalendarDescription(eventMapped);
        });
    } catch (error) {
        console.error(`Error fetching calendar ${calendarId}:`, error);
        return [];
    }
}
let generalEventsCache: LiturgicalDay[]| Promise<LiturgicalDay[]>;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 + 60 * 60 * 1000; // 5 hours in milliseconds (5 hours * 60 minutes * 60 seconds * 1000 milliseconds) 
export  const fetchGeneralEvents = async (): Promise<LiturgicalDay[]> =>{
    const now = Date.now();
    const isExpired = now - cacheTimestamp > CACHE_DURATION;


    // If there is no cache, or if the 5-hours timer has expired, fetch fresh data
    if (!generalEventsCache || isExpired) {
        cacheTimestamp = now; // Reset timestamp
        generalEventsCache =  await fetchGoogleCalendarEvents(ORTHO_CALENDAR_ID, 'event-general')
            .then(events => events)
            .catch((error) => {
                // Clear the cache on failure so future calls can retry immediately
                generalEventsCache = [];
                cacheTimestamp = 0;
                throw error;
            });
    }
    
    return generalEventsCache;
}

// local events are fetched separately because they will be updated more frequently
// local events are not cached to make sure updates appear immediately
export  const fetchLocalEvents=async ():Promise<LiturgicalDay[]>=>{
    return await fetchGoogleCalendarEvents(CALENDAR_ID, 'event-local');
 
}