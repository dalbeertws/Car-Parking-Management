import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import Store from "./redux/Store";
const root = ReactDOM.createRoot(document.getElementById("root"));
const theme = createTheme({
  palette: {
    primary: {
      main: "#17448F",
      bggradient:
        "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, #1D91DE 0%, #1D47A9 100%)!important",
      contrastText: "#fff",
    },
    secondary: {
      main: "#F5F5FE",
    },
  },
});
root.render(
  <Provider store={Store}>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
