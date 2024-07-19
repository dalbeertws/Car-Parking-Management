import React, { useEffect } from "react";
import cross from "../Images/cross.svg";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Button, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material";
function Adduser({
  open,
  onClose,
  title,
  buttonName,
  formData,
  handleFormChange,
  handleSubmit,
  setAddLoader,
  addLoader
}) {
  useEffect(() => {
    ValidatorForm.addValidationRule("ismax30", (value) => {
      return value.length <= 30;
    });
  });

  return (
    <div>
      <Dialog
        className="popup-section"
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="popup-body">
          <div className="popup-title">{title}</div>
          <div className="popup-title-cross">
            <Button onClick={onClose} autoFocus>
              <img src={cross} alt="cross" className="cross" />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ValidatorForm onSubmit={() => { setAddLoader(true); handleSubmit(); }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="model-input">
                    <label className="popup-label">First Name:</label>
                    <TextValidator
                      fullWidth
                      validators={["required", "ismax30"]}
                      errorMessages={[
                        "This field is required",
                        "Maximum 30 characters allowed",
                      ]}
                      className="popup-input"
                      value={formData.first_name}
                      onChange={handleFormChange}
                      type="text"
                      name="first_name"
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <div className="model-input">
                    <label className="popup-label">Last Name:</label>
                    <TextValidator
                      fullWidth
                      validators={["required", "ismax30"]}
                      errorMessages={[
                        "This field is required",
                        "Maximum 30 characters allowed",
                      ]}
                      className="popup-input"
                      value={formData.last_name}
                      onChange={handleFormChange}
                      name="last_name"
                      type="text"
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="model-input-full">
                    <label className="popup-label">Email:</label>
                    <TextValidator
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "This field is required",
                        "Invalid email format",
                      ]}
                      className="popup-input1"
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="popup-button">
                    <label>
                      <button type="submit" className="btncontrol">
                        {buttonName} {
                          addLoader ? <CircularProgress sx={{ width: '20px !important', height: '20px !important', color: '#fff' }} /> : null
                        }
                      </button>

                    </label>
                    <label>
                      <button onClick={onClose} className="btncontrol1">
                        Cancel
                      </button>
                    </label>
                  </div>
                </Grid>
              </Grid>
            </ValidatorForm>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Adduser;
