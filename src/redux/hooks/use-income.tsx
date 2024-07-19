import React, { useState, useEffect } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    useGetAllIncomeQuery,
    useGetIncomeByUserIdQuery,
    useAddIncomeMutation,
    useDeleteIncomeMutation,
    useGetIncomeByDateRangeQuery,
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

export const useIncome = ({
    userId = "",
    startDate = "",
    endDate = "",
}: { userId?: string; startDate?: string; endDate?: string } = {}) => {
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

    const {
        data: incomeByDateRange,
        isError: incomeByDateRangeError,
        isLoading: incomeByDateRangeLoading,
        isFetching: incomeByDateRangeFetching,
        isSuccess: incomeByDateRangeSuccess,
        error: incomeByDateRangeErrorMessage,
        refetch: refetchIncomeByDateRange,
    } = useGetIncomeByDateRangeQuery(
        {
            userId,
            startDate,
            endDate,
        },
        {
            skip: startDate === "" && endDate === "",
        }
    );

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

    // query
    const successQuery =
        allIncomeSuccess || usersIncomesSuccess || incomeByDateRangeSuccess;
    const errorQuery =
        allIncomeError || usersIncomesError || incomeByDateRangeError;
    const loadingQuery =
        allIncomeLoading || usersIncomesLoading || incomeByDateRangeLoading;
    const fetchingQuery =
        allIncomeFetching || usersIncomeFetching || incomeByDateRangeFetching;
    const errorMessageQuery =
        allIncomeErrorMessage ||
        usersIncomesErrorMessage ||
        incomeByDateRangeErrorMessage;

    // mutation
    const incomeSuccessMutation = addIncomeSuccess || deleteIncomeSuccess;
    const incomeLoadingMutation = addIncomeLoading || deleteIncomeLoading;
    const errorMutation = addIncomeError || deleteIncomeError;
    const errorMessageMutation =
        addIncomeErrorMessage || deleteIncomeErrorMessage;

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
        incomeByDateRange,
        refetchIncomeByDateRange,
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
