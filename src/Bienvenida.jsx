import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Bienvenida = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado antes de renderizar la página
    const isAuthenticated = checkAuthentication(); // Llama a una función para verificar la autenticación
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a la página de inicio
      navigate("/Principal");
    } else {
      // Si está autenticado, reemplazar la ubicación actual en el historial
      // Esto evita que el usuario retroceda a páginas anteriores
      window.history.pushState(null, "", "/bienvenida");
    }
  }, [navigate]);

  const checkAuthentication = () => {
    // Verifica la existencia de la cookie JWT en el cliente
    const jwtCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("jwt="));

    // Devuelve true si la cookie JWT está presente, de lo contrario, false
    return jwtCookie !== undefined;
  };

  const handleLogout = async () => {
    try {
      // Realizar una solicitud al servidor para cerrar sesión (eliminar la cookie)
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Incluir las cookies en la solicitud
      });

      // Redirigir a la página de inicio después de cerrar sesión
      navigate("/Principal");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      <h2>Bienvenido/a a la Página de Invitado</h2>
      {/* Contenido específico para la página de bienvenida */}

      {/* Botón para cerrar sesión */}
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Bienvenida;
