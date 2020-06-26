// https://cherniavskii.com/using-leaflet-in-react-apps-with-react-hooks/

import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import useConfigureLeaflet from "./useConfigureLeaflet";
import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon } from "./icons";
import fetchFakeData from "./fakeFetch";
//import { myData } from "./mydata";

useConfigureLeaflet();

const radius = 40_000;
const setOfActivities = ["Kite", "Canoe", "Bike"];

const dateFormat = require("dateformat");

export default function Search({ Lat, Lng, zoom } = {}) {
  const [activity, setActivity] = React.useState("Kite");
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [activities, setActivities] = React.useState([]);

  React.useEffect(() => {
    fetchFakeData({
      lat: Lat,
      lng: Lng,
      radius: radius,
      activity: activity,
    }).then((response) => {
      setData(response.features);
    });
  }, [activity, Lat, Lng]);

  const mapRef = React.useRef(null);

  React.useEffect(() => {
    mapRef.current = L.map("map", {
      center: [Lat, Lng],
      zoom: 10,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    }).on("load", () => {
      setIsLoading(false);
    });
    return () => mapRef.current.remove();
  }, []);

  const layerRef = React.useRef(null);
  React.useEffect(() => {
    layerRef.current = new L.featureGroup().addTo(mapRef.current);
    return () => layerRef.current.remove();
  }, []);

  function setContent({ feature: feature, check: check }) {
    const input = check
      ? `<input type="checkbox" checked }/>`
      : `<input type="checkbox" }/>`;
    const html =
      `
        <p> nb participants: ${feature.properties.id} </p>
        <p>Date Start : ${dateFormat(
          feature.properties.dateStart,
          "dddd/dd/mm/yy"
        )}</p>
        <label>Select</label>` + input;
    return html;
  }

  const handlePopupCallback = React.useCallback(handlePopup, [
    activities,
    data,
  ]);
  // destructure the feature = {feature:{properties:{...}},geometry...}
  function handlePopup({
    properties: { id, activity, username, dateStart },
    ...rest
  }) {
    const checkbox = document.body.querySelector('input[type="checkbox"]');
    if (checkbox) {
      const checkActivity = data.find((a) => a.properties.id === id);
      console.log(checkActivity === true, checkbox.checked);

      if (checkbox.checked && !checkActivity.properties.ischecked) {
        console.log(1);
        setActivities([
          ...activities,
          {
            ...rest,
            id: id,
            activity: activity,
            username: username,
            dateStart: dateStart,
          },
        ]);
        setData((allData) => {
          const copy = [...allData];
          const index = copy.findIndex((f) => f.properties.id === id);
          copy[index].properties.ischecked = true;
          return copy;
        });
      } else if (!checkbox.checked && checkActivity.properties.ischecked) {
        console.log(2);
        setActivities(activities.filter((a) => a.id !== id) || []);
        setData((allData) => {
          const copy = [...allData];
          const index = copy.findIndex((f) => f.properties.id === id);
          copy[index].properties.ischecked = false;
          return copy;
        });
      }
    }
  }

  React.useEffect(() => {
    layerRef.current.clearLayers();
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        let marker = L.marker(latlng);
        switch (feature.properties.activity) {
          case "Bike":
            marker = L.marker(latlng, {
              icon: redIcon,
            });
            break;
          case "Kite":
            marker = L.marker(latlng, {
              icon: blueIcon,
            });
            break;
          default:
            marker = L.marker(latlng, {
              icon: greenIcon,
            });
        }
        // const marker = L.marker(latlng, { icon: greenIcon });
        const content = L.DomUtil.create("div");
        content.innerHTML = setContent({
          feature: feature,
          check: feature.properties.ischecked,
        });
        const popup = marker.bindPopup(content);
        if (popup) {
          popup.on("popupclose", () => {
            handlePopupCallback(feature);
          });
        }
        return marker;
      },
    }).addTo(layerRef.current);
  }, [data, activities, handlePopupCallback]);

  function handleActivityChange(e) {
    setActivity(e.target.value);
  }

  function handleClick({
    activity: {
      geometry: { coordinates },
    },
  }) {
    console.log(coordinates);
    L.marker([coordinates[1], coordinates[0]], { icon: blueIcon }).addTo(
      layerRef.current
    );
  }
  return (
    <>
      <SelectType activity={activity} onActivityChange={handleActivityChange} />
      <div id="map">{isLoading && <Loader />} </div>
      <p>Click on the marker and select/unselect and ask to join the event:</p>
      {activities &&
        activities.map((a) => (
          <p key={a.id}>
            {" "}
            <button onClick={() => handleClick({ activity: a })}>
              {a.activity}, {a.id}, {a.dateStart}, contact: {a.username}
            </button>
            <button>Remove</button>
          </p>
        ))}
    </>
  );
}
