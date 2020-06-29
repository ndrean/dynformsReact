import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function AddDate({ onFormSubmit, onDateChange, date }) {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(2),
        width: "15ch",
      },
    },
  }));

  const classes = useStyles();

  return (
    <form
      //onSubmit={onFormSubmit}
      className={classes.root}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="standard-basic-lat"
        label="Event date"
        type="date"
        //value={date}
        onChange={onDateChange}
      />

      {/* <Button type="submit" variant="contained" color="primary" id="update">
        Enter
      </Button> */}
    </form>
  );
}
