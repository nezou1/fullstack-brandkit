export default function LangSwitch({ lang, setLang }) {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-0.5 p-[3px] bg-white border border-gray-200 rounded-lg shadow-sm">
      {["fr", "en"].map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`relative px-2 py-0.5 text-[11px] font-medium rounded-md transition-all cursor-pointer border-none outline-none focus:outline-none ${
            lang === l
              ? "bg-[#1a1a1a] text-white"
              : "bg-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
