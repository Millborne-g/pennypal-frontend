// LineChart.js
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Box, Select, MenuItem } from "@mui/material";

// Register the necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

import { exbalDataType } from "../../pages/Dashboard";

// Month names array
const monthNames = [
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

export const LineChart = (props: {
    dataset: exbalDataType[];
    expenseData: any[];
    incomeData: any[];
    startDate?: string;
    endDate?: string;
}) => {
    const [months, setMonths] = useState<string[]>([]);
    const [expenses, setExpenses] = useState<number[]>([]);
    const [income, setIncome] = useState<number[]>([]);
    const [view, setView] = useState<"month" | "day">("month");

    // useEffect(() => {
    //     if (props.dataset) {
    //         let filteredData = props.dataset;

    //         // Only apply filtering if startDate or endDate is provided
    //         if (props.startDate || props.endDate) {
    //             const startDate = props.startDate
    //                 ? new Date(props.startDate)
    //                 : new Date("2024-01-01");
    //             const endDate = props.endDate
    //                 ? new Date(props.endDate)
    //                 : new Date();

    //             // Filter the dataset based on the date range, considering months and years
    //             filteredData = props.dataset.filter((data) => {
    //                 const dataMonth = new Date(`${data.month} 1, 2024`); // Assuming the data is for the year 2024
    //                 const dataYear = 2024; // Since the dataset is for 2024

    //                 // Compare year and month from startDate and endDate
    //                 const dataYearMonth = dataYear * 12 + dataMonth.getMonth(); // Convert year and month to a comparable number
    //                 const startYearMonth =
    //                     startDate.getFullYear() * 12 + startDate.getMonth();
    //                 const endYearMonth =
    //                     endDate.getFullYear() * 12 + endDate.getMonth();

    //                 return (
    //                     dataYearMonth >= startYearMonth &&
    //                     dataYearMonth <= endYearMonth
    //                 );
    //             });
    //         }

    //         // Update states
    //         setMonths(filteredData.map((data) => data.month));
    //         setExpenses(filteredData.map((data) => data.expenses));
    //         setIncome(filteredData.map((data) => data.income));
    //     }
    // }, [props.dataset]);

    const formatMonthYear = (date: Date) => {
        return `${monthNames[date.getMonth()]}`;
    };

    // Helper function to format a date into 'Day Month YYYY' (day/month/year format)
    const formatDayMonthYear = (date: Date) => {
        return `${monthNames[date.getMonth()]} ${date.getDate()} `;
    };

    // Helper function to group amounts by month or day
    const groupBy = (
        data: any[],
        startDate: Date,
        endDate: Date,
        groupBy: "month" | "day"
    ) => {
        const result: { [key: string]: number } = {};

        data.forEach((item) => {
            const itemDate = new Date(item.date);

            // Adjust the endDate to the end of the day to include today
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999);

            // Check if itemDate falls within the range including today
            if (itemDate >= startDate && itemDate <= adjustedEndDate) {
                const formattedDate =
                    groupBy === "month"
                        ? formatMonthYear(itemDate)
                        : formatDayMonthYear(itemDate);
                if (!result[formattedDate]) {
                    result[formattedDate] = 0;
                }
                result[formattedDate] += item.amount;
            }
        });

        return result;
    };

    useEffect(() => {
        if (props.expenseData && props.incomeData) {
            const startDate = props.startDate
                ? new Date(props.startDate)
                : new Date("2024-01-01");
            const endDate = props.endDate
                ? new Date(props.endDate)
                : new Date();

            // Group expenses and income by the selected view (month or day)
            const expensesGrouped = groupBy(
                props.expenseData,
                startDate,
                endDate,
                view
            );
            const incomeGrouped = groupBy(
                props.incomeData,
                startDate,
                endDate,
                view
            );

            // Get the labels based on the selected view
            const labels: string[] = [];
            const current = new Date(startDate);

            if (view === "month") {
                while (current <= endDate) {
                    labels.push(formatMonthYear(current));
                    current.setMonth(current.getMonth() + 1); // Move to the next month
                }
            } else {
                while (current <= endDate) {
                    labels.push(formatDayMonthYear(current));
                    current.setDate(current.getDate() + 1); // Move to the next day
                }
            }

            // Map the grouped data into arrays for the chart
            setMonths(labels);
            setExpenses(labels.map((label) => expensesGrouped[label] || 0)); // Default to 0 if no data
            setIncome(labels.map((label) => incomeGrouped[label] || 0)); // Default to 0 if no data
        }
    }, [
        props.expenseData,
        props.incomeData,
        props.startDate,
        props.endDate,
        view,
    ]);

    const data = {
        labels: months,
        datasets: [
            {
                label: "Expenses",
                data: expenses,
                borderColor: "#FF6668", // Line color
                backgroundColor: "rgba(255, 102, 104, 0.5)",
                fill: true,
                tension: 0.1,
            },
            {
                label: "Income",
                data: income,
                borderColor: "#53B16B", // Line color
                backgroundColor: "rgba(83, 177, 107, 0.5)",
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Income - Expense (Monthly)",
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: number | string) {
                        if (typeof value === "number" && value < 0) {
                            return "";
                        }
                        return value;
                    },
                },
            },
        },
    };

    return (
        <Box height={400} position={"relative"}>
            <Select
                size="small"
                value={view}
                onChange={(e) => setView(e.target.value as "month" | "day")}
                sx={{ position: "absolute", right: 0 }}
            >
                <MenuItem value="month">Per Month</MenuItem>
                <MenuItem value="day">Per Day</MenuItem>
            </Select>
            <Line data={data} options={options} />
        </Box>
    );
};
