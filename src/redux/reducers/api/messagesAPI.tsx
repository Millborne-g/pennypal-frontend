import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

interface messageData {
    _id: number | string;
    content: string;
    senderEmail: string;
    recipientEmail: string;
    date: string;
}

const { VITE_BACKEND_URL } = import.meta.env;

export const messagesAPI = createApi({
    reducerPath: "messagesAPI",
    baseQuery: fetchBaseQuery({ baseUrl: VITE_BACKEND_URL }),
    tagTypes: ["messages"], // para mu refresh tung naa sa persist, ngalan sa state
    endpoints: (builder) => ({
        getAllMessage: builder.query<messageData[], void>({
            query: () => "messages/",
            // providesTags: ['users'] // para mu refresh tung naa sa persist
            providesTags: (result) =>
                // is result available?
                result
                    ? // successful query
                      [
                          ...result.map(
                              ({ _id }) => ({ type: "messages", _id } as const)
                          ),
                          // Ang 'LIST' kay Id sya sa query na atong gi fetch
                          // Kada kuha niyag data kay gi assign sa 'LIST' na copy sa tanan user na atong gi fetch
                          { type: "messages", id: "LIST" },
                      ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                      [{ type: "messages", id: "LIST" }],
        }),
        addMessage: builder.mutation({
            query: (messagesDetails) => ({
                url: "messages/save",
                method: "POST",
                body: messagesDetails,
            }),
            invalidatesTags: [{ type: "messages", id: "LIST" }],
        }),
        getMessageByConvo: builder.query({
            query: ({ recipientEmail, senderEmail }) =>
                `messages/getConvo?recipientEmail=${recipientEmail}&senderEmail=${senderEmail}`,
        }),
    }),
});

export const {
    useGetAllMessageQuery,
    useAddMessageMutation,
    useGetMessageByConvoQuery
} = messagesAPI