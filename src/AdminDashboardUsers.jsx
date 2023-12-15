import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";

const AdminDashboardUsers = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      navigate("/");
    } else {
      window.history.pushState(null, "", "/AdminDashboardUsers");
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
        <h2>Panel de usuarios</h2>
        <br />
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </center>
    </div>
  );
};

export default AdminDashboardUsers;
