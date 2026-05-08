import { T } from "../lib/i18n";

export default function StorePreview({ colors, heading, lang }) {
  const t = T[lang];
  const [primary, accent, , bg] = colors;
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: primary }}>
        <span className="font-semibold text-sm text-white">{t.storeName}</span>
        <div className="flex gap-3 text-xs text-white/70">{t.navItems.map((item) => (<span key={item}>{item}</span>))}</div>
      </div>
      <div className="py-8 px-6 text-center" style={{ background: bg }}>
        <h3 className="text-xl font-medium mb-1.5" style={{ fontFamily: `'${heading}', serif`, color: primary }}>{t.heroTitle}</h3>
        <p className="text-sm text-gray-400 mb-3">{t.heroSub}</p>
        <button className="inline-block px-5 py-2 rounded-md text-white text-xs font-medium border-none" style={{ background: accent }}>{t.heroCta}</button>
      </div>
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {t.productNames.map((name, i) => (
          <div key={i}>
            <div className="h-16 rounded-md mb-1" style={{ background: `linear-gradient(135deg, ${colors[i]}22, ${colors[i + 1] || colors[0]}44)` }} />
            <div className="text-xs text-gray-500">{name}</div>
            <div className="text-xs font-medium">{[49, 35, 59][i]},00 €</div>
          </div>
        ))}
      </div>
    </div>
  );
}
