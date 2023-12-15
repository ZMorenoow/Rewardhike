import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";

const EncargadoLocalListaCupones = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cuponesData, setCuponesData] = useState([]);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      navigate("/");
    } else {
      window.history.pushState(null, "", "/EncargadoQRListaCodigos");
      // Obtener datos de la tabla mapviews desde el servidor
      fetch("http://localhost:5000/obtener-localidades", {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => setCuponesData(data))
        .catch((error) => console.error("Error al obtener datos:", error));
    }
  }, [navigate]);

  const checkAuthentication = () => {
    const jwtCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("jwt="));
    return jwtCookie !== undefined;
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });

      logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      <br />
      <center>
        <h2>Lista de QR </h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Local</th>
              <th>Detalle</th>
              <th>Duracion</th>
              <th>QR</th>
            </tr>
          </thead>
          <tbody>
            {cuponesData.map((cupon) => (
              <tr key={cupon.ID}>
                <td>{cupon.ID}</td>
                <td>{cupon.Nombre}</td>
                <td>{cupon.Detalle}</td>
                <td>{cupon.Duracion}</td>
                <td>
                  {cupon.QRData && (
                    <img
                      src={cupon.QRData}
                      alt={`Código QR para ${cupon.Nombre}`}
                      style={{ width: "70px", height: "70px" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </center>
    </div>
  );
};

export default EncargadoLocalListaCupones;
