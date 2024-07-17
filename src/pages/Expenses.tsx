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
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
} from "@mui/material";

interface ExpenseRow {
    id: number | string;
    category: string;
    amount: number;
    date: string;
}

export const Expenses = () => {
    const userDetails = useSelector((state: any) => state.user.user);

    const {
        usersExpenses,
        loadingQuery,
        successQuery,
        fetchingQuery,
        expensesSuccessMutation,
        expensesLoadingMutation,
        addExpense,
        deleteExpense,
        refetchUsersExpenses,
        SnackbarComponent,
    } = useExpenses({
        userId: userDetails._id,
    });

    const [rows, setRows] = useState<ExpenseRow[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    const [currentYear, setCurrentYear] = useState("");

    const [yearList, setYearList] = useState<number[]>([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    // const [currentMonth, setCurrentMonth] = useState(0);

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
                            refetchUsersExpenses();
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const handleChange = (event: SelectChangeEvent) => {
        setCurrentYear(event.target.value);
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
        if (windowWidth < 1100) {
            dispatch(openSidebar(false));
        } else if (windowWidth > 1100) {
            dispatch(openSidebar(true));
        }
    }, [windowWidth]);

    const setData = () => {
        if (successQuery) {
            if (usersExpenses) {
                if (currentYear === "") {
                    const thisYear = new Date().getFullYear();
                    setCurrentYear(thisYear.toString());
                }
                // const thisMonth = new Date().getMonth();
                // setCurrentMonth(thisMonth);
                setRows([]);
                setYearList([]);
                setTotalExpenses(0);

                // Extract unique years from allExpenses
                let uniqueYearsExpenses = [
                    ...new Set(
                        usersExpenses.map((item: any) =>
                            new Date(item.date).getFullYear()
                        )
                    ),
                ];

                // Combine unique years from both allIncome and allExpenses
                let allUniqueYearsSet = new Set([...uniqueYearsExpenses]);

                // Add the current year to the set if it doesn't exist
                if (!allUniqueYearsSet.has(parseInt(currentYear))) {
                    allUniqueYearsSet.add(parseInt(currentYear));
                }

                // Convert the set back to an array
                let allUniqueYears: any = Array.from(allUniqueYearsSet);

                setYearList(allUniqueYears);
                for (let i = 0; i < months.length; i++) {
                    let totalExpensesPerMonth = 0;
                    for (let x = 0; x < usersExpenses.length; x++) {
                        let dateString = usersExpenses[x].date;
                        let dateObject = new Date(dateString);

                        // Get the year and month
                        let year = dateObject.getFullYear();
                        let month = dateObject.toLocaleString("en-US", {
                            month: "long",
                        });
                        if (currentYear === year.toString()) {
                            if (months[i] === month) {
                                totalExpensesPerMonth += usersExpenses[x]
                                    .amount as number;
                                const date = new Date(usersExpenses[x].date);
                                const year = date.getFullYear();
                                const month = String(
                                    date.getMonth() + 1
                                ).padStart(2, "0");
                                const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                );
                                const hours = String(
                                    date.getHours() % 12 || 12
                                ).padStart(2, "0");
                                const minutes = String(
                                    date.getMinutes()
                                ).padStart(2, "0");
                                const ampm =
                                    date.getHours() >= 12 ? "PM" : "AM";
                                setTotalExpenses(
                                    (prevAmount) =>
                                        prevAmount + usersExpenses[x].amount
                                );
                                let newData = {
                                    id: usersExpenses[x]._id,
                                    category: usersExpenses[x].category,
                                    date: `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`,
                                    amount: usersExpenses[x].amount,
                                };
                                setRows((prevDataset) => [
                                    ...prevDataset,
                                    newData,
                                ]);
                            }
                        }
                    }

                    // const newData = {
                    //     income: totalIncomePerMonth,
                    //     expenses: totalExpensesPerMonth,
                    //     month: months[i],
                    // };

                    // setDataset((prevDataset) => [...prevDataset, newData]);
                }
            }
        }
    };

    useEffect(() => {
        if (loadingQuery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [loadingQuery]);

    useEffect(() => {
        if (!fetchingQuery) {
            setData();
        }
    }, [fetchingQuery, successQuery, expensesSuccessMutation, currentYear]);

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
                        <Box>
                            <FormControl fullWidth>
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={currentYear}
                                    label="Year"
                                    onChange={handleChange}
                                    sx={{
                                        bgcolor: "#FFF",
                                    }}
                                >
                                    {yearList.map((year) => (
                                        <MenuItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </SpacedContainer>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: "15px 0",
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
                    refetch={refetchUsersExpenses}
                />
            )}

            {/* Snackbar */}
            {SnackbarComponent}

            {/* Loading */}
            {(loadingQuery || expensesLoadingMutation) && <Loading />}
        </>
    );
};
