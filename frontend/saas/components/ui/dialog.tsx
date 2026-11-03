'use client';
import { useSearchParams} from 'next/navigation';
import React, {ReactElement, useRef, useEffect, use, JSX} from "react";

import  styles from '@/components/ui/dialog.module.css';

interface Props {
    header: string | null; //for extra info, like date
    title: string;
    onClose: () => void;
    onOK?: (() => void) | null;
    children: React.ReactNode;
}

export default function Dialog({header = null,title, onClose,children ,onOK=null}: Props) {
    
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
      <dialog open className={styles.dialogOverlay}>
          <div className={styles.dialogContainer}>
              <div className={styles.dialogHeader}>
                  <div className={styles.headerText}>
                  {header!==null &&( <h2>{header}</h2>)}
                  <h1 className={`${styles.dialogTitle} gradient-dark-header-small `} >{title}</h1>
                  </div>
                  <button onClick={closeDialog} className='btn-close gradient-dark-header-small'>
                       X
                  </button>
              </div>

              <div className={styles.dialogBody}>
                  {children}

                  {onOK && (
                      <div className={styles.dialogFooter}>
                          <button onClick={clickOK} className={styles.btnOk}>
                              OK
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </dialog>

        );
    
}