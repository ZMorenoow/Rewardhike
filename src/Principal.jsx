import React from "react";
import { Link } from "react-router-dom";
import "./principal.css";

const Principal = () => {
  return (
    <div className="coontainer">
      <h2>Página Principal</h2>
      <br />
      <Link to="/Registro">
        <button className="button">Ir a Registro</button>
      </Link>
      <br />
      <Link to="/Login">
        <button className="button">Ir a Login</button>
      </Link>
    </div>
  );
};

export default Principal;
