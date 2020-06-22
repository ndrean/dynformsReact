import React from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { basemapLayer } from "esri-leaflet";

// import * as esriGeocode from "esri-leaflet-geocoder";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import useConfigureLeaflet from "./useConfigureLeaflet";

import SelectType from "./SelectType";
// import { geojsonFeature } from "./mydata";
import fetchFakeData from "./fakeFetch";
// import { map } from "mobx-state-tree/dist/internal";
useConfigureLeaflet();

const radius = 40_000;

export default function Search({ Lat, Lng, zoom } = {}) {
  // const [latitude, setLatitude] = React.useState(Lat);
  // const [longitude, setLongitude] = React.useState(Lng);
  const [center, setCenter] = React.useState({ lat: Lat, lng: Lng });
  const [type, setType] = React.useState("Kite");
  // const [address, setAddress] = React.useState(null);
  // const [markerState, setMarkerState] = React.useState(null);
  // const [rows, setRows] = React.useState([]);

  Search.propTypes = {
    Lat: PropTypes.number,
    Lng: PropTypes.number,
    zoom: PropTypes.number,
  };

  React.useEffect(() => {
    const myMap = L.map("map").locate({ setView: true, maxZoom: 8 });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    // basemapLayer("Streets").addTo(myMap);
    // setView([point.lat, point.lng], Zoom);

    myMap.on("onlocationerror", (e) => alert(e.message));

    const markerGroup = new L.layerGroup().addTo(myMap);
    // setMarkerState(markerGroup);
    const kite = L.layerGroup();

    // const searchControl = new GeoSearchControl({
    //   provider: new OpenStreetMapProvider(),
    //   style: "button",
    //   autoCompleteDelay: 250,
    // });
    // myMap.addControl(searchControl);

    myMap.on("locationfound", async (e) => {
      setCenter({ lat: e.latlng.lat, lng: e.latlng.lng });
      L.circle(e.latlng, radius).addTo(markerGroup);
      const sort = type;
      console.log(sort);

      markerGroup.clearLayers();
      const { lat, lng } = myMap.getCenter();
      setCenter({ lat, lng });
      // L.circle([lat, lng], radius).addTo(markerGroup);

      // adding the markers from the db
      const data = await fetchFakeData({ lat: lat, lng: lng, radius: radius });

      const dateFormat = require("dateformat");

      L.geoJSON(data.features, {
        onEachFeature: (feature, layer) => {
          layer.bindPopup(
            "<h4>" +
              dateFormat(feature.properties.dateStart, "dd-mm-yy") +
              "->" +
              dateFormat(feature.properties.dateEnd, "dd-mm-yy") +
              "</h4> <p> # participants:" +
              feature.properties.nbParticipants +
              "</p>"
          );
        },
        style: (feature) => {
          switch (feature.properties.type) {
            case "Bike":
              return { color: "#0000ff" };
            case "Kite":
              return { color: "#ff0000" };

            default:
              return { color: "#000000" };
          }
        },
        filter: (feature) => {
          return feature.properties.type === sort;
        },
      }).addTo(markerGroup);

      // myDataLayer.bindPopup("hi").on("click", () => console.log("ici"));
    });

    // const searchControl = new esriGeocode.geosearch().addTo(myMap);
    // const resultGroup = new L.layerGroup().addTo(myMap);
    // searchControl.on("results", (e) => {
    //   L.marker(e.latlng).addTo(markerGroup);
    //   setLatitude(e.latlng.lat.toFixed(4));
    //   setLongitude(e.latlng.lng.toFixed(4));
    //   setPoint({ lat: e.latlng.lat.toFixed(4), lng: e.latlng.lng.toFixed(4) });
    //   setRows((prev) => {
    //     return [
    //       ...prev,
    //       {
    //         address: {
    //           Country: e.results[0].properties.Country,
    //           Address: e.results[0].properties.ShortLabel,
    //           City: e.results[0].properties.City,
    //         },

    //         point: {
    //           lat: e.latlng.lat.toFixed(4),
    //           lng: e.latlng.lng.toFixed(4),
    //         },
    //       },
    //     ];
    //   });
    //   // resultGroup.clearLayers();
    // });

    // myMap.on("click", (e) => {
    //   markerGroup.clearLayers();
    //   setPoint({ lat: e.latlng.lat.toFixed(4), lng: e.latlng.lng.toFixed(4) });

    //   L.marker(e.latlng).addTo(markerGroup);
    //   reverseGeocode(e.latlng);
    //   // setZoom(e.target._zoom);
    // });

    return () => myMap.remove();
  }, [type]);

  // async function reverseGeocode(gps) {
  //   esriGeocode
  //     .geocodeService()
  //     .reverse()
  //     .latlng(gps)
  //     .run((error, result) => {
  //       if (error) return alert("not found");
  //       const {
  //         address: { CountryCode, ShortLabel, City },
  //       } = result;
  //       setAddress({ Country: CountryCode, City: City, Address: ShortLabel });
  //     });
  // }

  function handleTypeChange(e) {
    setType(e.target.value);
  }

  return (
    <>
      <div id="map"></div>;
      <SelectType type={type} onTypeChange={handleTypeChange} />
    </>
  );
}
