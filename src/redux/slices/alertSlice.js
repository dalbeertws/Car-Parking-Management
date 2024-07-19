import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "alert",
  initialState: {
    open: false,
    message: "",
    severity: "success",
    duration: 2000,
  },
  reducers: {
    setAlert: (state, action) => {
      state.open = action.payload.open;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.duration = action.payload.duration;
    },
    closeAlert: (state) => {
      state.open = false;
    },
  },
});

export const { setAlert, closeAlert } = alertSlice.actions;
export const selectAlert = (state) => state.alert;
export default alertSlice.reducer;
