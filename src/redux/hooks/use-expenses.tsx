import React, { useEffect, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
    useGetAllExpensesQuery,
    useGetExpensesByUserIdQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseByDateRangeMutation,
} from "../reducers/api/expensesAPI";

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

export const useExpenses = ({ userId = "" }: { userId?: string } = {}) => {
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
        data: allExpenses,
        isError: allExpensesError,
        isLoading: allExpensesLoading,
        isFetching: allExpensesFetching,
        isSuccess: allExpensesSuccess,
        error: allExpensesErrorMessage,
        refetch: refetchAllExpenses,
    } = useGetAllExpensesQuery();

    const {
        data: usersExpenses,
        isError: usersExpensesError,
        isLoading: usersExpensesLoading,
        isFetching: usersExpensesFetching,
        isSuccess: usersExpensesSuccess,
        error: usersExpensesErrorMessage,
        refetch: refetchUsersExpenses,
    } = useGetExpensesByUserIdQuery(userId, {
        skip: userId === "",
    });

    const [
        addExpense,
        {
            error: addExpensesErrorMessage,
            isError: addExpensesError,
            isLoading: addExpensesLoading,
            isSuccess: addExpensesSuccess,
        },
    ] = useAddExpenseMutation();

    const [
        deleteExpense,
        {
            error: deleteExpensesErrorMessage,
            isError: deleteExpensesError,
            isLoading: deleteExpensesLoading,
            isSuccess: deleteExpensesSuccess,
        },
    ] = useDeleteExpenseMutation();

    const [
        getExpenseByDateRange,
        {
            error: getExpenseByDateRangeErrorMessage,
            isError: getExpenseByDateRangeError,
            isLoading: getExpenseByDateRangeLoading,
            isSuccess: getExpenseByDateRangeSuccess,
        },
    ] = useGetExpenseByDateRangeMutation();

    // fetch
    // useEffect(() => {

    //     if (allExpensesSuccess) {
    //         dispatch(setExpensesData(allExpenses));

    //     } else if (allExpensesError) {
    //         dispatch(setExpensesData([]));
    //     }
    // }, [allExpenses, allExpensesSuccess, allExpensesError]);

    // query
    const successQuery = allExpensesSuccess || usersExpensesSuccess;
    const errorQuery = allExpensesError || usersExpensesError;
    const loadingQuery = allExpensesLoading || usersExpensesLoading;
    const fetchingQuery = allExpensesFetching || usersExpensesFetching;
    const errorMessageQuery =
        allExpensesErrorMessage || usersExpensesErrorMessage;

    // mutation
    const expensesSuccessMutation =
        addExpensesSuccess ||
        deleteExpensesSuccess ||
        getExpenseByDateRangeSuccess;
    const expensesLoadingMutation =
        addExpensesLoading ||
        deleteExpensesLoading ||
        getExpenseByDateRangeLoading;
    const expensesErrorMutation =
        addExpensesError || deleteExpensesError || getExpenseByDateRangeError;
    const errorMutation =
        addExpensesError || deleteExpensesError || getExpenseByDateRangeError;
    const errorMessageMutation =
        addExpensesErrorMessage ||
        deleteExpensesErrorMessage ||
        getExpenseByDateRangeErrorMessage;

    // mutation
    // useEffect(() => {
    //     let message = "";
    //     // add mutation
    //     if (addExpensesSuccess) {
    //         message = "Expense successfully added!";
    //         setStackSeverity('success');
    //         setStackText(message);
    //         setOpenSuccessStack(true);
    //     }

    //     // delete mutation
    //     if (deleteExpensesSuccess) {
    //         message = "Expense successfully deleted!";
    //         setStackSeverity('success');
    //         setStackText(message);
    //         setOpenSuccessStack(true);
    //     }

    // }, [expensesSuccessMutation, expensesLoadingMutation]);

    // useEffect(() => {
    //     console.log('heeey');
    //     let message = "Error adding, try to refresh the page.";
    //     if (addExpensesError) {
    //         setStackSeverity('error');
    //         setStackText(message);
    //         setOpenSuccessStack(true);
    //     }

    //     if (deleteExpensesError) {
    //         setStackSeverity('error');
    //         setStackText(message);
    //         setOpenSuccessStack(true);
    //     }

    // },[expensesErrorMutation, expensesLoadingMutation])

    useEffect(() => {
        if (addExpensesSuccess) {
            let message = "Expense successfully added!";
            if (addExpensesError) {
                message = "Error adding, try to refresh the page.";
                setStackSeverity("error");
            }

            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [addExpensesLoading]);

    // delete mutation
    useEffect(() => {
        if (deleteExpensesSuccess) {
            let message = "Expense successfully deleted!";
            if (deleteExpensesError) {
                message = "Error deleting, try to refresh the page.";
                setStackSeverity("error");
            }
            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [deleteExpensesLoading]);

    // Error mutation & query
    useEffect(() => {
        if (errorMutation) {
            const fetchBaseQueryError =
                errorMessageMutation as FetchBaseQueryError;
            if (fetchBaseQueryError && fetchBaseQueryError.status === 404) {
                Swal.fire({
                    title: "Server Error",
                    text: "Error expenses actions! Please contact the dev team.",
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
                    text: "Error fetching expenses! Please contact the dev team.",
                    icon: "error",
                });
            }
        }
    }, [errorMutation, errorQuery]);

    return {
        allExpenses,
        refetchAllExpenses,
        usersExpenses,
        refetchUsersExpenses,
        successQuery,
        errorQuery,
        loadingQuery,
        fetchingQuery,
        addExpense,
        deleteExpense,
        expensesSuccessMutation,
        expensesLoadingMutation,
        expensesErrorMutation,
        getExpenseByDateRange,
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
