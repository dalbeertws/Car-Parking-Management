import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorks, getAllIconMap } from "redux/slices/ParkingSlice";
import { setSearchQuery } from "redux/slices/searchSlice";
import ParkingInfo from "./ParkingInfo";
import Panzoomcls from "./Panzoom";
import { FaCircle } from "react-icons/fa";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import RepairingIcon from "Assets/Images/damageicon.svg";
import ArrivingIcon from "Assets/Images/arriving.svg";
import WashingIcon from "Assets/Images/washingicon.svg";
import PolishingIcon from "Assets/Images/polishingicon.svg";
import PickByIcon from "Assets/Images/pickbyicon.svg";

const Dashboard = () => {
  const dispatch = useDispatch();
  const parkIconsData = useSelector((state) => state.parking.getAllIconMap);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllIconMap());

    dispatch(fetchWorks());
  }, [dispatch]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearch(query);
    dispatch(setSearchQuery(query));
  };

  const renderHeaderIcons = () => {
    return (
      parkIconsData &&
      parkIconsData.map((iconData, index) => (
        <li className="header-list" key={index}>
          <img
            width="18px"
            height="18px"
            src={getIconForName(iconData?.name)}
            alt={iconData?.name || ""}
          />
          <span>{iconData?.name}</span>
        </li>
      ))
    );
  };

  const getIconForName = (name) => {
    const iconMapping = {
      Repairing: RepairingIcon,
      Polishing: PolishingIcon,
      Washing: WashingIcon,
      Pickup: PickByIcon,
      Arriving: ArrivingIcon,

    };
    return iconMapping[name];
  };

  const days = [
    { name: "Monday", color: "#56C72F" },
    { name: "Tuesday", color: "#3483DF" },
    { name: "Thursday", color: "#01CFC5" },
    { name: "Friday", color: "#FF649C" },
    { name: "Saturday", color: "#1C3C60" },
    { name: "Next Week", color: "#8F2FAD" },
    { name: "Overdue", color: "#FF251E" },

  ];
 
  const renderDays = () => {
    return days.map((day, index) => (
      <li key={index}>
        <span>
          <FaCircle style={{ color: day.color }} />
          {day.name}
        </span>
      </li>
    ));
  };

  return (
    <div className="parkingmap">
      <div className="sectiontitle">
        <div className="title">
          <label className="titletag">Map</label>
        </div>
        <div className="parking-map-search-right">
          <div className="parking-header">
              <ul className="header-icons">{renderHeaderIcons()}</ul>
          </div>
          <div className="search-field">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              autoComplete="off"
              value={search}
              onChange={(e) => handleSearch(e)}
              className="searchbar"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon className="searchicon" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      </div>

      <Panzoomcls />
      <div className="parkingmap-footer">
        <ul>{renderDays()}</ul>
      </div>
      <div className="parkingmap-sidepopper">
        <ParkingInfo />
      </div>
    </div>
  );
};

export default Dashboard;
