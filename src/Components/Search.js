import React from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { divIcon } from "leaflet";
import { basemapLayer } from "esri-leaflet";

// import * as esriGeocode from "esri-leaflet-geocoder";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import useConfigureLeaflet from "./useConfigureLeaflet";

import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon } from "./icons";
// import { geojsonData } from "./mydata";
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

const dateFormat = require("dateformat");

export default function Search({ Lat, Lng, zoom } = {}) {
  const [activity, setActivity] = React.useState("Kite");
  const [isLoading, setIsLoading] = React.useState(true);
  // const [val, setVal] = React.useState(false);
  const [activities, setActivities] = React.useState([]);
  // const [ids, setIds] = React.useState([]);

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

    myMap.on("onlocationerror", (e) => alert(e.message));

    const markerLayer = new L.layerGroup().addTo(myMap);

    const selectActivity = L.control({ position: "topright" });
    selectActivity.onAdd = function () {
      const div = L.DomUtil.create("div");
      const html =
        "<select id=" +
        "activity" +
        "><option value=" +
        "Kite" +
        ">Kite</option><option value=" +
        "Canoe" +
        ">Canoe</option><option value=" +
        "Bike" +
        ">Bike</option></select>";
      div.innerHTML = html;

      return div;
    };
    selectActivity.addTo(myMap);
    document.querySelector("#activity").addEventListener("change", (e) => {
      setActivity(e.target.value);
    });

    myMap.on("locationfound", async () => {
      markerLayer.clearLayers();
      const { lat, lng } = myMap.getCenter();
      const data = await fetchFakeData({
        lat: lat,
        lng: lng,
        radius: radius,
        activity: activity,
      });

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
            const element =
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

            const input = `<label for="activity">Select!</label>
              <input type="checkbox" id="activity_${feature.properties.id}" value="Select"/>`;

            const content = L.DomUtil.create("div");
            content.innerHTML = element + input;
            // const popup = L.popup().setPopupContent(element+input);
            const popup = layer.bindPopup(content).openPopup();
            if (popup) {
              popup.on("popupclose", (e) => {
                const checkbox = document.querySelector(
                  'input[type="checkbox"]'
                );
                if (checkbox) {
                  checkbox.addEventListener(
                    "change",
                    handleChange(checkbox, feature),
                    {
                      once: true,
                      passive: true,
                    }
                  );
                }
                function handleChange(checkbox, feature) {
                  console.log("change");
                  if (
                    checkbox.checked &&
                    activities.find(
                      (activity) => activity.id === feature.properties.id
                    ) === undefined
                  ) {
                    console.log(
                      activities.find(
                        (activity) => activity.id === feature.properties.id
                      )
                    );
                    setActivities((previous) => {
                      return [
                        ...previous,
                        {
                          id: feature.properties.id,
                          date: feature.properties.dateStart,
                          owner: feature.properties.username,
                        },
                      ];
                    });
                  } else if (!checkbox.checked) {
                    if (activities === []) {
                      setActivities([]);
                    } else {
                      setActivities(
                        activities.filter((activity) => {
                          if (activity.id !== feature.properties.id)
                            return activity;
                        })
                      );
                    }
                  }
                }
              });
            }
          }
        },
      }).addTo(markerLayer);
      //

      // checkbox.addEventListener("click", () => {
      // if (checkbox.checked) {
      //   // && activities.find((activity) => activity.id === feature.properties.id) === undefined)
      //   if (
      //     activities.find(
      //       (activity) => activity.id === feature.properties.id
      //     )
      //   ) {
      //     return activities;
      //   } else {
      //     setActivities((previous) => {
      //       return [
      //         ...previous,
      //         {
      //           id: feature.properties.id,
      //           date: feature.properties.dateStart,
      //           owner: feature.properties.username,
      //           status: checkbox.checked,
      //         },
      //       ];
      //     });
      //   }
      // } else if (!checkbox.checked) {
      //   // setVal(false);
      //
      // }
      //       });
      //     }
      //   },
      // }).addTo(markerGroup);

      // myMap.on("click", (e) => {
      //   console.log(e);
      // });
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
      {activities &&
        activities.map((a) => (
          <p key={a.id}>
            {a.id}, {a.owner}, {dateFormat(a.date, "dddd, dd/mm/yy")}{" "}
          </p>
        ))}
    </>
  );
}
