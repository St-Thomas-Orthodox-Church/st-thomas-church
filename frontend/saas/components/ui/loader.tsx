import React from "react";
import './loader.css';

interface LoaderProps {
    isLoading?: boolean;
    children: React.ReactNode;
}
export default function Loader({isLoading = false, children}: LoaderProps) {

    if (isLoading) {
        return (
            <div className="calendar-loader-container">
                <div className="calendar-spinner"></div>
                <span className="calendar-loader-text">Loading Calendar...</span>
            </div>
        );
    }
    
    return <>{children}</>;
}