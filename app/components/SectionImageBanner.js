import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";
import { assetPath } from "../lib/utils";

export default function SectionImageBanner({ scheme, headingFont, bodyFont, lang, colors }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: scheme.border }}>
      <SectionHeader label={lang === "fr" ? "Section — Image banner" : "Section — Image banner"} scheme={scheme} />
      <div className="flex flex-col sm:flex-row" style={{ background: scheme.background }}>
        {/* Content left */}
        <div className="sm:w-[55%] p-5 sm:p-6 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-3">
            <StarRating scheme={scheme} filled={4} />
            <span className="text-xs" style={{ color: scheme.foreground + "88" }}>(87 {lang === "fr" ? "avis" : "reviews"})</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-tight" style={{ fontFamily: `'${headingFont}', serif`, color: scheme.foreground }}>
            {lang === "fr" ? "Collection printemps 2026" : "Spring Collection 2026"}
          </h3>
          <p className="text-xs leading-relaxed mb-4" style={{ fontFamily: `'${bodyFont}', sans-serif`, color: scheme.foreground + "88" }}>
            {lang === "fr"
              ? "Découvrez notre nouvelle collection pensée pour sublimer votre quotidien."
              : "Discover our new collection designed to elevate your everyday."}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium" style={{
              background: scheme.primary_button_background,
              color: scheme.primary_button_text,
              border: `1px solid ${scheme.primary_button_border}`,
            }}>
              {lang === "fr" ? "Découvrir" : "Discover"}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
            <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-medium" style={{
              background: scheme.secondary_button_background || "transparent",
              color: scheme.secondary_button_text,
              border: `1px solid ${scheme.secondary_button_border}`,
            }}>
              {lang === "fr" ? "En savoir plus" : "Learn more"}
            </span>
          </div>
        </div>
        {/* Image right */}
        <div className="sm:w-[45%] min-h-[200px] relative bg-gray-50">
          <img
            src={assetPath("/placeholder.png")}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
