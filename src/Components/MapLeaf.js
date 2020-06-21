import React from "react";

import InputGPS from "./InputGPS";
import TableGPS from "./TableGPS";
// import useConfigureLeaflet from "./useConfigureLeaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import * as esri from "esri-leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
import { basemapLayer } from "esri-leaflet";
import { Map, TileLayer } from "react-leaflet";
import Button from "@material-ui/core/Button";

// function createDivMap() {
//   const div = document.createElement("div");
//   div.setAttribute("id", "map");
//   document.body.appendChild(div);
// }

// const div = document.createElement("div");
// div.setAttribute("id", "map");
// document.body.appendChild(div);

export default function Lmap({ Lat, Lng, zoom }) {
  const [latitude, setLatitude] = React.useState(Lat);
  const [longitude, setLongitude] = React.useState(Lng);
  const [point, setPoint] = React.useState({ lat: Lat, lng: Lng });
  const [address, setAddress] = React.useState(null);
  const [keep, setKeep] = React.useState(false);
  const [Zoom, setZoom] = React.useState(zoom);
  const [mapState, setMapState] = React.useState(null);
  const [markerState, setMarkerState] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  React.useLayoutEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    const myMap = L.map("map").setView([point.lat, point.lng], Zoom); //|| "./images/WesternEurpoe.png";

    basemapLayer("Topographic").addTo(myMap);
    setMapState(myMap);

    const markerGroup = new L.layerGroup().addTo(myMap);
    setMarkerState(markerGroup);
    L.marker([Lat, Lng]).addTo(markerGroup);
    basemapLayer("Streets").addTo(myMap);

    const searchControl = new esriGeocode.geosearch().addTo(myMap);
    const resultGroup = new L.layerGroup().addTo(myMap);
    searchControl.on("results", (data) => {
      resultGroup.clearLayers();
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; Powered by Esri <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });

    myMap.on("click", (e) => {
      setLatitude(point.lat);
      setLongitude(point.lng);
      markerGroup.clearLayers();
      L.marker(e.latlng).addTo(markerGroup);
      reverseGeocode(e.latlng);
      setZoom(e.target._zoom);
    });
    return () => myMap.remove();
  }, []);

  async function reverseGeocode(gps) {
    esriGeocode
      .geocodeService()
      .reverse()
      .latlng(gps)
      .run((error, result) => {
        if (error) return;
        const {
          address: { CountryCode, ShortLabel, City },
        } = result;
        setAddress({ Country: CountryCode, City: City, Address: ShortLabel });
      });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setPoint({ lat: latitude, lng: longitude });
    L.marker([point.lat, point.lng]).addTo(markerState);
  }

  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }

  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleRowRemove(add) {
    setRows(rows.filter((row) => row.address !== add));
  }

  return (
    <>
      <p className="coordOfClick">
        Lat: {parseFloat(point.lat).toFixed(2)}, Long:{" "}
        {parseFloat(point.lng).toFixed(2)}
      </p>
      <p>{JSON.stringify(address)}</p>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={() => setRows([...rows, { address, point, keep }])}
      >
        Keep
      </Button>
      <InputGPS
        onFormSubmit={handleFormSubmit}
        onLatitudeChange={handleLatitudeChange}
        onLongitudeChange={handleLongitudeChange}
        latitude={parseFloat(point.Lat).toFixed(4)}
        longitude={parseFloat(point.Lng).toFixed(4)}
      />

      <div id="map"></div>
      <TableGPS rows={rows} onRowRemove={handleRowRemove} />
    </>
  );
}
