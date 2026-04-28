import React from "react";
import { Phone, Globe, MapPin, AlertTriangle } from "lucide-react";
import BedAvailability from "../beds/BedAvailability";

const typeLabels = {
  government: "Government",
  private: "Private",
  clinic: "Clinic",
  unknown: "Hospital",
};

const typeStyles = {
  government: "bg-green-500/20 text-green-400 border-green-500/30",
  private: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  clinic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function HospitalPopup({ hospital }) {
  const h = hospital;

  return (
    <div className="min-w-[220px] space-y-2 p-1 font-sans">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm leading-tight text-white">
          {h.name}
        </h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${typeStyles[h.hospital_type] || typeStyles.unknown}`}>
          {typeLabels[h.hospital_type] || "HOSPITAL"}
        </span>
        {h.emergency_status === "confirmed" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-red-500/20 text-red-400 border-red-500/30 uppercase tracking-wider">
            <AlertTriangle className="w-2.5 h-2.5" />
            Priority ER
          </span>
        )}
      </div>

      <div className="space-y-1 py-1">
        {h.address && (
          <div className="flex items-start gap-1.5 text-[10px] text-[var(--t2)]">
            <MapPin size={10} className="mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{h.address}</span>
          </div>
        )}
        <div className="flex gap-2 mt-2">
          {h.phone && (
            <a href={`tel:${h.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--green)]/20 text-[var(--green)] border border-[var(--green)]/30 rounded-md text-[10px] font-bold">
              <Phone size={10} /> CALL
            </a>
          )}
          {h.website && (
            <a href={h.website} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-[var(--blue)]/20 text-[var(--blue)] border border-[var(--blue)]/30 rounded-md text-[10px] font-bold">
              <Globe size={10} /> WEB
            </a>
          )}
        </div>
      </div>

      <BedAvailability hospital={h} compact={true} />
    </div>
  );
}
