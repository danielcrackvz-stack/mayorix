import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "./leafletIconFix";

function RecenterMap({ position }) {
  const map = useMap();
  if (position) map.setView(position, 16);
  return null;
}

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect }) {
  const [showMap, setShowMap] = useState(false);
  const [position, setPosition] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const defaultCenter = [-17.7833, -63.1821];

  function handleSelect(coords) {
    setPosition(coords);
    setResults([]);
    onLocationSelect({ lat: coords[0], lng: coords[1] });
  }

  async function runSearch() {
    if (!searchText.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=bo&limit=5`
      );
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSearchClick(e) {
    e.preventDefault();
    runSearch();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  }

  function pickResult(r) {
    handleSelect([parseFloat(r.lat), parseFloat(r.lon)]);
  }

  if (!showMap) {
    return (
      <button type="button" onClick={() => setShowMap(true)} className="btn btn-outline">
        📍 Busca tu ubicación
      </button>
    );
  }

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "0.9rem", background: "var(--surface)" }}>
      <div className="location-search">
        <input
          type="text"
          className="field"
          style={{ marginBottom: 0 }}
          placeholder="Busca tu dirección o zona..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" className="btn btn-primary" onClick={handleSearchClick} disabled={searching}>
          {searching ? "..." : "Buscar"}
        </button>
      </div>

      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginBottom: "0.5rem" }}>
          {results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                onClick={() => pickResult(r)}
                style={{ textAlign: "left", width: "100%", padding: "0.4rem", background: "none", border: "none", cursor: "pointer" }}
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p style={{ fontSize: "0.85rem", color: "#6b7370" }}>
        También puedes hacer clic directamente sobre el mapa para marcar tu ubicación exacta.
      </p>

      <MapContainer center={position || defaultCenter} zoom={13} style={{ height: "300px", width: "100%", borderRadius: "8px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
}