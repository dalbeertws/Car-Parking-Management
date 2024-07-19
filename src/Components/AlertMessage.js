import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Zoom from "@mui/material/Zoom";
import PropTypes from "prop-types";
import { closeAlert } from "redux/slices/alertSlice";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GrowTransition(props) {
  return <Zoom {...props} />;
}

function AlertMessage() {
  const dispatch = useDispatch();
  const { open, duration, severity, message } = useSelector(
    (state) => state.alert
  );

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeAlert());
  };

  useEffect(() => {
    
  }, [open]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      onClose={handleClose}
      autoHideDuration={duration}
      TransitionComponent={GrowTransition}
    >
      <Alert
        onClose={() => dispatch(closeAlert())}
        severity={severity}
        sx={{
          color: "white!important",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: message }} />
      </Alert>
    </Snackbar>
  );
}
AlertMessage.propTypes = {
open: PropTypes.bool.isRequired,
closeCall: PropTypes.func.isRequired,
duration: PropTypes.number.isRequired,
severity: PropTypes.string.isRequired,
message: PropTypes.string.isRequired,
};

AlertMessage.defaultProps = {
open: false,
closeCall: () => {},
duration: 6000,
severity: "success",
message: "",
};

export default AlertMessage;
