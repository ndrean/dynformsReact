import React from "react";
import PropTypes from "prop-types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { divIcon } from "leaflet";
// import { basemapLayer } from "esri-leaflet";
import { observable } from "mobx";
import { observer } from "mobx-react";

// import * as esriGeocode from "esri-leaflet-geocoder";
// import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

import useConfigureLeaflet from "./useConfigureLeaflet";

import SelectType from "./SelectType";
import Loader from "./Loader.js";
import "../App.css";
import { blueIcon, redIcon, greenIcon } from "./icons";
// import { geojsonData } from "./mydata";
import fetchFakeData from "./fakeFetch";

useConfigureLeaflet();

const radius = 40_000;
const setOfActivities = ["Kite", "Canoe", "Bike"];

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
  // let center = observable({ lat: null, lng: null });
  const [lat, setLat] = React.useState(Lat);
  const [lng, setLng] = React.useState(Lng);
  const [layer, setLayer] = React.useState(null);
  const [activities, setActivities] = React.useState([]);
  const [data, setData] = React.useState(null);
  const [lmap, setLmap] = React.useState(null);
  // const [ids, setIds] = React.useState([]);

  let Oactivities = observable(activities);

  Search.propTypes = {
    Lat: PropTypes.number,
    Lng: PropTypes.number,
    zoom: PropTypes.number,
  };

  React.useLayoutEffect(() => {
    const myMap = L.map("map")
      .locate({ setView: true, maxZoom: 10 })
      .on("load", () => setIsLoading(false));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(myMap);

    myMap.on("onlocationerror", (e) => alert(e.message));

    L.control
      .scale({
        updateWhenIdle: true,
        imperial: false,
      })
      .addTo(myMap);

    const selectActivity = L.control({
      position: "topright",
    });
    selectActivity.onAdd = function () {
      const select = L.DomUtil.create("select");
      let html = "";
      setOfActivities.forEach((act) => {
        html += `<option value=${act}>${act}</option>`;
      });
      select.innerHTML = html;
      return select;
    };
    selectActivity.addTo(myMap);
    document.querySelector("select").addEventListener("change", (e) => {
      setActivity(e.target.value);
    });

    const markersLayer = new L.layerGroup().addTo(myMap);
    // setLayer(markersLayer);
    // setLmap(myMap);

    function pointToLayer(feature, latlng) {
      switch (feature.properties.activity) {
        case "Bike":
          return L.marker(latlng, {
            icon: redIcon,
          });
        case "Kite":
          return L.marker(latlng, {
            icon: blueIcon,
          });
        default:
          return L.marker(latlng, {
            icon: greenIcon,
          });
      }
    }

    myMap.on("locationfound", async () => {
      // center = observer(myMap.getCenter());
      markersLayer.clearLayers();
      setLat(myMap.getCenter().lat);
      setLng(myMap.getCenter().lng);

      const response = await fetchFakeData({
        lat: lat,
        lng: lng,
        radius: radius,
        activity: activity,
      });

      setData(response);

      L.geoJSON(
        response,
        {
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
        },
        {
          onEachFeature: (feature, layer) => {
            if (feature) {
              //     const info = `<h4> Starting :
              //     ${dateFormat(f.properties.dateStart, "dd-mm-yy")}
              //   , Ending:
              //     ${dateFormat(f.properties.dateEnd, "dd-mm-yy")}
              //   </h4>
              //   <h5> Organize: ${f.properties.username} </h5>
              //
              //   <h4> ${f.properties.address} </h4>`;

              //     const input = `<label for="activity">Select!</label>
              // <input type="checkbox" id="activity_${f.properties.id}" value="Select"/>`;

              //     const content = L.DomUtil.create("div");
              //     content.innerHTML = info + input;
              //     // const popup = L.popup().setPopupContent(element+input);
              //     const popup = layer.bindPopup(content).openPopup();
              // const element =
              //   "<h4> Starting :" +
              //   dateFormat(feature.properties.dateStart, "dd-mm-yy") +
              //   ", Ending: " +
              //   dateFormat(feature.properties.dateEnd, "dd-mm-yy") +
              //   "</h4>" +
              //   "<h5> Organized by: " +
              //   feature.properties.username +
              //   "</h5>" +
              //   "<p> nb participants:" +
              //   feature.properties.nbParticipants +
              //   "</p>" +
              //   "<h4>" +
              //   feature.properties.address +
              //   "</h4>";

              // const input = `<label for="activity">Select!</label>
              // <input type="checkbox" id="activity_${feature.properties.id}" value="Select"/>`;

              const content = L.DomUtil.create("div");
              content.innerHTML = "hi";
              // const popup = L.popup().setPopupContent(element+input);
              // const popup = layer.bindPopup(content); //.openPopup();
              const popup2 = L.popup()
                .setLatLng(feature.geemetry.coordinates)
                .setContent("hi")
                .openOn(myMap);
              //     if (popup) {
              //       popup.on("popupclose", (e) => {
              //         const checkbox = document.querySelector(
              //           'input[type="checkbox"]'
              //         );
              //         if (checkbox) {
              //           checkbox.addEventListener(
              //             "change",
              //             handleChange(checkbox, feature),
              //             {
              //               once: true,
              //               passive: true,
              //             }
              //           );
              //         }
              //         function handleChange(checkbox, feature) {
              //           console.log("change");
              //           if (
              //             checkbox.checked &&
              //             activities.find(
              //               (act) => act.id === feature.properties.id
              //             ) === undefined
              //           ) {
              //             setActivities((previous) => {
              //               return [
              //                 ...previous,
              //                 {
              //                   id: feature.properties.id,
              //                   date: feature.properties.dateStart,
              //                   owner: feature.properties.username,
              //                 },
              //               ];
              //             });
              //           } else if (!checkbox.checked) {
              //             if (activities === []) {
              //               setActivities([]);
              //             } else {
              //               setActivities(
              //                 activities.filter(
              //                   (activity) => activity.id !== feature.properties.id
              //                   // if (activity.id !== feature.properties.id)
              //                   //   return activity;
              //                   // }
              //                 )
              //               );
              //             }
              //           }
              //         }
              //       });
              //     }
            }
          },
        }
      ).addTo(markersLayer);
    });

    return () => myMap.remove();
  }, [activity]);

  // React.useEffect(() => {
  //   fetchFakeData({
  //     lat: lat,
  //     lng: lng,
  //     radius: radius,
  //     activity: activity,
  //   }).then((response) => setData(response));
  // }, []);

  // React.useLayoutEffect(() => {
  // function pointToLayer(feature, latlng) {
  //   switch (feature.properties.activity) {
  //     case "Bike":
  //       return L.marker(latlng, { icon: redIcon });
  //     case "Kite":
  //       return L.marker(latlng, { icon: blueIcon });
  //     default:
  //       return L.marker(latlng, { icon: greenIcon });
  //   }
  // }

  // console.log(data, layer, lmap);
  // new L.layerGroup().addTo(lmap);

  // markersLayer.clearLayers();
  // L.geoJSON(
  //   data,
  //   // {
  //   //   pointToLayer: pointToLayer,
  //   // },
  //   {
  //     onEachFeature: (feature, layer) => {
  //       if (feature) {
  //         const element =
  //           "<h4> Starting :" +
  //           dateFormat(feature.properties.dateStart, "dd-mm-yy") +
  //           ", Ending: " +
  //           dateFormat(feature.properties.dateEnd, "dd-mm-yy") +
  //           "</h4>" +
  //           "<h5> Organized by: " +
  //           feature.properties.username +
  //           "</h5>" +
  //           "<p> nb participants:" +
  //           feature.properties.nbParticipants +
  //           "</p>" +
  //           "<h4>" +
  //           feature.properties.address +
  //           "</h4>";
  //         const input = `<label for="activity">Select!</label>
  //         <input type="checkbox" id="activity_${feature.properties.id}" value="Select"/>`;
  //         const content = L.DomUtil.create("div");
  //         content.innerHTML = element + input;
  //         // const popup = L.popup().setPopupContent(element+input);
  //         const popup = layer.bindPopup(content).openPopup();
  //         if (popup) {
  //           popup.on("popupclose", (e) => {
  //             const checkbox = document.querySelector(
  //               'input[type="checkbox"]'
  //             );
  //             if (checkbox) {
  //               checkbox.addEventListener(
  //                 "change",
  //                 handleChange(checkbox, feature),
  //                 {
  //                   once: true,
  //                   passive: true,
  //                 }
  //               );
  //             }
  //             function handleChange(checkbox, feature) {
  //               console.log("change");
  //               if (
  //                 checkbox.checked &&
  //                 activities.find(
  //                   (act) => act.id === feature.properties.id
  //                 ) === undefined
  //               ) {
  //                 setActivities((previous) => {
  //                   return [
  //                     ...previous,
  //                     {
  //                       id: feature.properties.id,
  //                       date: feature.properties.dateStart,
  //                       owner: feature.properties.username,
  //                     },
  //                   ];
  //                 });
  //               } else if (!checkbox.checked) {
  //                 if (activities === []) {
  //                   setActivities([]);
  //                 } else {
  //                   setActivities(
  //                     activities.filter(
  //                       (activity) => activity.id !== feature.properties.id
  //                       // if (activity.id !== feature.properties.id)
  //                       //   return activity;
  //                       // }
  //                     )
  //                   );
  //                 }
  //               }
  //             }
  //           });
  //         }
  //       }
  //     },
  //   }
  // ); //.addTo(layer);

  // // filter: (feature) => {
  // //   return feature.properties.activity === activity;
  // // },
  // }, [lmap, layer, activities, data]);

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
        {lat}
        {lng}
      </p>
    </>
  );
}
