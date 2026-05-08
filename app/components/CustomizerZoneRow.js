"use client";

import { useRef } from "react";

export default function CustomizerZoneRow({ zone, value, colors, lang, onChange }) {
  const pickerRef = useRef(null);
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
      <span className="text-xs text-gray-600 flex-1">{zone.label[lang]}</span>
      <div className="flex items-center gap-1">
        {colors.map((c, i) => (
          <button key={i} onClick={() => onChange(zone.key, c)}
            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${value === c || value?.startsWith(c) ? "border-[#1a1a1a] scale-110" : "border-gray-200 hover:border-gray-400"}`}
            style={{ background: c, borderColor: c === "#ffffff" || c === "#FFFFFF" ? (value === c ? "#1a1a1a" : "#ddd") : undefined }} />
        ))}
        {/* Color picker */}
        <div className="relative">
          <button onClick={() => pickerRef.current?.click()}
            className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 hover:border-[#1a1a1a] cursor-pointer transition-all flex items-center justify-center bg-white"
            title={lang === "fr" ? "Couleur personnalisée" : "Custom color"}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <input ref={pickerRef} type="color" value={value?.slice(0, 7) || "#000000"}
            onChange={(e) => onChange(zone.key, e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
      </div>
      <div className="w-6 h-6 rounded ml-2 border border-gray-200 shrink-0" style={{ background: value }} />
    </div>
  );
}
