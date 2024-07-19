import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { RiEyeOffFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
function PasswordShow({ password }) {
  const [show, setshow] = useState(false);

  function bgclr() {
    if (show) {
      return "#4E445C";
    } else {
      return "#A09DAB";
    }
  }
  return (
    <div className="password-section">
      <Typography className="passwordtext">
        <span style={{ color: bgclr() }}>{show ? password : "*********"}</span>
      </Typography>

      <Box
        sx={{
          width: "26px",
          height: "20px",
          fontSize: "20px",
          color: bgclr(),
          justifyContent: "center",
          padding: "0",
          marginRight: "0",
          borderRadius: "50%",
        }}
      >
        {show ? (
          <IoMdEye
            onClick={(e) => {
              setshow(!show);
            }}
          />
        ) : (
          <RiEyeOffFill
            onClick={(e) => {
              setshow(!show);
            }}
          />
        )}
      </Box>
    </div>
  );
}

export default PasswordShow;
