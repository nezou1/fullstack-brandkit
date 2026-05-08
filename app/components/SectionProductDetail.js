import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";

export default function SectionProductDetail({ scheme, headingFont, bodyFont, lang, colors }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: scheme.border }}>
      <SectionHeader label={lang === "fr" ? "Section — Produit en vedette" : "Section — Featured product"} scheme={scheme} />
      <div className="flex flex-col sm:flex-row" style={{ background: scheme.background }}>
        {/* Product image left */}
        <div className="sm:w-[42%] p-3">
          <div className="relative rounded-lg overflow-hidden bg-gray-50" style={{ paddingBottom: "100%" }}>
            <img
              src="/placeholder.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-12 h-12 rounded-md overflow-hidden bg-gray-50" style={{
                border: i === 0 ? `1.5px solid ${scheme.primary_button_background}` : `1px solid ${scheme.border}`,
              }}>
                <img src="/placeholder.png" alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {/* Product info right */}
        <div className="sm:w-[58%] p-4 sm:p-5 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating scheme={scheme} filled={5} />
            <span className="text-xs" style={{ color: scheme.foreground + "88" }}>(87 {lang === "fr" ? "avis" : "reviews"})</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-1 leading-tight" style={{ fontFamily: `'${headingFont}', serif`, color: scheme.foreground }}>
            {lang === "fr" ? "Sérum éclat vitamine C" : "Vitamin C Glow Serum"}
          </h3>
          <span className="text-base font-bold mb-2" style={{ color: scheme.foreground }}>
            {lang === "fr" ? "49,00 EUR" : "$49.00"}
          </span>
          {/* Benefit badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(lang === "fr"
              ? ["Éclat naturel", "Anti-oxydant", "Vegan"]
              : ["Natural glow", "Anti-oxidant", "Vegan"]
            ).map((badge, idx) => (
              <span key={idx} className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium" style={{
                background: scheme.primary_badge_background,
                color: scheme.primary_badge_text,
              }}>
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xs leading-relaxed mb-3" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: scheme.foreground + "77" }}>
            {lang === "fr"
              ? "Formule concentrée en vitamine C pure pour un teint éclatant. Application matin et soir sur peau propre."
              : "Pure vitamin C formula for a radiant complexion. Apply morning and evening on clean skin."}
          </p>
          {/* Color swatches */}
          <div className="flex gap-2 mb-4">
            {colors.slice(0, 3).map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full border-2 ${i === 0 ? "border-[#1a1a1a]" : "border-gray-200"}`} style={{ background: c }} />
            ))}
          </div>
          {/* Add to cart button */}
          <button className="w-full py-2.5 rounded-lg text-xs font-medium text-center border-none cursor-default" style={{
            background: scheme.primary_button_background,
            color: scheme.primary_button_text,
          }}>
            {lang === "fr" ? "Ajouter au panier" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
