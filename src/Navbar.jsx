import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  const { userRole } = useAuth();

  return (
    <nav>
      <Link to="/Bienvenida">Inicio</Link>
      {userRole === "admin" && <Link to="/Admin">Panel de administrador</Link>}
      {userRole === "admin" && <Link to="/MapView">Mapa de locales</Link>}
      {userRole === "admin" && (
        <Link to="/CuponesAdministrador">Cupones Administrador</Link>
      )}
      {userRole === "admin" && (
        <Link to="/AdminDashboardUsers">Panel de administrador usuarios</Link>
      )}

      {userRole === "encargado_local" && (
        <Link to="/EncargadoLocalListaCupones">Lista de cupones local</Link>
      )}
      {userRole === "encargado_local" && (
        <Link to="/MapView">Mapa de locales</Link>
      )}
      {userRole === "encargado_local" && (
        <Link to="/EncargadoLocalEnvioCupon">Envio de cupones local</Link>
      )}

      {userRole === "encargadoQR" && (
        <Link to="/EncargadoQRListaCodigos">Lista codigos QR</Link>
      )}
      {userRole === "encargadoQR" && <Link to="/MapView">Mapa de locales</Link>}
      {userRole === "encargadoQR" && (
        <Link to="/EncargadoQRCupones">Cupones QR</Link>
      )}
      {/* Más enlaces según sea necesario */}
    </nav>
  );
};

export default NavBar;
