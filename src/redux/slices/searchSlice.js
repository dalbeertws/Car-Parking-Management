import { createSlice } from "@reduxjs/toolkit";

const initialSearch = {
    searchquery: "",
};

export const searchSlice = createSlice({
    name: "search",
    initialState: initialSearch,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchquery = action.payload;
        },
    },
});

export const { setSearchQuery } = searchSlice.actions;

export const selectSearch = (state) => state.search.searchquery;
