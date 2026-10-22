'use client';
import { useSearchParams} from 'next/navigation';
import React, {ReactElement, useRef, useEffect, use, JSX} from "react";

interface Props {
    title: string;
    onClose: () => void;
    onOK?: (() => void) | null;
    children: React.ReactNode;
}

export default function Dialog({title, onClose,children ,onOK=null}: Props) {
    //const searchParams = useSearchParams();
    //const dialogRef = useRef<HTMLDialogElement | null>(null);
   // const showDialog = searchParams.get('showDialog');
    //
    // useEffect(() => {
    //     if(showDialog === 'y'){
    //         dialogRef.current?.showModal();
    //     }else {
    //         dialogRef.current?.close();
    //     }
    // }, [showDialog]);
    
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
      <dialog open className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto w-full h-full">
          <div className="bg-white rounded-lg shadow-xl m-auto max-w-md w-full overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center bg-gray-100 p-4 border-b border-gray-200">
                  <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                  <button
                      onClick={closeDialog}
                      className="text-gray-500 hover:text-red-600 transition-colors font-bold text-lg px-2 cursor-pointer"
                  >
                      &times;
                  </button>
              </div>
              <div className="p-6 space-y-4">
                  {children}

                  {/* Fixed the text-string leakage bug here */}
                  {onOK && (
                      <div className="flex justify-end pt-2 border-t border-gray-100">
                          <button
                              onClick={clickOK}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                          >
                              OK
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </dialog>
        );
    
}