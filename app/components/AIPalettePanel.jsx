"use client";

import { useState } from "react";

const NICHES = [
  { id: "mode", label: "Mode & bijoux" },
  { id: "cosmetique", label: "Cosmétique & beauté" },
  { id: "maison", label: "Maison & déco" },
  { id: "sport", label: "Sport & bien-être" },
  { id: "alimentaire", label: "Alimentation & gourmet" },
  { id: "enfants", label: "Enfants & bébé" },
  { id: "autre", label: "Autre" },
];

const STYLES = [
  { id: "luxe", label: "Luxe & premium" },
  { id: "minimaliste", label: "Minimaliste & épuré" },
  { id: "bold", label: "Bold & impactant" },
  { id: "naturel", label: "Naturel & écologique" },
  { id: "doux", label: "Doux & bienveillant" },
];

const AVOID_OPTIONS = [
  { id: "none", label: "Aucune restriction" },
  { id: "vives", label: "Couleurs trop vives" },
  { id: "sombres", label: "Tons sombres" },
  { id: "froides", label: "Tons froids" },
  { id: "chaudes", label: "Tons chauds" },
];

/**
 * Panneau inline de consultation IA pour la génération de palettes.
 *
 * Props :
 *   onPaletteSelect(colors: string[5]) — appelé quand l'utilisateur choisit une palette
 *   lang — "fr" | "en"
 *   defaultOpen — si true, le panneau est toujours ouvert (tab IA)
 */
export default function AIPalettePanel({ onPaletteSelect, lang = "fr", defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [step, setStep] = useState("niche"); // niche | style | avoid | inspiration | loading | results | error
  const [niche, setNiche] = useState(null);
  const [style, setStyle] = useState(null);
  const [avoidId, setAvoidId] = useState("none");
  const [inspiration, setInspiration] = useState("");
  const [palettes, setPalettes] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const isFr = lang !== "en";

  const reset = () => {
    setStep("niche");
    setNiche(null);
    setStyle(null);
    setAvoidId("none");
    setInspiration("");
    setPalettes([]);
    setErrorMsg("");
  };

  const handleNiche = (id) => {
    setNiche(id);
    setStep("style");
  };

  const handleStyle = (id) => {
    setStyle(id);
    setStep("avoid");
  };

  const fetchPalettes = async (avoidIdParam, inspirationText) => {
    setStep("loading");
    try {
      const nicheLabel = NICHES.find((n) => n.id === niche)?.label ?? niche;
      const styleLabel = STYLES.find((s) => s.id === style)?.label ?? style;
      const avoidLabel =
        avoidIdParam !== "none"
          ? [AVOID_OPTIONS.find((a) => a.id === avoidIdParam)?.label ?? avoidIdParam]
          : [];

      const res = await fetch("/api/brandkit/suggest-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: nicheLabel,
          style: styleLabel,
          avoid: avoidLabel,
          inspiration: inspirationText?.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur serveur");
      }

      const data = await res.json();
      if (!data.palettes?.length) throw new Error("Aucune palette générée");
      setPalettes(data.palettes);
      setStep("results");
    } catch (e) {
      setErrorMsg(e.message || "Génération impossible. Vérifiez votre connexion.");
      setStep("error");
    }
  };

  const handleSelect = (palette) => {
    onPaletteSelect(palette.colors);
    setOpen(false);
    reset();
  };

  /* ── Trigger button (panel closed) ── */
  if (!open) {
    if (defaultOpen) return null;
    return (
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer bg-white"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 6v4m0 4h.01"/>
          </svg>
          {isFr
            ? "Pas d'inspiration ? Laissez l'IA vous proposer une palette"
            : "No inspiration? Let the AI suggest a palette"}
        </button>
      </div>
    );
  }

  /* ── Panel (open) ── */
  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden animate-fadeIn ${defaultOpen ? "" : "mt-6"}`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 text-white">
        <span className="text-sm font-semibold">
          ✨ {isFr ? "Palette personnalisée par l'IA" : "AI-powered palette"}
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
        {/* ── Step: niche ── */}
        {step === "niche" && (
          <div className="animate-fadeIn">
            <p className="text-sm font-medium text-gray-800 mb-3">
              {isFr ? "Quel type de produits vendez-vous ?" : "What type of products do you sell?"}
            </p>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNiche(n.id)}
                  className="px-3.5 py-2 rounded-full text-sm border border-gray-200 bg-white text-gray-700 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: style ── */}
        {step === "style" && (
          <div className="animate-fadeIn">
            <button onClick={() => setStep("niche")} className="text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer underline block">
              ← {isFr ? "Retour" : "Back"}
            </button>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {isFr ? "Quelle ambiance souhaitez-vous ?" : "What vibe are you going for?"}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {NICHES.find((n) => n.id === niche)?.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStyle(s.id)}
                  className="px-3.5 py-2 rounded-full text-sm border border-gray-200 bg-white text-gray-700 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: avoid ── */}
        {step === "avoid" && (
          <div className="animate-fadeIn">
            <button onClick={() => setStep("style")} className="text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer underline block">
              ← {isFr ? "Retour" : "Back"}
            </button>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {isFr ? "Des couleurs à éviter ?" : "Any colors to avoid?"}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {NICHES.find((n) => n.id === niche)?.label} · {STYLES.find((s) => s.id === style)?.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {AVOID_OPTIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAvoidId(a.id); setStep("inspiration"); }}
                  className="px-3.5 py-2 rounded-full text-sm border border-gray-200 bg-white text-gray-700 hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: inspiration ── */}
        {step === "inspiration" && (
          <div className="animate-fadeIn">
            <button onClick={() => setStep("avoid")} className="text-xs text-gray-400 hover:text-gray-700 mb-3 cursor-pointer underline block">
              ← {isFr ? "Retour" : "Back"}
            </button>
            <p className="text-sm font-medium text-gray-800 mb-1">
              {isFr ? "Une inspiration à partager ?" : "Any inspiration to share?"}
            </p>
            <p className="text-xs text-gray-400 mb-3">
              {isFr
                ? "Optionnel — nom de marque, référence, couleur précise, ambiance…"
                : "Optional — brand name, reference, specific color, mood…"}
            </p>
            <textarea
              value={inspiration}
              onChange={(e) => setInspiration(e.target.value)}
              placeholder={isFr
                ? "Ex : tons terracotta inspirés de l'Italie, marque qui s'appelle 'Soleil'…"
                : "E.g. terracotta tones inspired by Italy, brand called 'Soleil'…"}
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-3 resize-none focus:outline-none focus:border-[#1a1a1a] text-gray-800 placeholder:text-gray-300 bg-white"
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => fetchPalettes(avoidId, inspiration)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors"
              >
                ✨ {isFr ? "Générer ma palette" : "Generate my palette"}
              </button>
              <button
                onClick={() => fetchPalettes(avoidId, "")}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer underline whitespace-nowrap"
              >
                {isFr ? "Passer" : "Skip"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step: loading ── */}
        {step === "loading" && (
          <div className="flex flex-col items-center gap-3 py-10 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#1a1a1a] rounded-full animate-spin" />
            <p className="text-sm">
              {isFr ? "L'IA analyse votre univers…" : "AI is analysing your world…"}
            </p>
          </div>
        )}

        {/* ── Step: results ── */}
        {step === "results" && (
          <div className="animate-fadeIn">
            <p className="text-xs text-gray-400 mb-3">
              {isFr
                ? "Cliquez sur une palette pour l'appliquer à votre thème."
                : "Click a palette to apply it to your theme."}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {palettes.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(p)}
                  className="border border-gray-200 rounded-xl overflow-hidden text-left hover:border-[#1a1a1a] hover:shadow-sm transition-all cursor-pointer bg-white"
                >
                  <div className="flex h-12">
                    {p.colors.map((c, j) => (
                      <div key={j} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{p.rationale}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {p.colors.map((c, j) => (
                        <div
                          key={j}
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ background: c }}
                        />
                      ))}
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
