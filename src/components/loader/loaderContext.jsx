import React, { createContext, useContext, useState } from 'react';
import Loader from './loader';

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
    const [displayLoader, setDisplayLoader] = useState(false);

    const showLoader = (show) => {
        setDisplayLoader(show);
    };

    const handleClose = () => {
        showLoader(false);
    }

    return (
        <LoaderContext.Provider value={{ showLoader }}>
            {children}
            {displayLoader && <Loader {...{ showLoader: displayLoader, handleClose: handleClose }} />}
        </LoaderContext.Provider>
    );
}

export function useLoader() {
    return useContext(LoaderContext);
}
