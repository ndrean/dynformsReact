import React from "react";
import { render } from "react-dom";
import "fontsource-roboto";
//import Paper from "@material-ui/core/Paper";
//import Image from "./kitesurf.png";
//import "./index.css";
import Container from "@material-ui/core/Container";
// import { makeStyles } from "@material-ui/core/styles";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Downwind from "./Components/downwind";
import SearchAppBar from "./Components/appbar";

import Router from "universal-router";
// import { createBrowserHistory } from "history";

import * as serviceWorker from "./serviceWorker";
import history from "./Components/history";
import { useIdb } from "react-use-idb";

import { ReactComponent as Logo } from "./Components/images/kitesurfing.svg";
// import Logo from "./Components/logo";
import mapboxgl from "mapbox-gl";
import "./App.css";
import Loader from "./Components/spinner";

function Map({ lat = 45, lng = 5, zoom = 4 }) {
  const [isLoading, setIsLoading] = React.useState(true);
  // const mapContainerRef = React.useRef(null);
  const [marker, setMarker] = React.useState([]);
  const [latitude, setLatitude] = React.useState(lat);
  const [longitude, setLongitude] = React.useState(lng);
  const [Zoom, setZoom] = React.useState(zoom);
  const [place, setPlace] = React.useState(null);

  // process.env.APP_TOKEN "pk.eyJ1IjoibmRyZWFuIiwiYSI6ImNrMnE2d3RlZTBiMjkzZHA3enZ4dXU1cmEifQ.5DQRQQ9H6Gb0Fpat5mz1uw";

  const mapboxApiAccessToken =
    "pk.eyJ1IjoibmRyZWFuIiwiYSI6ImNrMnE2d3RlZTBiMjkzZHA3enZ4dXU1cmEifQ.5DQRQQ9H6Gb0Fpat5mz1uw";
  mapboxgl.accessToken = mapboxApiAccessToken;

  React.useLayoutEffect(() => {
    const map = new mapboxgl.Map({
      container: "mapContainerRef", //.current, // matches <div id="map" />
      style: "mapbox://styles/mapbox/streets-v11", // sets the dark mode
      center: [longitude, latitude], // Sets the center of the map (long, lat)
      zoom: zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    const Marker = new mapboxgl.Marker()
      .setLngLat([5, 45])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          "<p>Date : xx/xx/xx</p> <p>3 kiters</p>"
        )
      )
      .addTo(map);

    setMarker(Marker);
    map.on("idle", () => setIsLoading(false));
    map.on("move", () => {
      setLongitude(map.getCenter().lng.toFixed(2));
      setLatitude(map.getCenter().lat.toFixed(2));
      setZoom(map.getZoom().toFixed(1));
    });

    map.on("click", (e) => {
      localStorage.setItem("point", JSON.stringify(e.lngLat));
      setLongitude(e.lngLat.lng.toFixed(2));
      setLatitude(e.lngLat.lat.toFixed(2));
    });
    return () => map.remove();
  }, []);

  async function handleLocation(e) {
    e.preventDefault();
    marker.setLngLat([longitude, latitude]);
    fetch(
      `https://api.mapbox/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxApiAccessToken}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(console.log);
    // setMarker(marker);
  }

  async function handleForwardGeolocation(e) {
    e.preventDefault();
    try {
      const results = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${mapboxApiAccessToken}`
      );
      const data = await results.json();
      if (data) {
        const [
          {
            geometry: { coordinates },
          },
          ...rest
        ] = data.features;
        console.log(coordinates);
        marker.setLngLat(coordinates);
        setLatitude(coordinates[1]);
        setLongitude(coordinates[0]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <p
        style={{
          display: "inline-block",
          margin: 12,
          padding: 5,
          backgroundColor: "#404040",
          color: "white",
          fontWeigth: "bold",
          fontSize: 18,
        }}
      >
        Lat: {latitude}, Long: {longitude}
      </p>
      <Container style={{ position: "relative" }}>
        {" "}
        {isLoading && <Loader />}
      </Container>
      {!isLoading && (
        <form onSubmit={handleLocation}>
          <input
            type="text"
            id="long"
            name="long"
            onChange={(e) => setLongitude(e.target.value)}
          />
          <input
            type="text"
            id="lat"
            name="lat"
            onChange={(e) => setLatitude(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      )}
      {!isLoading && (
        <form onSubmit={handleForwardGeolocation}>
          <input
            type="text"
            id="place"
            name="place"
            onChange={(e) => setPlace(e.target.value)}
          />
          <input type="submit" value="search" />
        </form>
      )}
      <div id="mapContainerRef"></div>
      {/* ref={mapContainerRef} */}
    </>
  );
}

function Layout({ children }) {
  const [body, setBody] = React.useState(
    <>
      <Container>
        <SearchAppBar />
      </Container>
    </>
  );

  React.useEffect(() => {
    setBody(
      <>
        <Container>
          <SearchAppBar />
          {children}
        </Container>
      </>
    );
  }, [children]);
  return body;
}

function Geoloc() {
  const [pos, setPos] = React.useState({ lat: "", lng: "" });
  const [accept, setAccept] = React.useState(false);

  React.useEffect(() => {
    if (accept) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log(latitude, longitude);
          setPos({
            lat: latitude.toFixed(2),
            lng: longitude.toFixed(2),
          });
        }
      );
    }
  }, [accept]);
  return (
    <>
      <button onClick={() => setAccept(true)}>Accept geolocalisation</button>
      {accept && (
        <p>
          {" "}
          You are here: {pos.lat} | {pos.lng}{" "}
        </p>
      )}
    </>
  );
}

const routes = [
  {
    path: "/",
    async action() {
      return (
        <>
          <Layout>
            <Container style={{ position: "relative", display: "flex" }}>
              <Logo style={{ opacity: 0.15, position: "relative" }} />
              <Container style={{ position: "absolute" }}>
                <h1> Welcome to Downwind Finder </h1>
                <p>
                  {" "}
                  To fully use this app, you may want to enable geolocalisation
                  and create an account.
                </p>

                <p>You can find a downwind close to you:</p>
                <Geoloc />
                <p>
                  You can propose to join a downwind when you are logged in. The
                  kiter who initiated the downwind will accept or not your
                  demand.
                </p>
                <p>
                  You can create a downwind and push an invitation to other
                  members when logged in.
                </p>
                <p>You can respond to an invitation when you are logged in.</p>
                <li></li>
              </Container>
            </Container>
          </Layout>
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
          <Layout>
            <Downwind />
          </Layout>
          {/* </React.StrictMode> */}
        </>
      );
    },
  },
  {
    path: "/Maps",
    async action() {
      return (
        <Layout>
          <Container>
            <Map />
          </Container>
        </Layout>
      );
    },
  },
];

const router = new Router(routes);
// eslint-disable-next-line no-restricted-globals

function renderRoute() {
  router.resolve({ pathname: window.location.pathname }).then((html) => {
    render(html, document.getElementById("root"));
  });
}

history.listen(renderRoute);
history.listen(({ location }) => console.log(`${location.pathname}`));
renderRoute(history.location);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
