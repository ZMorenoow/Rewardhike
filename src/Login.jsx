import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './utils/AuthContext'; // Asegúrate de que este es el camino correcto al archivo AuthContext

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Utiliza el hook useAuth

  const handleLogin = async () => {
    // Limpiar mensajes de error al intentar iniciar sesión nuevamente
    setEmailError("");
    setPasswordError("");

    // Validaciones
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

        login(userRole); // Usa la función login del contexto para establecer el rol

        navigate("/bienvenida"); // Redirige a la página de bienvenida
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <div>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={{ color: "red" }}>{emailError}</p>}
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      </div>
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
};

export default Login;

