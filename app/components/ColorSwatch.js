export default function ColorSwatch({ color, label, onCopy }) {
  return (
    <button onClick={() => { navigator.clipboard.writeText(color); onCopy(color); }}
      className="flex-1 group relative cursor-pointer border-none p-0 bg-transparent">
      <div className="h-14 rounded-lg transition-transform group-hover:scale-105 border border-gray-100" style={{ background: color }} />
      <span className="block text-xs text-gray-500 mt-1.5 text-center font-mono">{color}</span>
      <span className="block text-xs text-gray-400 text-center">{label}</span>
    </button>
  );
}
