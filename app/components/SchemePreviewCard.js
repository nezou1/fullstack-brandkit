import { T } from "../lib/i18n";

export default function SchemePreviewCard({ scheme, heading, lang, isDefault, isEnabled, onSetDefault, onToggle, label }) {
  const t = T[lang];
  const s = scheme;
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isDefault ? "border-[#1a1a1a] ring-2 ring-gray-100" : isEnabled ? "border-gray-300" : "border-gray-200 opacity-60"}`}>
      {/* Mini preview */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ background: s.primary_button_background }}>
        <span className="font-semibold text-xs" style={{ color: s.primary_button_text }}>{t.storeName}</span>
        <div className="flex gap-1.5 text-xs" style={{ color: s.primary_button_text + "b3" }}>
          <span>Shop</span><span>About</span>
        </div>
      </div>
      <div className="p-3" style={{ background: s.background }}>
        <p className="text-xs font-medium mb-1.5" style={{ fontFamily: `'${heading}', serif`, color: s.foreground }}>{t.heroTitle}</p>
        <div className="flex gap-1.5 mb-2">
          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: s.primary_button_background, color: s.primary_button_text }}>{t.heroCta}</span>
          <span className="px-2 py-1 rounded text-xs" style={{ background: s.secondary_button_background, color: s.secondary_button_text, border: `1px solid ${s.secondary_button_border}` }}>Info</span>
        </div>
        <div className="flex gap-1">
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: s.primary_badge_background, color: s.primary_badge_text }}>New</span>
        </div>
      </div>
      {/* Controls */}
      <div className="px-3 py-2 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <span className="text-xs text-gray-500 flex-1 mr-2 leading-tight">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={isEnabled} onChange={onToggle} className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer" />
            <span className="text-xs text-gray-400">{lang === "fr" ? "Actif" : "Active"}</span>
          </label>
          <button onClick={onSetDefault}
            className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all ${isDefault ? "bg-[#1a1a1a] text-white border-none" : "bg-white text-gray-400 border border-gray-300 hover:border-[#1a1a1a]"}`}>
            {lang === "fr" ? "Par défaut" : "Default"}
          </button>
        </div>
      </div>
    </div>
  );
}
