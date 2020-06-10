// https://itnext.io/building-a-dynamic-controlled-form-in-react-together-794a44ee552c

// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
import React from "react";

class Form extends React.Component {
  state = {
    cats: [{ name: "", age: "" }],
    owner: "",
    description: "",
  };

  addCat = () => {
    this.setState((prevState) => ({
      cats: [...prevState.cats, { name: "", age: "" }],
    }));
  };

  handleChange = (e) => {
    if (["name", "age"].includes(e.target.className)) {
      let cats = [...this.state.cats];
      cats[e.target.dataset.id][e.target.className] = e.traget.value;
      this.setState({ cats }, () => console.log(this.state.cats));
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted old");
  };

  render() {
    let { owner, description, cats } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="owner">Owner</label>
        <input type="text" name="owner" id="owner" value={owner} />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          id="description"
          value={description}
        />
        <button onClick={this.addCat}>Add new cat</button>
        {cats.map((val, idx) => {
          let catId = `cat-${idx}`,
            ageId = `age-${idx}`;
          return (
            <div key={idx}>
              <label htmlFor={catId}>{`Cat #${idx + 1}`}</label>
              <input
                type="text"
                name={catId}
                data-id={idx}
                id={catId}
                className="name"
              />
              <label htmlFor={ageId}>Age</label>
              <input
                type="text"
                name={ageId}
                data-id={idx}
                id={ageId}
                className="age"
              />
            </div>
          );
        })}
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
export default Form;
