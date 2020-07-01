import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";

export default function AddPointForm({
  onFormSubmit,
  //onDateChange,
  //address,
  //date,
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "12ch",
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
      <Button type="submit" variant="contained" color="primary" id="update">
        Save point
      </Button>
    </form>
  );
}
