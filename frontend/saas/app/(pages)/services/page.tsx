'use client';

import React, { useState, useRef } from 'react';
import FullCalendar, { Calendar }  from "@fullcalendar/react";
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
export default  function Services() {

    // States to handle modal data and toggle status
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
  

    //google calendar 
    const calendarId='signapp46@gmail.com';
    const orthoCalendarId='ha9t75ni2au0610ef2o258i9bcltqhg1@import.calendar.google.com';
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

    const eventSource: EventSourceInput[] = [
        {
            googleCalendarId: orthoCalendarId,
            className: 'event-general'
        },
        {
            googleCalendarId: calendarId,
            className: 'event-local'
        }
    ];

    const calendarOptions: any = {
        plugins: [themePlugin,
            dayGridPlugin,
            listPlugin,
            timeGridPlugin,
            multiMonthPlugin,
            googleCalendarPlugin
        ],
        initialView: "dayGridMonth",
        googleCalendarApiKey: apiKey,
        eventSources: eventSource,

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

            <div>
                <FullCalendar {...calendarOptions} />
            </div>

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
                            <p className="modal-date"> <strong>Date:</strong> {selectedEvent.start}</p>
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
        </>
    )
}

//this code determines how each even will appear in the calendar
function renderEventContent(eventInfo: any) {
        console.log('eventInfo', eventInfo);
    return (
        <div>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </div>
    );
}