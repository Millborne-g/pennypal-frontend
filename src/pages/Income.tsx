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


interface IncomeRow {
    id: number | string;
    category: string;
    amount: number;
    date: string;
}

export const Income = () => {
    const userDetails = useSelector((state: any) => state.user.user);

    const {
        allIncome,
        loadingQuery,
        successQuery,
        addIncome,
        deleteIncome,
        SnackbarComponent,
    } = useIncome();

    const [rows, setRows] = useState<IncomeRow[]>([]);

    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

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
                        onClick={() => {
                            deleteIncome(params.id);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

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
            if (allIncome) {
                interface incomeData {
                    _id: number | string;
                    category: string;
                    amount: number;
                    date: string;
                    user: string;
                }

                // Convert and sort the data by date in descending order
                const sortedData = allIncome
                    .filter(
                        (income: incomeData) => userDetails._id === income.user
                    )
                    .map((income: incomeData) => {
                        const date = new Date(income.date);

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        const hours = String(
                            date.getHours() % 12 || 12
                        ).padStart(2, "0");
                        const minutes = String(date.getMinutes()).padStart(
                            2,
                            "0"
                        );
                        const ampm = date.getHours() >= 12 ? "PM" : "AM";

                        return {
                            id: income._id,
                            category: income.category,
                            date: `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`,
                            amount: income.amount,
                        };
                    })
                    .sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                    );

                // Set the sorted data to the state
                setRows(sortedData);
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
        setData();
    }, [allIncome]);

    return (
        <>
            <Box>
                <CssBaseline />
                <PageContainer>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography fontSize={30} fontWeight={700} gutterBottom>
                            Income
                        </Typography>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            p: "15px 0",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setOpenModal(true)}
                        >
                            Add Income
                        </Button>
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
                />
            )}

            {/* Snackbar */}
            {SnackbarComponent}

            {/* Loading */}
            {loadingQuery && <Loading />}
        </>
    );
};
