import { T } from "../lib/i18n";

export default function StepBar({ step, lang, totalSteps = 4 }) {
  const t = T[lang];
  const labels = [t.step1, t.step2, t.step3, t.step4];
  return (
    <div className="flex items-center justify-center gap-0 mb-10 mt-2">
      {labels.slice(0, totalSteps).map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={i} className="flex items-center">
            {i > 0 && <div className={`w-10 h-[2px] mx-1 transition-colors ${done ? "bg-[#1a1a1a]" : "bg-gray-200"}`} />}
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${done ? "bg-[#1a1a1a] text-white" : active ? "bg-[#1a1a1a] text-white ring-4 ring-gray-100" : "bg-gray-100 text-gray-400"}`}>
                {done ? "✓" : idx}
              </div>
              <span className={`text-xs ${active ? "text-[#1a1a1a] font-medium" : "text-gray-400"}`}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
