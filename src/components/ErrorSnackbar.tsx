import React, {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
export const ErrorSnackbar = ({openErrorSnackBar, text}:{openErrorSnackBar: boolean, text: string}) => {

    const [open, setOpen] = useState(false);
    // const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //     return;
    //     }

    //     setOpen(false);
    // };

    const handleClose = (
    ) => {
        setOpen(false);
    };

    useEffect(() => {
        setOpen(openErrorSnackBar)
    },[openErrorSnackBar])
    return (
        <>
            <Stack spacing={2} sx={{ width: '100%' }}>
                {/* <Button variant="outlined" onClick={handleClick}>
                    Open success snackbar
                </Button> */}
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {text}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    )
}
