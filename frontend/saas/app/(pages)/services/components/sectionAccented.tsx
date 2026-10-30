'use client'
import styles from "@/components/ui/dialog.module.css";
import DOMPurify from "dompurify";
import React ,{useState, useCallback, useRef, useEffect  } from "react";



const SectionAccented = ({event}:any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);

    // Persistent reference to prevent layout cycle loops
    const observerRef = useRef<ResizeObserver | null>(null);

    // Measures if the content overflows container
    const contentRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }

            if (node !== null) {
                observerRef.current = new ResizeObserver(() => {
                    if (!isExpanded) {
                        setIsClamped(node.scrollHeight > node.clientHeight);
                    }
                });
                observerRef.current.observe(node);
                setIsClamped(node.scrollHeight > node.clientHeight);
            }
        },
        [event.description, isExpanded]
    );
    
    // Clean up observer when the component unmounts
    useEffect(() => {
        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);


    return (
        <section className={`${styles.sectionBody} ${styles.sectionAccented}`}>
            <h3 className={styles.sectionHeader}>
                {event.start?.dateTime
                    ? new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'All Day'}
                {event.end?.dateTime
                    ? '-'+ new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}&nbsp;
                <span style={{whiteSpace: 'nowrap;',display: 'inline-block'}}> {event.summary}</span></h3>
            <div  className="local-event-item">
                <h4 className="local-event-title">{event.title}</h4>
                {event.description && (
                    <div className={styles.modalDescription}>
                        <div 
                            ref={contentRef}
                            className={`${styles.modalExpandable}
                                            ${isExpanded ? styles.expanded : styles.collapsed}`}
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(event.description)}}
                        />
                        {(isClamped || isExpanded) && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={styles.btnToggle}
                                aria-expanded={isExpanded}
                            >
                                {isExpanded ? "Read less" : " ...Read more"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
)}

export default SectionAccented;