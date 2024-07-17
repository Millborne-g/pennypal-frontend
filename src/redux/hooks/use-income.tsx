import React, { useState, useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    useGetAllIncomeQuery,
    useGetIncomeByUserIdQuery,
    useAddIncomeMutation,
    useDeleteIncomeMutation,
    useGetIncomeByDateRangeMutation,
} from "../reducers/api/incomeAPI";

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

export const useIncome = ({ userId = "" }: { userId?: string } = {}) => {
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
        data: allIncome,
        isError: allIncomeError,
        isLoading: allIncomeLoading,
        isFetching: allIncomeFetching,
        isSuccess: allIncomeSuccess,
        error: allIncomeErrorMessage,
        refetch: refetchAllIncome,
    } = useGetAllIncomeQuery();

    const {
        data: usersIncomes,
        isError: usersIncomesError,
        isLoading: usersIncomesLoading,
        isFetching: usersIncomeFetching,
        isSuccess: usersIncomesSuccess,
        error: usersIncomesErrorMessage,
        refetch: refetchUsersIncomes,
    } = useGetIncomeByUserIdQuery(userId, {
        skip: userId === "",
    });

    const [
        addIncome,
        {
            error: addIncomeErrorMessage,
            isError: addIncomeError,
            isLoading: addIncomeLoading,
            isSuccess: addIncomeSuccess,
        },
    ] = useAddIncomeMutation();

    const [
        deleteIncome,
        {
            error: deleteIncomeErrorMessage,
            isError: deleteIncomeError,
            isLoading: deleteIncomeLoading,
            isSuccess: deleteIncomeSuccess,
        },
    ] = useDeleteIncomeMutation();

    const [
        getIncomeByDateRange,
        {
            error: getIncomeByDateRangeErrorMessage,
            isError: getIncomeByDateRangeError,
            isLoading: getIncomeByDateRangeLoading,
            isSuccess: getIncomeByDateRangeSuccess,
        },
    ] = useGetIncomeByDateRangeMutation();

    // query
    const successQuery = allIncomeSuccess || usersIncomesSuccess;
    const errorQuery = allIncomeError || usersIncomesError;
    const loadingQuery = allIncomeLoading || usersIncomesLoading;
    const fetchingQuery = allIncomeFetching || usersIncomeFetching;
    const errorMessageQuery = allIncomeErrorMessage || usersIncomesErrorMessage;

    // mutation
    const incomeSuccessMutation =
        addIncomeSuccess || deleteIncomeSuccess || getIncomeByDateRangeSuccess;
    const incomeLoadingMutation =
        addIncomeLoading || deleteIncomeLoading || getIncomeByDateRangeLoading;
    const errorMutation =
        addIncomeError || deleteIncomeError || getIncomeByDateRangeError;
    const errorMessageMutation =
        addIncomeErrorMessage ||
        deleteIncomeErrorMessage ||
        getIncomeByDateRangeErrorMessage;

    // add mutation
    useEffect(() => {
        if (addIncomeSuccess) {
            let message = "Income successfully added!";
            if (addIncomeError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity("error");
            }

            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [addIncomeLoading]);

    // delete mutation
    useEffect(() => {
        if (deleteIncomeSuccess) {
            let message = "Income successfully deleted!";
            if (deleteIncomeError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity("error");
            }

            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [deleteIncomeLoading]);

    // Error mutation & query
    useEffect(() => {
        if (errorMutation) {
            const fetchBaseQueryError =
                errorMessageMutation as FetchBaseQueryError;
            if (fetchBaseQueryError && fetchBaseQueryError.status === 404) {
                Swal.fire({
                    title: "Server Error",
                    text: "Error income actions! Please contact the dev team.",
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
                    text: "Error fetching income! Please contact the dev team.",
                    icon: "error",
                });
            }
        }
    }, [errorMutation, errorQuery]);

    return {
        allIncome,
        refetchAllIncome,
        usersIncomes,
        refetchUsersIncomes,
        successQuery,
        errorQuery,
        loadingQuery,
        fetchingQuery,
        addIncome,
        deleteIncome,
        incomeLoadingMutation,
        incomeSuccessMutation,
        getIncomeByDateRange,
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
