import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  data: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.open = action.payload.open;
      state.data = action.payload.data;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const { setModal,setOpen } = modalSlice.actions;
export const selectOpen = (state) => state.modal.open;
export const selectData = (state) => state.modal.data;
export default modalSlice.reducer;
