import React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Toaster = (props) => {
    let { type = "s", duration = 6000 } = props;
    const [message, setMessage] = useState(props.message);

    const handleClose = () => {
        props.handleClose();
    };
    const getType = (type) => {
        let sType = "success";
        switch (type) {
            case "s":
                sType = "success";
                break;
            case "w":
                sType = "warning";
                break;
            case "e":
                sType = "error";
                break;
            case "i":
                sType = "info";
                break;
            default:
                break;
        }
        return sType;
    }
    return (
        message && <Stack spacing={2}>
            <Snackbar
                open
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                autoHideDuration={duration}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity={getType(type)} sx={{ width: '100%',
                 padding:'2px 10px'
            }}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
