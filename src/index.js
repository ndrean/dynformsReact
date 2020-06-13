import React from "react";
import ReactDOM from "react-dom";
import "fontsource-roboto";
//import Paper from "@material-ui/core/Paper";
//import Image from "./kitesurf.png";
//import "./index.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Downwind from "./Components/downwind";
import SearchAppBar from "./Components/appbar";
import * as serviceWorker from "./serviceWorker";

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundImage: "url(./kitesurf.jpeg)",
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <SearchAppBar />
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Downwind />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
