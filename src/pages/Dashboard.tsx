import { useState, useEffect } from "react";

export interface exbalDataType {
    income: number;
    expenses: number;
    month: string;
    [key: string]: string | number | Date;
}

// MUI
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
// import { BarChart } from "@mui/x-charts/BarChart";
import WalletIcon from "@mui/icons-material/Wallet";
import PaidIcon from "@mui/icons-material/Paid";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
// import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SavingsIcon from "@mui/icons-material/Savings";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/material";

// Components
import { UpsertBalanceExpensesModal } from "../components/popups/UpsertBalanceExpensesModal";
import { SpacedContainer } from "../components/containers/SpacedContainer";
import { Loading } from "../components/Loading";
import PageContainer from "../components/containers/PageContainer";

import { LineChart } from "../components/charts/LineChart";

// redux
import { useDispatch, useSelector } from "react-redux";

// sidebarSlice
import { openSidebar } from "../redux/reducers/sidebarSlice";

// hooks
import { useExpenses } from "../redux/hooks/use-expenses";
import { useIncome } from "../redux/hooks/use-income";

// Date Range
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

// const valueFormatter = (value: number) => {
//     const formattedValue = value.toLocaleString();
//     return `${formattedValue}php`;
// };

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

    const [dateRange, setDateRange] = useState<[Date, Date] | null>();
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const {
        successQuery: expensesSuccessQuery,
        loadingQuery: expensesLoadingQuery,
        addExpense,
        expensesLoadingMutation,
        expensesByDateRange,
        refetchExpensesByDateRange,
        SnackbarComponent: expensesSnackbar,
    } = useExpenses({
        userId: userDetails._id,
        startDate,
        endDate,
    });

    const {
        successQuery: incomeSuccessQuery,
        loadingQuery: incomeLoadingQuery,
        addIncome,
        incomeLoadingMutation,
        incomeByDateRange,
        refetchIncomeByDateRange,
        SnackbarComponent: incomeSnackbar,
    } = useIncome({
        userId: userDetails._id,
        startDate,
        endDate,
    });

    const [datasetMonthlyList, setDatasettMonthlyList] = useState<
        exbalDataType[]
    >([
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
    // const [currentYear, setCurrentYear] = useState("");
    // const [yearList, setYearList] = useState<number[]>([]);

    const [usersExpensesData, setUsersExpensesData] = useState<any[] | null>(
        null
    );
    const [usersIncomesData, setUsersIncomesData] = useState<any[] | null>(
        null
    );

    const [loading, setLoading] = useState<boolean>(true);

    const setData = () => {
        if (expensesSuccessQuery && incomeSuccessQuery) {
            if (usersExpensesData && usersIncomesData) {
                const thisMonth = new Date().getMonth();
                setCurrentMonth(thisMonth);
                setDatasettMonthlyList([]);
                setTotalExpenses(0);
                setTotalIncome(0);

                for (let i = 0; i < months.length; i++) {
                    let totalExpensesPerMonth = 0;
                    let totalIncomePerMonth = 0;
                    for (let x = 0; x < usersExpensesData.length; x++) {
                        // if(userDetails._id === usersExpenses[x].user){
                        let dateString = usersExpensesData[x].date;
                        let dateObject = new Date(dateString);

                        // Get the year and month
                        // let year = dateObject.getFullYear();
                        let month = dateObject.toLocaleString("en-US", {
                            month: "long",
                        });

                        if (months[i] === month) {
                            totalExpensesPerMonth += usersExpensesData[x]
                                .amount as number;
                            setTotalExpenses((ex: any) => {
                                return ex + usersExpensesData[x].amount;
                            });
                        }
                        // }
                    }
                    for (let x = 0; x < usersIncomesData.length; x++) {
                        let dateString = usersIncomesData[x].date;
                        let dateObject = new Date(dateString);
                        let month = dateObject.toLocaleString("en-US", {
                            month: "long",
                        });

                        if (months[i] === month) {
                            totalIncomePerMonth += usersIncomesData[x]
                                .amount as number;
                            setTotalIncome((inc: any) => {
                                return inc + usersIncomesData[x].amount;
                            });
                        }
                    }

                    const newData = {
                        income: totalIncomePerMonth,
                        expenses: totalExpensesPerMonth,
                        month: months[i],
                    };

                    setDatasettMonthlyList((prevDataset) => [
                        ...prevDataset,
                        newData,
                    ]);
                }
            }
        }
    };

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
        if (addBalExText === "Expense") {
            await refetchExpensesByDateRange();
        } else {
            await refetchIncomeByDateRange();
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

    useEffect(() => {
        setStartDate(getStartDate());
        setEndDate(getCurrentDate());
        setDateRange([new Date(getStartDate()), new Date(getCurrentDate())]);
    }, []);

    useEffect(() => {
        if (expensesByDateRange || incomeByDateRange) {
            setUsersExpensesData(expensesByDateRange);
            setUsersIncomesData(incomeByDateRange);
        }
    }, [expensesByDateRange, incomeByDateRange]);

    // fetch data
    useEffect(() => {
        if (usersExpensesData || usersIncomesData) {
            setData();
            setLoading(false);
        }
    }, [usersExpensesData, usersIncomesData, dateRange]);

    useEffect(() => {
        if (datasetMonthlyList) {
            for (let i = 0; i < datasetMonthlyList.length; i++) {
                if (months[currentMonth] === datasetMonthlyList[i].month) {
                    let updatedDataset = [
                        datasetMonthlyList[i],
                        ...datasetMonthly.slice(1),
                    ];
                    setDatasetMonthly(updatedDataset);
                }
            }
        }
    }, [currentMonth, datasetMonthlyList]);

    // useEffect(() => {
    //     if (currentYear !== "") {
    //         if (!expensesLoadingMutation || !incomeLoadingMutation) {
    //             const thisYear = new Date().getFullYear();
    //             setCurrentYear(thisYear.toString());
    //         }
    //     }
    // }, [expensesLoadingMutation, incomeLoadingMutation]);

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

    useEffect(() => {
        if (expensesByDateRange || incomeByDateRange) {
            refetchExpensesByDateRange();
            refetchIncomeByDateRange();
        }
    }, []);

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
                        <Stack
                            sx={{
                                alignItems: {
                                    sm: "flex-end",
                                    xs: "flex-start",
                                },
                                mb: {
                                    sm: 0,
                                    xs: 1,
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

                                    setLoading(true);
                                }}
                            />
                        </Stack>
                    </SpacedContainer>
                    <Box sx={{ mb: "15px" }}>
                        <Typography>
                            Welcome, {userDetails.firstName}! We're thrilled to
                            have you here.👋
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
                                        setStartDate(getStartDate());
                                        setEndDate(getCurrentDate());
                                        setDateRange([
                                            new Date(getStartDate()),
                                            new Date(getCurrentDate()),
                                        ]);
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
                                                    .format(totalIncome)
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
                                        setStartDate(getStartDate());
                                        setEndDate(getCurrentDate());
                                        setDateRange([
                                            new Date(getStartDate()),
                                            new Date(getCurrentDate()),
                                        ]);
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
                                                    .format(totalExpenses)
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
                        {/* <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography fontWeight={600}>
                                Income - Expense (Monthly)
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
                        </Box> */}
                        {/* {dataset && (
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
                        )} */}
                        {datasetMonthlyList && (
                            <LineChart
                                dataset={datasetMonthlyList}
                                startDate={startDate}
                                endDate={endDate}
                                expenseData={expensesByDateRange}
                                incomeData={incomeByDateRange}
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
                    refetch={() => refreshAll()}
                />
            )}

            {/* expenses Snackbar */}
            {expensesSnackbar}

            {/* income Snackbar */}
            {incomeSnackbar}

            {/* Loading */}
            {/* {((expensesLoadingQuery && incomeLoadingQuery) ||
                expensesLoadingMutation ||
                incomeLoadingMutation) && <Loading />} */}

            {(loading || expensesLoadingMutation || incomeLoadingMutation) && (
                <Loading />
            )}
        </>
    );
};
