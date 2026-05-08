export default function MoodCard({ mood, lang, selected, onClick }) {
  return (
    <button onClick={onClick} className={`border rounded-xl p-3 text-center cursor-pointer transition-all bg-white ${selected ? "border-[#1a1a1a] bg-gray-50" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
      <div className="flex gap-1 justify-center mb-1.5">
        {mood.dots.map((c, i) => (<div key={i} className="w-4 h-4 rounded-full border border-gray-100" style={{ background: c }} />))}
      </div>
      <div className="text-xs font-medium text-[#1a1a1a]">{mood.label[lang]}</div>
      <div className="text-xs text-gray-400 mt-0.5">{mood.sub[lang]}</div>
    </button>
  );
}
