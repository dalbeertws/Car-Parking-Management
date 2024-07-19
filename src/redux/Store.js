import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userSlice from "redux/slices/UserSlice";
import ParkingReducer from "redux/slices/ParkingSlice";
import modalReducer from "redux/slices/modalSlice"
import { searchSlice } from "redux/slices/searchSlice";
import alertReducer from "redux/slices/alertSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    parking: ParkingReducer,
    modal: modalReducer,
    alert: alertReducer,
    search : searchSlice.reducer,
  },
  middleware: [thunk],
});

export default store;
