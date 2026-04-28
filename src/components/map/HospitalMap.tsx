import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DELHI_NCR_CENTER } from "../../lib/hospitalService";
import HospitalPopup from "./HospitalPopup";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createHospitalIcon(type, emergency_status) {
  const typeColors = {
    government: "#22c55e",
    private: "#3b82f6",
    clinic: "#a855f7",
    unknown: "#6b7280",
  };
  const erBorders = {
    confirmed: { color: "#dc2626", glow: "rgba(220,38,38,0.7)", size: 14 },
    likely:    { color: "#f97316", glow: "rgba(249,115,22,0.5)", size: 12 },
    unknown:   { color: null,      glow: "rgba(0,0,0,0.3)",     size: 10 },
  };

  const fill = typeColors[type] || typeColors.unknown;
  const er = erBorders[emergency_status] || erBorders.unknown;
  const border = er.color || fill;
  const { size, glow } = er;

  return L.divIcon({
    className: "custom-hospital-marker",
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${fill};
      border: 2px solid ${border};
      border-radius: 50%;
      box-shadow: 0 0 8px ${glow};
      transform: translate(-50%, -50%);
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

const userIcon = L.divIcon({
  className: "user-marker",
  html: `<div class="emergency-pulse" style="width:16px;height:16px;background:white;border:3px solid var(--blue);border-radius:50%;box-shadow:0 0 15px var(--blue-alpha-20);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 14);
    }
  }, [position, map]);
  return null;
}

export default function HospitalMap({ hospitals, userPosition, selectedHospital, onMarkerClick }) {
  return (
    <div className="relative w-full h-full bg-[#0A0E14]">
      <MapContainer 
        center={DELHI_NCR_CENTER} 
        zoom={12} 
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {userPosition && (
          <>
            <Marker position={[userPosition.lat, userPosition.lng] as [number, number]} icon={userIcon}>
              <Popup>You are here (Responder Location)</Popup>
            </Marker>
            <Circle 
              center={[userPosition.lat, userPosition.lng] as [number, number]} 
              radius={2000} 
              pathOptions={{ color: 'var(--blue)', weight: 1, fillOpacity: 0.05 }} 
            />
          </>
        )}

        {hospitals.map(h => (
          <Marker 
            key={h.osm_id} 
            position={[h.latitude, h.longitude] as [number, number]} 
            icon={createHospitalIcon(h.hospital_type, h.emergency_status)}
            eventHandlers={{
              click: () => onMarkerClick?.(h)
            }}
          >
            <Popup className="tactical-popup">
              <HospitalPopup hospital={h} />
            </Popup>
          </Marker>
        ))}

        {selectedHospital && (
          <MapRecenter position={{ lat: selectedHospital.latitude, lng: selectedHospital.longitude }} />
        )}
      </MapContainer>
    </div>
  );
}
