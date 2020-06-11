// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f

import React, { useState } from "react";
//import "./styles.css";
//import { FormControl } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import ShowTrip from "./showTrip";
//import classes from "*.module.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Downwind() {
  const classes = useStyles();

  const newKiter = { name: "", contact: "" };
  const newTrip = { date: "", startPoint: "", endPoint: "" };

  const ironMan = {
    date: new Date("2020-09-01T10:00"),
    startPoint: "Pipa",
    endPoint: "Sao Luis",
  };

  const [kiters, setKiters] = useState([newKiter]);
  const [trip, setTrip] = useState(newTrip);

  function handleAddKiter() {
    setKiters([...kiters, { ...newKiter }]);
  }

  function handleSubmit(e) {
    console.log(e.target.name);
    e.preventDefault();
    setTrip({ ...trip });
    setKiters([...kiters]);
    console.log(trip, kiters);
  }

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
      <form
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
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

        <TextField
          required
          id="standard-required2"
          label="Starting location"
          variant="filled"
          value={trip.start}
          onChange={(e) => setTrip({ ...trip, startPoint: e.target.value })}
        />

        <TextField
          required
          id="standard-required2"
          label="End Point"
          variant="filled"
          value={trip.end}
          onChange={(e) => setTrip({ ...trip, endPoint: e.target.value })}
        />

        {kiters.map((kiter, id) => {
          // we iterate over the array to render
          const nameId = `name-${id}`;
          const contactId = `contact-${id}`;
          // React asks for a key per div
          return (
            <div key={`kiter-${id}`}>
              <TextField
                id="outlined-basic1"
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
                id="outlined-basic2"
                label="Contact phone"
                variant="outlined"
                value={kiter.contact}
                onChange={(e) => {
                  // overide the spread array at the index 'id'
                  [...kiters][id].contact = e.target.value;
                  return setKiters([...kiters]);
                }}
              ></TextField>
            </div>
          );
        })}
        <br />
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleAddKiter}
        >
          Add new participant
        </Button>

        <hr />
        <Button
          type="submit"
          onSubmit={handleSubmit}
          variant="contained"
          color="primary"
          size="large"
        >
          Submit!
        </Button>
      </form>
      {kiters.length + 1 > 0 && trip.date !== "" && (
        <p>Downwind scheduled for: {trip.date}</p>
      )}

      <div>
        <ShowTrip participants={kiters} onKiterRemove={handleRemoveKiter} />
      </div>
    </>
  );
}
