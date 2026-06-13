import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function RouteMap() {

  const { number } = useParams();

  const [points, setPoints] = useState([]);

  useEffect(() => {

    loadMap();

  }, []);

  const loadMap = async () => {

    const res = await axios.get(
      `/api/analysis/movement/${number}`
    );

    setPoints(res.data);

  };

  const routePath = points.map((point) => [
  point.latitude,
  point.longitude
]);

  return (
    <div>

      <h2>
        Route Tracking
      </h2>

      <MapContainer
        center={[12.9716,77.5946]}
        zoom={6}
        style={{
          height:"500px",
          width:"100%"
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((point,index)=>(
          <Marker
            key={index}
            position={[
              point.latitude,
              point.longitude
            ]}
          >

            <Popup>

              {point.towerId}

              <br/>

              {new Date(
                point.timestamp
              ).toLocaleString()}

            </Popup>

          </Marker>

        ))}
        <Polyline positions={routePath} />

      </MapContainer>

    </div>
  );
}

export default RouteMap;