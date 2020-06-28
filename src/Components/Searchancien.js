// L.geoJSON(
//   response,
//   {
//     pointToLayer: (feature, latlng) => {
//       switch (feature.properties.activity) {
//         case "Bike":
//           return L.marker(latlng, { icon: redIcon });
//         case "Kite":
//           return L.marker(latlng, { icon: blueIcon });
//         default:
//           return L.marker(latlng, { icon: greenIcon });
//       }
//     },
//   },
