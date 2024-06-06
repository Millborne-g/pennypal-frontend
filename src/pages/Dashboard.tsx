import { useState, useEffect } from "react";

interface exbalDataType {
    income: number;
    expenses: number;
    month: string;
    [key: string]: string | number | Date;
}

// MUI
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import { BarChart } from "@mui/x-charts/BarChart";
import WalletIcon from "@mui/icons-material/Wallet";
import PaidIcon from "@mui/icons-material/Paid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SavingsIcon from "@mui/icons-material/Savings";
import AddIcon from "@mui/icons-material/Add";

// Components
import { UpsertBalanceExpensesModal } from "../components/UpsertBalanceExpensesModal";
import { SpacedContainer } from "../components/containers/SpacedContainer";
import { Loading } from "../components/Loading";
import PageContainer from "../components/containers/PageContainer";

// redux
import { useDispatch, useSelector } from "react-redux";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// hooks
import { useExpenses } from "../redux/hooks/use-expenses";
import { useIncome } from "../redux/hooks/use-income";

const valueFormatter = (value: number) => {
    const formattedValue = value.toLocaleString();
    return `${formattedValue}php`;
};

export const Dashboard = () => {
    const userDetails = useSelector((state: any) => state.user.user);
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

    // const { allExpenses, allExpensesFetching, allExpensesLoading, allExpensesSuccess, addExpense, expensesLoadingMutation, SnackbarComponent: expensesSnackbar} = useExpenses();
    const {
        // allExpenses,
        usersExpenses,
        refetchUsersExpenses,
        successQuery: expensesSuccessQuery,
        loadingQuery: expensesLoadingQuery,
        fetchingQuery: expensesFetchingQuery,
        addExpense,
        expensesLoadingMutation,
        SnackbarComponent: expensesSnackbar,
    } = useExpenses({
        userId: userDetails._id,
    });

    const {
        // allIncome,
        usersIncomes,
        refetchUsersIncomes,
        successQuery: incomeSuccessQuery,
        loadingQuery: incomeLoadingQuery,
        fetchingQuery: incomeFetchingQuery,
        addIncome,
        incomeLoadingMutation,
        SnackbarComponent: incomeSnackbar,
    } = useIncome({
        userId: userDetails._id.toString(),
    });

    const [dataset, setDataset] = useState<exbalDataType[]>([
        {
            income: 0,
            expenses: 0,
            month: "",
        },
    ]);

    const [datasetMonthly, setDatasetMonthly] = useState<exbalDataType[]>([
        {
            income: 0,
            expenses: 0,
            month: "",
        },
    ]);

    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const theme = useTheme();
    const dispatch = useDispatch();

    const [openModal, setOpenModel] = useState(false);
    const [addBalExText, setAddBalExText] = useState("");
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

    const [currentMonth, setCurrentMonth] = useState(0);
    const [currentYear, setCurrentYear] = useState("");
    const [yearList, setYearList] = useState<number[]>([]);

    const handleChange = (event: SelectChangeEvent) => {
        setCurrentYear(event.target.value);
    };

    const setData = () => {
        if (expensesSuccessQuery && incomeSuccessQuery) {
            if (usersExpenses && usersIncomes) {
                if (currentYear === "") {
                    const thisYear = new Date().getFullYear();
                    setCurrentYear(thisYear.toString());
                }
                const thisMonth = new Date().getMonth();
                setCurrentMonth(thisMonth);
                setDataset([]);
                setYearList([]);
                setTotalExpenses(0);
                setTotalIncome(0);

                // Extract unique years from allIncome
                let uniqueYearsIncome = [
                    ...new Set(
                        usersIncomes.map((item: any) =>
                            new Date(item.date).getFullYear()
                        )
                    ),
                ];

                // Extract unique years from allExpenses
                let uniqueYearsExpenses = [
                    ...new Set(
                        usersExpenses.map((item: any) =>
                            new Date(item.date).getFullYear()
                        )
                    ),
                ];

                // Combine unique years from both allIncome and allExpenses
                let allUniqueYearsSet = new Set([
                    ...uniqueYearsIncome,
                    ...uniqueYearsExpenses,
                ]);

                // Add the current year to the set if it doesn't exist
                if (!allUniqueYearsSet.has(parseInt(currentYear))) {
                    allUniqueYearsSet.add(parseInt(currentYear));
                }

                // Convert the set back to an array
                let allUniqueYears: any = Array.from(allUniqueYearsSet);

                setYearList(allUniqueYears);
                for (let i = 0; i < months.length; i++) {
                    let totalExpensesPerMonth = 0;
                    let totalIncomePerMonth = 0;
                    for (let x = 0; x < usersExpenses.length; x++) {
                        // if(userDetails._id === usersExpenses[x].user){
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
                                setTotalExpenses((ex: any) => {
                                    return ex + usersExpenses[x].amount;
                                });
                            }
                        }
                        // }
                    }

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
                                setTotalIncome((inc: any) => {
                                    return inc + usersIncomes[x].amount;
                                });
                            }
                        }
                    }

                    const newData = {
                        income: totalIncomePerMonth,
                        expenses: totalExpensesPerMonth,
                        month: months[i],
                    };

                    setDataset((prevDataset) => [...prevDataset, newData]);
                }
            }
        }
    };

    // disable scroll
    useEffect(() => {
        if (expensesLoadingQuery && incomeLoadingQuery) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "visible";
        }
    }, [expensesLoadingQuery, incomeLoadingQuery]);

    // fetch data
    useEffect(() => {
        if (!expensesFetchingQuery || !incomeFetchingQuery) {
            setData();
        }
    }, [expensesFetchingQuery, incomeFetchingQuery, currentYear]);

    useEffect(() => {
        if (dataset) {
            for (let i = 0; i < dataset.length; i++) {
                if (months[currentMonth] === dataset[i].month) {
                    let updatedDataset = [
                        dataset[i],
                        ...datasetMonthly.slice(1),
                    ];
                    setDatasetMonthly(updatedDataset);
                }
            }
        }
    }, [currentMonth, dataset]);

    useEffect(() => {
        if (currentYear !== "") {
            if (!expensesLoadingMutation || !incomeLoadingMutation) {
                const thisYear = new Date().getFullYear();
                setCurrentYear(thisYear.toString());
            }
        }
    }, [expensesLoadingMutation, incomeLoadingMutation]);


    // get the screen size
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (windowWidth < 1100) {
            dispatch(openSidebar(false));
        } else if (windowWidth > 1100) {
            dispatch(openSidebar(true));
        }
    }, [windowWidth]);

    return (
        <>
            <Box>
                <CssBaseline />
                <PageContainer>
                    <SpacedContainer>
                        <Typography fontSize={30} fontWeight={700} gutterBottom>
                            Dashboard
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
                    <Box sx={{ mb: "15px" }}>
                        <Typography>
                            Welcome, {userDetails.firstName}! We're
                            thrilled to have you here.👋
                        </Typography>
                    </Box>
                    <Divider />

                    {/* numbers */}
                    <br />
                    <Box sx={{ mb: 1 }}>
                        <Grid container spacing={1}>
                            {/* Total Income */}
                            <Grid sx={{ width: "100%" }} item md={4} sm={6}>
                                <Box
                                    sx={{
                                        bgcolor: "#FFF",
                                        p: "20px",
                                        borderRadius: "10px",
                                        border: "1px solid #DFDFDF",
                                        transition: "0.2s ease-in-out",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        py: 4,
                                        "&: hover": {
                                            boxShadow:
                                                "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        },
                                    }}
                                    onClick={() => {
                                        setOpenModel(true);
                                        setAddBalExText("Income");
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: "#545454",
                                            }}
                                        >
                                            Total Income
                                        </Typography>
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
                                                {new Intl.NumberFormat(
                                                    "en-PH",
                                                    {
                                                        style: "currency",
                                                        currency: "PHP",
                                                    }
                                                )
                                                    .format(
                                                        Math.floor(totalIncome)
                                                    )
                                                    .replace(/\.00$/, "")}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    bgcolor: "#0066FF",
                                                    borderRadius: "100%",
                                                }}
                                            >
                                                <IconButton size="small">
                                                    <AddIcon
                                                        sx={{
                                                            color: "#FFFFFF",
                                                            fontSize: "15px",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box
                                            sx={{
                                                bgcolor: "#53B16B",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "100%",
                                                height: "60px",
                                                width: "60px",
                                            }}
                                        >
                                            <WalletIcon
                                                sx={{
                                                    fontSize: "35px",
                                                    color: "#ffffff",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Total Expenses */}
                            <Grid sx={{ width: "100%" }} item md={4} sm={6}>
                                <Box
                                    sx={{
                                        bgcolor: "#FFF",
                                        p: "20px",
                                        borderRadius: "10px",
                                        border: "1px solid #DFDFDF",
                                        transition: "0.2s ease-in-out",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        py: 4,
                                        "&: hover": {
                                            boxShadow:
                                                "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        },
                                    }}
                                    onClick={() => {
                                        setOpenModel(true);
                                        setAddBalExText("Expense");
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
                                                {new Intl.NumberFormat(
                                                    "en-PH",
                                                    {
                                                        style: "currency",
                                                        currency: "PHP",
                                                    }
                                                )
                                                    .format(
                                                        Math.floor(
                                                            totalExpenses
                                                        )
                                                    )
                                                    .replace(/\.00$/, "")}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    bgcolor: "#0066FF",
                                                    borderRadius: "100%",
                                                }}
                                            >
                                                <IconButton size="small">
                                                    <AddIcon
                                                        sx={{
                                                            color: "#FFFFFF",
                                                            fontSize: "15px",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box
                                            sx={{
                                                bgcolor: "#FF6668",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "100%",
                                                height: "60px",
                                                width: "60px",
                                            }}
                                        >
                                            <PaidIcon
                                                sx={{
                                                    fontSize: "35px",
                                                    color: "#ffffff",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* Saving */}
                            <Grid sx={{ width: "100%" }} item md={4} sm={12}>
                                <Box
                                    sx={{
                                        bgcolor: "#FFF",
                                        p: "20px",
                                        borderRadius: "10px",
                                        border: "1px solid #DFDFDF",
                                        transition: "0.2s ease-in-out",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        py: 4,
                                        "&: hover": {
                                            boxShadow:
                                                "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        },
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                fontWeight: 400,
                                                color: "#545454",
                                            }}
                                        >
                                            Savings
                                        </Typography>
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
                                                    color:
                                                        totalIncome -
                                                            totalExpenses <
                                                        0
                                                            ? "#FF6668"
                                                            : "",
                                                }}
                                            >
                                                {new Intl.NumberFormat(
                                                    "en-PH",
                                                    {
                                                        style: "currency",
                                                        currency: "PHP",
                                                    }
                                                )
                                                    .format(
                                                        totalIncome -
                                                            totalExpenses
                                                    )
                                                    .replace(/\.00$/, "")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Box
                                            sx={{
                                                bgcolor:
                                                    theme.palette.primary.light,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "100%",
                                                height: "60px",
                                                width: "60px",
                                            }}
                                        >
                                            <SavingsIcon
                                                sx={{
                                                    fontSize: "35px",
                                                    color: "#ffffff",
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Chart */}
                    <Box
                        sx={{
                            bgcolor: "#FFF",
                            p: "20px",
                            borderRadius: "10px",
                            border: "1px solid #DFDFDF",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography fontWeight={600}>
                                Income - Expense
                            </Typography>
                            <Box
                                sx={{
                                    border: "1px solid #DFDFDF",
                                    borderRadius: "5px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <IconButton
                                    disabled={currentMonth === 0}
                                    onClick={() => {
                                        setCurrentMonth(
                                            (prevMon: number) => prevMon - 1
                                        );
                                    }}
                                >
                                    <KeyboardArrowLeftIcon />
                                </IconButton>
                                <Box sx={{ px: 1 }}>{months[currentMonth]}</Box>
                                <IconButton
                                    disabled={currentMonth === 11}
                                    onClick={() => {
                                        setCurrentMonth(
                                            (prevMon: number) => prevMon + 1
                                        );
                                    }}
                                >
                                    <KeyboardArrowRightIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        {dataset && (
                            <BarChart
                                dataset={datasetMonthly}
                                xAxis={[
                                    {
                                        scaleType: "band",
                                        dataKey: "month",
                                    },
                                ]}
                                series={[
                                    {
                                        dataKey: "income",
                                        label: "Income",
                                        valueFormatter,
                                    },
                                    {
                                        dataKey: "expenses",
                                        label: "Expenses",
                                        valueFormatter,
                                    },
                                ]}
                                height={400}
                                sx={{
                                    width: "100%",
                                }}
                                colors={["#53B16B", "#FF6668"]}
                            />
                        )}
                    </Box>
                </PageContainer>
            </Box>

            {/* Modals */}
            {openModal && (
                <UpsertBalanceExpensesModal
                    setOpenModal={setOpenModel}
                    addBalExText={addBalExText}
                    addFunction={
                        addBalExText === "Expense" ? addExpense : addIncome
                    }
                    refetch={
                        addBalExText === "Expense"
                            ? refetchUsersExpenses
                            : refetchUsersIncomes
                    }
                />
            )}

            {/* expenses Snackbar */}
            {expensesSnackbar}

            {/* income Snackbar */}
            {incomeSnackbar}

            {/* Loading */}
            {((expensesLoadingQuery && incomeLoadingQuery) ||
                expensesLoadingMutation ||
                incomeLoadingMutation) && <Loading />}
        </>
    );
};
