// LineChart.js
import React, { useEffect, useState } from "react";
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
import { Box } from "@mui/material";

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

export const LineChart = (props: {
    dataset: exbalDataType[];
    startDate?: string;
    endDate?: string;
}) => {
    const [months, setMonths] = useState<string[]>([]);
    const [expenses, setExpenses] = useState<number[]>([]);
    const [income, setIncome] = useState<number[]>([]);

    console.log(props.dataset);

    useEffect(() => {
        if (props.dataset) {
            let filteredData = props.dataset;

            // Only apply filtering if startDate or endDate is provided
            if (props.startDate || props.endDate) {
                const startDate = props.startDate
                    ? new Date(props.startDate)
                    : new Date("2024-01-01");
                const endDate = props.endDate
                    ? new Date(props.endDate)
                    : new Date();

                // Filter the dataset based on the date range, considering months and years
                filteredData = props.dataset.filter((data) => {
                    const dataMonth = new Date(`${data.month} 1, 2024`); // Assuming the data is for the year 2024
                    const dataYear = 2024; // Since the dataset is for 2024

                    // Compare year and month from startDate and endDate
                    const dataYearMonth = dataYear * 12 + dataMonth.getMonth(); // Convert year and month to a comparable number
                    const startYearMonth =
                        startDate.getFullYear() * 12 + startDate.getMonth();
                    const endYearMonth =
                        endDate.getFullYear() * 12 + endDate.getMonth();

                    return (
                        dataYearMonth >= startYearMonth &&
                        dataYearMonth <= endYearMonth
                    );
                });
            }

            // Update states
            setMonths(filteredData.map((data) => data.month));
            setExpenses(filteredData.map((data) => data.expenses));
            setIncome(filteredData.map((data) => data.income));
        }
    }, [props.dataset]);

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
        <Box height={400}>
            <Line data={data} options={options} />
        </Box>
    );
};
