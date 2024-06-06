import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
    open: boolean
}

const initialState: initialStateProps = {
    open: window.innerWidth > 1100? true: false
}

export const sidebarSlice = createSlice({
    name: "sidebarSlice",
    initialState,
    reducers: {
        openSidebar: (state, action) => {
            state.open = action.payload;
        }
    }
})

export const { openSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer;