import React from "react";
import { Dialog, DialogTitle } from "@mui/material";

function LogoutConfirmation(props) {
  const { open, onClose, title, onConfirm } = props;

  return (
    <Dialog className="deletepopup-section" open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title" className="popup-body">
        {title}
      </DialogTitle>

      <div className="popup-button">
        <label>
          <button className="btncontrol" onClick={onConfirm}>
            Yes
          </button>
        </label>
        <label>
          <button className="btncontrol1" onClick={onClose}>
            No
          </button>
        </label>
      </div>
    </Dialog>
  );
}

export default LogoutConfirmation;
