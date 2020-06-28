// https://cherniavskii.com/using-leaflet-in-react-apps-with-react-hooks/

import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

//import { observable } from "mobx";
//import { observer } from "mobx-react-lite";

import useConfigureLeaflet from "./useConfigureLeaflet";

import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon, greyIcon } from "./icons";
import fetchFakeData from "./fakeFetch";
import { Notifications } from "./notifications";

useConfigureLeaflet();

const radius = 40_000;

const setOfActivities = [
  { activity: "Kite", color: blueIcon },
  { activity: "Canoe", color: greenIcon },
  { activity: "Bike", color: redIcon },
];

const dateFormat = require("dateformat");

export default function Search({ Lat, Lng, zoom } = {}) {
  const [activity, setActivity] = React.useState("Kite");
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  //const [notif, setNotif] = React.useState([]);

  // fetch the data
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

  // mount the map
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
    L.control.scale().addTo(mapRef.current);
    return () => mapRef.current.remove();
  }, []);

  // setup a layer above the map
  const layerRef = React.useRef(null);
  React.useEffect(() => {
    layerRef.current = new L.featureGroup().addTo(mapRef.current);
    return () => layerRef.current.remove();
  }, []);

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
      if (checkbox.checked && !checkActivity.properties.ischecked) {
        // setNotif([...notif, { id: id, notified: false }]);
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
        // setNotif(notif.filter((n) => n.id !== id));
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

  // set the color of a marker upon the activity/color hash 'setOfActivities'
  function selectColor(feature, latlng) {
    return L.marker(latlng, {
      icon: setOfActivities.find(
        (a) => a.activity === feature.properties.activity
      ).color,
    });
  }

  // define the content of a popup binding to a marker
  function setContent({ feature, check }) {
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

  React.useEffect(() => {
    layerRef.current.clearLayers();
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        const marker = selectColor(feature, latlng);
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

  // activity selector
  function handleActivityChange(e) {
    setActivity(e.target.value);
  }

  // reposition a marker on map from the table
  function handleClick({
    activity: {
      geometry: { coordinates },
    },
  }) {
    const marker = L.marker([coordinates[1], coordinates[0]], {
      icon: greyIcon,
    });
    marker.addTo(layerRef.current);
  }

  function handleRemove(e, { act }) {
    setActivities((allActivities) =>
      [...allActivities].filter((activity) => activity.id !== act.id)
    );
    //setNotif([...notif, notif.filter((n) => n.id !== act.id)]);
    setData((allData) => {
      const copy = [...allData];
      const index = copy.findIndex((f) => f.properties.id === act.id);
      copy[index].properties.ischecked = false;
      return copy;
    });
  }

  function handleNotification(e, { act }) {
    Notifications.add();
  }

  //   setNotif((Allnotif) => {
  //     const copy = [...Allnotif].filter((n) => n.id !== act.id);
  //     return [...copy, { id: act.id, notified: true }];
  //   });
  // }

  return (
    <>
      <SelectType activity={activity} onActivityChange={handleActivityChange} />
      <div ref={mapRef} id="map">
        {isLoading && <Loader />}{" "}
      </div>
      <p>Click on the marker and select/unselect and ask to join the event:</p>
      {activities &&
        activities.map((a) => (
          <p key={a.id}>
            {" "}
            <button onClick={() => handleClick({ activity: a })}>
              {a.activity}, {a.id}, {dateFormat(a.dateStart, "dddd-dd/mm/yy")},
              contact: {a.username}
            </button>
            <button onClick={(e) => handleRemove(e, { act: a })}>Remove</button>
            <button onClick={(e) => handleNotification(e, { act: a })}>
              Confirm participation?
            </button>
          </p>
        ))}
    </>
  );
}
