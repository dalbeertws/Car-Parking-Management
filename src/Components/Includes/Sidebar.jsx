import React, { useEffect, useState, useCallback, useMemo } from "react";
import "Assets/StyleCss/sidebar.css";
import C_logo from "Assets/Images/c.svg";
import { FaCaravan, FaMap, FaUserCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import logo from "Assets/Images/carparking.png";
import avatar from "Assets/Images/avatar1.png";
import { useLocation } from "react-router-dom";
import toggleleft from "Assets/Images/toggleleft.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, styled, tooltipClasses } from "@mui/material";
import LogoutConfirmation from "Assets/Dialog box/LogoutConfirmation";
import { useDispatch } from "react-redux";
import { setAlert } from "redux/slices/alertSlice";

export default function SideBar({ handleSidebarToggle, sidebarStatus }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutConfirmationState, setLogoutConfirmationState] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    useremail: "",
    issuperadmin: false,
  });
  const [actives, setActives] = useState("dashboard");
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleToCloseLogoutConfirmation = useCallback(() => {
    setLogoutConfirmationState(false);
  }, []);

  const userID = useCallback(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/me/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const { first_name, last_name, email, is_superuser } = res.data;
        setUserData({
          username: first_name + " " + last_name,
          useremail: email,
          issuperadmin: is_superuser,
        });

        localStorage.setItem("issuperuser", is_superuser)
        localStorage.setItem("isLoggedIn", true);
      })
      .catch((err) => {
        handleLogout();
        dispatch(
          setAlert({
            open: true,
            message: "Session Expired, Please login again",
            severity: "error",
            duration: 6000,
          })
        );
        localStorage.setItem("issuperuser", false)
      });
  }, []);
  const pathname = useMemo(() => location.pathname.split("/")[1], [location.pathname]);
  useEffect(() => {
    userID();
    setActives(pathname);
  }, [userID, pathname, localStorage.getItem("issuperuser")]);

  const handleToOpenLogoutConfirmation = useCallback(() => {
    setLogoutConfirmationState(true);
  }, []);
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,


    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
    margin: 0,
  }));
  return (
    <>
      <div className="sidebar_wrrpr">
        <div className="sidebar_dv">
          <div className="sidebar_head">
            <div className={`sidebar_collapsed_logo ${sidebarStatus}`}>
              <img src={C_logo} alt="logo" />{" "}
            </div>{" "}
            <div className="sidebar_logo">
              <img src={logo} className="sidebar_logo" alt="logo" />{" "}
            </div>
          </div>
          <div className="sidebar_toggle">
            <button
              className="sidebar_toggle_btn"
              onClick={() => {
                handleSidebarToggle();
              }}
            >
              <div className="closemenu">
                <img src={toggleleft} alt={"logo"} />
              </div>
            </button>
          </div>
          <div className="sidebar_body">
            {
              sidebarStatus + "" === "true" ?
                <ul className="navigation">
                  <li
                    className={`${pathname === "dashboard" ? "activeitem" : "noactive"
                      }`}
                  >
                    <Link to="/dashboard">
                      <FaMap className="menuicons" />
                      <span className="sidebar_menu_name">Map</span>
                    </Link>
                  </li>
                  {
                    (localStorage.getItem("issuperuser") + "") === "true" ?
                      <li
                        className={`${pathname === "users" ? "activeitem" : "noactive"
                          }`}
                      >
                        <Link to="/users">
                          <FaUserCog className="menuicons" />
                          <span className="sidebar_menu_name">User Management</span>
                        </Link>
                      </li> : null
                  }
                </ul> :
                <ul className="navigation">
                  <LightTooltip title="Map" arrow placement="top" followCursor>
                    <li
                      className={`${pathname === "dashboard" ? "activeitem" : "noactive"
                        }`}
                    >
                      <Link to="/dashboard">
                        <FaMap className="menuicons" />

                      </Link>
                    </li>
                  </LightTooltip>
                  <LightTooltip title="Vehicles" arrow placement="top" followCursor>
                    <li
                      className={`${pathname === "vehicles" ? "activeitem" : "noactive"
                        }`}

                    >
                      <Link to="/vehicles">
                        <FaCaravan className="menuicons" />

                      </Link>
                    </li>
                  </LightTooltip>
                  {
                    (localStorage.getItem("issuperuser") + "") === "true" ?
                      <LightTooltip title="User Management" arrow placement="top" followCursor>
                        <li className={`${pathname === "users" ? "activeitem" : "noactive"}`}>
                          <Link to="/users">
                            <FaUserCog className="menuicons" />
                          </Link>
                        </li>
                      </LightTooltip> : null
                  }

                </ul>
            }
          </div>
          <div className={`sidebar_foot ${sidebarStatus}`}>
            <div className=" sidebar_toggle2"></div>
            <ul>
              <li className="sidebar_foot_li sidebar_foot_avatar_li sb-avatar">
                <img src={avatar} alt="avatar" />
              </li>
              <li className="sidebar_foot_li sb-detail">
                <p className="textfootername">{userData.username} </p>
                <p className="textfooteremail">{userData.useremail}</p>
              </li>
              <li
                className={`sidebar_foot_li_second menuicons log-btn sb-logout `}
              >
                <Tooltip title="Logout" arrow>
                  <IconButton
                    className={`${sidebarStatus}`}
                    onClick={() => {
                      handleToOpenLogoutConfirmation();
                    }}
                  >
                    <FiLogOut className="logout" />
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <LogoutConfirmation
        open={logoutConfirmationState}
        onClose={handleToCloseLogoutConfirmation}
        title="Are you sure you want to logout ?"
        onConfirm={() => {
          handleLogout();
        }}
      />
    </>
  );
}
