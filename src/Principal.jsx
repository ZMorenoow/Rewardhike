import React from "react";
import { Link } from "react-router-dom";
import "./principal.css";

const Principal = () => {
  return (
    <div className="coontainer">
      <h2>Página Principal</h2>
      <Link to="/Registro">
        <button className="button">Ir a Registro</button>
      </Link>
      <Link to="/Login">
        <button className="button">Ir a Login</button>
      </Link>
    </div>
  );
};

export default Principal;
