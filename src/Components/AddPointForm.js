import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

export default function AppPointForm({
  onFormSubmit,
  onLatitudeChange,
  onLongitudeChange,
  onAddressChange,
  latitude,
  longitude,
  address,
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
    >
      <TextField
        id="standard-basic-lat"
        label="latitude"
        type="number"
        value={latitude}
        onChange={onLatitudeChange}
      />
      <TextField
        id="standard-basic-lng"
        label="longitude"
        type="number"
        value={longitude}
        onChange={onLongitudeChange}
      />
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Empty"
        value={address}
        onChange={onAddressChange}
      />
      <Button type="submit" variant="contained" color="primary" id="update">
        Keep
      </Button>
    </form>
  );
}
