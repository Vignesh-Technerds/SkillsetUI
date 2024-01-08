import React, { createContext, useContext, useState } from 'react';
import { Toaster } from './toaster';

const ToasterContext = createContext();

export function ToasterProvider({ children }) {
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [toastDuration, setToastDuration] = useState('');

    const showToast = (message, type = "s", duration = 6000) => {
        setToastMessage(message);
        setToastType(type);
        setToastDuration(duration);
    };

    const handleClose = () => {
        setToastMessage('');
    }

    return (
        <ToasterContext.Provider value={{ showToast }}>
            {children}
            {toastMessage && <Toaster {...{ message: toastMessage, type: toastType, duration: toastDuration, handleClose: handleClose }} />}
        </ToasterContext.Provider>
    );
}

export function useToaster() {
    return useContext(ToasterContext);
}
