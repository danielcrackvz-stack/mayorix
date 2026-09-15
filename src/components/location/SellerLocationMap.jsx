import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./leafletIconFix";

export default function SellerLocationMap({ location, sellerName }) {
  if (!location) return null;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={16}
      style={{ height: "250px", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]}>
        <Popup>{sellerName}</Popup>
      </Marker>
    </MapContainer>
  );
}