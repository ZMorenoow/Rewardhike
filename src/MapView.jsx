import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

const MapView = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const location = [-38.7402, -72.59];

    const mapContainer = document.getElementById("map");

    if (mapContainer) {
      const newMap = L.map(mapContainer).setView(location, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(newMap);

      const handleRightClick = (e) => {
        e.originalEvent.preventDefault();
        const { lat, lng } = e.latlng;
        const nombreLocalidad = prompt("Ingrese el nombre de la localidad:");
        if (!nombreLocalidad) {
          return;
        }

        fetch("http://localhost:5000/guardar-localidad", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre: nombreLocalidad, lat, lng }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Respuesta del servidor:", data);
            if (data.success) {
              alert("Localidad guardada exitosamente");

              const newLocation = {
                id: data.id,
                Nombre: nombreLocalidad,
                Latitud: lat,
                Longitud: lng,
              };

              setLocations((prevLocations) => [...prevLocations, newLocation]);

              const newMarker = L.marker([lat, lng]).addTo(newMap);
              newMarker.bindPopup(nombreLocalidad).openPopup();
              setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
            } else {
              alert("Error al guardar la localidad");
            }
          })
          .catch((error) => {
            console.error("Error al guardar la localidad:", error);
            alert(
              "Error al guardar la localidad. Consulta la consola para más detalles."
            );
          });
      };

      newMap.on("contextmenu", handleRightClick);

      fetch("http://localhost:5000/obtener-localidades")
        .then((response) => response.json())
        .then((data) => {
          console.log("Datos de localidades:", data);

          if (data.success) {
            const locationsWithIds = data.locations.map((location, index) => ({
              ...location,
              id: index + 1,
            }));

            setLocations(locationsWithIds);

            const newMarkers = locationsWithIds.map((location) => {
              const { Latitud, Longitud, Nombre } = location;
              const newMarker = L.marker([Latitud, Longitud]);
              newMarker.bindPopup(Nombre).openPopup();
              return newMarker;
            });

            setMarkers(newMarkers);
          } else {
            console.error("Error al obtener localidades:", data.message);
          }
        })
        .catch((error) => {
          console.error("Error al obtener localidades:", error);
        });

      setMap(newMap);

      return () => {
        newMap.remove();
      };
    } else {
      console.error("Map container not found");
    }
  }, []);

  const handleDeleteLocation = (location) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de borrar la localidad ${location.Nombre} con latitud ${location.Latitud} y longitud ${location.Longitud}?`
    );

    if (confirmDelete) {
      fetch(`http://localhost:5000/borrar-localidad/${location.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Respuesta del servidor:", data);
          if (data.success) {
            const updatedLocations = locations.filter(
              (loc) => loc.id !== location.id
            );
            setLocations(updatedLocations);
            alert("Localidad borrada exitosamente");
          } else {
            alert("Error al borrar la localidad");
          }
        })
        .catch((error) => {
          console.error("Error al borrar la localidad:", error);
          alert(
            "Error al borrar la localidad. Consulta la consola para más detalles."
          );
        });
    }
  };

  return (
    <div className="map-container">
      <div id="map" className="map"></div>
      <div className="locations-container">
        <h2>Localidades Almacenadas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td>{location.Nombre}</td>
                <td>{location.Latitud}</td>
                <td>{location.Longitud}</td>
                <td>
                  <button onClick={() => handleDeleteLocation(location)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MapView;
