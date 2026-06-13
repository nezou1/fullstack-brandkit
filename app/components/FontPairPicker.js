"use client";

import { useEffect } from "react";
import { loadGoogleFont } from "../lib/utils";

export default function FontPairPicker({ duos, selectedIdx, onSelect, lang }) {
  // Pré-charge toutes les polices au montage — plus d'attente au clic
  useEffect(() => {
    duos.forEach((duo) => {
      loadGoogleFont(duo.heading);
      loadGoogleFont(duo.body);
    });
  }, [duos]);

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      {duos.map((duo, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`border rounded-xl p-4 text-center cursor-pointer transition-all bg-white flex flex-col items-center gap-1 ${
            selectedIdx === i
              ? "border-[#1a1a1a] shadow-[0_0_0_1px_#1a1a1a]"
              : "border-gray-200 hover:border-[#1a1a1a]"
          }`}
        >
          {/* Grand Aa dans la vraie police titre */}
          <span
            className="block text-[26px] leading-none mb-0.5"
            style={{ fontFamily: `'${duo.heading}', serif`, fontWeight: 600, color: "#1a1a1a" }}
          >
            Aa
          </span>
          {/* Nom du duo dans la vraie police corps */}
          <span
            className="block text-[11px] leading-snug text-gray-500 mb-2"
            style={{ fontFamily: `'${duo.body}', sans-serif` }}
          >
            {duo.tag[lang]}
          </span>
          {/* Noms des polices */}
          <span className="block text-[10px] text-gray-400 leading-tight">{duo.heading}</span>
          <span className="block text-[10px] text-gray-400 leading-tight">+ {duo.body}</span>
        </button>
      ))}
    </div>
  );
}
