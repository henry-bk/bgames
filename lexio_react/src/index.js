import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Main from "./route";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  gameContainer: {
    position: "relative",
    width: 1280,
    height: 720,
    backgroundColor: "#888888",
  },

  lexioTheme: {
    colors: ["#ff0000", "#00ff00", "#ffff00", "#00ffff"],
    blockColor: "#181718",
    dimColor: "#403d40",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Main />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
