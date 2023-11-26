import React from "react";
import { Link } from "react-router-dom";

const Principal = () => {
  return (
    <div>
      <h2>Página Principal</h2>
      <Link to="/Registro">
        <button>Ir a Registro</button>
      </Link>
      <Link to="/Login">
        <button>Ir a Login</button>
      </Link>
    </div>
  );
};

export default Principal;
