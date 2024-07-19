import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  issuperuser: false,
};

const issuperuserSlice = createSlice({
  name: 'issuperuser',
  initialState,
  reducers: {
    setIssuperuser: (state, action) => {
      state.issuperuser = action.payload;
    },
  },
});

export const { setIssuperuser } = issuperuserSlice.actions;
export const selectIssuperuser = (state) => state.issuperuser.issuperuser;
export default issuperuserSlice.reducer;
