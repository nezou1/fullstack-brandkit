"use client";

import { useState, useEffect } from "react";
import { loadGoogleFont } from "../lib/utils";

const STYLES = [
  { id: "elegant",   label: "Élégant & raffiné",    hint: "Serif classique, ambiance luxe", font: "'Cormorant Garamond', serif", weight: 600, googleFont: "Cormorant Garamond" },
  { id: "moderne",   label: "Moderne & épuré",       hint: "Sans-serif clean, digital",      font: "'Montserrat', sans-serif",    weight: 500, googleFont: "Montserrat" },
  { id: "bold",      label: "Bold & impactant",      hint: "Fort contraste, display",        font: "'Libre Baskerville', serif",  weight: 700, googleFont: "Libre Baskerville" },
  { id: "doux",      label: "Doux & arrondi",        hint: "Formes rondes, bienveillant",    font: "'Raleway', sans-serif",       weight: 400, googleFont: "Raleway" },
  { id: "editorial", label: "Classique & éditorial", hint: "Serif lisible, contenu dense",   font: "'Playfair Display', serif",   weight: 400, googleFont: "Playfair Display" },
];

const USAGES = [
  { id: "titres", label: "Titres courts & accrocheurs", hint: "Noms de produits, slogans percutants" },
  { id: "texte", label: "Beaucoup de texte à lire", hint: "Descriptions longues, blog, fiches produit" },
  { id: "mixte", label: "Équilibré — titres + texte", hint: "Usage standard e-commerce" },
];

/**
 * Panneau inline de consultation IA pour la typographie.
 * Affiché à l'étape 3 (Typographie) du Brand Kit.
 *
 * Props :
 *   onFontSelect({ heading, body }) — applique le duo dans le wizard
 *   lang — "fr" | "en"
 *   defaultOpen — si true, le panneau est toujours ouvert (tab IA)
 */
export default function AIFontPanel({ onFontSelect, lang = "fr", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState("style"); // style | usage | loading | results | error
  const [style, setStyle] = useState(null);
  const [duos, setDuos] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const isFr = lang !== "en";

  // Pré-charger les polices représentatives des styles au montage
  useEffect(() => {
    STYLES.forEach((s) => loadGoogleFont(s.googleFont));
  }, []);

  // Charger les Google Fonts dès que les résultats arrivent
  useEffect(() => {
    if (step === "results") {
      duos.forEach((d) => {
        loadGoogleFont(d.heading);
        loadGoogleFont(d.body);
      });
    }
  }, [step, duos]);

  const reset = () => {
    setStep("style");
    setStyle(null);
    setDuos([]);
    setErrorMsg("");
  };

  const handleStyle = (id) => {
    setStyle(id);
    setStep("usage");
  };

  const fetchDuos = async (usageId) => {
    setStep("loading");
    try {
      const styleLabel = STYLES.find((s) => s.id === style)?.label ?? style;
      const usageLabel = USAGES.find((u) => u.id === usageId)?.label ?? usageId;

      const res = await fetch("/api/brandkit/suggest-fonts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style: styleLabel, usage: usageLabel }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur serveur");
      }

      const data = await res.json();
      if (!data.duos?.length) throw new Error("Aucun duo généré");
      setDuos(data.duos);
      setStep("results");
    } catch (e) {
      setErrorMsg(e.message || "Génération impossible. Vérifiez votre connexion.");
      setStep("error");
    }
  };

  const handleSelect = (duo) => {
    onFontSelect({ heading: duo.heading, body: duo.body });
    if (!defaultOpen) setOpen(false);
    reset();
  };

  /* ── Trigger button (panel closed) ── */
  if (!open) {
    return (
      <div className="mt-5 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 6v4m0 4h.01"/>
          </svg>
          {isFr
            ? "Pas d'inspiration ? Laissez l'IA vous suggérer des polices"
            : "Need help? Let the AI suggest font pairings"}
        </button>
      </div>
    );
  }

  /* ── Panel (open) ── */
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden animate-fadeIn ${defaultOpen ? "" : "mt-5"}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 text-white">
        <span className="text-sm font-semibold">
          ✨ {isFr ? "Duo de polices par l'IA" : "AI font pairing"}
        </span>
        {!defaultOpen && (
          <button
            onClick={() => { setOpen(false); reset(); }}
            className="text-white/50 hover:text-white text-lg leading-none cursor-pointer"
            aria-label="Fermer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-4 bg-gray-50">
        {/* ── Step: style ── */}
        {step === "style" && (
          <div className="animate-fadeIn">
            <p className="text-sm font-medium text-gray-800 mb-3">
              {isFr
                ? "Quel style typographique souhaitez-vous ?"
                : "What typographic style are you looking for?"}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStyle(s.id)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-gray-200 bg-white text-left hover:border-[#1a1a1a] transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <span
                      className="block text-[13px] text-gray-800 group-hover:text-gray-900 leading-tight"
                      style={{ fontFamily: s.font, fontWeight: s.weight }}
                    >
                      {s.label}
                    </span>
                    <span className="block text-[11px] text-gray-400 mt-0.5">{s.hint}</span>
                  </div>
                  <span
                    className="text-xl text-gray-300 ml-3 shrink-0 group-hover:text-gray-500 transition-colors"
                    style={{ fontFamily: s.font, fontWeight: s.weight }}
                  >
                    Aa
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: usage ── */}
        {step === "usage" && (
          <div className="animate-fadeIn">
            <button
              onClick={() => setStep("style")}
              className="text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer underline block"
            >
              ← {isFr ? "Retour" : "Back"}
            </button>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {isFr
                ? "Quel est le contenu principal de votre boutique ?"
                : "What's the primary content of your shop?"}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {STYLES.find((s) => s.id === style)?.label}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {USAGES.map((u) => (
                <button
                  key={u.id}
                  onClick={() => fetchDuos(u.id)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-left hover:border-[#1a1a1a] transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                    {u.label}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{u.hint}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: loading ── */}
        {step === "loading" && (
          <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#1a1a1a] rounded-full animate-spin" />
            <p className="text-sm">
              {isFr ? "L'IA compose vos duos de polices…" : "AI is crafting your font pairings…"}
            </p>
          </div>
        )}

        {/* ── Step: results ── */}
        {step === "results" && (
          <div className="animate-fadeIn">
            <p className="text-xs text-gray-400 mb-3">
              {isFr
                ? "Cliquez sur un duo pour l'appliquer à votre thème."
                : "Click a pairing to apply it to your theme."}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {duos.map((d, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(d)}
                  className="border border-gray-200 rounded-xl overflow-hidden text-left hover:border-[#1a1a1a] hover:shadow-sm transition-all cursor-pointer bg-white"
                >
                  <div className="px-4 pt-4 pb-3">
                    <p
                      style={{ fontFamily: `"${d.heading}", serif` }}
                      className="text-xl font-bold text-gray-900 leading-tight"
                    >
                      {d.heading}
                    </p>
                    <p
                      style={{ fontFamily: `"${d.body}", sans-serif` }}
                      className="text-sm text-gray-500 mt-0.5"
                    >
                      {isFr ? "avec" : "with"} {d.body}{" "}
                      {isFr ? "pour le texte" : "for body text"}
                    </p>
                    <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-start justify-between gap-2">
                      <p className="text-xs text-gray-400 leading-relaxed">{d.rationale}</p>
                      {d.tag && (
                        <span className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {d.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-3 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer underline"
            >
              {isFr ? "Recommencer les questions" : "Start over"}
            </button>
          </div>
        )}

        {/* ── Step: error ── */}
        {step === "error" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-red-500">{errorMsg}</p>
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-gray-700 underline cursor-pointer"
            >
              {isFr ? "Réessayer" : "Try again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
