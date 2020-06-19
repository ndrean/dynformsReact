import React from "react";

export default function Geoloc(props) {
  React.useEffect(() => {
    if (props.accept) {
      console.log("go");
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log(latitude, longitude);
          setPos({
            lat: latitude.toFixed(2),
            lng: longitude.toFixed(2),
          });
        }
      );
    }
  }, [props.accept]);
  return (
    <>
      <button onClick={props.handeAccept}>Accept geolocalisation</button>
      {props.accept && (
        <p>
          {" "}
          You are here: {props.pos.lat} | {props.pos.lng}{" "}
        </p>
      )}
    </>
  );
}
