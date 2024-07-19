import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { calculatePageNumbers } from "utils/calculatePageNumbers";
const initialState = {
  getAllUsers: [],
  currentPage: 1,
};
export const getAllUsers = createAsyncThunk(
  "getAllUsers",
  async (pagenumber = 1) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/?page=${pagenumber}`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      response.data.currentPage = pagenumber;
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return message;
    }
  }
);
export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (userId, { dispatch }) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/users/${userId}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(getAllUsers());
      return userId;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return message;
    }
  }
);

export const createUser = createAsyncThunk(
  "createUser",
  async (userData, { dispatch }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/`,
        userData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response) ||
        "An error occurred while creating user";
      return message;
    }
  }
);
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData }, { dispatch }) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/${userData?.id}/`,
        userData,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(getAllUsers());
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.getAllUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.isLoading = true;
      state.message = null;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.getAllUsers = action.payload.results;
      state.totalPages = calculatePageNumbers(action.payload.count);
      state.currentPage = action.payload.currentPage;
    });

    builder.addCase(createUser.pending, (state) => {
      state.isLoading = true;
      state.message = null;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.message = action.payload;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload;
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.getAllUsers = state.getAllUsers.filter(
        (user) => user.id !== action.payload
      );
    });
    builder.addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.getAllUsers = state.getAllUsers.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    });
  },
});

export default userSlice.reducer;
