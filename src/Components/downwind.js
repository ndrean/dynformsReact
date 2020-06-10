import React, { useState } from "react";
//import "./styles.css";

export default function Downwind() {
  const newKiter = { name: "", contact: "" };
  const ironMan = {
    date: new Date("2020-09-01"),
    startPoint: "Pipa",
    endPoint: "Sao Luis",
  };
  //const newTrip = { date: "", startPoint: "", endPoint: "" };
  const [kiters, setKiters] = useState([newKiter]);
  const [trip, setTrip] = useState(ironMan);

  function handleAddKiter() {
    setKiters([...kiters, { ...newKiter }]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTrip({ ...trip });
    setKiters([...kiters]);
    console.log(trip, kiters);
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">New Downwind: </label>
        <input
          id="date"
          name="date"
          type="date"
          value={trip.date}
          onChange={(e) => setTrip({ ...trip, date: e.target.value })}
        />

        <label htmlFor="start">Start point:</label>
        <input
          type="text"
          id="start"
          name="start"
          value={trip.startPoint}
          onChange={(e) => setTrip({ ...trip, startPoint: e.target.value })}
        />

        <label htmlFor="end">End point:</label>
        <input
          type="text"
          id="end"
          name="end"
          value={trip.endPoint}
          onChange={(e) => setTrip({ ...trip, endPoint: e.target.value })}
        />

        {kiters.map((kiter, id) => {
          const nameId = `name-${id}`;
          const contactId = `contact-${id}`;
          return (
            <div key={`kiter-${id}`}>
              <label htmlFor={nameId}>{`Kiter ${id + 1}`}</label>
              <input
                type="text"
                name={nameId}
                id={nameId}
                className="name"
                value={kiter.name}
                onChange={(e) => {
                  [...kiters][id].name = e.target.value;
                  return setKiters([...kiters]);
                }}
              />

              <label htmlFor={contactId}>{`Contact ${id + 1}`}</label>
              <input
                type="text"
                name={contactId}
                id={contactId}
                className="age"
                value={kiter.contact}
                onChange={(e) => {
                  [...kiters][id].contact = e.target.value;
                  return setKiters([...kiters]);
                }}
              />
            </div>
          );
        })}
        <input
          type="button"
          value="Add new participant"
          onClick={handleAddKiter}
        />
        <hr />
        <input type="submit" value="Submit!" onSubmit={handleSubmit} />
      </form>
      <div>
        <ul>
          {kiters.map((kiter, id) => (
            <li key={id}>
              {kiter.name}
              <button onClick={() => handleRemoveKiter(id)}>Del</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
