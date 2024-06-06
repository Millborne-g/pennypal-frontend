import React, { useState, useEffect } from "react"

import { useGetAllUserQuery, useFindUserByEmailQuery, useRegisterUserMutation } from "../reducers/api/userAPI";

// hooks
import { setUser } from "../reducers/userSlice";

// redux
import { useDispatch } from "react-redux";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

// for stacbar 
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

// error message
interface ErrorMessage {
    data?: {
      code?: Number;
    };
  }

export const useUser = ({email = ""}: {email?: string} = {}) => {
    // for stackbar
    const [stackText, setStackText] = useState("");
    const [openSuccessStack, setOpenSuccessStack] = useState(false);
    const [stackSeverity, setStackSeverity] = useState<AlertColor | undefined>(
        "success"
    );
    const handleSuccessStackClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSuccessStack(false);
    };

    const {
        data: allUsers,
        isError: allUsersError,
        isLoading: allUsersLoading,
        isFetching: allUsersFetching,
        isSuccess: allUsersSuccess,
    } = useGetAllUserQuery();

    // const {
    //     data: findUser,
    //     isError: findUserError,
    //     isLoading: findUserLoading,
    //     isFetching: findUserFetching,
    //     isSuccess: findUserSuccess
    //   }: {
    //     data?: string;
    //     isError?: boolean;
    //     isLoading?: boolean;
    //     isFetching?: boolean;
    //     isSuccess?: boolean;
    //   } = email.trim() !== '' ? useFindUserByEmailQuery(email) : {};

    const {
        data: findUser,
        isError: findUserError,
        isLoading: findUserLoading,
        isFetching: findUserFetching,
        isSuccess: findUserSuccess,
    }: {
        data?: {
            email: string;
            password: string;
        };
        isError?: boolean;
        isLoading?: boolean;
        isFetching?: boolean;
        isSuccess?: boolean;
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

    // query
    const successQuery = allUsersSuccess || findUserSuccess;
    const errorQuery = allUsersError || findUserError;
    const loadingQuery = allUsersLoading || findUserLoading;
    const fetchingQuery = allUsersFetching || findUserFetching;

    // mutation
    const registerUserSuccessMutation = registerUserSuccess;

    const registerUserLoadingMutation = registerUserLoading;

    // query
    useEffect(() => {
        let message = "";
        if (findUserError) {
            console.log("eyyyyy");

            message = "User doesn't exist!";
            setStackSeverity("error");
            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [findUserError, findUserLoading]);

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

    return {
        allUsers,
        registerUser,
        registerUserSuccessMutation,
        registerUserLoadingMutation,
        registerUserErrorMessage,
        findUser,
        findUserLoading,
        findUserSuccess,
        findUserError,
        successQuery,
        errorQuery,
        loadingQuery,
        fetchingQuery,
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
}
