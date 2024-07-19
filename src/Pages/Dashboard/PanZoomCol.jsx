import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CancelIcon from "@mui/icons-material/Cancel";
import PanZoomRows from "./PanZoomRows";
import { setModal } from "redux/slices/modalSlice";
import { getAllParkingMap } from "redux/slices/ParkingSlice";
import { setAlert } from "redux/slices/alertSlice";

const PanZoomCol = ({ item, index, parkingSlots }) => {
  const [editModes, setEditModes] = useState(Array(parkingData?.length).fill(false));
  const [editlabel, seteditlabel] = useState("");
  const dispatch = useDispatch();
  const parkingData = useSelector((state) => state.parking.getAllParkingMap);
  const handleEdit = (index) => {
    const labelToUpdate = editlabel[index];
    const token = localStorage.getItem("token");
    if (!labelToUpdate || !token) {
      dispatch(
        setAlert({
          open: true,
          message: "Invalid label or token",
          severity: "error",
          duration: 6000,
        })
      );
      return;
    }

    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    axios
      .patch(
        `${process.env.REACT_APP_API_URL}/api/parking/label/${index}/`,
        { name: labelToUpdate },
        config
      )
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setAlert({
              open: true,
              message: "Label Updated Successfully",
              severity: "success",
              duration: 6000,
            })
          );
          dispatch(getAllParkingMap());

        } else if (res.status === 400){

          dispatch(
            setAlert({
              open: true,
              message: res.data.non_field_errors[0],
              severity: "error",
              duration: 6000,
            })
          );
        } else {

          dispatch(
            setAlert({
              open: true,
              message: "Something went wrong",
              severity: "error",
              duration: 6000,
            })
          );
        }
      })
      .catch((err) => {

        dispatch(
          setAlert({
            open: true,
            message: err.response?.data?.detail || "An error occurred",
            severity: "error",
            duration: 6000,
          })
        );
      });
  };

  const handleLiDoubleClick = async (event, data) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/parking/parking_map/${data.id}/`,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setModal({ open: true, data: response.data }));
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  const [lastTouchEndTime, setLastTouchEndTime] = useState(0);

  const handleTouchEnd = (e, iteminner) => {
    const now = Date.now();
    const timeDiff = now - lastTouchEndTime;

    if (timeDiff <= 300) {

      handleLiDoubleClick(e, iteminner);
    }

    setLastTouchEndTime(now);
  };

  return (
    <>
      <div className="parkingmap-body" key={index}>
        <ul className="parkingmap-body-ul" key={item.id}>
          {editModes[index] ? (
            <div className="parking-edit-div">
              <div className="parking-edit-div">
                <input
                  type="text"
                  className="parkingmap-body-front"
                  value={editlabel[item.id] || ""}
                  onChange={(e) => {
                    const newEditLabel = [...editlabel];
                    newEditLabel[item.id] = e.target.value;
                    seteditlabel(newEditLabel);
                  }}
                />
                <button
                  className="parking-edit"
                  onClick={() => {
                    handleEdit(item.id);
                    setEditModes((prevModes) => {
                      const newModes = [...prevModes];
                      newModes[index] = false;
                      return newModes;
                    });
                  }}
                >
                  Edit
                </button>
                <CancelIcon
                  className="crossedit"
                  onClick={() => {
                    const newEditModes = [...editModes];
                    if (newEditModes[index] === true) {
                      newEditModes[index] = false;
                      setEditModes(newEditModes);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <li
              onClick={() => {
                const newEditModes = [...editModes];
                newEditModes[index] = true;
                setEditModes(newEditModes);
                seteditlabel((prevLabels) => {
                  const newLabels = [...prevLabels];
                  newLabels[item.id] = item.name;
                  return newLabels;
                });
              }}
              className="parkingmap-body-front"
            >
              {item.name}
            </li>
          )}
          <div style={{ display: "flex", gap: "20px" }}>
            {parkingSlots.map((iteminner, index1) => (
              <li
                key={iteminner.id}
                style={{
                  cursor: "pointer",
                }}
                onDoubleClickCapture={(e) => handleLiDoubleClick(e, iteminner)}
                onTouchEnd={(e) => handleTouchEnd(e, iteminner)}
              >
                <PanZoomRows
                  key={index1}
                  iteminner={iteminner}
                  index1={index1}
                  index={index}
                />
              </li>
            ))}
          </div>

          <li className="parkingmap-body-front">{item.name}</li>
        </ul>
      </div>
    </>
  );
};

export default React.memo(PanZoomCol);
