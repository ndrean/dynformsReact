import React from "react";
import history from "./Components/history";
import "./App.css";

function Nav() {
  const handleClick = (e) => {
    e.preventDefault();
    history.push({ pathname: e.currentTarget.pathname });
  };
  return (
    <>
      <ul style={{ listStyleType: "none" }}>
        <li>
          <a href="/" onClick={handleClick}>
            Home
          </a>
        </li>
        <li>
          <a href="/new" onClick={handleClick}>
            new
          </a>
        </li>
        <li>
          <a href="/About" onClick={handleClick}>
            about
          </a>
        </li>
      </ul>
    </>
  );
}

export default Nav;
