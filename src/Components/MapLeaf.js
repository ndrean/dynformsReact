import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//import * as esri from "esri-leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
//import { basemapLayer } from "esri-leaflet";

//import useConfigureLeaflet from "./useConfigureLeaflet";

import AddPointForm from "./AddPointForm";
import PointsTable from "./PointsTable";
import Button from "@material-ui/core/Button";
import Loader from "./Loader.js";

//useConfigureLeaflet();

export default function Lmap({ Lat, Lng, zoom, mapRef } = {}) {
  const [point, setPoint] = React.useState({
    lat: Lat,
    lng: Lng,
  });
  const [address, setAddress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [itinary, setItinary] = React.useState({});

  // mount the map
  const lmapRef = React.useRef(null);
  React.useEffect(() => {
    lmapRef.current = L.map("Lmap", {
      center: [Lat, Lng],
      zoom: 10,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    }).on("load", () => setIsLoading(false));
    L.control.scale().addTo(lmapRef.current);
  }, []);

  const markersRef = React.useRef(null);
  React.useEffect(() => {
    markersRef.current = new L.layerGroup().addTo(lmapRef.current);

    const searchControl = new esriGeocode.geosearch().addTo(lmapRef.current);

    searchControl.on("results", (e) => {
      markersRef.current.clearLayers();
      L.marker(e.latlng).addTo(markersRef.current);
      setPoint({ lat: e.latlng.lat.toFixed(4), lng: e.latlng.lng.toFixed(4) });
      setRows((prev) => {
        return [
          ...prev,
          {
            address: {
              Country: e.results[0].properties.Country,
              Address: e.results[0].properties.ShortLabel,
              City: e.results[0].properties.City,
            },

            point: {
              lat: e.latlng.lat.toFixed(4),
              lng: e.latlng.lng.toFixed(4),
            },
          },
        ];
      });
    });

    lmapRef.current.on("click", (e) => {
      markersRef.current.clearLayers();
      setPoint({ lat: e.latlng.lat.toFixed(2), lng: e.latlng.lng.toFixed(2) });
      reverseGeocode(e.latlng);

      const marker = L.marker(e.latlng).addTo(markersRef.current);
      // marker
      //   .bindPopup(`<p>${JSON.stringify(address)}</p>`)
      //   .openPopup()
      //   .addTo(markersRef.current);
    });
    return () => markersRef.current.remove();
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
    setPoint({
      lat: point.lat,
      lng: point.lng,
    });
    setRows((prev) => {
      return [
        ...prev,
        {
          address,
          point,
        },
      ];
    });
  }

  function postItinary() {
    const formdata = new FormData();
    const date = new Date().toDateString();
    formdata.append("date", JSON.stringify(date));
    rows.forEach((r, idx) => formdata.append("idx", JSON.stringify(r.point)));
    setItinary(formdata);
    return formdata;
  }

  function handleRowRemove(add) {
    setRows(rows.filter((row) => row.address !== add));
  }

  return (
    <>
      <AddPointForm
        onFormSubmit={handleFormSubmit}
        latitude={parseFloat(point.lat).toFixed(4)}
        longitude={parseFloat(point.lng).toFixed(4)}
        address={JSON.stringify(address)}
      />
      <div id="Lmap">{isLoading && <Loader />} </div>
      <PointsTable rows={rows} onRowRemove={handleRowRemove} />
      <Button variant="contained" color="primary" onClick={postItinary}>
        Save Itinary
      </Button>
    </>
  );
}
