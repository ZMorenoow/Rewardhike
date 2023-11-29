import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  const { userRole } = useAuth();

  return (
    <nav>
      <Link to="/Bienvenida">Inicio</Link>
      {userRole === "admin" && <Link to="/Admin">Panel de Administrador</Link>}
      {userRole === "encargado_local" && (
        <Link to="/EncargadoLocal">Panel de Encargado Local</Link>
      )}
      {userRole === "encargadoQR" && (
        <Link to="/EncargadoQR">Panel de Encargado QR</Link>
      )}
      {/* Más enlaces según sea necesario */}
    </nav>
  );
};

export default NavBar;
