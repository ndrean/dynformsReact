import React from "react";

export default function CheckBox({ bool, id }) {
  if (bool === true) {
    return (
      <>
        <label for="id">Select</label>
        <input type="checkbox" id={id} checked />
      </>
    );
  } else {
    return (
      <>
        <label for="id">Select</label>
        <input type="checkbox" id={id} />
      </>
    );
  }
}
