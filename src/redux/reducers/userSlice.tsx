import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
    login: boolean,
    user: Object
}

const initialState: initialStateProps = {
    login: false,
    user: {}
}

export const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.login = true,
            state.user = action.payload
        },
        logoutUser: (state) => {
            state.login = false,
            state.user = {}
        }
    }
})

export const { setUser, logoutUser } = userSlice.actions
export default userSlice.reducer;