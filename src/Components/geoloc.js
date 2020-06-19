import React from "react";

export default function Geoloc(props) {
  const [accept, setAccept] = React.useState(false);
  const [pos, setPos] = React.useState({});
  React.useEffect(() => {
    if (accept) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
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
    </>
  );
}
