import SectionHeader from "./SectionHeader";

export default function SectionReassuranceMockup({ scheme, bodyFont, lang }) {
  const items = lang === "fr"
    ? [
        { title: "Livraison offerte", sub: "Dès 50 EUR d'achat",   icon: "local_shipping" },
        { title: "Retours 30 jours", sub: "Satisfait ou remboursé", icon: "package_2" },
        { title: "Paiement sécurisé", sub: "CB, PayPal, Apple Pay", icon: "lock" },
      ]
    : [
        { title: "Free shipping",   sub: "Orders over $50",          icon: "local_shipping" },
        { title: "30-day returns",  sub: "Satisfaction guaranteed",  icon: "package_2" },
        { title: "Secure payment",  sub: "Visa, PayPal, Apple Pay",  icon: "lock" },
      ];

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: scheme.border }}>
      <SectionHeader label={lang === "fr" ? "Section — Réassurance" : "Section — Reassurance"} scheme={scheme} />
      <div className="p-4" style={{ background: scheme.background }}>
        <div className="grid grid-cols-3 gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1.5 py-2">
              <span
                className="material-symbols-rounded"
                style={{
                  color: scheme.stars_icons_color,
                  fontSize: 26,
                  fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {item.icon}
              </span>
              <span className="text-xs font-semibold leading-tight" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: scheme.foreground }}>
                {item.title}
              </span>
              <span className="text-xs leading-tight" style={{ color: scheme.foreground + "66" }}>
                {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
