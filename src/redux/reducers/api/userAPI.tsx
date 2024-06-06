import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface userData {
    _id: number | string;
    email: string;
    password: number;
    fullName: string;
    firstName: string;
    lastName: string;
    userImage: string;
}

const { VITE_BACKEND_URL } = import.meta.env;

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BACKEND_URL }),
    tagTypes: ["user"], // para mu refresh tung naa sa persist, ngalan sa state
    endpoints: (builder) => ({
        getAllUser: builder.query<userData[], void>({
            query: () => "/user/users",
            // providesTags: ['users'] // para mu refresh tung naa sa persist
            providesTags: (result) =>
                // is result available?
                result
                    ? // successful query
                      [
                          ...result.map(
                              ({ _id }) => ({ type: "user", _id } as const)
                          ),
                          // Ang 'LIST' kay Id sya sa query na atong gi fetch
                          // Kada kuha niyag data kay gi assign sa 'LIST' na copy sa tanan user na atong gi fetch
                          { type: "user", id: "LIST" },
                      ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                      [{ type: "user", id: "LIST" }],
        }),
        findUserByEmail: builder.query({
            query: (email: string) => `/users/${email}`,
        }),
        registerUser: builder.mutation({
            query: (userDetails) => ({
                url: "/user/register",
                method: "POST",
                body: userDetails,
            }),
            // invalidatesTags: ['users'] // para mu refresh tung naa sa persist
            // gina update ra niya tung user sa katung query with 'List' ID
            invalidatesTags: [{ type: "user", id: "LIST" }],
        }),
    }),
});

export const { useGetAllUserQuery, useFindUserByEmailQuery, useRegisterUserMutation } = userAPI