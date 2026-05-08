import { loadGoogleFont } from "../lib/utils";

export default function FontPairPicker({ duos, selectedIdx, onSelect, lang }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {duos.map((duo, i) => (
        <button key={i} onClick={() => { loadGoogleFont(duo.heading); loadGoogleFont(duo.body); onSelect(i); }}
          className={`border rounded-xl p-4 text-center cursor-pointer transition-all bg-white ${selectedIdx === i ? "border-[#1a1a1a] ring-2 ring-gray-100" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
          <span className="block text-xl font-medium mb-1 leading-tight" style={{ fontFamily: `'${duo.heading}', serif` }}>Aa</span>
          <span className="block text-sm text-gray-500 mb-2" style={{ fontFamily: `'${duo.body}', sans-serif` }}>Aa Bb Cc</span>
          <span className="block text-sm font-medium text-[#1a1a1a]">{duo.tag[lang]}</span>
          <span className="block text-xs text-gray-400 mt-0.5 leading-tight">{duo.heading}</span>
          <span className="block text-xs text-gray-400 leading-tight">+ {duo.body}</span>
        </button>
      ))}
    </div>
  );
}
