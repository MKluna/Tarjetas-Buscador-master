import React, { useEffect, useState } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import useSWR from "swr";
import "./App.css";
import Axios from "axios";

function App() {
  //const url = "https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/?format=vnd.api%2Bjson";
  const [locales, guardarlocales] = useState([]);
  const [InformacionLocales, setInformacionLocales] = useState(null);

  const consultarapi = async () => {
    const url = `https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/`;
    const respuesta = await fetch(url);
    const data = await respuesta.json();
    guardarlocales(data.data);
  };

  useEffect(() => {
    consultarapi();
  }, []);

  const Coordenadas = point => {
    if (point !== null) {
      return [point.coordinates[1], point.coordinates[0]];
    } else return [0, 0];
  };

  return (
    <Map center={[-28.468722, -65.779009]} zoom={13}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locales.map(info => (
        <Marker
          key={info.id}
          position={Coordenadas(info.attributes.point)}
          onclick={() => {
            setInformacionLocales(info.attributes);
          }}
        />
      ))}

      {InformacionLocales ? (
        <Popup
          position={Coordenadas(InformacionLocales.point)}
          onClose={() => {
            setInformacionLocales(null);
          }}
        >
          <div>
            <p>
              Lugar: <span>{InformacionLocales.name}</span>
            </p>
            <p>
              Direccion: <span>{InformacionLocales.address}</span>
            </p>
          </div>
        </Popup>
      ) : null}
    </Map>
  );
}
export default App;
