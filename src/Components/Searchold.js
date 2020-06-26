import React from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import useConfigureLeaflet from "./useConfigureLeaflet";
import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon } from "./icons";
import fetchFakeData from "./fakeFetch";

useConfigureLeaflet();

const radius = 40_000;
const setOfActivities = ["Kite", "Canoe", "Bike"];

const dateFormat = require("dateformat");

export default function Search({ Lat, Lng, zoom } = {}) {
  const [activity, setActivity] = React.useState("Kite");
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [layer, setLayer] = React.useState(null);

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

  React.useEffect(() => {
    const myMap = L.map("map", { center: [Lat, Lng], zoom: 10 })

      //.locate({ setView: true, maxZoom: 10 })
      .on("load", () => {
        setIsLoading(false);
      })
      .on("onlocationerror", (e) => alert(e.message));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    const markersLayer = new L.layerGroup().addTo(myMap);
    setLayer(markersLayer);

    L.control
      .scale({
        updateWhenIdle: true,
        imperial: false,
      })
      .addTo(myMap);

    /***** new L.control
    https://usabilityetc.com/2016/06/how-to-create-leaflet-plugins/
    1- extend and initialize an L.control
    2 - we have to redefine the .onAdd and .onRemove which is called by addTo
    */
    L.Control.SelectActivity = L.Control.extend({
      options: {
        position: null,
        array: null,
      },
      initialize: function (options) {
        L.Util.setOptions(this, options || {});
      },
      onAdd: function (map) {
        const select = L.DomUtil.create("select");
        let html = "";
        this.options.array.forEach((act) => {
          html += `<option value=${act}>${act}</option>`;
        });
        select.innerHTML = html;
        L.DomEvent.addListener(select, "change", (e) => {
          setActivity(e.target.value);
        });
        return select;
      },
      onRemove: function (map) {
        // const select = document.querySelector("select");
        // L.DomEvent.off(select, "change");
      },
    });
    new L.Control.SelectActivity({
      position: "topright",
      array: setOfActivities,
    }).addTo(myMap);
    /***** END L.Control ****/

    function pointToLayer(feature, latlng) {
      let marker = L.marker(latlng);
      // switch (feature.properties.activity) {
      //   case "Bike":
      //     marker = L.marker(latlng, {
      //       icon: redIcon,
      //     });
      //     break;

      //   case "Kite":
      //     marker = L.marker(latlng, {
      //       icon: blueIcon,
      //     });
      //     break;
      //   default:
      //     marker = L.marker(latlng, {
      //       icon: greenIcon,
      //     });
      // }
      // //}

      //function onEachFeature(feature, layer) {
      const content = L.DomUtil.create("div");
      if (feature.properties.ischecked) {
        content.innerHTML = `
            <p> nb participants: ${feature.properties.id} </p>
            <label>Select</label>
            <input type="checkbox" checked/>`;
      } else {
        content.innerHTML = `
            <p> nb participants: ${feature.properties.id} </p>
            <label>Select</label>
            <input type="checkbox" }/>`;
      }
      const popup = marker.bindPopup(content);
      if (popup) {
        popup.on("popupclose", (e) => {
          handlePopup(feature);
        });
      }
      return marker;
    }

    function handlePopup(feature) {
      const checkbox = document.body.querySelector('input[type="checkbox"]');

      if (checkbox) {
        const getActivity = activities.find(
          (activity) => activity.id === feature.properties.id
        );
        if (checkbox.checked && getActivity === undefined) {
          console.log(1);

          setData((prev) => {
            const copy = [...prev];
            const index = copy.findIndex(
              (f) => f.properties.id === feature.properties.id
            );
            copy[index].properties.ischecked = true;
            console.log(copy);
            return copy;
          });

          setActivities((allActivities) => [
            ...allActivities,
            {
              id: feature.properties.id,
            },
          ]);
        } else if (!checkbox.checked && getActivity) {
          console.log(2);
          setActivities((allActivities) =>
            allActivities.filter((a) => a.id !== feature.properties.id)
          );
        }
      }
    }

    L.geoJSON(
      data,
      // {
      //   onEachFeature: onEachFeature,
      // },
      {
        pointToLayer: pointToLayer,
      }
    ).addTo(markersLayer);

    return () => myMap.remove();
  }, [activity, data, activities, Lat, Lng]);

  function handleActivityChange(e) {
    setActivity(e.target.value);
  }

  return (
    <>
      <SelectType activity={activity} onActivityChange={handleActivityChange} />
      <div id="map">{isLoading && <Loader />} </div>
      {activities &&
        activities.map((a) => (
          <p key={a.id}>
            {a.id}, {a.owner}, {dateFormat(a.date, "dddd, dd/mm/yy")}{" "}
          </p>
        ))}
      <p>
        {Lat}
        {Lng}
      </p>
    </>
  );
}
