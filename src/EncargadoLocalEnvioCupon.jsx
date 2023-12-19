import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import LocalForm from "./LocalForm";

const EncargadoLocalEnvioCupon = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      navigate("/");
    } else {
      window.history.pushState(null, "", "/EncargadoLocalEnvioCupon");
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

  const saveCouponToLocation = (lat, lng, name, duracion, detalle, qrCode) => {
    fetch("http://localhost:5000/guardar-cupon-en-localidad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
        nombre: name,
        duracion: duracion,
        detalle: detalle,
        qrCode: qrCode, // Agrega el código QR a los datos que envías al servidor
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Actualiza el estado con la nueva localidad
          setLocations((prevLocations) => [
            ...prevLocations,
            {
              Latitud: lat,
              Longitud: lng,
              Nombre: name,
              Duracion: duracion,
              Detalle: detalle,
            },
          ]);
          // Muestra una alerta indicando que se guardó la localidad
          alert("Localidad guardada exitosamente");
        } else {
          console.error(
            "Error al guardar el cupón en la localidad:",
            data.message
          );
          // Muestra una alerta indicando que hubo un error al guardar la localidad
          alert("Error al guardar el cupón en la localidad");
        }
      })
      .catch((error) => {
        console.error("Error al guardar el cupón en la localidad:", error);
        // Muestra una alerta indicando que hubo un error al guardar la localidad
        alert("Error al guardar el cupón en la localidad");
      })
      .finally(() => {
        // Recarga la página después de completar la operación
        window.location.reload();
      });
  };

  return (
    <div>
      <h2>Envío de Cupones - Encargado Local</h2>
      <LocalForm onSave={saveCouponToLocation} />
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default EncargadoLocalEnvioCupon;
