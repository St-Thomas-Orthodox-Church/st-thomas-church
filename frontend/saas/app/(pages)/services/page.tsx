'use client';

import React, {useState, useRef, useEffect, use} from 'react';
import FullCalendar, {Calendar, EventInput} from "@fullcalendar/react";
import {EventSourceInput} from '@fullcalendar/react';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import themePlugin from "@fullcalendar/react/themes/monarch"; // YOUR THEME
import dayGridPlugin from "@fullcalendar/react/daygrid";
import listPlugin from '@fullcalendar/react/list';
import timeGridPlugin from '@fullcalendar/react/timegrid'
import multiMonthPlugin from '@fullcalendar/react/multimonth'
// stylesheets
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/monarch/theme.css'; // THEME
import '@fullcalendar/react/themes/monarch/palettes/red.css'; // THEME'S PALETTE
import './services.css';
import {notFound} from "next/navigation";
import {fetchGeneralEvents, fetchLocalEvents} from "@/app/api/google/calendar";
import Loader from "@/components/ui/loader";
import EventDialog from "@/app/(pages)/services/components/EventDialog";
import {LiturgicalDay} from "@/app/types/calendar";

//this code determines how each even will appear in the calendar
const renderEventContent = (eventInfo: any) => {
    return (
        <div>
            <b>{eventInfo?.timeText} </b>
            {eventInfo?.timeText && ' '}
            <i>{eventInfo?.event.title}</i>
        </div>
    );
}

export default function Services() {

    // States to handle modal data and toggle status
    const [generalEvents,setGeneralEvents] =useState<LiturgicalDay[]>([]);
    const [localEvents,setLocalEvents] =useState<EventInput []>([]);
    const [selectedLocalEvents, setSelectedLocalEvents] = useState<EventInput[] | null>(null);
    const [selectedGeneralEvent, setSelectedGeneralEvent] = useState<LiturgicalDay | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    const dialogRef = useRef<HTMLDialogElement>(null);

    // 1. Initialize state to hold the fully processed event sources safely
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calendarSources, setCalendarSources] = useState<EventSourceInput[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /// SET EVENTS 
    useEffect(() => {
        let isMounted = true; // Prevents state updates if component unmounts mid-fetch

        const loadAllCalendarEvents = async () => {
            try {
                // 2. Perform the async fetching inside the side-effect hook safely
                const [generalDays, localDays] = await Promise.all([
                    fetchGeneralEvents(),
                    fetchLocalEvents()
                ]);
                
                if (!isMounted) return;
                
                setGeneralEvents(generalDays);
                setLocalEvents(localDays);
                
                //  Map  custom objects cleanly to native FullCalendar options
                    const formattedGeneralEvents: EventInput[] = generalDays?.map((day: any) => ({
                    id: day.id || `loc-${Math.random()}`,
                    title: day.title || day.summary || '',
                    start: day.start?.dateTime || day.start?.date || day.start || day.date,
                    end: day.end?.dateTime || day.end?.date || day.end || day.date,
                    className: 'event-general',
                    extendedProps: {description: day.description || ''}
                })) || [];

                const formattedLocalEvents: EventInput[] = localDays?.map((day: any) => ({
                    id: day.id || `loc-${Math.random()}`,
                    title: day.title || day.summary || 'No Title',
                    // Flatten the nested start/end structure so FullCalendar can read it
                    start: day.start?.dateTime || day.start?.date || day.start || day.date,
                    end: day.end?.dateTime || day.end?.date || day.end || day.date,
                    className: 'event-local',
                    extendedProps: {
                        description: day.description || ''
                    }
                })) || [];
                
                // 4. Update the state once everything is compiled and mounted
                setCalendarSources([
                    {events: formattedGeneralEvents },
                    {events: formattedLocalEvents}
                ]);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to populate calendar views:", error);
                if (isMounted) setIsLoading(false);
            }
        };

        loadAllCalendarEvents();

        // Cleanup tracking flag
        return () => {
            isMounted = false;
        };
    }, []); // Runs once on safe component mount

    /// CALENDAR OPTIONS 
    const calendarOptions: any = {
        plugins: [themePlugin,
            dayGridPlugin,
            listPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            googleCalendarPlugin
        ],
        initialView: "dayGridMonth",
        eventSources: calendarSources,
        eventContent: renderEventContent,
        headerToolbar: {
            start: 'today prev,next title',
            end: 'dayGridMonth,dayGridWeek,timeGridDay,multiMonthYear,listWeek',
        },
        dateClick:(info: any) =>{
            console.log('dated Clicked')
        },
        eventClick: (info: any) => {
            info.jsEvent.preventDefault(); //prevent opening google calendar on click
            //  Normalize the dates to standard ISO strings (YYYY-MM-DD) for a 100% reliable match
            const clickedDate: string=info.event.start
                ? new Date(info.event.start).toISOString().split('T')[0]
                : '';
            setSelectedDate(clickedDate);
            console.log('clickedDate',clickedDate);


            const localEventsSelected: EventInput[] = localEvents?.filter(le => {
                if (!le.start) return false;
                    console.log(typeof le.start );
                const eventDateStr = (() => {
                    if (!le.start) return '';

                    // 1. If it's a string, it might be an ISO string ("2026-10-22T12:00:00") or just a date ("2026-10-22")
                    if (typeof le.start === 'string') {
                        return le.start.split('T')[0];
                    }

                    // 2. If it's a raw Google Calendar object with nested fields
                    if (typeof le.start === 'object' && ('dateTime' in le.start || 'date' in le.start)) {
                        const rawDate = (le.start as any).dateTime || (le.start as any).date;
                        return rawDate ? rawDate.split('T')[0] : '';
                    }

                    // 3. If it's a native JavaScript Date object
                    return new Date(le.start as any).toISOString().split('T')[0];
                })();

                return eventDateStr === clickedDate;
            }) || [];
            const generalEventSelected: LiturgicalDay=generalEvents?.filter(le => {
                return le.start === clickedDate;
            })[0];
            
            // Extract the event properties you want to show
            setSelectedLocalEvents(localEventsSelected);
            setSelectedGeneralEvent(generalEventSelected);
            setIsModalOpen(true);
       
        }
    }




    return (
        <>
            <section className={'service-times-page'}>
                <h1 className={'gradient-dark-header-large'}>SCHEDULE OF SERVICES</h1>
                <p> Hours and Divine Liturgy: <time> Sunday, 10:00am </time></p>
                <p><i> Please contact us if you have any questions.</i></p>
            </section>
            <Loader isLoading={isLoading}>
                <div>
                    <FullCalendar {...calendarOptions} />
                </div>
            </Loader>

            {/* 👇 THE LIGHTBOX STYLE POP-UP WINDOW */}
            {isModalOpen && (
                <EventDialog 
                    date={selectedDate}
                    eventsLocal={selectedLocalEvents} 
                    eventGeneral={selectedGeneralEvent}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
        </>
    )
}

