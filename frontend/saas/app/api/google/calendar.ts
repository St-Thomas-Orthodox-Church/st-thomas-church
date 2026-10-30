'use server';
import {LiturgicalDay} from '@/app/types/calendar';

// app/services/page.tsx (or wherever your route sits)
import {parseCalendarDescription} from "@/app/utils/textFormatter";
import {EventInput} from "@fullcalendar/react";


const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY; // Kept secure on server!
const CALENDAR_ID = 'signapp46@gmail.com';
const ORTHO_CALENDAR_ID = 'ha9t75ni2au0610ef2o258i9bcltqhg1@import.calendar.google.com';

async function fetchGoogleCalendarEvents(calendarId: string): Promise<EventInput[]> {
    if (!API_KEY) {
        console.error('⛔ No API key found.');
        return [];
    }

    const url=`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&singleEvents=true&orderBy=startTime`;
    try {
        // Next.js caches this fetch request natively. Revalidates every hour (3600 seconds)
        const response = await fetch(url, {
            next: {revalidate: 3600}
        });
        const data = await response.json();

        if (!data.items) {
            console.info('🫙 to items found');
            return [];
        }
        
        return data.items;
        
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
        generalEventsCache =  await fetchGoogleCalendarEvents(ORTHO_CALENDAR_ID)
            .then(events => {
                if (!events || !events.length) return [];
                // Map Google Event Object properties to native FullCalendar options
                return events.map((event: any) => {
                    const multiDays: boolean=isMultiDays(event);

                    let eventMapped = {
                        id: event.id,
                        title: event.summary || 'No Title',
                        start: event.start?.dateTime || event.start?.date,
                        end: event.end?.dateTime || event.end?.date,
                        className: `event-general ${multiDays ?' multi-day': ''}`,
                        // Pass description cleanly down to the client modal hook
                        extendedProps: {
                            description: event.description || "No additional description available.",
                            isMultiDay: multiDays,
                        }
                    };
                    const parsedEvent = parseCalendarDescription(eventMapped);

                    if (!parsedEvent.extendedProps) {
                        parsedEvent.extendedProps = {};
                    }
                    parsedEvent.extendedProps.isMultiDay = multiDays;
                    
                    return parsedEvent;
                   
                });
                
            } )
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
export  const fetchLocalEvents=async ():Promise<EventInput[]>=>{
  const localEvents= await fetchGoogleCalendarEvents(CALENDAR_ID);
  
  return  localEvents;
 
}


function isMultiDays (event: any): boolean  {
    // 1. Handle All-Day Events (uses event.start.date formatted as "YYYY-MM-DD")
    if (event.start?.date && event.end?.date) {
        const startDate = new Date(event.start.date);
        const endDate = new Date(event.end.date);

        // Google Calendar API all-day events end at midnight of the following day.
        // A single all-day event (e.g., Nov 1) has start="2026-11-01" and end="2026-11-02".
        // Therefore, it's only multi-day if the difference is greater than 1 day (86400000 ms).
        const diffTime = endDate.getTime() - startDate.getTime();
        return diffTime > 86400000;
    }

    // 2. Handle Timed Events (uses event.start.dateTime formatted as ISO strings)
    if (event.start?.dateTime && event.end?.dateTime) {
        const startDate = new Date(event.start.dateTime);
        const endDate = new Date(event.end.dateTime);

        return (
            startDate.getFullYear() !== endDate.getFullYear() ||
            startDate.getMonth() !== endDate.getMonth() ||
            startDate.getDate() !== endDate.getDate()
        );
    }

    return false;
};
