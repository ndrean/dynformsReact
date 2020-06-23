import React from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { divIcon } from "leaflet";
import { basemapLayer } from "esri-leaflet";

// import * as esriGeocode from "esri-leaflet-geocoder";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import useConfigureLeaflet from "./useConfigureLeaflet";

import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon } from "./icons";
import { geojsonData } from "./mydata";
import fetchFakeData from "./fakeFetch";
// import { map } from "mobx-state-tree/dist/internal";
useConfigureLeaflet();

const radius = 40_000;

const icon = L.divIcon({
  className: "custom-div-icon",
  html:
    "<div style='background-color:#4838cc;' class='marker-pin'></div><i class='fa fa-camera awesome'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

export default function Search({ Lat, Lng, zoom } = {}) {
  // const [latitude, setLatitude] = React.useState(Lat);
  // const [longitude, setLongitude] = React.useState(Lng);
  const [center, setCenter] = React.useState({ lat: Lat, lng: Lng });
  const [activity, setActivity] = React.useState("Kite");
  const [isLoading, setIsLoading] = React.useState(true);
  // const [address, setAddress] = React.useState(null);
  // const [markerState, setMarkerState] = React.useState(null);
  // const [rows, setRows] = React.useState([]);

  Search.propTypes = {
    Lat: PropTypes.number,
    Lng: PropTypes.number,
    zoom: PropTypes.number,
  };

  React.useEffect(() => {
    const myMap = L.map("map")
      .locate({ setView: true, maxZoom: 10 })
      .on("load", () => setIsLoading(false));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    // basemapLayer("Streets").addTo(myMap);
    // setView([point.lat, point.lng], Zoom);

    myMap.on("onlocationerror", (e) => alert(e.message));

    const markerGroup = new L.layerGroup().addTo(myMap);
    // setMarkerState(markerGroup);

    // const searchControl = new GeoSearchControl({
    //   provider: new OpenStreetMapProvider(),
    //   style: "button",
    //   autoCompleteDelay: 250,
    // });
    // myMap.addControl(searchControl);

    // <LayerGroup>
    //   <SelectType type={type} onTypeChange={handleTypeChange} />
    // </LayerGroup>;

    const selectbox = L.control({ position: "topright" });
    selectbox.onAdd = (myMap) => {
      const div = L.DomUtil.create("div");
      div.innerHTML = <p>ICI</p>;
      return div;
    };
    selectbox.addTo(myMap);

    myMap.on("locationfound", async (e) => {
      setCenter({ lat: e.latlng.lat, lng: e.latlng.lng });
      L.circle(e.latlng, radius).addTo(markerGroup);

      markerGroup.clearLayers();
      const { lat, lng } = myMap.getCenter();
      // setCenter({ lat, lng });
      // L.circle([lat, lng], radius).addTo(markerGroup);

      const data = await fetchFakeData({
        lat: lat,
        lng: lng,
        radius: radius,
        activity: activity,
      });

      const dateFormat = require("dateformat");

      L.geoJSON(data, {
        pointToLayer: (feature, latlng) => {
          switch (feature.properties.activity) {
            case "Bike":
              return L.marker(latlng, { icon: redIcon });
            case "Kite":
              return L.marker(latlng, { icon: blueIcon });
            default:
              return L.marker(latlng, { icon: greenIcon });
          }
        },
        // filter: (feature) => {
        //   return feature.properties.activity === activity;
        // },
        onEachFeature: (feature, layer) => {
          if (feature) {
            let html =
              "<h4> Starting :" +
              dateFormat(feature.properties.dateStart, "dd-mm-yy") +
              ", Ending: " +
              dateFormat(feature.properties.dateEnd, "dd-mm-yy") +
              "</h4>" +
              "<h5> Organized by: " +
              feature.properties.username +
              "</h5>" +
              "<p> nb participants:" +
              feature.properties.nbParticipants +
              "</p>" +
              "<h4>" +
              feature.properties.address +
              "</h4>";
            layer.bindPopup(html);
          }
        },
      }).addTo(markerGroup);

      // myLayer.bindPopup("hi").on("click", () => console.log("ici"));
    });

    return () => myMap.remove();
  }, [activity]);

  function handleActivityChange(e) {
    setActivity(e.target.value);
  }

  return (
    <>
      <SelectType activity={activity} onActivityChange={handleActivityChange} />
      <div id="map">{isLoading && <Loader />} </div>
    </>
  );
}
