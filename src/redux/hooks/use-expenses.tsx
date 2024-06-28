import React, { useEffect, useState } from "react"
import { useGetAllExpensesQuery, useGetExpensesByUserIdQuery, useAddExpenseMutation, useDeleteExpenseMutation } from "../reducers/api/expensesAPI";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

// for stacbar 
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export const useExpenses = ({userId = ""}: {userId?: string} = {}) => {
    
    // for stackbar
    const [stackText, setStackText] = useState('');
    const [openSuccessStack, setOpenSuccessStack] = useState(false);
    const [stackSeverity, setStackSeverity] = useState<AlertColor | undefined>('success');

    const handleSuccessStackClose = () => {
        setOpenSuccessStack(false);
    };

    const {
        data: allExpenses,
        isError: allExpensesError,
        isLoading: allExpensesLoading,
        isFetching: allExpensesFetching,
        isSuccess: allExpensesSuccess,
        refetch: refetchAllExpenses,
    } = useGetAllExpensesQuery();

    const {
        data: usersExpenses,
        isError: usersExpensesError,
        isLoading: usersExpensesLoading,
        isFetching: usersExpensesFetching,
        isSuccess: usersExpensesSuccess,
        refetch: refetchUsersExpenses,
    } = useGetExpensesByUserIdQuery(userId, {
        skip: userId === "",
    });

    const [
        addExpense,
        {
            isError: addExpensesError, 
            isLoading: addExpensesLoading,  
            isSuccess: addExpensesSuccess 
        }]= useAddExpenseMutation();

    const [
        deleteExpense, 
        {
            isError: deleteExpensesError, 
            isLoading: deleteExpensesLoading,  
            isSuccess: deleteExpensesSuccess 
        }] = useDeleteExpenseMutation();

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

    // mutation
    const expensesSuccessMutation = addExpensesSuccess || deleteExpensesSuccess;
    const expensesLoadingMutation = addExpensesLoading || deleteExpensesLoading;
    const expensesErrorMutation = addExpensesError || deleteExpensesError;
    
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
                setStackSeverity('error');
            }
            
            setStackText(message);
            setOpenSuccessStack(true);
        }
    },[addExpensesLoading])

    // delete mutation 
    useEffect(() => {
    
        if (deleteExpensesSuccess) {
            let message = "Expense successfully deleted!";
            if (deleteExpensesError) {
                message = "Error deleting, try to refresh the page.";
                setStackSeverity('error');
            }
            setStackText(message);
            setOpenSuccessStack(true);
        }
    },[deleteExpensesLoading]);

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
        SnackbarComponent: ( // Return the Snackbar component as part of the returned object
            <Snackbar open={openSuccessStack} autoHideDuration={3000} onClose={handleSuccessStackClose}>
                <Alert onClose={handleSuccessStackClose} severity={stackSeverity} sx={{ width: '100%' }}>
                    {stackText}
                </Alert>
            </Snackbar>
        ),
    }
}
