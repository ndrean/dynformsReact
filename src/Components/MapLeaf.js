import React from "react";

import AddPointForm from "./AddPointForm";
import PointsTable from "./PointsTable";
// import useConfigureLeaflet from "./useConfigureLeaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import * as esri from "esri-leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
import { basemapLayer } from "esri-leaflet";
import useConfigureLeaflet from "./useConfigureLeaflet";
// import { Map, TileLayer } from "react-leaflet";
import Button from "@material-ui/core/Button";

useConfigureLeaflet();

export default function Lmap({ Lat, Lng, zoom }) {
  const [latitude, setLatitude] = React.useState(Lat);
  const [longitude, setLongitude] = React.useState(Lng);
  const [point, setPoint] = React.useState({ lat: Lat, lng: Lng });
  const [address, setAddress] = React.useState(null);
  const [keep, setKeep] = React.useState(false);
  const [Zoom, setZoom] = React.useState(zoom);
  // const [mapState, setMapState] = React.useState(null);
  const [markerState, setMarkerState] = React.useState(null);
  const [rows, setRows] = React.useState([]);

  React.useLayoutEffect(() => {
    const myMap = L.map("map").setView([point.lat, point.lng], Zoom); //|| "./images/WesternEurpoe.png";
    basemapLayer("Streets").addTo(myMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; Powered by Esri <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });

    const markerGroup = new L.layerGroup().addTo(myMap);
    setMarkerState(markerGroup);
    L.marker([Lat, Lng]).addTo(markerGroup);

    const searchControl = new esriGeocode.geosearch().addTo(myMap);
    const resultGroup = new L.layerGroup().addTo(myMap);

    searchControl.on("results", () => {
      resultGroup.clearLayers();
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
        if (error) return alert("not found");
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
    setRows((prev) => {
      return [...prev, { address, point, keep: false }];
    });
  }

  function handleLatitudeChange(e) {
    setLatitude(e.target.value);
  }

  function handleLongitudeChange(e) {
    setLongitude(e.target.value);
  }

  function handleAddressChange(e) {
    setAddress(e.target.value);
  }

  function handleRowRemove(add) {
    setRows(rows.filter((row) => row.address !== add));
  }

  return (
    <>
      <AddPointForm
        onFormSubmit={handleFormSubmit}
        onLatitudeChange={handleLatitudeChange}
        onLongitudeChange={handleLongitudeChange}
        onAddressChange={handleAddressChange}
        latitude={parseFloat(point.lat).toFixed(4)}
        longitude={parseFloat(point.lng).toFixed(4)}
        address={JSON.stringify(address)}
      />

      <div id="map"></div>
      <PointsTable rows={rows} onRowRemove={handleRowRemove} />
      <Button variant="contained" color="primary" onClick={() => {}}>
        Save
      </Button>
    </>
  );
}
