// MUI imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

// components
import { Button, Stack } from "@mui/material";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
        sm: 390,
        xs: "90%",
    },
    bgcolor: "background.paper",
    // border: '2px solid #000',
    borderRadius: "5px",
    boxShadow: 24,
    p: 4,
};

export const MessagePopup = ({
    closeAction,
    leftBtnText,
    leftBtnAction,
    rightBtnText,
    content,
    load,
}: {
    closeAction: () => void;
    leftBtnText?: string;
    leftBtnAction: () => void;
    rightBtnText?: string;
    content: string;
    load?: boolean;
}) => {
    return (
        <>
            <Modal
                open={true}
                onClose={closeAction}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        sx={{ position: "absolute", right: 13, top: 13 }}
                        onClick={closeAction}
                        disabled={load}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="h2"
                        textAlign={"center"}
                        sx={{ mb: 2 }}
                    >
                        {content}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <LoadingButton
                            fullWidth
                            variant="contained"
                            type="submit"
                            loading={load}
                            onClick={leftBtnAction}
                        >
                            {leftBtnText ? leftBtnText : "Yes"}
                        </LoadingButton>
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={closeAction}
                        >
                            {rightBtnText ? rightBtnText : "No"}
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};
