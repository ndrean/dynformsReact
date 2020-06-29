import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

export default function AddPointForm({
  onFormSubmit,
  onDateChange,
  address,
  date,
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "15ch",
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
      {/*
       <TextField
        id="standard-basic-lat"
        label="latitude"
        type="date"
        value={date}
        onChange={onDateChange}
      />
      
      <TextField
        id="standard-basic-lng"
        label="longitude"
        type="number"
        hidden
        value={parseFloat(longitude).toFixed(2)}
        // onChange={onLongitudeChange}
      />
      <TextareaAutosize
        aria-label="empty textarea"
        placeholder="Empty"
        hidden
        value={address}
        rowsMin={3}
        rowsMax={4}

        // onChange={onAddressChange}
      /> */}
      <Button type="submit" variant="contained" color="primary" id="update">
        Store point
      </Button>
    </form>
  );
}
