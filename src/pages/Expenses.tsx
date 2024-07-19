import { useState, useEffect } from "react";

// MUI imports
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

// redux
import { useDispatch, useSelector } from "react-redux";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// Hooks
import { useExpenses } from "../redux/hooks/use-expenses";

// components
import { UpsertBalanceExpensesModal } from "../components/UpsertBalanceExpensesModal";
import { Loading } from "../components/Loading";
import { SpacedContainer } from "../components/containers/SpacedContainer";
import PageContainer from "../components/containers/PageContainer";

// Date Range
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

interface ExpenseRow {
    id: number | string;
    category: string;
    amount: number;
    date: string;
}

export const Expenses = () => {
    const userDetails = useSelector((state: any) => state.user.user);

    const [dateRange, setDateRange] = useState<[Date, Date] | null>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [usersExpensesData, setUsersExpensesData] = useState<any[] | null>(
        null
    );

    const {
        loadingQuery,
        successQuery,
        expensesLoadingMutation,
        addExpense,
        deleteExpense,
        expensesByDateRange,
        refetchExpensesByDateRange,
        SnackbarComponent,
    } = useExpenses({
        userId: userDetails._id,
        startDate,
        endDate,
    });

    const [rows, setRows] = useState<ExpenseRow[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);

    const columns = [
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            editable: false,
        },
        {
            field: "amount",
            headerName: "Amount",
            type: "number",
            flex: 1,
            justifyContent: "flex-start",
            editable: false,
            renderCell: (params: any) => (
                <span style={{ textAlign: "start", paddingLeft: "16px" }}>
                    ₱ {params.value.toLocaleString()}
                </span>
            ),
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            editable: false,
        },
        {
            field: "actions",
            flex: 1,
            headerName: "Actions",
            renderCell: (params: any) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <IconButton
                        onClick={async () => {
                            await deleteExpense(params.id);
                            refetchExpensesByDateRange();
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    // const handleChange = (event: SelectChangeEvent) => {
    //     setCurrentYear(event.target.value);
    // };

    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getStartDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();

        return `${year}-01-01`;
    };

    const convertDate = (date: Date) => {
        const dateTemp = new Date(date);
        const year = dateTemp.getFullYear();
        const month = (dateTemp.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
        const day = dateTemp.getDate().toString().padStart(2, "0");

        // Format the date as YYYY-MM-DD
        return `${year}-${month}-${day}`;
    };

    const refreshAll = async () => {
        await refetchExpensesByDateRange();
        setStartDate(getStartDate());
        setEndDate(getCurrentDate());
        setDateRange([new Date(getStartDate()), new Date(getCurrentDate())]);
    };

    const setData = () => {
        if (successQuery) {
            if (usersExpensesData) {
                setRows([]);
                setTotalExpenses(0);

                for (let x = 0; x < usersExpensesData.length; x++) {
                    let totalExpensesPerMonth = 0;
                    totalExpensesPerMonth += usersExpensesData[x]
                        .amount as number;
                    const date = new Date(usersExpensesData[x].date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hours = String(date.getHours() % 12 || 12).padStart(
                        2,
                        "0"
                    );
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    const ampm = date.getHours() >= 12 ? "PM" : "AM";
                    setTotalExpenses(
                        (prevAmount) => prevAmount + usersExpensesData[x].amount
                    );
                    let newData = {
                        id: usersExpensesData[x]._id,
                        category: usersExpensesData[x].category,
                        date: `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`,
                        amount: usersExpensesData[x].amount,
                    };
                    setRows((prevDataset) => [...prevDataset, newData]);
                }
            }
        }
    };

    // get the screen size
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Attach the event listener
        window.addEventListener("resize", handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); // Empty dependency array means this effect runs once after the initial render

    useEffect(() => {
        setStartDate(getStartDate());
        setEndDate(getCurrentDate());
        setDateRange([new Date(getStartDate()), new Date(getCurrentDate())]);
    }, []);

    useEffect(() => {
        if (expensesByDateRange) {
            setUsersExpensesData(expensesByDateRange);
        }
    }, [expensesByDateRange]);

    useEffect(() => {
        if (windowWidth < 1100) {
            dispatch(openSidebar(false));
        } else if (windowWidth > 1100) {
            dispatch(openSidebar(true));
        }
    }, [windowWidth]);

    useEffect(() => {
        if (loadingQuery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [loadingQuery]);

    useEffect(() => {
        if (usersExpensesData) {
            setData();
            setLoading(false);
        }
    }, [usersExpensesData, dateRange]);

    return (
        <>
            <Box>
                <CssBaseline />
                <PageContainer>
                    <SpacedContainer padding={"10px 0"}>
                        <Typography fontSize={30} fontWeight={700} gutterBottom>
                            Expenses
                        </Typography>
                        {/* time range */}
                        <Stack
                            sx={{
                                alignItems: {
                                    sm: "flex-end",
                                    xs: "flex-start",
                                },
                            }}
                        >
                            <DateRangePicker
                                showOneCalendar
                                size="lg"
                                format="MMM dd, yyyy"
                                placeholder="Select Date Range"
                                character=" to "
                                style={{
                                    width: "90%",
                                }}
                                value={dateRange}
                                onChange={async (dates) => {
                                    setDateRange(null);
                                    if (dates) {
                                        setStartDate(convertDate(dates[0]));
                                        setEndDate(convertDate(dates[1]));
                                        setDateRange(dates);
                                    } else {
                                        setStartDate(getStartDate());
                                        setEndDate(getCurrentDate());
                                        setDateRange([
                                            new Date(getStartDate()),
                                            new Date(getCurrentDate()),
                                        ]);
                                    }
                                }}
                            />
                        </Stack>
                    </SpacedContainer>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: "15px 0",
                            flexDirection: {
                                sm: "row",
                                xs: "column"
                            }
                        }}
                    >
                        <Box>
                            <Typography>Total Expenses</Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "35px",
                                        fontWeight: "600",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {new Intl.NumberFormat("en-PH", {
                                        style: "currency",
                                        currency: "PHP",
                                    })
                                        .format(totalExpenses)
                                        .replace(/\.00$/, "")}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={() => setOpenModal(true)}
                            >
                                Add Expense
                            </Button>
                        </Stack>
                    </Box>
                    <Box sx={{ height: "100%" }}>
                        <Box
                            sx={{
                                width: "100%",
                                height: 400,
                                bgcolor: "white",
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5, 10, 20]}
                                // checkboxSelection
                                disableRowSelectionOnClick
                                sx={{
                                    width: "100%",
                                }}
                            />
                        </Box>
                    </Box>
                </PageContainer>
            </Box>
            {openModal && (
                <UpsertBalanceExpensesModal
                    setOpenModal={setOpenModal}
                    addBalExText={"Expense"}
                    addFunction={addExpense}
                    refetch={refreshAll}
                />
            )}

            {/* Snackbar */}
            {SnackbarComponent}

            {/* Loading */}
            {(loading || expensesLoadingMutation) && <Loading />}
        </>
    );
};
