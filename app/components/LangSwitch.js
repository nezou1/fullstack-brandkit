export default function LangSwitch({ lang, setLang }) {
  return (
    <div className="absolute top-4 right-4 flex rounded-full overflow-hidden border border-gray-200 z-10">
      {["fr", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className={`px-3.5 py-1.5 text-xs border-none cursor-pointer transition-colors ${lang === l ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-400"}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}
