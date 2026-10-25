'use client';
import { useSearchParams} from 'next/navigation';
import React, {ReactElement, useRef, useEffect, use, JSX} from "react";

import  './dialog.css';

interface Props {
    title: string;
    onClose: () => void;
    onOK?: (() => void) | null;
    children: React.ReactNode;
}

export default function Dialog({title, onClose,children ,onOK=null}: Props) {
    
    const closeDialog = () => {
      //  dialogRef.current?.close();
        onClose();
    }
    
    let clickOK: () => void=()=>{return null};
    if (onOK !== null) {
         clickOK=()=>{
            onOK();
            closeDialog();
        }
    }
    
  return(
      <dialog open className="dialog-overlay">
          <div className="dialog-container">
              <div className="dialog-header">
                  <h1 className="dialog-title">{title}</h1>
                  <button onClick={closeDialog} className="dialog-close-btn">
                      &times;
                  </button>
              </div>

              <div className="dialog-body">
                  {children}

                  {onOK && (
                      <div className="dialog-footer">
                          <button onClick={clickOK} className="dialog-ok-btn">
                              OK
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </dialog>

        );
    
}