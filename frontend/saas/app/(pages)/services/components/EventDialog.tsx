'use client';

import React, {useRef, useState} from "react";
import Dialog from '@/components/ui/dialog';
import DOMPurify from 'dompurify';
import {EventInput, EventSourceInput} from '@fullcalendar/react';
import {LiturgicalDay} from "@/app/types/calendar";
import postgres from "postgres";
import from = postgres.toPascal.column.from;
import Link from "next/link";

import  styles from '@/components/ui/dialog.module.css';

interface Props{
    date:string | null,
    eventsLocal: EventInput[] | null;
    eventGeneral: LiturgicalDay | null;
    setIsModalOpen: (isOpen: boolean)=>void
}
export default function EventDialog({date, eventsLocal, eventGeneral, setIsModalOpen}: Props) {

    const [isExpanded, setIsExpanded] = useState(false);
//format date
    const dateDate = new Date(date.replace(/-/g, '/'));
// 2. Format to "Month Day, YYYY"
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(dateDate);
    
    
    // Close the pop-up box cleanly
    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <Dialog header={formattedDate} title={ eventGeneral?.title ?? ''} onClose={closeModal}>
            <div className={styles.sectionWrapper}>
                {eventGeneral && (
                        <p className={`${styles.right}   ${styles.accent}  ${eventGeneral.fast ? styles.amber : styles.green}`}>
                            {eventGeneral.fast ? '● Fasting Day' : '○ No Fasting'}
                        </p>
                    )}
                {/* 2. RENDER LOCAL PARISH EVENTS IF PRESENT */}
                {eventsLocal && eventsLocal.length > 0 && (
                    eventsLocal.map((event, index) => (
                        <section className={`${styles.sectionBody} ${styles.sectionAccented}`} key={index}>
                            <h3 className={styles.sectionHeader}>
                                {event.start?.dateTime
                                    ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'All Day'} &nbsp;
                                {event.summary}</h3>
                            <div key={event.id || index} className="local-event-item">
                                <h4 className="local-event-title">{event.title}</h4>
                                {event.description && (
                                    <div className={styles.modalDescription}>
                                        <div className={`${styles.modalExpandable}
                                            ${isExpanded ? styles.expanded : styles.collapsed}`}
                                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(event.description)}}
                                        />
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className={styles.btnToggle}
                                            aria-expanded={isExpanded}
                                        >
                                            {isExpanded ? "Read less" : " ...Read more"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    ))
                )}

                {/* 1. RENDER GENERAL LITURGICAL DATA IF PRESENT */}
                {eventGeneral && (
                    <section className={styles.sectionBody}>
                        {eventGeneral.commemorations && (
                            <section className={styles.sectionGeneral}>
                                <b>Commemorations:</b> {eventGeneral.commemorations}
                            </section>
                        )}
                        <section className={styles.sectionGeneral}>
                            {eventGeneral.epistle && <p><strong>Epistle:</strong> {eventGeneral.epistle}</p>}
                            {eventGeneral.gospel && <p><strong>Gospel:</strong> {eventGeneral.gospel}</p>}
                        </section>
                        {eventGeneral.link && (
                            <section className={styles.sectionGeneral}>
                                Follow this link to the &nbsp;
                                <Link href={eventGeneral.link} >
                                     Orthodox Calendar
                                </Link>
                                &nbsp;for full readings. 
                            </section>
                        )}
                    </section>
                )}
            </div>
        </Dialog>

        
    )
}