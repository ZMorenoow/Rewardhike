import React, { useState } from "react";
import MapSelector from "./MapSelector";
import QRCode from "qrcode.react";

const LocalForm = ({ onSave }) => {
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [nombre, setNombre] = useState("");
  const [duracion, setDuracion] = useState("");
  const [detalle, setDetalle] = useState("");

  const handleSelectLocation = ({ lat, lng }) => {
    setLatitud(lat);
    setLongitud(lng);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Genera el código QR
    const qrCode = `Latitud: ${latitud}, Longitud: ${longitud}, Nombre: ${nombre}, Detalle: ${detalle}`;
    // Llama a la función onSave con los datos del formulario y el código QR
    onSave(latitud, longitud, nombre, duracion, detalle, qrCode);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Latitud:
          <input type="text" value={latitud} readOnly />
        </label>
        <label>
          Longitud:
          <input type="text" value={longitud} readOnly />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <label>
          Duración:
          <input
            type="text"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </label>
        <label>
          Detalle:
          <textarea
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
          />
        </label>
        {/* Incorpora el MapSelector para que aparezca el mapa en el formulario */}
        <MapSelector onSelectLocation={handleSelectLocation} />
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default LocalForm;
