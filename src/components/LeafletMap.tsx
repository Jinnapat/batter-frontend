import { LatLng } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import * as L from "leaflet";
import "leaflet-defaulticon-compatibility";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

function LocationMarker({
  position,
  setPosition,
}: {
  position: LatLng | null;
  setPosition: Dispatch<SetStateAction<LatLng | null>>;
}) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const LeafletMap = ({
  position,
  setPosition,
}: {
  position: LatLng | null;
  setPosition: Dispatch<SetStateAction<LatLng | null>>;
}) => {
  return (
    <MapContainer
      center={[13.74, 100.53]}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full h-96"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} setPosition={setPosition} />
    </MapContainer>
  );
};

export { LeafletMap };
