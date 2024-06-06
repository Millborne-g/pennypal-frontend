import React, { useState, useEffect } from "react"

import { useGetMessageByConvoQuery, useAddMessageMutation } from "../reducers/api/messagesAPI";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

// for stacbar 
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


export const useMessage = ({senderEmail = "", recipientEmail = "" }: {senderEmail?: string, recipientEmail?: string } = {}) => {

    // for stackbar
    const [stackText, setStackText] = useState('');
    const [openSuccessStack, setOpenSuccessStack] = useState(false);
    const [stackSeverity, setStackSeverity] = useState<AlertColor | undefined>('success');
    const handleSuccessStackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        setOpenSuccessStack(false);
    };

    const { 
        data: usersMessages, 
        isError: usersMessagesError, 
        isLoading: usersMessagesLoading, 
        isFetching: usersMessagesFetching, 
        isSuccess: usersMessagesSuccess,
        refetch: refetchMessages
    } = useGetMessageByConvoQuery(
        {
            senderEmail,
            recipientEmail
        }, 
        {
            skip: senderEmail === '' || recipientEmail === ''
        }
    );

    const [
        addMessage,
        {
            isError: addMessageError, 
            isLoading: addMessageLoading,  
            isSuccess: addMessageSuccess 
        }]= useAddMessageMutation();

    // query
    const successQuery = usersMessages;
    const errorQuery = usersMessagesError;
    const loadingQuery = usersMessagesLoading;
    const fetchingQuery = usersMessagesFetching;

    // mutation
    const successMutation = addMessageSuccess;

    const loadingMutation = addMessageLoading;
    
    // add mutation
    useEffect(() => {
        if (addMessageSuccess) {
            let message = "Income successfully added!";
            if (addMessageError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity('error');
            }
            
            setStackText(message);
            setOpenSuccessStack(true);
        }

    },[addMessageLoading]);

    return {
        usersMessages,
        successQuery,
        errorQuery,
        loadingQuery,
        fetchingQuery,
        addMessage,
        loadingMutation,
        successMutation,
        refetchMessages,
        SnackbarComponent: ( // Return the Snackbar component as part of the returned object
            <Snackbar open={openSuccessStack} autoHideDuration={3000} onClose={handleSuccessStackClose}>
                <Alert onClose={handleSuccessStackClose} severity={stackSeverity} sx={{ width: '100%' }}>
                    {stackText}
                </Alert>
            </Snackbar>
        ),
    }
}
