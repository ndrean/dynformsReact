import React from "react";
import PositionContext from "./PositionContext";

function Geoloc(props) {
  const [accept, setAccept] = React.useState(false);
  const [pos, setPos] = React.useState({});
  React.useEffect(() => {
    if (accept) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } } = {}) => {
          setPos({
            Lat: latitude.toFixed(2),
            Lng: longitude.toFixed(2),
          });

          localStorage.setItem(
            "localPosition",
            JSON.stringify({
              Lat: latitude.toFixed(2),
              Lng: longitude.toFixed(2),
            })
          );
        },
        (error) => console.log("not available", error),

        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 10_000,
        }
      );
    }
  }, [accept]);

  return (
    <>
      <button onClick={() => setAccept(true)}>Accept geolocalisation</button>
      {accept && (
        <p>
          {" "}
          Your position is: latitude: {pos.Lat} et Longitude: {pos.Lng}{" "}
        </p>
      )}
      {accept && <PositionContext.Provider value={pos} />}
    </>
  );
}

export { Geoloc };
