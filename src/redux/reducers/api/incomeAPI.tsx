import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface incomeData {
    _id: number | string;
    category: string;
    amount: number;
    date: string;
    user: string;
}

const { VITE_BACKEND_URL } = import.meta.env;

export const incomeAPI = createApi({
    reducerPath: "incomeAPI",
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BACKEND_URL }),
    tagTypes: ["income"], // para mu refresh tung naa sa persist, ngalan sa state
    endpoints: (builder) => ({
        getAllIncome: builder.query<incomeData[], void>({
            query: () => "income/",
            // providesTags: ['users'] // para mu refresh tung naa sa persist
            providesTags: (result) =>
                // is result available?
                result
                    ? // successful query
                      [
                          ...result.map(
                              ({ _id }) => ({ type: "income", _id } as const)
                          ),
                          // Ang 'LIST' kay Id sya sa query na atong gi fetch
                          // Kada kuha niyag data kay gi assign sa 'LIST' na copy sa tanan user na atong gi fetch
                          { type: "income", id: "LIST" },
                      ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                      [{ type: "income", id: "LIST" }],
        }),
        getIncomeByYear: builder.query({
            query: (year) => `income/year/${year}`,
        }),
        getIncomeByUserId: builder.query({
            query: (userId) => `income/user/${userId}`,
        }),
        addIncome: builder.mutation({
            query: (incomeDetails) => ({
                url: "income/save",
                method: "POST",
                body: incomeDetails,
            }),
            // invalidatesTags: ['users'] // para mu refresh tung naa sa persist
            // gina update ra niya tung user sa katung query with 'List' ID
            invalidatesTags: [{ type: "income", id: "LIST" }],
        }),
        deleteIncome: builder.mutation<void, string>({
            query: (idIncome: string) => ({
                url: `income/${idIncome}`,
                method: "DELETE",
            }),
            // invalidtate - means to refetch the code to make sure ma update ang list
            // invalidatesTags: ['users'] // para mu refresh tung naa sa persist
            // gina delete ra niya tung user sa katung query with 'List' ID
            invalidatesTags: (idIncome) => {
                return [{ type: "income", idIncome }];
            },
        }),

        getIncomeByDateRange: builder.query({
            query: ({ userId, startDate, endDate }) => ({
                url: `/income/date-range/${userId}/${startDate}/${endDate}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetAllIncomeQuery, 
    useGetIncomeByYearQuery, 
    useGetIncomeByUserIdQuery,
    useAddIncomeMutation, 
    useDeleteIncomeMutation,
    useGetIncomeByDateRangeQuery
} = incomeAPI