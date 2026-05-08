"use client";

import { useState, useRef, useCallback, useEffect } from "react";

import { T } from "./lib/i18n";
import { SHOPIFY_FONTS } from "./lib/fonts";
import { STYLES, AMBIANCES } from "./lib/ambiances";
import { SCHEME_LABELS, MAPPING_ZONES, buildAllSchemes } from "./lib/schemes";
import {
  extractColorsFromImage,
  detectMoodFromColors,
  getDuosForMood,
  loadGoogleFont,
} from "./lib/utils";

import StepBar from "./components/StepBar";
import LangSwitch from "./components/LangSwitch";
import PipetteCanvas from "./components/PipetteCanvas";
import ColorSwatch from "./components/ColorSwatch";
import FontPairPicker from "./components/FontPairPicker";
import SectionImageBanner from "./components/SectionImageBanner";
import SectionProductDetail from "./components/SectionProductDetail";
import SectionReassuranceMockup from "./components/SectionReassuranceMockup";
import CustomizerZoneRow from "./components/CustomizerZoneRow";
import Toast from "./components/Toast";

export default function BrandKit() {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeMood, setActiveMood] = useState("_default");
  const [selectedStyle, setSelectedStyle] = useState("luxe");
  const [selectedAmbiance, setSelectedAmbiance] = useState(null);
  const [step1Tab, setStep1Tab] = useState("scratch"); // "import" | "scratch"
  const [fontDuoIdx, setFontDuoIdx] = useState(0);
  const [imageSrc, setImageSrc] = useState(null);
  const [colors, setColors] = useState(["#ccc", "#ccc", "#ccc", "#ccc", "#ccc"]);
  const [fonts, setFonts] = useState({ heading: "Playfair Display", body: "Montserrat" });
  const [mapping, setMapping] = useState(null);
  const [defaultScheme, setDefaultScheme] = useState("scheme-1");
  const [enabledSchemes, setEnabledSchemes] = useState(["scheme-1", "scheme-2", "scheme-3", "scheme-4", "scheme-5"]);
  const [showManagement, setShowManagement] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [previewScheme, setPreviewScheme] = useState("scheme-1");
  const [themeZip, setThemeZip] = useState(null);
  const [themeStatus, setThemeStatus] = useState("idle"); // idle | processing | done
  const [toast, setToast] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);
  const themeFileRef = useRef(null);

  const t = T[lang];

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  }, []);

  const goStep = (n) => {
    setStep(n);
    setMaxStep((prev) => Math.max(prev, n));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* File handling — image upload */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setSelectedMood(null);
    const img = new Image();
    img.onload = () => {
      const extracted = extractColorsFromImage(img, 5);
      setColors(extracted);
      const detectedMood = detectMoodFromColors(extracted);
      setActiveMood(detectedMood);
      setFontDuoIdx(0);
      const duos = getDuosForMood(detectedMood);
      loadGoogleFont(duos[0].heading);
      loadGoogleFont(duos[0].body);
      setFonts({ heading: duos[0].heading, body: duos[0].body });
    };
    img.src = url;
  };

  /* Mood selection (legacy) */
  const handleMood = (mood) => {
    setSelectedMood(mood.id);
    setActiveMood(mood.id);
    setFontDuoIdx(0);
    setImageSrc(null);
    setColors(mood.colors);
    const duos = getDuosForMood(mood.id);
    loadGoogleFont(duos[0].heading);
    loadGoogleFont(duos[0].body);
    setFonts({ heading: duos[0].heading, body: duos[0].body });
    goStep(2);
  };

  /* Ambiance selection (new) */
  const handleAmbiance = (ambiance) => {
    setSelectedAmbiance(ambiance.id);
    setActiveMood(ambiance.moodId);
    setFontDuoIdx(0);
    setImageSrc(null);
    setColors(ambiance.colors);
    const duos = getDuosForMood(ambiance.moodId);
    loadGoogleFont(duos[0].heading);
    loadGoogleFont(duos[0].body);
    setFonts({ heading: duos[0].heading, body: duos[0].body });
    setSelectedMood(ambiance.moodId);
  };

  const handleColorsChange = useCallback((newColors) => {
    if (typeof newColors === "function") setColors(newColors);
    else setColors(newColors);
  }, []);

  /* Auto-rebuild mapping whenever colors change (pipette drag, ambiance pick, etc.) */
  useEffect(() => {
    if (colors && colors[0] !== "#ccc") {
      setMapping(buildAllSchemes(colors));
    }
  }, [colors]);

  /* Restore config from URL params (shared link) */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get("c");
    if (c) {
      const parsed = c.split(",").map((h) => "#" + h);
      if (parsed.length === 5 && parsed.every((h) => /^#[0-9a-fA-F]{6}$/.test(h))) {
        setColors(parsed);
        const hf = params.get("hf");
        const bf = params.get("bf");
        if (hf) loadGoogleFont(hf);
        if (bf) loadGoogleFont(bf);
        if (hf || bf) setFonts({ heading: hf || "Playfair Display", body: bf || "Montserrat" });
        const en = params.get("en");
        if (en) setEnabledSchemes(en.split(",").map((n) => `scheme-${n}`));
        const df = params.get("df");
        if (df) setDefaultScheme(`scheme-${df}`);
        setStep(4);
        setMaxStep(4);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  /* Initialize mapping when going to step 2 */
  const goToMapping = () => {
    if (!mapping) setMapping(buildAllSchemes(colors));
    goStep(2);
  };

  /* Update a single mapping key in scheme-1 (customizer) */
  const updateMapping = (scheme, key, value) => {
    setMapping((prev) => ({
      ...prev,
      [scheme]: { ...prev[scheme], [key]: value },
    }));
  };

  /* Toggle a scheme on/off */
  const toggleScheme = (sk) => {
    setEnabledSchemes((prev) =>
      prev.includes(sk) ? prev.filter((s) => s !== sk) : [...prev, sk]
    );
  };

  /* Theme ZIP processing */
  const handleThemeUpload = async (file) => {
    if (!file || !file.name.endsWith(".zip")) return;
    setThemeStatus("processing");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(file);
      const settingsFile = zip.file("config/settings_data.json");
      if (!settingsFile) {
        showToast("Fichier config/settings_data.json introuvable dans le ZIP");
        setThemeStatus("idle");
        return;
      }
      const settingsText = await settingsFile.async("text");
      const settings = JSON.parse(settingsText);

      // Inject enabled color schemes (only enabled ones)
      // Swap default scheme to position 1 so Shopify uses it as the default
      if (mapping) {
        const schemes = {};
        enabledSchemes.forEach((sk) => {
          if (!mapping[sk]) return;
          let targetKey = sk;
          if (defaultScheme !== "scheme-1") {
            if (sk === "scheme-1") targetKey = defaultScheme;
            else if (sk === defaultScheme) targetKey = "scheme-1";
          }
          schemes[targetKey] = { settings: mapping[sk] };
        });
        settings.current.color_schemes = schemes;
      }

      // Inject fonts
      const headingFont = SHOPIFY_FONTS[fonts.heading];
      const bodyFont = SHOPIFY_FONTS[fonts.body];
      if (headingFont) {
        settings.current.font_from = "shopify";
        settings.current.type_heading_font = headingFont.heading;
        settings.current.type_subheading_font = headingFont.subheading;
      }
      if (bodyFont) {
        settings.current.type_body_font = bodyFont.body;
        settings.current.type_primary_font = bodyFont.body;
      }

      // Write back to ZIP
      zip.file("config/settings_data.json", JSON.stringify(settings, null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      setThemeZip(blob);
      setThemeStatus("done");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors du traitement du ZIP");
      setThemeStatus("idle");
    }
  };

  const downloadTheme = () => {
    if (!themeZip) return;
    const url = URL.createObjectURL(themeZip);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fullstack-brandkit-theme.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* Share config link */
  const handleShare = async () => {
    const params = new URLSearchParams();
    params.set("c", colors.map((c) => c.replace("#", "")).join(","));
    params.set("hf", fonts.heading);
    params.set("bf", fonts.body);
    params.set("en", enabledSchemes.map((s) => s.split("-")[1]).join(","));
    params.set("df", defaultScheme.split("-")[1]);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "FullStack BrandKit", text: lang === "fr" ? "Voici ma config BrandKit :" : "Here's my BrandKit config:", url: shareUrl });
        return;
      } catch (e) { /* user cancelled or not supported */ }
    }
    await navigator.clipboard.writeText(shareUrl);
    showToast(t.linkCopied);
  };

  /* Reset */
  const handleReset = () => {
    setStep(1);
    setMaxStep(1);
    setSelectedMood(null);
    setActiveMood("_default");
    setSelectedStyle("luxe");
    setSelectedAmbiance(null);
    setStep1Tab("scratch");
    setFontDuoIdx(0);
    setImageSrc(null);
    setColors(["#ccc", "#ccc", "#ccc", "#ccc", "#ccc"]);
    setFonts({ heading: "Playfair Display", body: "Montserrat" });
    setMapping(null);
    setDefaultScheme("scheme-1");
    setEnabledSchemes(["scheme-1", "scheme-2", "scheme-3", "scheme-4", "scheme-5"]);
    setShowManagement(false);
    setShowCustomizer(false);
    setPreviewScheme("scheme-1");
    setThemeZip(null);
    setThemeStatus("idle");
    if (fileRef.current) fileRef.current.value = "";
    if (themeFileRef.current) themeFileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pb-16 relative">
      <LangSwitch lang={lang} setLang={setLang} />

      {/* Header */}
      <div className="text-center pt-16 pb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a1a1a] rounded-xl text-white font-semibold text-lg mb-4">FS</div>
        <h1 className="text-4xl font-semibold mb-2">{t.title}</h1>
        <p className="text-base text-gray-400">{t.subtitle}</p>
      </div>

      <StepBar step={step} lang={lang} totalSteps={4} maxStep={maxStep} onStepClick={goStep} />

      {/* ──── STEP 1: Tab system — Import / From scratch ──── */}
      {step === 1 && (
        <section className="animate-fadeIn">
          {/* Tab switcher */}
          <div className="flex mb-5 border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setStep1Tab("scratch")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium cursor-pointer transition-all border-none ${step1Tab === "scratch" ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-50"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              {lang === "fr" ? "Partir de zéro" : "Start from scratch"}
            </button>
            <button onClick={() => setStep1Tab("import")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium cursor-pointer transition-all border-none ${step1Tab === "import" ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-50"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
              {lang === "fr" ? "Importer une image" : "Import an image"}
            </button>
          </div>

          {/* ── TAB: Import image ── */}
          {step1Tab === "import" && (
            <div className="animate-fadeIn">
              {!imageSrc && (
                <div className={`border-[1.5px] border-dashed rounded-xl p-12 text-center cursor-pointer transition-all relative ${isDragging ? "border-[#1a1a1a] bg-gray-50" : "border-gray-300 hover:border-[#1a1a1a] hover:bg-gray-50"}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}>
                  <svg className="mx-auto mb-3 text-gray-300" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                  <p className="text-base text-gray-500 font-medium">{t.uploadTitle}</p>
                  <span className="text-xs text-gray-300 mt-1.5 block">{t.uploadSub}</span>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                </div>
              )}

              {/* Pipette canvas + color swatches inline */}
              {imageSrc && (
                <div className="animate-fadeIn">
                  {/* Change image button — top right, always visible */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                      {t.pipetteHint}
                    </span>
                    <button onClick={() => { setImageSrc(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border border-gray-200 bg-white text-gray-500 hover:border-[#1a1a1a] hover:text-[#1a1a1a]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                      {lang === "fr" ? "Changer d'image" : "Change image"}
                    </button>
                  </div>
                  <PipetteCanvas imageSrc={imageSrc} colors={colors} onColorsChange={handleColorsChange} lang={lang} />
                  <div className="mt-4">
                    <div className="flex gap-1.5">
                      {colors.map((c, i) => (<ColorSwatch key={i} color={c} label={t.colorLabels[i]} onCopy={(hex) => showToast(`${hex} ${t.copied}`)} />))}
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="mt-5">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2.5">
                      {lang === "fr" ? "Aperçu" : "Preview"}
                    </span>
                    <SectionImageBanner
                      scheme={buildAllSchemes(colors)["scheme-1"]}
                      headingFont={fonts.heading}
                      bodyFont={fonts.body}
                      lang={lang}
                      colors={colors}
                    />
                  </div>
                  <div className="mt-5">
                    <button onClick={() => goStep(2)} className="w-full py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">
                      {t.step2} →
                    </button>
                  </div>
                </div>
              )}

              {!imageSrc && (
                <p className="text-xs text-gray-300 text-center mt-3">
                  {lang === "fr" ? "On extraira automatiquement les couleurs de ton image" : "We'll automatically extract colors from your image"}
                </p>
              )}
            </div>
          )}

          {/* ── TAB: From scratch ── */}
          {step1Tab === "scratch" && (
            <div className="animate-fadeIn">
              {/* Style pills */}
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2.5">
                {lang === "fr" ? "Étape 1 — Choisis un style" : "Step 1 — Choose a style"}
              </span>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {STYLES.map((style) => (
                  <button key={style.id} onClick={() => { setSelectedStyle(style.id); setSelectedAmbiance(null); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all border ${selectedStyle === style.id ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-gray-500 border-gray-200 hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}>
                    {style.label[lang]}
                  </button>
                ))}
              </div>

              {/* Ambiance cards */}
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2.5">
                {lang === "fr" ? "Étape 2 — Choisis une ambiance" : "Step 2 — Choose an ambiance"}
              </span>
              <div className="grid grid-cols-3 gap-2.5 items-stretch">
                {(AMBIANCES[selectedStyle] || []).map((amb) => (
                  <button key={amb.id} onClick={() => handleAmbiance(amb)}
                    className={`border rounded-xl p-4 text-left cursor-pointer transition-all bg-white flex flex-col ${selectedAmbiance === amb.id ? "border-[#1a1a1a] ring-2 ring-gray-100" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
                    <div className="flex gap-0.5 mb-2">
                      {amb.dots.map((c, i) => (
                        <div key={i} className="flex-1 h-6 first:rounded-l-md last:rounded-r-md" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-[#1a1a1a] leading-tight">{amb.name[lang]}</div>
                    <div className="text-xs text-gray-400 mt-auto pt-1">{amb.sub[lang]}</div>
                  </button>
                ))}
              </div>

              {/* Preview after ambiance selected */}
              {selectedAmbiance && (
                <div className="mt-6 animate-fadeIn">
                  <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2.5">
                    {lang === "fr" ? "Aperçu" : "Preview"}
                  </span>
                  <SectionImageBanner
                    scheme={buildAllSchemes(colors)["scheme-1"]}
                    headingFont={fonts.heading}
                    bodyFont={fonts.body}
                    lang={lang}
                    colors={colors}
                  />
                  <button onClick={() => goStep(2)} className="w-full mt-5 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">
                    {lang === "fr" ? "Continuer" : "Continue"} →
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ──── STEP 3: Typography ──── */}
      {step === 3 && (
        <section className="animate-fadeIn">
          <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400 mb-1">{t.fontPickerTitle}</h2>
          <p className="text-sm text-gray-300 mb-4">{t.fontPickerHint}</p>
          <FontPairPicker duos={getDuosForMood(activeMood)} selectedIdx={fontDuoIdx} onSelect={(idx) => { setFontDuoIdx(idx); const duo = getDuosForMood(activeMood)[idx]; setFonts({ heading: duo.heading, body: duo.body }); }} lang={lang} />

          {/* Typography preview using Product Detail section */}
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2.5 mt-6">
            {t.previewTitle}
          </span>
          <SectionProductDetail
            scheme={mapping ? mapping["scheme-1"] : buildAllSchemes(colors)["scheme-1"]}
            headingFont={fonts.heading}
            bodyFont={fonts.body}
            lang={lang}
            colors={colors}
          />

          <div className="flex gap-2 mt-8">
            <button onClick={() => goStep(2)} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-white text-[#1a1a1a] border-[1.5px] border-gray-200 cursor-pointer hover:border-[#1a1a1a] transition-colors">← {t.step2}</button>
            <button onClick={() => goStep(4)} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">{t.step4} →</button>
          </div>
        </section>
      )}

      {/* ──── STEP 2: Color Mapping ──── */}
      {step === 2 && mapping && (
        <section className="animate-fadeIn">
          {/* Header row: title + Gérer button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">
              {lang === "fr" ? "Choisis un nuancier" : "Choose a color scheme"}
            </span>
            <button onClick={() => setShowManagement((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border border-gray-200 bg-white text-gray-500 hover:border-[#1a1a1a] hover:text-[#1a1a1a]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              {lang === "fr" ? "Gérer" : "Manage"}
            </button>
          </div>

          {/* Management panel — toggled by Gérer button */}
          {showManagement && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5 animate-fadeIn">
              {/* Section 1: Enable/disable schemes + set default */}
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-2">
                {lang === "fr" ? "Activer / désactiver" : "Enable / disable"}
              </span>
              {["scheme-1", "scheme-2", "scheme-3", "scheme-4", "scheme-5"].map((sk, i) => {
                const s = mapping[sk];
                const isDefault = defaultScheme === sk;
                const isEnabled = enabledSchemes.includes(sk);
                return (
                  <div key={sk} className={`flex items-center justify-between py-2.5 ${i < 4 ? "border-b border-gray-200/60" : ""}`}>
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="flex gap-1 shrink-0">
                        {[s.background, s.primary_button_background, s.primary_badge_background].map((c, j) => (
                          <div key={j} className="w-4 h-4 rounded-full border border-gray-200" style={{ background: c }} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 truncate">{SCHEME_LABELS[lang][i]}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={isEnabled} onChange={() => { if (defaultScheme !== sk) toggleScheme(sk); }}
                          className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer" disabled={isDefault} />
                        <span className="text-xs text-gray-400">{lang === "fr" ? "Actif" : "On"}</span>
                      </label>
                      <button onClick={() => { setDefaultScheme(sk); if (!enabledSchemes.includes(sk)) setEnabledSchemes((prev) => [...prev, sk]); setPreviewScheme(sk); }}
                        className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all ${isDefault ? "bg-[#1a1a1a] text-white border-none" : "bg-white text-gray-400 border border-gray-300 hover:border-[#1a1a1a]"}`}>
                        {lang === "fr" ? "Par défaut" : "Default"}
                      </button>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* Scheme cards — styled like ambiance cards */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
            {["scheme-1", "scheme-2", "scheme-3", "scheme-4", "scheme-5"].map((sk, i) => {
              const s = mapping[sk];
              const isActive = previewScheme === sk;
              const isDefault = defaultScheme === sk;
              const isEnabled = enabledSchemes.includes(sk);
              return (
                <button key={sk} onClick={() => setPreviewScheme(sk)}
                  className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${isActive ? "border-[#1a1a1a] ring-2 ring-gray-100" : isEnabled ? "border-gray-200 hover:border-[#1a1a1a]" : "border-gray-100 opacity-40"}`}
                  style={{ background: "#fff" }}>
                  <div className="flex gap-0.5 mb-2.5">
                    <div className="flex-1 h-6 rounded-l-md" style={{ background: s.background, border: s.background === "#ffffff" ? "1px solid #eee" : "none" }} />
                    <div className="flex-1 h-6" style={{ background: s.foreground }} />
                    <div className="flex-1 h-6" style={{ background: s.primary_button_background }} />
                    <div className="flex-1 h-6" style={{ background: s.primary_badge_background }} />
                    <div className="flex-1 h-6 rounded-r-md" style={{ background: s.secondary_button_border || s.border }} />
                  </div>
                  <span className="block text-sm font-semibold text-[#1a1a1a] leading-tight">{SCHEME_LABELS[lang][i].split(" — ")[0]}</span>
                  {isDefault && (
                    <span className="inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded-full bg-[#1a1a1a] text-white">
                      {lang === "fr" ? "défaut" : "default"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Customizer accordion — under scheme cards */}
          <div className="mb-5">
            <button onClick={() => setShowCustomizer(!showCustomizer)}
              className="flex items-center gap-2 text-sm font-medium text-[#1a1a1a] cursor-pointer bg-transparent border-none hover:underline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{ transform: showCustomizer ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
              {lang === "fr"
                ? `Personnaliser — ${SCHEME_LABELS[lang][parseInt(previewScheme.split("-")[1]) - 1]?.split(" — ")[0]}`
                : `Customize — ${SCHEME_LABELS[lang][parseInt(previewScheme.split("-")[1]) - 1]?.split(" — ")[0]}`}
            </button>

            {showCustomizer && (
              <div className="mt-3 bg-gray-50 rounded-xl p-4 animate-fadeIn">
                <p className="text-xs text-gray-400 mb-3">
                  {lang === "fr"
                    ? "Assigne tes couleurs ou utilise le + pour une couleur personnalisée"
                    : "Assign your colors or use + for a custom color"}
                </p>
                {MAPPING_ZONES.map((zone) => (
                  <CustomizerZoneRow
                    key={zone.key}
                    zone={zone}
                    value={mapping[previewScheme][zone.key]}
                    colors={colors}
                    lang={lang}
                    onChange={(key, color) => updateMapping(previewScheme, key, color)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Preview Live */}
          <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-3">
            {lang === "fr" ? "Preview live — Sections du thème" : "Live preview — Theme sections"}
          </span>

          {mapping[previewScheme] && (
            <div className="space-y-3 mb-5">
              <SectionImageBanner scheme={mapping[previewScheme]} headingFont={fonts.heading} bodyFont={fonts.body} lang={lang} colors={colors} />
              <SectionProductDetail scheme={mapping[previewScheme]} headingFont={fonts.heading} bodyFont={fonts.body} lang={lang} colors={colors} />
              <SectionReassuranceMockup scheme={mapping[previewScheme]} bodyFont={fonts.body} lang={lang} />
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={() => goStep(1)} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-white text-[#1a1a1a] border-[1.5px] border-gray-200 cursor-pointer hover:border-[#1a1a1a] transition-colors">← {t.step1}</button>
            <button onClick={() => goStep(3)} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">{t.step3} →</button>
          </div>
        </section>
      )}

      {/* ──── STEP 4: Theme Export ──── */}
      {step === 4 && (
        <section className="animate-fadeIn">
          <h2 className="text-sm font-medium uppercase tracking-wide text-gray-400 mb-1">{t.themeTitle}</h2>
          <p className="text-sm text-gray-300 mb-4">{t.themeHint}</p>

          {themeStatus === "idle" && (
            <div className="border-[1.5px] border-dashed rounded-xl p-12 text-center cursor-pointer transition-all border-gray-300 hover:border-[#1a1a1a] hover:bg-gray-50"
              onClick={() => themeFileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleThemeUpload(e.dataTransfer.files[0]); }}>
              <svg className="mx-auto mb-2 text-gray-300" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <p className="text-base text-gray-400">{t.themeUpload}</p>
              <span className="text-sm text-gray-300 mt-1 block">{t.themeUploadSub}</span>
              <input ref={themeFileRef} type="file" accept=".zip" className="hidden" onChange={(e) => handleThemeUpload(e.target.files[0])} />
            </div>
          )}

          {themeStatus === "processing" && (
            <div className="border border-gray-200 rounded-xl p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-gray-200 border-t-[#1a1a1a] rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">{t.themeProcessing}</p>
            </div>
          )}

          {themeStatus === "done" && (
            <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-sm font-medium text-green-700 mb-1">{t.themeSuccess}</p>
              <button onClick={downloadTheme} className="mt-3 px-6 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">
                {t.themeDownload}
              </button>
            </div>
          )}

          {/* Visual summary — active scheme cards + typo */}
          {mapping && (
            <div className="mt-6">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-3">
                {lang === "fr" ? "Récapitulatif" : "Summary"}
              </span>
              <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${enabledSchemes.length}, minmax(0, 1fr))` }}>
                {enabledSchemes.map((sk) => {
                  const s = mapping[sk];
                  const i = parseInt(sk.split("-")[1]) - 1;
                  const isDefault = defaultScheme === sk;
                  return (
                    <div key={sk} className={`border rounded-xl p-3 text-center ${isDefault ? "border-[#1a1a1a] ring-2 ring-gray-100" : "border-gray-200"}`} style={{ background: "#fff" }}>
                      <div className="flex gap-0.5 mb-2">
                        <div className="flex-1 h-5 rounded-l-md" style={{ background: s.background, border: s.background === "#ffffff" ? "1px solid #eee" : "none" }} />
                        <div className="flex-1 h-5" style={{ background: s.foreground }} />
                        <div className="flex-1 h-5" style={{ background: s.primary_button_background }} />
                        <div className="flex-1 h-5" style={{ background: s.primary_badge_background }} />
                        <div className="flex-1 h-5 rounded-r-md" style={{ background: s.secondary_button_border || s.border }} />
                      </div>
                      <span className="block text-xs font-semibold text-[#1a1a1a] leading-tight">{SCHEME_LABELS[lang][i]?.split(" — ")[0]}</span>
                      {isDefault && (
                        <span className="inline-block text-[10px] mt-1 px-1.5 py-0.5 rounded-full bg-[#1a1a1a] text-white">
                          {lang === "fr" ? "défaut" : "default"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold" style={{ fontFamily: `'${fonts.heading}', serif` }}>Aa</span>
                  <div>
                    <span className="block text-sm font-medium text-[#1a1a1a]">{fonts.heading}</span>
                    <span className="block text-xs text-gray-400">{lang === "fr" ? "Titres" : "Headings"}</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex items-center gap-3">
                  <span className="text-lg" style={{ fontFamily: `'${fonts.body}', sans-serif` }}>Aa</span>
                  <div>
                    <span className="block text-sm font-medium text-[#1a1a1a]">{fonts.body}</span>
                    <span className="block text-xs text-gray-400">{lang === "fr" ? "Corps" : "Body"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <button onClick={handleShare} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="3" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.3"/><path d="M5.8 7l4.4-3M5.8 9l4.4 3" stroke="currentColor" strokeWidth="1.3"/></svg>
              {t.shareBtn}
            </button>
            <button onClick={handleReset} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-white text-[#1a1a1a] border-[1.5px] border-gray-200 cursor-pointer hover:border-[#1a1a1a] transition-colors">{t.resetBtn}</button>
          </div>
        </section>
      )}

      <Toast message={toast} />
    </main>
  );
}
