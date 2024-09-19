import { useState } from "react";

// MUI imports
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

// date picker
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

// components
import { ErrorSnackbar } from "../ErrorSnackbar";
import { useSelector } from "react-redux";
import { Stack } from "@mui/material";

export const style = {
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
    maxHeight: "90vh",
    overflow: "auto",
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
    const [amountDisplay, setAmountDisplay] = useState<String>("");

    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");

    const [openErrorSnackBar, setOpenErrorSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    const [load, setLoad] = useState<boolean>(false);

    const [errorCategory, setErrorCategory] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorAmount, setErrorAmount] = useState(false);

    const handleChange = (event: SelectChangeEvent) => {
        setOpenErrorSnackbar(false);
        setErrorCategory(false);
        setCategory(event.target.value as string);
    };

    const submitAmount = async (e: any) => {
        e.preventDefault();
        if (category !== "" && amount && selectedDate) {
            try {
                const newData = {
                    category: category,
                    amount: amount,
                    user: userDetails._id,
                    ...(note !== "" && { note: note }),
                    date: new Date(selectedDate.toISOString()),
                };
                // console.log("aaaaaaaaaaaah");
                setLoad(true);

                await addFunction(newData);
                refetch && refetch();
                setOpenModal(false);
            } catch (error: any) {
                if (error.message === "Invalid time value") {
                    setOpenErrorSnackbar(true);
                    setSnackbarText("Invalid date.");
                    setErrorDate(true);
                }
            }
        } else {
            setOpenErrorSnackbar(true);
            if (!category) {
                setSnackbarText("Choose a category.");
                setErrorCategory(true);
            }

            if (!selectedDate) {
                setSnackbarText("Please enter the date.");
                setErrorDate(true);
            }
            
            if (amount <= 0) {
                setSnackbarText("Please enter an amount.");
                setErrorAmount(true);
            }
        }
    };

    return (
        <>
            <Modal
                open={true}
                onClose={() => {
                    !load && setOpenModal(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        sx={{ position: "absolute", right: 13, top: 13 }}
                        onClick={() => setOpenModal(false)}
                        disabled={load}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Add {addBalExText}
                    </Typography>
                    <form onSubmit={(e) => submitAmount(e)}>
                        <Stack gap={2}>
                            {addBalExText === "Expense" ? (
                                <FormControl fullWidth error={errorCategory}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={category}
                                        label="Cathegory"
                                        onChange={handleChange}
                                        disabled={load}
                                    >
                                        <MenuItem value={"Transportation"}>
                                            Transportation
                                        </MenuItem>
                                        <MenuItem value={"Bills"}>
                                            Bills
                                        </MenuItem>
                                        <MenuItem value={"Food"}>Food</MenuItem>
                                        <MenuItem value={"GF"}>GF</MenuItem>
                                        <MenuItem value={"Others"}>
                                            Others
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            ) : (
                                <FormControl fullWidth error={errorCategory}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={category}
                                        label="Cathegory"
                                        onChange={handleChange}
                                        disabled={load}
                                    >
                                        <MenuItem value={"Income"}>
                                            Income
                                        </MenuItem>
                                        <MenuItem value={"Others"}>
                                            Others
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            )}

                            <TextField
                                label="Note (optional)"
                                fullWidth
                                multiline
                                rows={4}
                                value={note}
                                disabled={load}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                }}
                            />

                            <Stack>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DemoContainer
                                        components={["DatePicker"]}
                                        sx={{ mt: -1 }}
                                    >
                                        <DatePicker
                                            label="Basic date picker"
                                            value={selectedDate}
                                            // error={true}
                                            onChange={(newValue) => {
                                                setSelectedDate(newValue);
                                                setErrorDate(false);
                                                setOpenErrorSnackbar(false);
                                            }}
                                            slotProps={{
                                                textField: {
                                                    error: errorDate,
                                                },
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Stack>

                            <TextField
                                label="Enter the Amount"
                                fullWidth
                                error={errorAmount}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            Php
                                        </InputAdornment>
                                    ),
                                }}
                                value={amountDisplay}
                                disabled={load}
                                onChange={(e) => {
                                    setOpenErrorSnackbar(false);
                                    setErrorAmount(false);
                                    let value: any = e.target.value;
                                    if (value === "") {
                                        setAmount(0);
                                        setAmountDisplay("");
                                    } else {
                                        const parsedValue = parseFloat(value);
                                        // Check if the parsed value is a valid number
                                        if (!isNaN(parsedValue)) {
                                            setAmount(parsedValue);
                                            setAmountDisplay(value);
                                            if (
                                                parsedValue % 1 !== 0 ||
                                                value % 1 !== 0
                                            ) {
                                                setAmountDisplay(
                                                    parsedValue.toString()
                                                );
                                            }
                                        }
                                    }
                                }}
                            />
                            <LoadingButton
                                fullWidth
                                variant="contained"
                                type="submit"
                                loading={load}
                            >
                                Save
                            </LoadingButton>
                        </Stack>
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
