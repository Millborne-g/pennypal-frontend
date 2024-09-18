import { Box, Modal, IconButton, Typography, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { style } from "./UpsertBalanceExpensesModal";

export const NotePopup = ({
    note,
    setOpenModal,
}: {
    note?: string;
    setOpenModal?: any;
}) => {
    return (
        <Modal
            open={true}
            onClose={() => {
                setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    sx={{ position: "absolute", right: 13, top: 13 }}
                    onClick={() => setOpenModal(false)}
                >
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Note
                </Typography>
                <Box>
                    <TextField
                        label="Note"
                        fullWidth
                        multiline
                        rows={5}
                        sx={{ mb: 3 }}
                        value={note}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
            </Box>
        </Modal>
    );
};
