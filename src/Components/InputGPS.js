import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function InputGSP({
  onFormSubmit,
  onLatitudeChange,
  onLongitudeChange,
  latitude,
  longitude,
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  }));

  const classes = useStyles();

  return (
    <form
      onSubmit={onFormSubmit}
      className={classes.root}
      noValidate
      autoComplete="off"
      onSubmit={onFormSubmit}
    >
      <TextField
        id="standard-basic-lat"
        label="latitude"
        type="number"
        // value={latitude}
        onChange={onLatitudeChange}
      />
      <TextField
        id="standard-basic-lng"
        label="longitude"
        type="number"
        // value={longitude}
        onChange={onLongitudeChange}
      />
      <Button type="submit" variant="contained" color="primary" id="update">
        Search
      </Button>
    </form>
  );
}
