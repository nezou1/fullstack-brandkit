import SectionHeader from "./SectionHeader";

export default function SectionReassuranceMockup({ scheme, bodyFont, lang }) {
  const items = lang === "fr"
    ? [
        { title: "Livraison offerte", sub: "Dès 50 EUR d'achat", icon: "check" },
        { title: "Retours 30 jours", sub: "Satisfait ou remboursé", icon: "arrow" },
        { title: "Paiement sécurisé", sub: "CB, PayPal, Apple Pay", icon: "heart" },
      ]
    : [
        { title: "Free shipping", sub: "Orders over $50", icon: "check" },
        { title: "30-day returns", sub: "Satisfaction guaranteed", icon: "arrow" },
        { title: "Secure payment", sub: "Visa, PayPal, Apple Pay", icon: "heart" },
      ];

  const renderIcon = (type) => {
    const fill = scheme.stars_icons_color;
    if (type === "check") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    );
    if (type === "arrow") return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="7 13 12 18 17 13"/><polyline points="7 6 12 11 17 6"/>
      </svg>
    );
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    );
  };

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: scheme.border }}>
      <SectionHeader label={lang === "fr" ? "Section — Réassurance" : "Section — Reassurance"} scheme={scheme} />
      <div className="p-4" style={{ background: scheme.background }}>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1.5 py-2">
              {renderIcon(item.icon)}
              <span className="text-xs font-semibold leading-tight" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: scheme.foreground }}>{item.title}</span>
              <span className="text-xs leading-tight" style={{ color: scheme.foreground + "66" }}>{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
