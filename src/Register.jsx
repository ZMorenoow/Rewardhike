import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegistro = async () => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contraseña: password }),
      });

      if (response.status === 201) {
        const data = await response.json();
        alert("¡Cuenta creada correctamente!");

        // Redirigir al "/Principal"
        navigate("/Principal");
      } else {
        // Manejar diferentes casos de respuesta del servidor
        alert("Error al crear cuenta");
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
      </div>
      <div>
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleRegistro}>Crear Cuenta</button>
    </div>
  );
};

export default Register;
