import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import {
  Button, Checkbox, FormControl, FormControlLabel, FormHelperText, MenuItem, Select
} from "@mui/material";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {
  LocalizationProvider,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";


import { getAllParkingMap, postworksession, siteInfoApi } from "redux/slices/ParkingSlice";

// Image Imports
import Polishing from "Assets/Images/polishingicon.svg";
import Washing from "Assets/Images/washingicon.svg";
import damageicon from "Assets/Images/damageicon.svg";
import pickbyicon from "Assets/Images/pickbyicon.svg";
import DialogBox from "Assets/Dialog box/Deletebox";
import { setOpen } from "redux/slices/modalSlice";
import { setAlert } from "redux/slices/alertSlice";
import cross from "Assets/Images/cross.svg";
import arrivingicon from "Assets/Images/arriving.svg";

const ParkingInfo = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.parking.siteInfo);
  const data = useSelector((state) => state.modal.data);
  const open = useSelector((state) => state.modal.open);



  function handleclick() {
    setSelectedCarNumber("default_value_here");
    dispatch(setOpen(!open));
    setNewStatus("");
    setapplydate(dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss[Z]"));
    setError(false);
  }

  const anchor = "right";

  const [newStatus, setNewStatus] = useState("");
  const parkingSlot = data;
  const [locationid, setlocationid] = useState(data?.location_type?.id ?? location[0]?.id ?? "");
  const [works, setworks] = useState();
  const [obj_check_work, setobj_check_work] = useState([]);
  const [statuspopup, setstatuspopup] = useState(false);
  const [completedwork, setcompletedwork] = useState(false);
  const [checkid, setcheckboxid] = useState("");
  const [objerr, setobjerr] = useState({
    work: "",
    parking_session: "",
  });
  const [selectcnValid, setselectcnValid] = useState(false);
  const [selectedCarNumber, setSelectedCarNumber] = useState(
    parkingSlot?.vehicle?.id ?? "default_value_here"
  );
  const [objstatus, setobjstatus] = useState({
    location: false,
    vehiclenumber: false,
    status: false,
  });



  const [applydate, setapplydate] = useState(
    dayjs(new Date()).format("YYYY-MM-DDTHH:mm:ss[Z]")
  );
  useEffect(() => {
    if (parkingSlot && parkingSlot?.location_type?.id) {
      setlocationid(parkingSlot?.location_type?.id);
    }
  }, [parkingSlot]);

  const [error, setError] = useState(false);

  const handleDateChange = (e) => {
    const date = e["$d"];
    const formatedDate = dayjs(date).format("YYYY-MM-DDTHH:mm:ss[Z]"); // display
    setapplydate(formatedDate);
  };
  const handleSaveChanges = () => {
    setobjerr({ work: "", parking_session: "" });

    if (objstatus.location) {
      updatelocationtype(parkingSlot?.id);
    }

    if (objstatus.status) {
      editparkingstatus(parkingSlot?.parking_session_id);
    }
    const isNoParking = disable_noparking()
    if (objstatus.vehiclenumber && !isNoParking) {
      addusercar(selectedCarNumber);
    }
    dispatch(setOpen(false));

  };

  useEffect(() => {
    setobjerr((prevstate) => ({
      ...prevstate,
      parking_session: "",
    }));
    setSelectedCarNumber("default_value_here");
    dispatch(siteInfoApi([]));

    setError(false);
    workslist();
  }, [parkingSlot?.vehicle, dispatch, data]);

  const workstatus = (id) => {
    setobjerr({ ...objerr, work: "", parking_session: "" });

    if (newStatus === "") {
      setError(true);
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/work_session/`,
        {
          work: works?.filter((item) => item.name === newStatus)[0]?.id,
          scheduled_at: applydate,
          parking_session: parkingSlot?.parking_session_id,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch(getAllParkingMap());

        dispatch(
          setAlert({
            open: true,
            message: "Status added successfully",
            severity: "success", // or "error", "warning", "info"
            duration: 6000,
          })
        );

        dispatch(setOpen(false));
      })
      .catch((err) => {
        if (err?.response?.data?.work === "This work is already added") {
          setobjerr({ ...objerr, work: err?.response?.data?.work });

          dispatch(
            setAlert({
              open: true,
              message: "This work is already added",
              severity: "error",
              duration: 6000,
            })
          );
        }
        if (err?.response?.data?.parking_session) {
          setobjerr({
            ...objerr,
            parking_session: err?.response?.data?.parking_session[0],
          });

          dispatch(
            setAlert({
              open: true,
              message: "Please add vehicle first",
              severity: "error",
              duration: 6000,
            })
          );
        }
        if (
          err?.response?.data.scheduled_at ===
          "Datetime less than current datetime is not allowed"
        ) {
          dispatch(
            setAlert({
              open: true,
              message: "This time has passed, please select another time",
              severity: "error",
              duration: 6000,
            })
          );
        }
      });
  };
  const editparkingstatus = (id) => {
    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_session/${id}/`,
        {},
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch(getAllParkingMap());
        dispatch(setOpen(false));
        dispatch(
          setAlert({
            open: true,
            message: "Data Updated Successfully",
            severity: "success",
            duration: 6000,
          })
        );
      })
      .catch((err) => { });
    setobjstatus({ ...objstatus, status: false });
  };

  const workslist = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/work/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setworks(res.data.results);
      })
      .catch((err) => { });
  };
  function handlechangeLocationId(e) {
    setobjstatus({ ...objstatus, location: true });
    setlocationid(e.target.value);
    if (parkingSlot?.location_type?.id === e.target.value) {
      setobjstatus({ ...objstatus, location: false });
    }
  }
  const updatelocationtype = (id) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_slot/${id}/`,
        {
          location_type: locationid,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        dispatch(getAllParkingMap());
        dispatch(
          setAlert({
            open: true,
            message: "Data Updated Successfully",
            severity: "success",
            duration: 6000,
          })
        );
      })
      .catch((err) => {
        if (err?.response?.data?.location_type) {
          dispatch(
            setAlert({
              open: true,
              message: err?.response?.data?.location_type,
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
        else {
          dispatch(
            setAlert({
              open: true,
              message: "Something went wrong",
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );
        }
      });
    setobjstatus({ ...objstatus, location: false });
  };

  const handleSelectnumber = (e) => {
    if (
      e.target.value === "default_value_here" ||
      e.target.value === "" ||
      e.target.value === null ||
      e.target.value === undefined
    ) {
      setselectcnValid(true);
    } else {
      setselectcnValid(false);
    }
    setobjstatus({ ...objstatus, vehiclenumber: true });
    setSelectedCarNumber(e.target.value);
  };

  const addusercar = (id) => {
    if (
      selectedCarNumber === "default_value_here" ||
      selectedCarNumber === "" ||
      selectedCarNumber === null ||
      selectedCarNumber === undefined
    ) {
      setselectcnValid(true);
      return;
    } else {
      setselectcnValid(false);
    }
    let plot = parkingSlot?.id ? parkingSlot?.id : "";
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_session/`,
        {
          vehicle: id,
          parking_slot: plot,
          location_type: locationid
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(
        (res) => {
          dispatch(getAllParkingMap());

          dispatch(
            setAlert({
              open: true,
              message: "Vehicle added successfully",
              severity: "success",
              duration: 6000,
            })
          );

        }

      )
      .catch((e) => {
        if (e.response?.data?.location_type) {

          dispatch(
            setAlert({
              open: true,
              message: e.response?.data?.location_type[0],
              severity: "error",
              duration: 6000,
            })
          );
        } else if (e.response?.status === 400) {

          dispatch(
            setAlert({
              open: true,
              message: "Something went wrong",
              severity: "error",
              duration: 6000,
            })
          );
        } else if (e.response?.status === 500) {

          dispatch(
            setAlert({
              open: true,
              message: "Something went wrong",
              severity: "error",
              duration: 6000,
            })
          );
        }
      });
    setobjstatus({ ...objstatus, vehiclenumber: false });
  };

  function handleCheckbox(id) {
    if (obj_check_work.includes(id)) {
      const updatedCheckWork = obj_check_work.filter(
        (checkedId) => checkedId !== id
      );
      setobj_check_work(updatedCheckWork);
    } else {
      dispatch(postworksession(id))
        .then((res) => {
          setobj_check_work([...obj_check_work, id]);

          dispatch(
            setAlert({
              open: true,
              message: "Work completed successfully",
              severity: "success",
              duration: 6000,
            })
          );
          setcheckboxid("");
          dispatch(setOpen(false));
        })
        .catch((err) => {

          dispatch(
            setAlert({
              open: true,
              message: err?.detail ?? "Something went wrong",
              severity: "error", // or "error", "warning", "info"
              duration: 6000,
            })
          );

        });
    }
  }

  function check_work(id, item) {
    return obj_check_work.includes(id) || item.is_completed;
  }

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    dispatch(setOpen(open));
  };

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      right: open
    }));
  }, [open]);


  function disable_noparking() {
    const locid = location.find((item) => item.id === locationid)

    if (locid?.name === "No Parking") {

      return true
    }
    else {

      return false
    }
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <React.Fragment>
        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
        >
          <div className="parking-info">

            <div className="row-popup">
              <div className="model-input1">
                <label className="popup-label">Location Type:</label>
                <div className="custom-select">
                  <Select
                    IconComponent={(props) => (
                      <i
                        {...props}
                        className={` ${props.className}`}
                        style={{ marginRight: "15px" }}
                      >
                        <svg
                          width="19"
                          height="11"
                          viewBox="0 0 19 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.69531 1.5L9.69531 9.5L17.6953 1.5"
                            stroke="#4E445C"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </i>
                    )}
                    value={locationid}
                    onChange={(e) => {
                      handlechangeLocationId(e);
                    }}
                    defaultValue={locationid}
                    sx={{ padding: "0px 17px" }}
                    className="innerselect popup-input1 selectbox"
                  >
                    {location?.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>

            <div className="popup-title-cross">
              <Button
                autoFocus
                onClick={() => {
                  handleclick();
                }}
              >
                <img
                  src={cross}
                  alt="cross"
                  className="cross"
                  style={{ width: "15px" }}
                />
              </Button>
            </div>
            <div className="parking-info-header">
              <span>Parking Info</span>
            </div>
            <div className="parking-info-body">
              <div className="row-popup">
                <div className="model-input1">
                  <label className="popup-label">Select Vehicle: </label>
                  <div className="custom-select">
                    {parkingSlot && parkingSlot?.vehicle?.number ? (
                      <FormControl fullWidth error={selectcnValid}>
                        <Select
                          IconComponent={(props) => (
                            <i
                              {...props}
                              className={` ${props.className}`}
                              style={{ marginRight: "15px", cursor: 'no-drop !important' }}
                            >
                              <svg
                                width="19"
                                height="11"
                                viewBox="0 0 19 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.69531 1.5L9.69531 9.5L17.6953 1.5"
                                  stroke="#4E445C"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </i>
                          )}
                          labelId="demo-simple-select-label"
                          style={{ padding: "0px 17px", cursor: 'no-drop !important' }}
                          id="demo-simple-select"
                          className="innerselect popup-input1 selectbox"
                          value={selectedCarNumber}
                          onChange={(e) => {
                            handleSelectnumber(e);
                          }}
                          name="vehicle_type"
                          placeholder="Status"
                          displayEmpty
                          disabled={true}
                          renderValue={(value) => parkingSlot?.vehicle?.number}
                        >
                          <MenuItem sx={{ cursor: 'no-drop !important' }} disabled value={parkingSlot?.vehicle?.id}>
                            {parkingSlot?.vehicle?.number}
                          </MenuItem>
                        </Select>
                        {selectcnValid && (
                          <FormHelperText>
                            Vehicle Number is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    ) : (
                      <FormControl fullWidth error={selectcnValid}>
                        <Select
                          IconComponent={(props) => (
                            <i
                              {...props}
                              className={` ${props.className}`}
                              style={{ marginRight: "15px" }}
                            >
                              <svg
                                width="19"
                                height="11"
                                viewBox="0 0 19 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1.69531 1.5L9.69531 9.5L17.6953 1.5"
                                  stroke="#4E445C"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </i>
                          )}
                          labelId="demo-simple-select-label"
                          style={{ padding: "0px 17px" }}
                          id="demo-simple-select"
                          className="innerselect popup-input1 selectbox"
                          value={selectedCarNumber}
                          disabled={disable_noparking()}
                          onChange={(e) => {
                            handleSelectnumber(e);
                          }}
                          name="vehicle_type"
                          placeholder="Status"
                          displayEmpty
                        >
                          <MenuItem disabled value="default_value_here">
                            Select Vehicle
                          </MenuItem>
                        </Select>

                        {selectcnValid && (
                          <FormHelperText>
                            Vehicle Number is required
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                    {objerr.parking_session ? (
                      <p className="error">{objerr.parking_session}</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="row-popup">
                <div
                  className="model-input1"
                  style={{
                    padding: parkingSlot?.vehicle?.number
                      ? "0px"
                      : "0px 0px 0px 0px",
                  }}
                >
                  <div className="custom-select">
                    {
                      <>
                        {parkingSlot?.vehicle?.number ? (
                          <button
                            className="btncontrol"
                            onClick={() => {
                              setstatuspopup(!statuspopup);
                            }}
                          >
                            OffSite Vehicle
                          </button>
                        ) : (
                          ""
                        )}
                      </>
                    }
                  </div>
                </div>
              </div>
              <div className="popup-button">
                <label>
                  <button onClick={handleSaveChanges} className="btncontrol">
                    Save Changes
                  </button>
                </label>
                <label>
                  <button
                    onClick={() => {
                      handleclick();
                    }}
                    className="btncontrol1"
                  >
                    Cancel{" "}
                  </button>
                </label>
              </div>

              {parkingSlot?.vehicle?.number ? (
                <>
                  {" "}
                  <div className="divider"></div>
                  <div className="parking-info-header">
                    <span>Schedule Info</span>
                  </div>
                  <div className="parking-details">
                    <div className="row-popup">
                      <div className="model-input1">
                        <label className="popup-label">Status Details</label>
                        <div className="custom-select">
                          <Select
                            displayEmpty
                            IconComponent={(props) => (
                              <i
                                {...props}
                                className={` ${props.className}`}
                                style={{ marginRight: "15px" }}
                              >
                                <svg
                                  width="19"
                                  height="11"
                                  viewBox="0 0 19 11"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.69531 1.5L9.69531 9.5L17.6953 1.5"
                                    stroke="#4E445C"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </i>
                            )}
                            value={newStatus}
                            onChange={(e) =>
                              setNewStatus(e.target.value) || setError(false)
                            }
                            className="innerselect popup-input1"
                            sx={{ padding: "0px 17px" }}
                          >
                            <MenuItem value="" disabled>
                              Select Work
                            </MenuItem>
                            {works?.map((item) => (
                              <MenuItem key={item.id} value={item.name}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                          {objerr.work ? (
                            <p className="error">{objerr.work}</p>
                          ) : null}
                          {error && <p className="error">Please select status</p>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="popup-label">Date and Time:</label>
                    </div>{" "}
                    <div className="parking-select-date">
                      <DemoContainer components={["DatePicker"]}>
                        <MobileDateTimePicker
                          defaultValue={dayjs(new Date())}
                          onChange={handleDateChange}
                          minDate={dayjs(new Date())}
                        />
                      </DemoContainer>
                    </div>
                    <div className="popup-button">
                      <label>
                        <button
                          type="button"
                          className="btncontrol"
                          onClick={() => {
                            workstatus(parkingSlot?.parking_session_id);
                          }}
                        >
                          Add{" "}
                        </button>
                      </label>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="parking-info-footer">
              <div className="footer-text">
                <p>
                  {parkingSlot?.works_sessions?.length > 0 ? <span>Added Status:</span> : null}

                  {parkingSlot?.works_sessions?.map((item) => (
                    <ul
                      style={{
                        listStyleType: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <li key={item.id} style={{ display: 'flex' }}>
                        {item.work.name === "Polishing" ? (
                          <img
                            src={Polishing}
                            alt="Polishing"
                            style={{ width: "20px", marginRight: "10px" }}
                          />
                        ) : null}{" "}
                        {item.work.name === "Washing" ? (
                          <img
                            src={Washing}
                            alt="Washing"
                            style={{ width: "20px", marginRight: "10px" }}
                          />
                        ) : null}
                        {item.work.name === "Repairing" ? (
                          <img
                            src={damageicon}
                            alt="Damage"
                            style={{ width: "20px", marginRight: "10px" }}
                          />
                        ) : null}
                        {item.work.name === "Pickup" ? (
                          <img
                            src={pickbyicon}
                            alt="Pick by owner"
                            style={{
                              width: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )
                          : null}
                        {item.work.name === "Arriving" ? (
                          <img
                            src={arrivingicon}
                            alt="Arriving"
                            className="iconadded"
                            style={{
                              width: "20px",
                              marginRight: "10px",
                            }}
                          />
                        )
                          : null}
                        <div className="iconname" style={{ minWidth: '80px' }}>{item.work.name}</div>

                        <div style={{ marginRight: '5px' }}>
                          {dayjs(item.scheduled_at).format("DD-MM-YYYY")}
                        </div>{" "}
                        <div>{dayjs(item.scheduled_at).format("HH:mm")}</div>
                      </li>
                      <li>
                        <FormControlLabel
                          control={
                            <Checkbox
                              sx={{ color: "#50485A !important" }}
                              checked={check_work(item.id, item)}
                              disabled={item.is_completed}
                              onClick={() => {
                                setcompletedwork(true);
                                setcheckboxid(item.id);
                              }}
                              name="checkedB"
                              color="primary"
                            />
                          }
                        />
                      </li>
                    </ul>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
      <DialogBox
        open={statuspopup}
        onClose={() => setstatuspopup(false)}
        title="Are you sure you want to Offsite the vehicle?"
        onConfirm={() => {
          editparkingstatus(parkingSlot?.parking_session_id);
          setstatuspopup(false);
        }}
      />
      <DialogBox
        open={completedwork}
        onClose={() => setcompletedwork(false)}
        title={`Are you sure you want to complete this work ?`}
        onConfirm={() => {
          handleCheckbox(checkid);
          setcompletedwork(false);
        }}
      />

    </LocalizationProvider>
  );
};

export default ParkingInfo;
