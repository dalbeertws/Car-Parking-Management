import React, { useState } from "react";
import axios from "axios";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setAlert } from "redux/slices/alertSlice";

const Password = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom validation rules
  ValidatorForm.addValidationRule("isPasswordMatch", (value) => value === formData.password);
  ValidatorForm.addValidationRule("isPasswordLength", (value) => value.length >= 8);
  ValidatorForm.addValidationRule("ismax8", (value) =>
    /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/.test(value)
  );

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/change_password/`, formData, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        dispatch(
          setAlert({
            open: true,
            message: "Password changed successfully",
            severity: "success",
            duration: 6000,
          })
        );
        ValidatorForm.removeValidationRule("isPasswordMatch");
        ValidatorForm.removeValidationRule("isPasswordLength");
        ValidatorForm.removeValidationRule("ismax8");
        window.location.reload(); // Reload the page after successful password change
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          dispatch(
            setAlert({
              open: true,
              message:
                "Same password cannot be used again. Please try with a different password",
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
      });
  };

  return (
    <div className="changepassword-outerdiv">
      <div className="change-password-section">
        <div className="logintitle passwordtitle">
          <div className="logotitle">Change Password</div>
        </div>
        <ValidatorForm onSubmit={handleSubmit}>
          <div className="row-popup change-div">
            <div className="change-password-control">
              <label className="popup-label">Set Password:</label>
              <TextValidator
                validators={["required", "isPasswordMatch", "isPasswordLength", "ismax8"]}
                errorMessages={[
                  "This field is required",
                  "Password must match with confirm password",
                  "Password must be at least 8 characters",
                  "Password must contain at least one letter and one number (no whitespace)",
                ]}
                className="popup-input1"
                value={formData.password}
                onChange={handleFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                name="password"
                type={showPassword ? "text" : "password"}
              />
            </div>
          </div>
          <div className="row-popup change-div">
            <div className="model-input-full">
              <label className="popup-label">Confirm Password:</label>
              <TextValidator
                validators={["required", "isPasswordMatch", "isPasswordLength"]}
                errorMessages={[
                  "This field is required",
                  "Confirm password must match with password",
                  "Password must be at least 8 characters",
                ]}
                className="popup-input1"
                value={formData.password2}
                name="password2"
                onChange={handleFormChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showConfirmPassword ? "text" : "password"}
              />
            </div>
          </div>
          <div className="change-password-btn-div">
            <button type="submit" className="change-password-buttoncontrol">
              Submit
            </button>
          </div>
        </ValidatorForm>
      </div>
    </div>
  );
};

export default Password;
