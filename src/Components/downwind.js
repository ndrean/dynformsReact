// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f

import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
//import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
//import CssBaseline from "#material-ui/core/CssBaseline";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

import ShowTrip from "./ShowTrip";
//import TakePicButton from "./camera";

import { useIdb } from "react-use-idb";

import "../App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Downwind() {
  const classes = useStyles();

  const newKiter = { name: "", contact: "", pushed: false, file: "" };
  const newTrip = { date: "", startPoint: "", endPoint: "", comment: "" };

  const [kiters, setKiters] = useState([newKiter]);
  const [trip, setTrip] = useState(newTrip);

  const [user, setUser] = useIdb("user", {
    name: "Fred",
    email: " star@hackit.js",
  });

  function handleAddKiter() {
    setKiters([...kiters, { ...newKiter }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTrip({ ...trip });
    setKiters([...kiters]);
    const formData = new FormData();
    formData.append("trip", JSON.stringify(trip));
    formData.append("kiters", JSON.stringify(kiters));
    for (let val of formData.values()) {
      console.log(val);
    }
  }

  function handleRemoveKiter(index) {
    return setKiters(
      [...kiters].filter((kiter, id) => {
        if (id !== index) {
          return kiter;
        }
      })
    );
  }

  return (
    <>
      <h4>
        {" "}
        If logged in, you can create a downwind and push invitations to your
        buddies with the checkbox.
      </h4>

      <div className={classes.root}>
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            spacing={3}
            direction="row"
            justify-content="center"
            alignItems="center"
          >
            <Grid item xs>
              <Paper className={classes.paper}>
                <TextField
                  required
                  id="standard-required0"
                  label="Choose a date"
                  variant="filled"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={trip.date}
                  onChange={(e) => setTrip({ ...trip, date: e.target.value })}
                />
              </Paper>

              <Paper className={classes.paper}>
                <TextField
                  required
                  id="standard-required1"
                  label="Starting location"
                  variant="filled"
                  value={trip.start}
                  onChange={(e) =>
                    setTrip({ ...trip, startPoint: e.target.value })
                  }
                />
              </Paper>

              <Paper className={classes.paper}>
                <TextField
                  required
                  id="standard-required2"
                  label="End Point"
                  variant="filled"
                  value={trip.end}
                  onChange={(e) =>
                    setTrip({ ...trip, endPoint: e.target.value })
                  }
                />
              </Paper>

              <Paper className={classes.paper}>
                <TextareaAutosize
                  id="textarea"
                  label="Comments"
                  aria-label="empty textarea"
                  placeholder="Any comments..."
                  value={trip.comment}
                  onChange={(e) =>
                    setTrip({ ...trip, comment: e.target.value })
                  }
                />
              </Paper>
            </Grid>
          </Grid>

          <p>
            The 'current.user' will appear automatically as the first
            participant. There is an autocomplet on the name. The controller
            will 'Find_by_name_or_Create' the kiter.{" "}
          </p>
          {kiters.map((kiter, id) => {
            // we iterate over the array to render. React asks for a key per div
            return (
              <div key={`kiter-${id}`}>
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  justify-content="center"
                  alignItems="center"
                >
                  <Grid item xs>
                    <TextField
                      id={`outlined-basic-1-${id}`}
                      label="Participant name"
                      variant="outlined"
                      value={kiter.name}
                      onChange={(e) => {
                        // overide the spread array at the index 'id'
                        [...kiters][id].name = e.target.value;
                        return setKiters([...kiters]);
                      }}
                    >{`Kiter ${id + 1}`}</TextField>

                    <TextField
                      id={`outlined-basic-2-${id}`}
                      label="Contact phone"
                      variant="outlined"
                      value={kiter.contact}
                      onChange={(e) => {
                        // overide the spread array at the index 'id'
                        [...kiters][id].contact = e.target.value;
                        return setKiters([...kiters]);
                      }}
                    ></TextField>
                  </Grid>
                  <Grid item xs>
                    <FormControlLabel
                      value="top"
                      control={
                        <Checkbox
                          color="primary"
                          checked={[...kiters][id].pushed}
                          inputProps={{ "aria-label": "secondary checkbox" }}
                          onChange={() => {
                            [...kiters][id].pushed = ![...kiters][id].pushed;
                            setKiters([...kiters]);
                          }}
                        />
                      }
                      label="Notify him!"
                      labelPlacement="start"
                    />

                    <input
                      label="Upload"
                      accept="image/*"
                      multiple
                      type="file"
                      id={`raised-button-file-${id}`}
                      name="raised-button-file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        // overide the spread array at the index 'id'
                        [...kiters][id].file = e.target.files[0];
                        return setKiters([...kiters]);
                      }}
                    />
                    <label htmlFor={`raised-button-file-${id}`}>
                      <IconButton
                        color="primary"
                        size="medium"
                        aria-label="upload picture"
                        component="span"
                      >
                        Upload picture!
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Grid>
                </Grid>
                <hr />
              </div>
            );
          })}

          <Grid
            container
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs>
              <Paper className={classes.paper}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={handleAddKiter}
                >
                  Add buddies
                </Button>
              </Paper>
            </Grid>
          </Grid>
          <hr />
          <Grid
            container
            spacing={3}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid item xs>
              <Paper className={classes.paper}>
                <Button
                  type="submit"
                  onSubmit={handleSubmit}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Submit!
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </form>
      </div>

      <br />

      <hr />

      {kiters.length + 1 > 0 && trip.date !== "" && (
        <p>Downwind scheduled for: {trip.date}</p>
      )}

      <div>
        <ShowTrip participants={kiters} onKiterRemove={handleRemoveKiter} />
      </div>
    </>
  );
}
