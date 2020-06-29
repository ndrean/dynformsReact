import * as esriGeocode from "esri-leaflet-geocoder";

const reverseGPS = {
  gps: null,
  address: null,
  reverseGeocode: async function (gps) {
    esriGeocode
      .geocodeService()
      .reverse()
      .latlng(gps)
      .run((error, result) => {
        if (error) return alert("not found");
        const {
          address: { CountryCode, ShortLabel, City },
        } = result;
        reverseGPS.address = {
          Country: CountryCode,
          City: City,
          Address: ShortLabel,
        };
      });
  },
};

export { reverseGPS };
