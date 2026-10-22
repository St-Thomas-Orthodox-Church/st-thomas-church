'use client';

import Dialog from '@/components/ui/dialog';
import React, {useRef, useState} from "react";
import {EventInput, EventSourceInput} from '@fullcalendar/react';
import {LiturgicalDay} from "@/app/types/calendar";
import postgres from "postgres";
import from = postgres.toPascal.column.from;
import Link from "next/link";


interface Props{
    eventsLocal: EventInput[] | null;
    eventGeneral: LiturgicalDay | null;
    setIsModalOpen: (isOpen: boolean)=>void
}
export default function EventDialog({eventsLocal, eventGeneral, setIsModalOpen}: Props) {
    // States to handle modal data and toggle status
    //const [selectedEvent, setSelectedEvent] = useState<any>(null);
   // const dialogRef = useRef<HTMLDialogElement>(null);


    // Close the pop-up box cleanly
    const closeModal = () => {
        //dialogRef.current?.close();
        //setSelectedEvent(null);
        setIsModalOpen(false);
    };


    return (
        <Dialog title={eventGeneral?.title??''} onClose={closeModal}>
            <div className="p-4 space-y-4 max-w-md w-full">

                {/* 1. RENDER GENERAL LITURGICAL DATA IF PRESENT */}
                {eventGeneral && (
                    <section className="modal-body space-y-2">
                        <p className="modal-date"><strong>Date:</strong> {eventGeneral.start}</p>
                        {eventGeneral.start && eventGeneral.start !== "12:00 AM" && (
                            <p className="modal-time">⏰ <strong>Time:</strong> {eventGeneral.start}
                                {eventGeneral.end && ` - ${eventGeneral.end}`}
                            </p>
                        )}
                        <p className={`fast font-semibold ${eventGeneral.fast ? 'text-amber-600' : 'text-green-600'}`}>
                            {eventGeneral.fast ? 'Fasting Day' : 'No Fasting'}
                        </p>
                        <p className="text-sm italic">{eventGeneral.commemorations}</p>
                        <div className="modal-description text-sm space-y-1 bg-gray-50 p-2 rounded">
                            {eventGeneral.epistle && <p><strong>Epistle:</strong> {eventGeneral.epistle}</p>}
                            {eventGeneral.gospel && <p><strong>Gospel:</strong> {eventGeneral.gospel}</p>}
                        </div>
                        {eventGeneral.link && (
                            <Link href={eventGeneral.link} className="text-blue-600 underline block mt-2">
                                More Liturgical Info
                            </Link>
                        )}
                    </section>
                )}

                {/* 2. RENDER LOCAL PARISH EVENTS IF PRESENT */}
                {eventsLocal && eventsLocal.length > 0 && (
                    <section className="local-events-body space-y-3 division-y">
                        <h3 className="font-bold border-b pb-1 text-gray-700">Scheduled Parish Services</h3>
                        {eventsLocal.map((event, index) => (
                            <div key={event.id || index} className="py-2 first:pt-0">
                                <h4 className="font-semibold text-lg text-blue-900">{event.title}</h4>
                                <p className="text-xs text-gray-500">
                                    ⏰ {event.start ? new Date(event.start as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day'}
                                </p>
                                {event.extendedProps?.description && (
                                    <p className="text-sm mt-1 text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-line">
                                        {event.extendedProps.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </section>
                )}

            </div>
        </Dialog>
        
    )
}