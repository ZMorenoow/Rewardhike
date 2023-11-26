import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    // Limpiar mensajes de error al intentar registrarse nuevamente
    setEmailError("");
    setPasswordError("");

    // Validaciones
    if (!email.trim()) {
      setEmailError("El email es requerido");
      return;
    }

    // Validar el formato del correo electrónico usando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("El email no tiene un formato válido");
      return;
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      return;
    }

    // Validar longitud mínima de la contraseña
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
        body: JSON.stringify({ email, contraseña: password}),
      });
      
      if (response.status === 201) {
        // Asumiendo que la respuesta es texto plano en caso de éxito
        const text = await response.text();
        alert(text); // Mostrar el mensaje de éxito

        // Redirigir al "/"
        navigate("/");
      } else {
        // Si la respuesta no es de éxito, asumir que es JSON
        const errorData = await response.json();
        alert("Error al crear cuenta: " + errorData.message);
      }
    } catch (error) {
      console.error("Error al crear cuenta:", error);
    }
  };

  return (
    <div>
      <h2>Registro</h2>
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
      <button onClick={handleRegistro}>Crear Cuenta</button>
    </div>
  );
};

export default Register;
