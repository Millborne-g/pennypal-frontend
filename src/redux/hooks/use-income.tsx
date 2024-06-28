import React, { useState, useEffect } from "react"
import { useGetAllIncomeQuery, useGetIncomeByUserIdQuery, useAddIncomeMutation, useDeleteIncomeMutation } from "../reducers/api/incomeAPI";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

// for stacbar 
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


export const useIncome = ({userId = ""}: {userId?: string} = {}) => {

    // for stackbar
    const [stackText, setStackText] = useState('');
    const [openSuccessStack, setOpenSuccessStack] = useState(false);
    const [stackSeverity, setStackSeverity] = useState<AlertColor | undefined>('success');
    const handleSuccessStackClose = () => {
        setOpenSuccessStack(false);
    };

    const {
        data: allIncome,
        isError: allIncomeError,
        isLoading: allIncomeLoading,
        isFetching: allIncomeFetching,
        isSuccess: allIncomeSuccess,
        refetch: refetchAllIncome,
    } = useGetAllIncomeQuery();

    const {
        data: usersIncomes,
        isError: usersIncomesError,
        isLoading: usersIncomesLoading,
        isFetching: usersIncomeFetching,
        isSuccess: usersIncomesSuccess,
        refetch: refetchUsersIncomes,
    } = useGetIncomeByUserIdQuery(userId, {
        skip: userId === "",
    });

    const [
        addIncome,
        {
            isError: addIncomeError, 
            isLoading: addIncomeLoading,  
            isSuccess: addIncomeSuccess 
        }]= useAddIncomeMutation();
    
    const [
        deleteIncome, 
        {
            isError: deleteIncomeError, 
            isLoading: deleteIncomeLoading,  
            isSuccess: deleteIncomeSuccess 
        }] = useDeleteIncomeMutation();



    // query
    const successQuery = allIncomeSuccess || usersIncomesSuccess;
    const errorQuery = allIncomeError || usersIncomesError;
    const loadingQuery = allIncomeLoading || usersIncomesLoading;
    const fetchingQuery = allIncomeFetching || usersIncomeFetching;

    // mutation
    const incomeSuccessMutation = addIncomeSuccess || deleteIncomeSuccess;

    const incomeLoadingMutation = addIncomeLoading || deleteIncomeLoading;
    
    // add mutation
    useEffect(() => {
        if (addIncomeSuccess) {
            let message = "Income successfully added!";
            if (addIncomeError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity('error');
            }
            
            setStackText(message);
            setOpenSuccessStack(true);
        }

    },[addIncomeLoading]);

    // delete mutation
    useEffect(() => {
        if (deleteIncomeSuccess) {
            let message = "Income successfully deleted!";
            if (deleteIncomeError) {
                message = "Error income, try to refresh the page.";
                setStackSeverity('error');
            }
            
            setStackText(message);
            setOpenSuccessStack(true);
        }
    }, [deleteIncomeLoading])

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
        SnackbarComponent: ( // Return the Snackbar component as part of the returned object
            <Snackbar open={openSuccessStack} autoHideDuration={3000} onClose={handleSuccessStackClose}>
                <Alert onClose={handleSuccessStackClose} severity={stackSeverity} sx={{ width: '100%' }}>
                    {stackText}
                </Alert>
            </Snackbar>
        ),
    }
}
