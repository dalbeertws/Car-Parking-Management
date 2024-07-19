import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setAlert } from "redux/slices/alertSlice";
import logo from "../../Assets/Images/logo.svg";
import "../../Assets/StyleCss/styles.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const loginPayload = {
      ...loginData,
      email: loginData.email.toLowerCase(),
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/login/`, loginPayload)
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          handleUserID(res.data.token);
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        localStorage.setItem("isLoggedIn", false);
        dispatch(
          setAlert({
            open: true,
            message: "Invalid email or password.",
            severity: "error",
            duration: 6000,
          })
        );
      });
  };

  const handleUserID = (token) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        const { username, email, is_superuser } = res.data;
        localStorage.setItem("issuperuser", is_superuser);
      })
      .catch((err) => {
        localStorage.setItem("issuperuser", false);
      });
  };

  return (
    <>
      <div className="mainbody">
        <div className="login-outerdiv">
          <div className="loginsection">
            <ValidatorForm className="loginform" onSubmit={handleLogin}>
              <div className="logintitle">
                <img className="logo" src={logo} alt="Parking Map Logo" />
                <div className="logotitle">
                  Let’s login to your  Parking Management Map Account
                </div>
              </div>
              <div className="loginformcontrol">
                <label className="loginlabel">Email</label>
                <TextValidator
                  variant="outlined"
                  validators={["required", "isEmail"]}
                  errorMessages={["Email is required", "Email is not valid"]}
                  className="logininput"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  type="text"
                />
              </div>
              <div className="loginformcontrol">
                <label className="loginlabel">Password</label>
                <TextValidator
                  variant="outlined"
                  validators={["required"]}
                  value={loginData.password}
                  errorMessages={["Password is required"]}
                  className="logininput"
                  name="password"
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="LoginButton">
                <button type="submit" className="loginbuttoncontrol">
                  Login
                </button>
              </div>
            </ValidatorForm>
          </div>
        </div>
      </div>
      <div className="loginfooter">
        <span>Copyright by Parking Management 2023</span>
      </div>
    </>
  );
};

export default Login;
