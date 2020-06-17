import React from "react";
import { render } from "react-dom";
import "fontsource-roboto";
//import Paper from "@material-ui/core/Paper";
//import Image from "./kitesurf.png";
//import "./index.css";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import Downwind from "./Components/downwind";
import SearchAppBar from "./Components/appbar";

import Router from "universal-router";
// import { createBrowserHistory } from "history";

import * as serviceWorker from "./serviceWorker";
import history from "./Components/history";

import { ReactComponent as Logo } from "./Components/images/kitesurfing.svg";
// import Logo from "./Components/logo";

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          // backgroundImage: "url(./Components/images/kitesurfing.svg)",
        },
      },
    },
  },
});

const routes = [
  {
    path: "/",
    async action() {
      return (
        <>
          <SearchAppBar />
          <Container style={{ position: "relative", display: "flex" }}>
            <Logo style={{ opacity: 0.15, position: "relative" }} />
            <p style={{ position: "absolute" }}>
              Almost 300 km downwind, 300 km of windy destinations, amazing
              beaches and blue lagoons. In these kite safaris you may see the
              HOT kiting spots in Ceara (northeastern part of Brazil) and every
              day we will do a different downwinder in the most amazing kite
              surf destinations in Brazil. We have different options for your
              new kite experience. We are organizing safaris from Cumbuco to
              Jericoacoara, Cumbuco to Parnaiba, the NorthEast Coast kite
              surfing downwind, and exploring downwind of the wild north of
              Brazil. For your safety our car is always nearby and you can stop
              the downwind at any time. Brazil is an unique exotic place with
              beautiful nature and the landscapes which are untouched by people.
              If you love nature and wildlife, then any of these kite safaris is
              absolutely right choice. The reality is just as spectacular, which
              is why sunny Brazil with its samba rhythms attracts kite surfers
              from around the world. Sun-kissed beaches, strong winds,
              spectacular natural wonders … Brazil never fails to charm its
              visitors. The best thing about kitesurfing in Brazil are the
              downwind kitesurfing trips. The concept with this is to kite
              downwind along the coast, near many beaches and villages. On your
              downwind you may stop at wave spots, flat lagoons, rivers and
              sleep every night at a different village. You can join an
              organized kitesurfing trip with an escorting car and a kitesurfing
              guide, or you can organize your own downwind kite trip with your
              friends. Some of the best routes for downwind kitesurfing are
              routes south to Fortaleza ( many flat water lagoons), or routes
              from Jericoacoara to Barra Grande (great strong wind and very
              attractive flat water kite spots). The most popular kitesurfing
              downwind trip for years, is Cumbuco to Jericoacoara
            </p>
          </Container>
        </>
      );
    },
  },
  {
    path: "/new",
    async action() {
      return (
        <>
          {/* <React.StrictMode> */}
          <SearchAppBar />
          <MuiThemeProvider theme={theme}>
            <CssBaseline />

            <Downwind />
          </MuiThemeProvider>
          {/* </React.StrictMode> */}
        </>
      );
    },
  },
  {
    path: "/about",
    async action() {
      return (
        <>
          <SearchAppBar />
          <h1>About</h1>;
        </>
      );
    },
  },
];

const router = new Router(routes);
// eslint-disable-next-line no-restricted-globals

function renderRoute(location) {
  router.resolve({ pathname: window.location.pathname }).then((html) => {
    render(html, document.getElementById("root"));
  });
}

renderRoute(history.location);
history.listen(renderRoute);
history.listen(({ location }) => console.log(`${window.location.pathname}`));
// renderRoute(window.location);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
