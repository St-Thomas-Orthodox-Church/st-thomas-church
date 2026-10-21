'use client';

import React, {useState, useRef, useEffect, use} from 'react';
import FullCalendar, {Calendar, EventInput} from "@fullcalendar/react";
import { EventSourceInput } from '@fullcalendar/core';
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
export default  function Services() {

    // States to handle modal data and toggle status
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
  

    //google calendar 
 


    // 1. Initialize state to hold the fully processed event sources safely
    const [calendarSources, setCalendarSources] = useState<EventSourceInput[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

                // 3. Map  custom objects cleanly to native FullCalendar options
                const formattedGeneralEvents: EventInput[] = generalDays.map((day: any) => ({
                    id: day.id || `gen-${Math.random()}`,
                    title: day.title || day.summary || 'No Title',
                    start: day.start?.dateTime || day.start?.date || day.start || day.date,
                    end: day.end?.dateTime || day.end?.date || day.end || day.date,
                    className: 'event-general',
                    extendedProps: { description: day.description || '' }
                }));

                const formattedLocalEvents: EventInput[] = localDays.map((day: any) => ({
                    id: day.id || `loc-${Math.random()}`,
                    title: day.title || day.summary || 'No Title',
                    start: day.start?.dateTime || day.start?.date || day.start || day.date,
                    end: day.end?.dateTime || day.end?.date || day.end || day.date,
                    className: 'event-local',
                    extendedProps: { description: day.description || '' }
                }));

                // 4. Update the state once everything is compiled and mounted
                setCalendarSources([
                    { events: formattedGeneralEvents },
                    { events: formattedLocalEvents }
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
        eventClick: (info: any) => {
            info.jsEvent.preventDefault(); //prevent opening google calendar on click

            // Extract the event properties you want to show
            setSelectedEvent({
                title: info.event.title,
                start: info.event.start?.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'}),
                time: info.event.start?.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
                description: info.event.extendedProps?.description || "No additional description available."
            });
            // Display the modal cleanly on screen
            dialogRef.current?.showModal();
        }
    }
    
    
    // Close the pop-up box cleanly
    const closeModal = () => {
        dialogRef.current?.close();
        setSelectedEvent(null);
    };
    
   
    return(
        <>
            <section className={'service-times-page'}>
                <h1 className={'gradient-dark-header-large'}>SCHEDULE OF SERVICES</h1>
                <p> Hours and Divine Liturgy: <time> Sunday, 10:00am </time></p>
                <p><i> Please contact us for seasonal service schedules.</i></p>
            </section>

            {isLoading ? (
                <div className="fc-event-spinner-container">
                    <div className="fc-event-spinner"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                <div>
                    <FullCalendar {...calendarOptions} />
                </div>
            )}
            {/* 👇 THE LIGHTBOX STYLE POP-UP WINDOW */}
            <dialog ref={dialogRef} className="calendar-modal" onClick={closeModal}>
                {selectedEvent && (
                    // Stop clicking inside the modal content box from closing it automatically
                    <section className="calendar-modal-content" onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <h2>{selectedEvent.title}</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </header>
                        <section className="modal-body">
                            <p className="modal-date"><strong>Date:</strong> {selectedEvent.start}</p>
                            {selectedEvent.time && selectedEvent.time !== "12:00 AM" && (
                                <p className="modal-time">⏰ <strong>Time:</strong> {selectedEvent.time}</p>
                            )}
                            <div className="modal-description">
                                <p>{selectedEvent.description}</p>
                            </div>
                        </section>
                    </section>
                )}
            </dialog>
            
         
</>)
}

//this code determines how each even will appear in the calendar
const renderEventContent= ( eventInfo: any)=> {
    return (
        <div>
            <b>{eventInfo?.timeText} </b>
            {eventInfo?.timeText && ' '}
            <i>{eventInfo?.event.title}</i>
        </div>
    );
}