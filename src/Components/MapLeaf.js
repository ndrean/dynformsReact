import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
//import * as esri from "esri-leaflet";
import * as esriGeocode from "esri-leaflet-geocoder";
//import { basemapLayer } from "esri-leaflet";
//import turf from "../outTurf.js";
import AddDate from "./AddDate";
import AddPointForm from "./AddPointForm";
import PointsTable from "./PointsTable";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
// import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
// import List from "@material-ui/core/List";
// import { ListItem } from "@material-ui/core";

import Loader from "./Loader.js";
import { greenIcon, blueIcon, redIcon, violetIcon } from "./icons";

/* for the modal */
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 90,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
/* end for the modal */

export default function Lmap({ Lat, Lng, zoom } = {}) {
  const [point, setPoint] = React.useState({
    lat: Lat,
    lng: Lng,
  });
  const [address, setAddress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [itinary, setItinary] = React.useState([]);
  const [date, setDate] = React.useState(null);

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  // const [positions, setPositions] = React.useState([]);
  //const [select, setSelect] = React.useState("Set position");

  // const classes = useStyles();

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

    // lmarker.current = L.marker([Lat, Lng], {
    //   title: "Home",
    //   alt: "Home position",
    //   opacity: 0.7,
    //   icon: greenIcon,
    // }).addTo(lmapRef.current);
    return () => lmapRef.current.remove();
  }, []);

  const markersRef = React.useRef(null);
  React.useEffect(() => {
    markersRef.current = L.layerGroup().addTo(lmapRef.current);

    const searchControl = new esriGeocode.geosearch({
      expanded: true,
      position: "topright",
      placeholder: "Search for places or addresses",
      title: "Location Search",
      collapseAfterResult: true,
      allowMultipleResults: true,
    }).addTo(lmapRef.current);

    searchControl.on("results", (e) => {
      markersRef.current.clearLayers();
      L.marker(e.latlng, { icon: blueIcon }).addTo(markersRef.current);
    });
    return () => markersRef.current.remove();
  }, []);

  // find address on click with reverseGeocode (ESRI)
  React.useEffect(() => {
    lmapRef.current.on("click", (e) => {
      markersRef.current.clearLayers();
      setPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
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
        const marker = L.marker(gps, { icon: blueIcon }).addTo(
          markersRef.current
        );
        const content = L.DomUtil.create("div");
        content.innerHTML = `
          <p>${ShortLabel}</p>
          <p>${City}</p>
          `;
        marker.bindPopup(content).openPopup();
      });
  }

  // store point to the table
  function handleAddPoint(e) {
    e.preventDefault();
    if (address) {
      //L.marker(point).addTo(markersRef.current);
      setRows((prev) => {
        return [
          ...prev,
          {
            id: new Date(),
            address,
            point: {
              lng: parseFloat(point.lng).toFixed(6),
              lat: parseFloat(point.lat).toFixed(6),
            },
            position: "Set Position",
          },
        ];
      });
    }
  }

  function saveItinary() {
    // date needed
    if (!date) {
      alert("Please set a date");
      return null;
    }

    // positions needed
    if (rows.length > 1) {
      let ok = true;
      rows.forEach((row) => {
        for (const [, v] of Object.entries(row)) {
          if (v === "Set Position") {
            ok = false;
            return alert("Please set Position");
          }
        }
      });
      if (!ok) return null;
    }

    markersRef.current.clearLayers();

    // shuffle start/end of the rows
    let newRows = rows;
    const findStart = newRows.find((r) => r.position === "Start point");
    if (findStart) {
      const idx = newRows.findIndex((r) => r === findStart);
      newRows.splice(idx, 1);
      newRows.unshift(findStart);
    }
    const findEnd = newRows.find((r) => r.position === "End point");
    if (findEnd) {
      const idx = newRows.findIndex((r) => r === findEnd);
      newRows.splice(idx, 1);
      newRows.push(findEnd);
    }
    setRows(newRows);
    console.log(newRows);

    // removed address for copyrights ESRI and create geojson itinary
    const newGeoJSON = [];
    newRows.forEach((r) =>
      newGeoJSON.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [r.point.lat, r.point.lng],
        },
        properties: {
          position: r.position,
          dateStart: date,
        },
      })
    );
    setItinary(newGeoJSON);

    const polygone = [],
      geojson = [];
    [...rows].forEach((r) => {
      polygone.push([r.point.lat, r.point.lng]);
      // removed address
      const mark = L.marker([r.point.lat, r.point.lng], {
        icon: greenIcon,
      }).toGeoJSON();
      mark.properties.date = date;
      mark.properties.position = geojson.push(mark);
    });
    console.log(geojson);
    L.polyline(polygone).addTo(markersRef.current);
    L.marker(polygone[0], { icon: blueIcon }).addTo(markersRef.current);
    L.marker(polygone[polygone.length - 1], { icon: redIcon }).addTo(
      markersRef.current
    );
    if (polygone.length > 1) {
      L.marker(polygone.slice(-1)[0]).addTo(markersRef.current);
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

  function showOnMap(coords) {
    L.marker([coords.lat, coords.lng], { icon: violetIcon }).addTo(
      markersRef.current
    );
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  /* modal */
  const handleModalOpen = (latlng) => {
    setPoint(latlng);
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleSelect = (e) => {
    const status = e.target.firstChild.data;

    let findRow = rows.find(
      (row) => row.point.lat === point.lat && row.point.lng === point.lng
    );

    let newRows = [
      ...rows.filter((r) => r !== findRow), // remove the found row
      { ...findRow, position: status }, // and replace by a modified one
    ];
    setRows(newRows);
  };
  /* end modal */

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
            onSubmit={(e) => e.preventDefault()}
            onDateChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={3}>
          <AddPointForm onFormSubmit={handleAddPoint} />
        </Grid>
      </Grid>

      <div id="Lmap">{isLoading && <Loader />} </div>
      {rows && (
        <PointsTable
          rows={rows}
          onRowRemove={handleRowRemove}
          open={open}
          onhandleSelect={handleSelect}
          onhandleModalClose={handleModalClose}
          onhandleOpen={handleModalOpen}
          modalStyle={modalStyle}
          onShowOnMap={showOnMap}
        />
      )}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={saveItinary}>
            Save Itinary
          </Button>
        </Grid>
      </Grid>
      <p>{itinary && JSON.stringify(itinary)}</p>
    </>
  );
}

// const old = {};old[e.target.name] = e.target.value; console.log(old);
