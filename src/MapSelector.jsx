import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MapSelector = ({ onSelectLocation }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoiem1vcmVub293IiwiYSI6ImNscHQ1NmZ6MDA4bHEyam9iZnduaWZvNzcifQ.nkn0U0F5JK8g3-QpKoIe9w";

    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-72.589, -38.741],
        zoom: 13.5,
      });

      map.on("contextmenu", (e) => {
        e.preventDefault();

        const { lng, lat } = e.lngLat;
        onSelectLocation({ lat, lng });
      });

      setMap(map);
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, onSelectLocation]);

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default MapSelector;
