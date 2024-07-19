import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const initialState = {
  getAllParkingMap: [],
  currentPage: 1,
  siteInfo: [],
  loading: false,
  isSuccess: false,
  isLoading:false,
  error: null,
  locationType: [],
  worksession: "",
  siteInfoApillocation: [],
  fetchWorks: [],
  getAllIconMap:[],
};

export const getAllParkingMap = createAsyncThunk(
  "getAllParkingMap",
  async (pagenumber = 1) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_map/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      response.data.currentPage = pagenumber;
      return response.data;
    } catch (error) {}
  }
);
export const getAllIconMap = createAsyncThunk(
  "getAllIconMap",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/work/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data.results;
    } catch (error) {}
  }
);
export const siteInfoApillocation = createAsyncThunk(
  "siteInfoApillocation",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parking/location_type/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data.results;
    } catch (error) {}
  }
);

export const siteInfoApi = createAsyncThunk("siteInfoApi", async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/parking/location_type/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data.results;
  } catch (error) {
    throw error;
  }
});

export const singleparkingslot = createAsyncThunk(
  "singleparkingslot",
  async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_map/${id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);
export const postworksession = createAsyncThunk(
  "postworksession",
  async (id, { dispatch }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/work_session_completed/${id}/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(getAllParkingMap());
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  }
);
export const fetchWorks = createAsyncThunk(
  "fetchWorks",
  async (_, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/work/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }
);

export const addusercar = createAsyncThunk(
  "addusercar",
  async (id, plot, { dispatch, getState }) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_session/`,
        {
          vehicle: id,
          parking_slot: plot,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(getAllParkingMap());

      toast.success("Vehicle added successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("Vehicle already added", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      }
    }
  }
);
const parkingMapSlice = createSlice({
  name: "parkingMap",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.error = null;
      state.getAllParkingMap = [];
      state.singledata=null;
      state.getAllIconMap=[];
      state.isLoading=false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllParkingMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllParkingMap.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(getAllParkingMap.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.getAllParkingMap = action.payload;
      })
      .addCase(getAllIconMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllIconMap.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(getAllIconMap.fulfilled, (state, action) => {
        state.loading = true;
        state.isSuccess = true;
        state.getAllIconMap = action.payload;
      })

      .addCase(siteInfoApi.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(siteInfoApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.siteInfo = action.payload;
      })
      .addCase(siteInfoApillocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(siteInfoApillocation.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(siteInfoApillocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.locationType = action.payload;
      })
      .addCase(addusercar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addusercar.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(addusercar.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.siteInfoApillocation = action.payload;
      })
      .addCase(postworksession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postworksession.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(postworksession.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.worksession = action.payload;
      })

      .addCase(singleparkingslot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(singleparkingslot.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(singleparkingslot.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.singledata = action.payload;
      })


      .addCase(fetchWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false;
        state.isSuccess = false;
        state.error = action.error.message;
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.worksession = action.payload;
      });
  },
});

export const { reset } = parkingMapSlice.actions;
export default parkingMapSlice.reducer;
