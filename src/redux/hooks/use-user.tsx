import React, { useState, useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    useGetAllUserQuery,
    useFindUserByEmailQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
} from "../reducers/api/userAPI";

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

// error message
interface ErrorMessage {
    data?: {
        code?: Number;
    };
}

export const useUser = ({
    email = "",
}: // password = "",
{ email?: string; password?: string } = {}) => {
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
        data: allUsers,
        isError: allUsersError,
        isLoading: allUsersLoading,
        isFetching: allUsersFetching,
        isSuccess: allUsersSuccess,
        error: allUsersErrorMessage,
    } = useGetAllUserQuery();

    const {
        data: findUser,
        isError: findUserError,
        isLoading: findUserLoading,
        isFetching: findUserFetching,
        isSuccess: findUserSuccess,
        error: findUserErrorMessage,
    }: {
        data?: {
            email: string;
            password: string;
        };
        isError?: boolean;
        isLoading?: boolean;
        isFetching?: boolean;
        isSuccess?: boolean;
        error?: any;
    } = useFindUserByEmailQuery(email, {
        skip: email === "", // Skip the query if email is empty
    });

    const [
        registerUser,
        {
            error: registerUserErrorMessage,
            isError: registerUserError,
            isLoading: registerUserLoading,
            isSuccess: registerUserSuccess,
        },
    ] = useRegisterUserMutation();

    const [
        loginUser,
        {
            error: loginUserErrorMessage,
            isError: loginUserError,
            isLoading: loginUserLoading,
            isSuccess: loginUserSuccess,
        },
    ] = useLoginUserMutation();

    // query
    const successQuery = allUsersSuccess || findUserSuccess;
    const errorQuery = allUsersError || findUserError;
    const loadingQuery = allUsersLoading || findUserLoading;
    const fetchingQuery = allUsersFetching || findUserFetching;
    const errorMessageQuery = allUsersErrorMessage || findUserErrorMessage;

    // mutation
    const successMutation = registerUserSuccess || loginUserSuccess;
    const loadingMutation = registerUserLoading || loginUserLoading;
    const errorMutation = registerUserError || loginUserError;
    const errorMessageMutation =
        registerUserErrorMessage || loginUserErrorMessage;

    // query
    useEffect(() => {
        let message = "";
        if (errorQuery) {
            message = "User(s) do not exist!";
            setStackSeverity("error");
            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [errorQuery, loadingQuery]);

    // add mutation
    useEffect(() => {
        let message = "";
        if (registerUserSuccess) {
            setStackSeverity("success");
            message = "You have been successfully registered!";
            setStackText(message);
            setOpenSuccessStack(true);
        } else if (registerUserError) {
            // if(registerUserErrorMessage.data)
            const { data } = registerUserErrorMessage as ErrorMessage;
            const code = data?.code; // Non-null assertion

            if (code === 11000) {
                message = "Email already exist!";
            } else {
                message = "Error signing up, try to refresh the page.";
            }
            setStackText(message);
            setStackSeverity("error");
            setOpenSuccessStack(true);
        }
    }, [registerUserLoading]);

    // Error mutation
    useEffect(() => {
        if (errorMutation) {
            const fetchBaseQueryError =
                errorMessageMutation as FetchBaseQueryError;
            if (fetchBaseQueryError && fetchBaseQueryError.status === 404) {
                Swal.fire({
                    title: "Server Error",
                    text: "Error user actions! Please contact the dev team.",
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
                    text: "Error fetching users! Please contact the dev team.",
                    icon: "error",
                });
            }
        }
    }, [errorMutation, errorQuery]);

    return {
        allUsers,
        loginUser,
        registerUser,
        findUser,
        successQuery,
        errorQuery,
        loadingQuery,
        fetchingQuery,
        successMutation,
        loadingMutation,
        registerUserErrorMessage,
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
