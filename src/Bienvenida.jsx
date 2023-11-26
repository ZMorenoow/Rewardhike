import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './utils/AuthContext';

const Bienvenida = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      navigate("/");
    } else {
      window.history.pushState(null, "", "/bienvenida");
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
      <h2>Bienvenido/a a la Página de Bienvenida</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Bienvenida;

