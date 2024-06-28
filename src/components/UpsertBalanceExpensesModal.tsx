import { useState } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

// components
import { ErrorSnackbar } from "../components/ErrorSnackbar";
import { useSelector } from "react-redux";

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

export const UpsertBalanceExpensesModal = ({
    setOpenModal,
    addBalExText,
    addFunction,
    refetch,
}: {
    setOpenModal: any;
    addBalExText: string;
    addFunction: any;
    refetch?: any;
}) => {
    // const { addExpense, expensesSuccessMutation } = useExpenses();
    // const { allBalance, balanceLoading, balanceSuccess } = useBalance();

    const userDetails = useSelector((state: any) => state.user.user);

    const [amount, setAmount] = useState<number>(0);

    const [category, setCategory] = useState("");

    const [openErrorSnackBar, setOpenErrorSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const submitAmount = async (e: any) => {
        e.preventDefault();
        if (category !== "" && amount) {
            const newData = {
                category: category,
                amount: amount,
                user: userDetails._id,
            };
            // console.log("aaaaaaaaaaaah");

            await addFunction(newData);
            refetch && refetch();
            setOpenModal(false);
        } else {
            setOpenErrorSnackbar(true);
            if (amount <= 0) {
                setSnackbarText("Please enter an amount.");
            } else if (!category) {
                setSnackbarText("Choose a category.");
            }
        }
    };

    return (
        <>
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
                        Add {addBalExText}
                    </Typography>
                    <form onSubmit={(e) => submitAmount(e)}>
                        {addBalExText === "Expense" ? (
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Cathegory"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Transportation"}>
                                        Transportation
                                    </MenuItem>
                                    <MenuItem value={"Bills"}>Bills</MenuItem>
                                    <MenuItem value={"Food"}>Food</MenuItem>
                                    <MenuItem value={"GF"}>GF</MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Cathegory"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"Income"}>Income</MenuItem>
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            label="Enter the Amount"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        Php
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                            value={amount}
                            onChange={(e) => {
                                let value = e.target.value;
                                if (value === "") {
                                    setAmount(0);
                                } else {
                                    const parsedValue = parseInt(value, 10);
                                    // Check if the parsed value is a valid integer
                                    if (Number.isInteger(parsedValue)) {
                                        setAmount(parsedValue);
                                    }
                                }
                            }}
                        />
                        <Button fullWidth variant="contained" type="submit">
                            Save
                        </Button>
                    </form>
                </Box>
            </Modal>

            <ErrorSnackbar
                openErrorSnackBar={openErrorSnackBar}
                text={snackbarText}
            />
        </>
    );
};
