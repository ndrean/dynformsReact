import React from "react";
import ReactDOM from "react-dom";
//import Paper from "@material-ui/core/Paper";
//import Image from "./kitesurf.png";
//import "./index.css";
import Downwind from "./Components/downwind";
import SearchAppBar from "./Components/appbar";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <SearchAppBar />
    <Downwind />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
