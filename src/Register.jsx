import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Pag.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
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
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña: password }),
      });

      if (response.status === 201) {
        const text = await response.text();
        alert(text);
        navigate("/");
      } else {
        const errorData = await response.json();
        alert("Error al crear cuenta: " + errorData.message);
      }
    } catch (error) {
      console.error("Error al crear cuenta:", error);
    }
  };

  return (
    <div className="container">
      <div className="form">
        <header>Registro</header>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>
        <center>
          <button className="button" onClick={handleRegistro}>
            Crear Cuenta
          </button>
        </center>
      </div>
    </div>
  );
};

export default Register;
