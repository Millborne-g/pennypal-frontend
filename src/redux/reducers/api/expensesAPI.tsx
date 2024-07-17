import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface expenseData {
    _id: number | string;
    category: string;
    amount: number;
    date: string;
    user: string;
}

const { VITE_BACKEND_URL } = import.meta.env;

export const expensesAPI = createApi({
    reducerPath: "expensesAPI",
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BACKEND_URL }),
    tagTypes: ["expenses"], // para mu refresh tung naa sa persist, ngalan sa state
    endpoints: (builder) => ({
        getAllExpenses: builder.query<expenseData[], void>({
            query: () => "expenses/",
            // providesTags: ['users'] // para mu refresh tung naa sa persist
            providesTags: (result) =>
                // is result available?
                result
                    ? // successful query
                      [
                          ...result.map(
                              ({ _id }) => ({ type: "expenses", _id } as const)
                          ),
                          // Ang 'LIST' kay Id sya sa query na atong gi fetch
                          // Kada kuha niyag data kay gi assign sa 'LIST' na copy sa tanan user na atong gi fetch
                          { type: "expenses", id: "LIST" },
                      ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                      [{ type: "expenses", id: "LIST" }],
        }),
        getExpensesByYear: builder.query({
            query: (year) => `expenses/year/${year}`,
        }),
        getExpensesByUserId: builder.query({
            query: (userId: string) => `expenses/user/${userId}`,
        }),
        addExpense: builder.mutation({
            query: (expenseDetails) => ({
                url: "expenses/save",
                method: "POST",
                body: expenseDetails,
            }),
            // invalidatesTags: ['users'] // para mu refresh tung naa sa persist
            // gina update ra niya tung user sa katung query with 'List' ID
            invalidatesTags: [{ type: "expenses", id: "LIST" }],
        }),
        deleteExpense: builder.mutation<void, string>({
            query: (idExpense: string) => ({
                url: `expenses/${idExpense}`,
                method: "DELETE",
            }),
            // invalidtate - means to refetch the code to make sure ma update ang list
            // invalidatesTags: ['users'] // para mu refresh tung naa sa persist
            // gina delete ra niya tung user sa katung query with 'List' ID
            invalidatesTags: (idExpense) => {
                return [{ type: "expenses", idExpense }];
            },
        }),

        getExpenseByDateRange: builder.mutation({
            query: (dateRange) => ({
                url: "/expenses/date-range",
                method: "POST",
                body: dateRange,
            }),
        }),
    }),
});

export const {
    useGetAllExpensesQuery,
    useGetExpensesByYearQuery,
    useGetExpensesByUserIdQuery,
    useAddExpenseMutation,
    useDeleteExpenseMutation,
    useGetExpenseByDateRangeMutation
} = expensesAPI;
