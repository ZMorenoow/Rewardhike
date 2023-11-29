// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./utils/AuthContext"; // Asegúrate de que este es el camino correcto al archivo AuthContext
import "./Login.css"; // Importa el nuevo archivo CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Utiliza el hook useAuth

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("El email es requerido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("El email no tiene un formato válido");
      return;
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      return;
    }

    if (password.trim().length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña: password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        document.cookie = `jwt=${data.token}; path=/`;

        const decodedToken = parseJwt(data.token);
        const userRole = decodedToken.rol;

        login(userRole);

        navigate("/bienvenida");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  return (
    <div className="container">
      <div className="form">
        <header>Iniciar Sesión</header>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="error">{emailError}</p>}
      </div>
      <div className="form">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="error">{passwordError}</p>}
      </div>
      <center>
        <button className="button" onClick={handleLogin}>
          Iniciar Sesión
        </button>
      </center>
      <br />
    </div>
  );
};

export default Login;
