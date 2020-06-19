import React from "react";
import "fontsource-roboto";

import Container from "@material-ui/core/Container";

// import { useIdb } from "react-use-idb";

import mapboxgl from "mapbox-gl";
import "../App.css";
import Loader from "./Loader";

export default function Map({ lat = 45, lng = 3, zoom = 4 }) {
  const [isLoading, setIsLoading] = React.useState(true);
  // const mapContainerRef = React.useRef(null);
  const [marker, setMarker] = React.useState([]);
  const [latitude, setLatitude] = React.useState(lat);
  const [longitude, setLongitude] = React.useState(lng);
  const [zoomed, setZoomed] = React.useState(zoom);
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
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          "<p>Date : xx/xx/xx</p> <p>3 kiters</p>"
        )
      )
      .addTo(map);

    setMarker(Marker);

    map.on("idle", () => setIsLoading(false));

    // map.on("move", () => {
    //   setLongitude(map.getCenter().lng.toFixed(2));
    //   setLatitude(map.getCenter().lat.toFixed(2));
    //   setZoomed(map.getZoom().toFixed(1));
    // });

    map.on("click", (e) => {
      localStorage.setItem("click", JSON.stringify(e.lngLat));
      setLongitude(e.lngLat.lng.toFixed(2));
      setLatitude(e.lngLat.lat.toFixed(2));
    });
    return () => map.remove();
  }, []);

  async function handleReverseGeocoding(e) {
    e.preventDefault();
    // setMarker(marker.setLngLat([longitude, latitude]));
    fetch(
      `https://api.mapbox/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxApiAccessToken}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch(console.log);
    // setMarker(marker);
  }

  async function handleForwardGeocoding(e) {
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
      <p className="coordOfClick">
        Lat: {latitude}, Long: {longitude}
      </p>
      <Container style={{ position: "relative" }}>
        {" "}
        {isLoading && <Loader />}
      </Container>
      {!isLoading && (
        <button onClick={handleReverseGeocoding}>Find the name</button>
      )}
      {!isLoading && (
        <form onSubmit={handleForwardGeocoding}>
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
