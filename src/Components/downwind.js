// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f

import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
//import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";

import ShowTrip from "./showTrip";
//import TakePicButton from "./camera";

import "../App.css";

const BackgroundImagePage = () => {
  return <div className="bg"></div>;
};

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
  const newTrip = { date: "", startPoint: "", endPoint: "" };

  //const [file, setFile] = useState(null);

  const ironman = {
    date: "2020-09-01T10:00",
    startPoint: "Pipa",
    endPoint: "Paracuru",
  };

  const [kiters, setKiters] = useState([newKiter]);
  const [trip, setTrip] = useState(newTrip);
  const [push, setPush] = useState(false);

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
          console.log(kiter);
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
        buddies
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
            justify="flex-start"
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
            </Grid>
          </Grid>

          <p>
            The 'current.user' will appear automatically as the first
            participant{" "}
          </p>

          <Grid
            container
            spacing={3}
            direction="row"
            justify="flex-start"
            alignItems="center"
          >
            {kiters.map((kiter, id) => {
              // we iterate over the array to render. React asks for a key per div
              return (
                <div key={`kiter-${id}`}>
                  <Grid item xs>
                    <TextField
                      id="outlined-basic-1"
                      label="Participant name"
                      variant="outlined"
                      value={kiter.name}
                      onChange={(e) => {
                        // overide the spread array at the index 'id'
                        [...kiters][id].name = e.target.value;
                        return setKiters([...kiters]);
                      }}
                    >{`Kiter ${id + 1}`}</TextField>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      id="outlined-basic-2"
                      label="Contact phone"
                      variant="outlined"
                      value={kiter.contact}
                      onChange={(e) => {
                        // overide the spread array at the index 'id'
                        [...kiters][id].contact = e.target.value;
                        return setKiters([...kiters]);
                      }}
                    ></TextField>
                    <Checkbox
                      color="primary"
                      checked={[...kiters][id].pushed}
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      onChange={() => {
                        [...kiters][id].pushed = ![...kiters][id].pushed;
                        setKiters([...kiters]);
                      }}
                    />
                  </Grid>

                  <input
                    label="Upload"
                    accept="image/*"
                    multiple
                    type="file"
                    id="raised-button-file"
                    name="rased-button-file"
                    //style={{ display: "none" }}
                    onChange={(e) => {
                      // overide the spread array at the index 'id'
                      [...kiters][id].file = e.target.files[0];
                      return setKiters([...kiters]);
                    }}
                  />
                </div>
              );
            })}
          </Grid>
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
                  size="small"
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

{
  /* 
    function handleChange(e) {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  }

    function NewInput(props) {
    return (
      <>
        <label htmlFor={props.attr}>{props.children} </label>
        <input
          id={props.attr}
          name={props.attr}
          type={props.type}
          value={[props.value]}
          required={props.required}
          onChange={props.onHandleChange}
        />
      </>
    );
  }
  <NewInput type="text" attr="start" value={trip.start} onHandleChange={handleChange}> 
    Choose location 
  </NewInput>
  */
}
