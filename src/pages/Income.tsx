import { useState, useEffect } from "react";

// MUI
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { DataGrid } from "@mui/x-data-grid";

// redux
import { useDispatch, useSelector } from "react-redux";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// Hooks
import { useIncome } from "../redux/hooks/use-income";

// components
import { UpsertBalanceExpensesModal } from "../components/UpsertBalanceExpensesModal";
import { Loading } from "../components/Loading";
import PageContainer from "../components/containers/PageContainer";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import { SpacedContainer } from "../components/containers/SpacedContainer";

interface IncomeRow {
    id: number | string;
    category: string;
    amount: number;
    date: string;
}

export const Income = () => {
    const userDetails = useSelector((state: any) => state.user.user);

    const {
        usersIncomes,
        loadingQuery,
        successQuery,
        fetchingQuery,
        incomeSuccessMutation,
        incomeLoadingMutation,
        addIncome,
        deleteIncome,
        refetchUsersIncomes,
        SnackbarComponent,
    } = useIncome({
        userId: userDetails._id,
    });

    const [rows, setRows] = useState<IncomeRow[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    const [currentYear, setCurrentYear] = useState("");
    const [totalIncome, setTotalIncome] = useState(0);

    const [yearList, setYearList] = useState<number[]>([]);

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
                            await deleteIncome(params.id);
                            refetchUsersIncomes();
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
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
            if (usersIncomes) {
                if (currentYear === "") {
                    const thisYear = new Date().getFullYear();
                    setCurrentYear(thisYear.toString());
                }
                // const thisMonth = new Date().getMonth();
                // setCurrentMonth(thisMonth);
                setRows([]);
                // setYearList([]);
                setTotalIncome(0);

                // Extract unique years from allExpenses
                let uniqueYearsIncomes = [
                    ...new Set(
                        usersIncomes.map((item: any) =>
                            new Date(item.date).getFullYear()
                        )
                    ),
                ];

                // Combine unique years from both allIncome and allExpenses
                let allUniqueYearsSet = new Set([...uniqueYearsIncomes]);

                // Add the current year to the set if it doesn't exist
                if (!allUniqueYearsSet.has(parseInt(currentYear))) {
                    allUniqueYearsSet.add(parseInt(currentYear));
                }

                // Convert the set back to an array
                let allUniqueYears: any = Array.from(allUniqueYearsSet);
                setYearList(allUniqueYears);
                for (let i = 0; i < months.length; i++) {
                    let totalIncomePerMonth = 0;
                    for (let x = 0; x < usersIncomes.length; x++) {
                        let dateString = usersIncomes[x].date;
                        let dateObject = new Date(dateString);

                        // Get the year and month
                        let year = dateObject.getFullYear();
                        let month = dateObject.toLocaleString("en-US", {
                            month: "long",
                        });
                        if (currentYear === year.toString()) {
                            if (months[i] === month) {
                                totalIncomePerMonth += usersIncomes[x]
                                    .amount as number;
                                const date = new Date(usersIncomes[x].date);
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
                                setTotalIncome(
                                    (prevAmount) =>
                                        prevAmount + usersIncomes[x].amount
                                );
                                let newData = {
                                    id: usersIncomes[x]._id,
                                    category: usersIncomes[x].category,
                                    date: `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`,
                                    amount: usersIncomes[x].amount,
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

    // disable scroll
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
    }, [fetchingQuery, successQuery, incomeSuccessMutation, currentYear]);

    return (
        <>
            <Box>
                <CssBaseline />
                <PageContainer>
                    <SpacedContainer padding={"10px 0"}>
                        <Typography fontSize={30} fontWeight={700} gutterBottom>
                            Income
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
                            <Typography>Total Income</Typography>
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
                                        .format(totalIncome)
                                        .replace(/\.00$/, "")}
                                </Typography>
                            </Box>
                        </Box>
                        <Stack justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={() => setOpenModal(true)}
                            >
                                Add Income
                            </Button>
                        </Stack>
                    </Box>
                    <Box sx={{ height: "500px" }}>
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
                    addBalExText={"Income"}
                    addFunction={addIncome}
                    refetch={refetchUsersIncomes}
                />
            )}

            {/* Snackbar */}
            {SnackbarComponent}

            {/* Loading */}
            {(loadingQuery || incomeLoadingMutation) && <Loading />}
        </>
    );
};
