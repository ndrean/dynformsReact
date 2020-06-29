import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//import * as esri from "esri-leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
//import { basemapLayer } from "esri-leaflet";
//import turf from "../outTurf.js";
import AddDate from "./date";
import AddPointForm from "./AddPointForm";
import PointsTable from "./PointsTable";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";

import Loader from "./Loader.js";
import { greenIcon } from "./icons";

export default function Lmap({ Lat, Lng, zoom } = {}) {
  const [point, setPoint] = React.useState({
    lat: Lat,
    lng: Lng,
  });
  const [address, setAddress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [itinary, setItinary] = React.useState(null);
  const [date, setDate] = React.useState(null);

  // mount the map
  const lmapRef = React.useRef(null);
  const lmarker = React.useRef(null);
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

    lmarker.current = L.marker([Lat, Lng], {
      title: "Home",
      alt: "Home position",
      opacity: 0.7,
      icon: greenIcon,
    }).addTo(lmapRef.current);
    return () => lmapRef.current.remove();
  }, []);

  const markersRef = React.useRef(null);
  React.useEffect(() => {
    //markersRef.current = new L.layerGroup().addTo(lmapRef.current);

    const searchControl = new esriGeocode.geosearch({
      expanded: true,
      position: "topright",
      placeholder: "Search for places or addresses",
      title: "Location Search",
      collapseAfterResult: true,
      allowMultipleResults: true,
    }).addTo(lmapRef.current);

    //const results = L.layerGroup().addTo(lmapRef.current);
    markersRef.current = L.layerGroup().addTo(lmapRef.current);
    searchControl.on("results", (e) => {
      markersRef.current.clearLayers();
      L.marker(e.latlng).addTo(markersRef.current);
      setPoint(e.latlng);
      markersRef.current.addLayer(L.marker(e.results[0].latlng));
    });

    // find address on click with reverseGeocode (ESRI)
    lmapRef.current.on("click", (e) => {
      markersRef.current.clearLayers();
      setPoint(e.latlng);
      reverseGeocode(e.latlng);
    });
    return () => markersRef.current.remove();
  }, []);

  React.useEffect(() => {
    lmapRef.current.on("click", (e) => {
      markersRef.current.clearLayers();
      setPoint(e.latlng);
      reverseGeocode(e.latlng);
    });
    return () => markersRef.current.remove();
  }, []);

  async function reverseGeocode(gps) {
    markersRef.current.clearLayers();
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
        const marker = L.marker(gps).addTo(markersRef.current);
        const content = L.DomUtil.create("div");
        content.innerHTML = `
          <p>${JSON.stringify(ShortLabel)}</p>
          <p>${JSON.stringify(City)}</p>
          `;
        marker.bindPopup(content).openPopup();
      });
  }

  // store point to the table
  function handleFormSubmit(e) {
    e.preventDefault();
    if (address) {
      L.marker(point).addTo(markersRef.current);
      setRows((prev) => {
        return [
          ...prev,
          {
            id: new Date(),
            address,
            point,
          },
        ];
      });
    }
  }

  // final [start, end] saved
  function postItinary() {
    if (!date) {
      alert("Please set a date");
      return;
    }
    if (itinary) {
      const formdata = new FormData();
      itinary.forEach((it, idx) => formdata.append("idx", JSON.stringify(it)));
    } else {
      const formdata = new FormData();
      rows.forEach((r, idx) => {
        const mark = L.marker(r.point).toGeoJSON();
        mark.properties.date = date;
        formdata.append("idx", JSON.stringify(mark));
      });
      setItinary(formdata);
      setRows([]);
      markersRef.current.clearLayers();
      return formdata;
    }
  }

  function handleRowRemove(address) {
    setRows(rows.filter((row) => row.address !== address));
  }

  // function showOnMap(coords) {
  //   L.marker(coords).addTo(markersRef.current);
  // }

  function drawItinary() {
    if (rows.length > 1) {
      markersRef.current.clearLayers();
      const polygone = [],
        geojson = [],
        turfpoly = [];
      [...rows].forEach((r) => {
        polygone.push(r.point);
        turfpoly.push([r.point.lat, r.point.lng]);
        // removed address
        console.log(L.marker(r.point).toGeoJSON());
        const mark = L.marker(r.point).toGeoJSON();
        mark.properties.date = date;
        geojson.push(mark);
      });
      setItinary(geojson);
      L.polyline(polygone).addTo(markersRef.current);
      L.marker(polygone[0]).addTo(markersRef.current);
      if (polygone.length > 1) {
        L.marker(polygone.slice(-1)[0]).addTo(markersRef.current);
      }
    }
  }

  function handleClick(e) {
    e.preventDefault();
    const answer = prompt("Define the start point");
    console.log(answer);
  }

  // function handleDateSubmit(e) {
  //   e.preventDefault();
  // }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  return (
    <>
      <h1>Compose your itinary by selecting points on the map</h1>
      <h3>
        {" "}
        To validate the point, press 'Store Point'. and when finished, 'Save
        Itinary'
      </h3>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <AddDate
            //onFormSubmit={(e) => handleDateSubmit(e)}
            onDateChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={3}>
          <AddPointForm
            onFormSubmit={handleFormSubmit}
            latitude={parseFloat(point.lat).toFixed(4)}
            longitude={parseFloat(point.lng).toFixed(4)}
            address={JSON.stringify(address)}
          />
        </Grid>
      </Grid>

      <div id="Lmap">{isLoading && <Loader />} </div>
      {rows && (
        <PointsTable
          rows={rows}
          onRowRemove={handleRowRemove}
          onPopup={handleClick}
        />
      )}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={drawItinary}>
            Draw itinary
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="secondary" onClick={postItinary}>
            Save Itinary
          </Button>
        </Grid>
      </Grid>
      <p>{JSON.stringify(itinary)}</p>
    </>
  );
}

// const old = {};old[e.target.name] = e.target.value; console.log(old);
