import { useEffect, useState } from "react";
import { LocalStorage, SessionStorage } from "../../helpers/storage";
import { Box } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const Error = (props, { error }) => {
    const [isShowSignIn, setIsShowSignIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        debugger;
        if(error){
            // Catch azure error here;
            console.log(error?.message);
            let errorMessage = "There is an issue with the application configuration. Please contact administrator for further assistance.";
            setErrorMessage(errorMessage);
        }
        else if(props.message){
            setErrorMessage(props.message);
        }
        else{
            const urlParams = new URLSearchParams(window.location.search); 
            const signIn = urlParams.get('signIn');
            if(signIn && signIn === 'true') 
                setIsShowSignIn(true);
            const errorMessage = urlParams.get('message');
            if(errorMessage) 
                setErrorMessage(errorMessage);
        }
    }, []);

    const clearAllStorageData = () => {
        LocalStorage.removeAll();
        SessionStorage.removeAll();
    }

    const handleSignIn = () => {
        clearAllStorageData();
        setTimeout(() => {
            window.location.href = "/";
        });
    }
    
    return (
        <Box 
            sx={{
                flexDirection:'row',
                display:'flex',
                height:'100%',
                justifyContent:'center',
                alignItems:'center',
            }}
            component="div">
            <Box component="div"> 
                <Box
                    sx={{
                        display:'flex',
                        justifyContent:'center',
                        color:"#024e6f"
                    }}
                >
                    <WarningAmberIcon
                        sx={{
                            fontSize: 40
                        }}
                    />
                </Box>
                <h3 style={{display:'flex',margin:'0px', color:"#024e6f", justifyContent:'center'}}>
                    {errorMessage}
                </h3>
                {isShowSignIn && <h5 style={{display:'flex',margin:'0px', color:"#00b0fc", justifyContent:'center'}}>
                    <a 
                        style={{
                            cursor:'pointer',
                        }}
                        onClick={handleSignIn}
                    >
                            Click here to Sign in
                    </a>
                </h5>}
            </Box>
        </Box>
    );
}

export default Error;