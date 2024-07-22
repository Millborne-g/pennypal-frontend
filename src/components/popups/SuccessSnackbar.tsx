import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const SuccessSnackbar = ({
    openSuccessSnackBar,
    text,
    setOpenSuccessSnackbar,
}: {
    openSuccessSnackBar: boolean;
    text: string;
    setOpenSuccessSnackbar: any;
}) => {
    // const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //     return;
    //     }

    //     setOpenSuccessSnackbar(false);
    // };
    const handleClose = () => {
        setOpenSuccessSnackbar(false);
    };
    return (
        <>
            <Stack spacing={2} sx={{ width: "100%" }}>
                {/* <Button variant="outlined" onClick={handleClick}>
                    Open success snackbar
                </Button> */}
                <Snackbar
                    open={openSuccessSnackBar}
                    autoHideDuration={6000}
                    onClose={handleClose}
                >
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {text}
                        {/* Invalid Input! Numbers only, please. */}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
};
