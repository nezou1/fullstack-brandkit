export const SCHEME_LABELS = {
  fr: [
    "Clair — fond blanc, couleurs de marque",
    "Doux — fond teinté, tons harmonieux",
    "Accent — couleur d'accent dominante",
    "Neutre — fond gris, touches de couleur",
    "Sombre — fond foncé, texte clair",
  ],
  en: [
    "Light — white bg, brand colors",
    "Soft — tinted bg, harmonious tones",
    "Accent — dominant accent color",
    "Neutral — gray bg, color touches",
    "Dark — dark bg, light text",
  ],
};

export const MAPPING_ZONES = [
  { key: "background", label: { fr: "Fond de page", en: "Page background" } },
  { key: "foreground", label: { fr: "Texte principal", en: "Main text" } },
  { key: "border", label: { fr: "Bordures", en: "Borders" } },
  { key: "stars_icons_color", label: { fr: "Icônes", en: "Icons" } },
  { key: "primary_button_background", label: { fr: "Bouton principal — fond", en: "Primary button — bg" } },
  { key: "primary_button_text", label: { fr: "Bouton principal — texte", en: "Primary button — text" } },
  { key: "primary_button_border", label: { fr: "Bouton principal — bordure", en: "Primary button — border" } },
  { key: "secondary_button_background", label: { fr: "Bouton secondaire — fond", en: "Secondary button — bg" } },
  { key: "secondary_button_text", label: { fr: "Bouton secondaire — texte", en: "Secondary button — text" } },
  { key: "secondary_button_border", label: { fr: "Bouton secondaire — bordure", en: "Secondary button — border" } },
  { key: "primary_badge_background", label: { fr: "Badge — fond", en: "Badge — bg" } },
  { key: "primary_badge_text", label: { fr: "Badge — texte", en: "Badge — text" } },
];

export function buildScheme(bgColor, fgColor, btnBg, btnText, btnBorder, btn2Bg, btn2Text, btn2Border, badgeBg, badgeText, borderColor, starsColor) {
  return {
    background: bgColor,
    foreground: fgColor,
    border: borderColor,
    stars_icons_color: starsColor,
    primary_button_background: btnBg,
    primary_button_text: btnText,
    primary_button_border: btnBorder,
    secondary_button_background: btn2Bg,
    secondary_button_text: btn2Text,
    secondary_button_border: btn2Border,
    primary_badge_background: badgeBg,
    primary_badge_text: badgeText,
    primary_badge_border: badgeBg,
    secondary_badge_background: bgColor,
    secondary_badge_text: fgColor,
    secondary_badge_border: borderColor,
    input_background: bgColor,
    input_text_color: fgColor,
    input_border_color: borderColor,
    selected_input_background: bgColor,
    selected_input_text_color: fgColor,
    selected_input_border_color: btnBg,
    variant_background_color: bgColor,
    variant_text_color: fgColor,
    variant_border_color: borderColor,
    selected_variant_background_color: bgColor,
    selected_variant_text_color: fgColor,
    selected_variant_border_color: btnBg,
    tab_background_color: bgColor,
    tab_text_color: fgColor,
    tab_border_color: borderColor,
    selected_tab_background_color: bgColor,
    selected_tab_text_color: fgColor,
    selected_tab_border_color: btnBg,
  };
}

export function buildAllSchemes(colors) {
  const [primary, secondary, accent, bg, bgAlt] = colors;
  const white = "#ffffff";
  const darkText = "#252525";
  return {
    "scheme-1": buildScheme(white, darkText, primary, white, primary, white, primary, primary + "33", accent, white, "#0000000f", primary),
    "scheme-2": buildScheme(bg || "#f9f7f4", darkText, primary, white, primary, bg || "#f9f7f4", primary, primary + "33", secondary, white, primary + "1a", primary),
    "scheme-3": buildScheme(white, darkText, accent, white, accent, white, accent, accent + "33", primary, white, accent + "1a", accent),
    "scheme-4": buildScheme("#f5f5f5", darkText, primary, white, primary, "#f5f5f5", darkText, darkText + "33", accent, white, "#00000020", darkText),
    "scheme-5": buildScheme(primary, white, white, primary, white, primary, white, white + "55", accent, white, white + "25", white),
  };
}
