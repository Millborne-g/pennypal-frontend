import React, { useState, useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    useGetMessageByConvoQuery,
    useAddMessageMutation,
} from "../reducers/api/messagesAPI";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

import Swal from "sweetalert2";

// for stacbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const useMessage = ({
    senderEmail = "",
    recipientEmail = "",
}: { senderEmail?: string; recipientEmail?: string } = {}) => {
    // for stackbar
    const [stackText, setStackText] = useState("");
    const [openSuccessStack, setOpenSuccessStack] = useState(false);
    const [stackSeverity, setStackSeverity] = useState<AlertColor | undefined>(
        "success"
    );
    const handleSuccessStackClose = () => {
        setOpenSuccessStack(false);
    };

    const {
        data: usersMessages,
        isError: usersMessagesError,
        isLoading: usersMessagesLoading,
        isFetching: usersMessagesFetching,
        isSuccess: usersMessagesSuccess,
        error: usersMessagesErrorMessage,
        refetch: refetchMessages,
    } = useGetMessageByConvoQuery(
        {
            senderEmail,
            recipientEmail,
        },
        {
            skip: senderEmail === "" || recipientEmail === "",
        }
    );

    const [
        addMessage,
        {
            error: addMessageErrorMessage,
            isError: addMessageError,
            isLoading: addMessageLoading,
            isSuccess: addMessageSuccess,
        },
    ] = useAddMessageMutation();

    // query
    const successQuery = usersMessagesSuccess;
    const errorQuery = usersMessagesError;
    const loadingQuery = usersMessagesLoading;
    const fetchingQuery = usersMessagesFetching;
    const errorMessageQuery = usersMessagesErrorMessage;

    // mutation
    const successMutation = addMessageSuccess;
    const loadingMutation = addMessageLoading;
    const errorMutation = addMessageError;
    const errorMessageMutation = addMessageErrorMessage;

    // add mutation
    useEffect(() => {
        if (addMessageSuccess) {
            let message = "Income successfully added!";
            if (addMessageError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity("error");
            }

            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [addMessageLoading]);

    // Error mutation & query
    useEffect(() => {
        if (errorMutation) {
            const fetchBaseQueryError =
                errorMessageMutation as FetchBaseQueryError;
            if (fetchBaseQueryError && fetchBaseQueryError.status === 404) {
                Swal.fire({
                    title: "Server Error",
                    text: "Error message actions! Please contact the dev team.",
                    icon: "error",
                });
            }
        }

        if (errorQuery) {
            const fetchBaseQueryError =
                errorMessageQuery as FetchBaseQueryError;
            if (fetchBaseQueryError?.status === "PARSING_ERROR") {
                Swal.fire({
                    title: "Server Error",
                    text: "Server error fetching messages! Please contact the dev team.",
                    icon: "error",
                });
            }
        }
    }, [errorMutation, errorQuery]);

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
        // Return the Snackbar component as part of the returned object
        SnackbarComponent: (
            <Snackbar
                open={openSuccessStack}
                autoHideDuration={3000}
                onClose={handleSuccessStackClose}
            >
                <Alert
                    onClose={handleSuccessStackClose}
                    severity={stackSeverity}
                    sx={{ width: "100%" }}
                >
                    {stackText}
                </Alert>
            </Snackbar>
        ),
    };
};
