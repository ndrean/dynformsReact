import React from "react";
import { makeStyles } from "@material-ui/core/styles";
//import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export default function TakePicButton(props) {
  const classes = useStyles();
  let video = null;
  let photo = null;
  let canvas = null;

  async function setDevice() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  }

  const takePhoto = () => {
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, 680, 300);
    canvas.toBlob(props.picFile);
    //photo.setAttribute("src", canvas.toDataRUL("image/jpeg"));
  };

  return (
    <div className={classes.root}>
      <div className="viewer">
        <video ref={(ref) => (video = ref)} width="680" height="300" />
      </div>

      <button onClick={takePhoto}>Take a pic!</button>

      <div className="feed">
        <canvas width="680" height="300" ref={(ref) => (canvas = ref)} />
      </div>
    </div>
  );
}
