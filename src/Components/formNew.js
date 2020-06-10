import React, { useState } from "react";

const FormNew = () => {
  const blankCat = { name: "", age: "" };
  const blankOwner = { owner: "", description: "" };
  const [catState, setCatState] = useState([{ ...blankCat }]);
  const [ownerState, setOwnerState] = useState(blankOwner);

  const handleOwnerChange = (e) =>
    setOwnerState({ ...ownerState, [e.target.name]: [e.target.value] });

  const handleCatChange = (e) => {
    // ew use a clone a catState with the spread
    [...catState][e.target.dataset.id][e.target.className] = e.target.value;
    // we used the className attribute to find if it's name or age that's changed
    setCatState([...catState]);
  };

  function handleSubmit(e) {
    e.preventDefault();
    console.log(catState);
  }

  const addCat = () => {
    setCatState([...catState, { ...blankCat }]); // why {...blankCat} ?
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="owner">Owner</label>
      <input
        id="owner"
        name="owner"
        type="text"
        value={ownerState.owner}
        onChange={handleOwnerChange}
      />

      <label htmlFor="description">Description</label>
      <input
        type="text"
        id="description"
        name="description"
        value={ownerState.description}
        onChange={handleOwnerChange}
      />

      <input type="button" value="Add new cat" onClick={addCat} />

      {catState.map((value, id) => {
        const catId = `name-${id}`;
        const ageId = `age-${id}`;
        return (
          <div key={`cat-${id}`}>
            <label htmlFor={catId}>{`Cat ${id + 1}`}</label>
            <input
              type="text"
              name={catId}
              data-id={id}
              id={catId}
              className="name"
              value={catState[id].name}
              onChange={handleCatChange}
            />
            <label htmlFor={ageId}>{`Cat ${id + 1}`}</label>
            <input
              type="text"
              name={ageId}
              data-id={id}
              id={ageId}
              className="age"
              value={catState[id].age}
              onChange={handleCatChange}
            />
          </div>
        );
      })}
      <input type="submit" value="Submit!" onSubmit={handleSubmit} />
    </form>
  );
};

export default FormNew;
