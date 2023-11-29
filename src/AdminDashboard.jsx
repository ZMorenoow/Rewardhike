import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const availableRoles = ["usuario", "admin", "encargado_local", "encargadoQR"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/usuarios", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Error al obtener los usuarios");
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    const isAuthenticated = checkAuthentication();
    if (!isAuthenticated) {
      navigate("/");
    } else {
      window.history.pushState(null, "", "/Admin");
      fetchData();
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

  const handleRoleChange = (e, email) => {
    const updatedUsers = users.map((user) => {
      if (user.Email === email) {
        return { ...user, Rol: e.target.value };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleUpdateRole = async (email) => {
    const user = users.find((user) => user.Email === email);
    if (user) {
      try {
        const response = await fetch(
          `http://localhost:5000/usuarios/${email}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newRole: user.Rol }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el rol del usuario");
        }
      } catch (error) {
        console.error("Error al actualizar el rol:", error);
      }
    }
  };

  const handleDeleteUser = async (email) => {
    // Implementa la lógica de eliminación de usuarios aquí
  };

  return (
    <div className="admin-page">
      <h2>Panel de Administración</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      <div className="table-container">
        <h3>Usuarios:</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Rol</th>
              <th>Editar</th>
              <th> Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usuario) =>
              usuario.Email === "admin@gmail.com" ? null : (
                <tr key={usuario.Email}>
                  <td>{usuario.Email}</td>
                  <td>
                    <select
                      value={usuario.Rol}
                      onChange={(e) => handleRoleChange(e, usuario.Email)}
                    >
                      {availableRoles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleUpdateRole(usuario.Email)}>
                      Actualizar
                    </button>
                  </td>
                  <td>
                    {usuario.Rol === "admin" ? null : (
                      <button onClick={() => handleDeleteUser(usuario.Email)}>
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
