"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ═══════════════════════════ i18n ═══════════════════════════ */

const T = {
  fr: {
    title: "FullStack BrandKit",
    subtitle: "Trouve les couleurs et polices de ta boutique en 30 secondes",
    step1: "Couleurs",
    step2: "Nuanciers",
    step3: "Typo",
    step4: "Thème",
    uploadTitle: "Glisse ton logo ou une image ici",
    uploadSub: "PNG, JPG, SVG — max 5 Mo",
    orMood: "— ou choisis une ambiance —",
    pipetteHint: "Déplace les pipettes sur l'image pour capturer les couleurs",
    colorLabels: ["Primaire", "Secondaire", "Accent", "Fond", "Fond alt"],
    fontPickerTitle: "Choisis un duo typographique",
    fontPickerHint: "Polices disponibles nativement sur Shopify",
    typoTitle: "Aperçu typographique",
    typoHeading: "Titres",
    typoBody: "Corps",
    typoSample: "Votre boutique",
    typoBodySample: "Des produits uniques, faits pour vous. Découvrez notre collection exclusive.",
    previewTitle: "Preview sur ta boutique",
    navItems: ["Produits", "À propos", "Contact"],
    storeName: "Ma Boutique",
    heroTitle: "Découvrez notre collection",
    heroSub: "Des produits sélectionnés avec soin pour vous",
    heroCta: "Voir la collection",
    productNames: ["Produit phare", "Nouveauté", "Best-seller"],
    mappingTitle: "Assigne tes couleurs au thème",
    mappingHint: "Clique sur une zone puis choisis la couleur à appliquer",
    scheme1Label: "Scheme 1 — Fond clair (principal)",
    scheme2Label: "Scheme 2 — Fond gris (sections)",
    scheme3Label: "Scheme 3 — Fond sombre (contraste)",
    zoneBackground: "Fond de page",
    zoneForeground: "Texte principal",
    zoneBorder: "Bordures",
    zoneStars: "Étoiles & icônes",
    zonePrimaryBtnBg: "Bouton principal — fond",
    zonePrimaryBtnText: "Bouton principal — texte",
    zonePrimaryBtnBorder: "Bouton principal — bordure",
    zoneSecondaryBtnBg: "Bouton secondaire — fond",
    zoneSecondaryBtnText: "Bouton secondaire — texte",
    zoneSecondaryBtnBorder: "Bouton secondaire — bordure",
    zoneBadgePrimaryBg: "Badge principal — fond",
    zoneBadgePrimaryText: "Badge principal — texte",
    themeTitle: "Exporte ton thème personnalisé",
    themeHint: "Uploade le .zip de ton ThemeFullStack, on injecte tes couleurs et polices dedans",
    themeUpload: "Glisse ton fichier .zip ici",
    themeUploadSub: "ThemeFullStack uniquement",
    themeProcessing: "Modification du thème en cours…",
    themeDownload: "Télécharger mon thème personnalisé",
    themeSuccess: "Thème prêt ! Importe-le dans Shopify.",
    copied: "copié !",
    settingsCopied: "Settings copiés !",
    copyBtn: "Copier les settings",
    resetBtn: "Recommencer",
    primaryLabel: "Couleur primaire",
    secondaryLabel: "Couleur secondaire",
    accentLabel: "Couleur accent",
    bgLabel: "Couleur fond",
    bgAltLabel: "Couleur fond alt",
    headingLabel: "Police titres",
    bodyLabel: "Police corps",
  },
  en: {
    title: "FullStack BrandKit",
    subtitle: "Find your store's colors and fonts in 30 seconds",
    step1: "Colors",
    step2: "Schemes",
    step3: "Type",
    step4: "Theme",
    uploadTitle: "Drop your logo or an image here",
    uploadSub: "PNG, JPG, SVG — max 5 MB",
    orMood: "— or pick a mood —",
    pipetteHint: "Drag the pipettes on the image to pick colors",
    colorLabels: ["Primary", "Secondary", "Accent", "Background", "Alt bg"],
    fontPickerTitle: "Choose a font pairing",
    fontPickerHint: "Fonts available natively on Shopify",
    typoTitle: "Typography preview",
    typoHeading: "Headings",
    typoBody: "Body",
    typoSample: "Your store",
    typoBodySample: "Unique products, made for you. Discover our exclusive collection.",
    previewTitle: "Preview on your store",
    navItems: ["Products", "About", "Contact"],
    storeName: "My Store",
    heroTitle: "Discover our collection",
    heroSub: "Carefully selected products just for you",
    heroCta: "View collection",
    productNames: ["Featured", "New arrival", "Best-seller"],
    mappingTitle: "Assign your colors to the theme",
    mappingHint: "Click a zone then pick the color to apply",
    scheme1Label: "Scheme 1 — Light bg (main)",
    scheme2Label: "Scheme 2 — Gray bg (sections)",
    scheme3Label: "Scheme 3 — Dark bg (contrast)",
    zoneBackground: "Page background",
    zoneForeground: "Main text",
    zoneBorder: "Borders",
    zoneStars: "Stars & icons",
    zonePrimaryBtnBg: "Primary button — background",
    zonePrimaryBtnText: "Primary button — text",
    zonePrimaryBtnBorder: "Primary button — border",
    zoneSecondaryBtnBg: "Secondary button — background",
    zoneSecondaryBtnText: "Secondary button — text",
    zoneSecondaryBtnBorder: "Secondary button — border",
    zoneBadgePrimaryBg: "Primary badge — background",
    zoneBadgePrimaryText: "Primary badge — text",
    themeTitle: "Export your customized theme",
    themeHint: "Upload your ThemeFullStack .zip, we inject your colors and fonts",
    themeUpload: "Drop your .zip file here",
    themeUploadSub: "ThemeFullStack only",
    themeProcessing: "Modifying theme…",
    themeDownload: "Download my custom theme",
    themeSuccess: "Theme ready! Import it into Shopify.",
    copied: "copied!",
    settingsCopied: "Settings copied!",
    copyBtn: "Copy settings",
    resetBtn: "Start over",
    primaryLabel: "Primary color",
    secondaryLabel: "Secondary color",
    accentLabel: "Accent color",
    bgLabel: "Background color",
    bgAltLabel: "Alt background",
    headingLabel: "Heading font",
    bodyLabel: "Body font",
  },
};

/* ═══════════════════ SHOPIFY FONT MAP ═══════════════════ */

const SHOPIFY_FONTS = {
  "Playfair Display": { heading: "playfair_display_n7", body: "playfair_display_n4", subheading: "playfair_display_n5" },
  "Cormorant Garamond": { heading: "cormorant_garamond_n7", body: "cormorant_garamond_n4", subheading: "cormorant_garamond_n5" },
  "Bodoni Moda": { heading: "bodoni_moda_n7", body: "bodoni_moda_n4", subheading: "bodoni_moda_n5" },
  "Libre Baskerville": { heading: "libre_baskerville_n7", body: "libre_baskerville_n4", subheading: "libre_baskerville_n4" },
  "DM Serif Display": { heading: "dm_serif_display_n4", body: "dm_serif_display_n4", subheading: "dm_serif_display_n4" },
  "Lora": { heading: "lora_n7", body: "lora_n4", subheading: "lora_n5" },
  "PT Serif": { heading: "pt_serif_n7", body: "pt_serif_n4", subheading: "pt_serif_n4" },
  "Merriweather": { heading: "merriweather_n7", body: "merriweather_n4", subheading: "merriweather_n4" },
  "Oswald": { heading: "oswald_n6", body: "oswald_n4", subheading: "oswald_n5" },
  "Montserrat": { heading: "montserrat_n6", body: "montserrat_n4", subheading: "montserrat_n5" },
  "Raleway": { heading: "raleway_n6", body: "raleway_n4", subheading: "raleway_n5" },
  "Open Sans": { heading: "open_sans_n7", body: "open_sans_n4", subheading: "open_sans_n6" },
  "Lato": { heading: "lato_n7", body: "lato_n4", subheading: "lato_n4" },
  "Roboto": { heading: "roboto_n7", body: "roboto_n4", subheading: "roboto_n5" },
  "Source Sans Pro": { heading: "source_sans_pro_n7", body: "source_sans_pro_n4", subheading: "source_sans_pro_n6" },
  "Poppins": { heading: "poppins_n6", body: "poppins_n4", subheading: "poppins_n5" },
  "Nunito Sans": { heading: "nunito_sans_n7", body: "nunito_sans_n4", subheading: "nunito_sans_n6" },
  "Inter": { heading: "inter_n6", body: "inter_n4", subheading: "inter_n5" },
};

/* ═══════════════════ FONT DUOS (Shopify native) ═══════════════════ */

const FONT_DUOS = {
  beaute: [
    { heading: "Cormorant Garamond", body: "Montserrat", tag: { fr: "Classique raffiné", en: "Classic refined" } },
    { heading: "Playfair Display", body: "Raleway", tag: { fr: "Élégance moderne", en: "Modern elegance" } },
    { heading: "Libre Baskerville", body: "Open Sans", tag: { fr: "Doux & lisible", en: "Soft & readable" } },
  ],
  bijoux: [
    { heading: "Bodoni Moda", body: "Raleway", tag: { fr: "Haute joaillerie", en: "High jewelry" } },
    { heading: "Playfair Display", body: "Montserrat", tag: { fr: "Luxe classique", en: "Classic luxury" } },
    { heading: "Cormorant Garamond", body: "Lato", tag: { fr: "Élégance fine", en: "Fine elegance" } },
  ],
  "pret-a-porter": [
    { heading: "Oswald", body: "Lato", tag: { fr: "Minimal bold", en: "Minimal bold" } },
    { heading: "Montserrat", body: "Source Sans Pro", tag: { fr: "Épuré moderne", en: "Clean modern" } },
    { heading: "Raleway", body: "Open Sans", tag: { fr: "Sobre chic", en: "Chic sober" } },
  ],
  "maison-deco": [
    { heading: "DM Serif Display", body: "Nunito Sans", tag: { fr: "Chaleureux artisan", en: "Warm artisan" } },
    { heading: "Lora", body: "Open Sans", tag: { fr: "Naturel cosy", en: "Cozy natural" } },
    { heading: "Libre Baskerville", body: "Montserrat", tag: { fr: "Classique intérieur", en: "Classic interior" } },
  ],
  complements: [
    { heading: "Lora", body: "Nunito Sans", tag: { fr: "Nature & confiance", en: "Natural & trust" } },
    { heading: "PT Serif", body: "Open Sans", tag: { fr: "Santé sérieux", en: "Serious health" } },
    { heading: "Merriweather", body: "Lato", tag: { fr: "Bio premium", en: "Premium organic" } },
  ],
  cbd: [
    { heading: "Montserrat", body: "Open Sans", tag: { fr: "Premium zen", en: "Zen premium" } },
    { heading: "Raleway", body: "Lato", tag: { fr: "Épuré naturel", en: "Clean natural" } },
    { heading: "Cormorant Garamond", body: "Nunito Sans", tag: { fr: "Luxe botanique", en: "Botanic luxury" } },
  ],
  animaux: [
    { heading: "Poppins", body: "Open Sans", tag: { fr: "Fun & friendly", en: "Fun & friendly" } },
    { heading: "Nunito Sans", body: "Lato", tag: { fr: "Doux & joyeux", en: "Soft & joyful" } },
    { heading: "Montserrat", body: "Raleway", tag: { fr: "Moderne vivant", en: "Lively modern" } },
  ],
  numeriques: [
    { heading: "Oswald", body: "Source Sans Pro", tag: { fr: "Tech bold", en: "Bold tech" } },
    { heading: "Montserrat", body: "Roboto", tag: { fr: "Digital clean", en: "Digital clean" } },
    { heading: "Raleway", body: "Lato", tag: { fr: "SaaS léger", en: "Lightweight SaaS" } },
  ],
  "idees-cadeaux": [
    { heading: "Poppins", body: "Nunito Sans", tag: { fr: "Festif & clair", en: "Festive & clear" } },
    { heading: "Playfair Display", body: "Raleway", tag: { fr: "Cadeau chic", en: "Chic gift" } },
    { heading: "Lora", body: "Open Sans", tag: { fr: "Chaleureux élégant", en: "Warm elegant" } },
  ],
  alimentaire: [
    { heading: "DM Serif Display", body: "Open Sans", tag: { fr: "Bistrot moderne", en: "Modern bistro" } },
    { heading: "Playfair Display", body: "Lato", tag: { fr: "Gastronomie", en: "Gastronomy" } },
    { heading: "Lora", body: "Nunito Sans", tag: { fr: "Artisan chaleureux", en: "Warm artisan" } },
  ],
  sport: [
    { heading: "Oswald", body: "Roboto", tag: { fr: "Impact sportif", en: "Sport impact" } },
    { heading: "Montserrat", body: "Open Sans", tag: { fr: "Performance", en: "Performance" } },
    { heading: "Raleway", body: "Source Sans Pro", tag: { fr: "Outdoor clean", en: "Outdoor clean" } },
  ],
  bebe: [
    { heading: "Poppins", body: "Nunito Sans", tag: { fr: "Doux & rond", en: "Soft & round" } },
    { heading: "Lora", body: "Open Sans", tag: { fr: "Tendre classique", en: "Tender classic" } },
    { heading: "Raleway", body: "Lato", tag: { fr: "Moderne délicat", en: "Delicate modern" } },
  ],
  eco: [
    { heading: "DM Serif Display", body: "Lato", tag: { fr: "Nature élégante", en: "Elegant nature" } },
    { heading: "Libre Baskerville", body: "Open Sans", tag: { fr: "Organique sérieux", en: "Serious organic" } },
    { heading: "Lora", body: "Nunito Sans", tag: { fr: "Terre & confiance", en: "Earth & trust" } },
  ],
  luxe: [
    { heading: "Bodoni Moda", body: "Montserrat", tag: { fr: "Grand luxe", en: "Grand luxury" } },
    { heading: "Playfair Display", body: "Raleway", tag: { fr: "Prestige", en: "Prestige" } },
    { heading: "Cormorant Garamond", body: "Lato", tag: { fr: "Exclusif raffiné", en: "Refined exclusive" } },
  ],
  vintage: [
    { heading: "Libre Baskerville", body: "Lato", tag: { fr: "Rétro chic", en: "Retro chic" } },
    { heading: "Playfair Display", body: "Open Sans", tag: { fr: "Nostalgique", en: "Nostalgic" } },
    { heading: "Lora", body: "Nunito Sans", tag: { fr: "Ancien monde", en: "Old world" } },
  ],
  sante: [
    { heading: "Raleway", body: "Open Sans", tag: { fr: "Sérénité", en: "Serenity" } },
    { heading: "Montserrat", body: "Nunito Sans", tag: { fr: "Bien-être pro", en: "Pro wellness" } },
    { heading: "Lora", body: "Lato", tag: { fr: "Confiance calme", en: "Calm trust" } },
  ],
  _default: [
    { heading: "Playfair Display", body: "Montserrat", tag: { fr: "Classique", en: "Classic" } },
    { heading: "Montserrat", body: "Open Sans", tag: { fr: "Moderne", en: "Modern" } },
    { heading: "Lora", body: "Lato", tag: { fr: "Élégant", en: "Elegant" } },
  ],
};

/* ═══════════════════════════ MOODS ═══════════════════════════ */

const MOODS = [
  { id: "beaute", label: { fr: "Beauté", en: "Beauty" }, sub: { fr: "Rose, doux, raffiné", en: "Pink, soft, refined" }, dots: ["#C4849B", "#F5E6EC", "#2C1E2A"], colors: ["#C4849B", "#E8B4C8", "#9B5C74", "#FDF5F8", "#FFFFFF"] },
  { id: "bijoux", label: { fr: "Bijoux", en: "Jewelry" }, sub: { fr: "Or, élégance, luxe", en: "Gold, elegant, luxury" }, dots: ["#2C2C2A", "#C4A35A", "#F5F0E8"], colors: ["#2C2C2A", "#C4A35A", "#8B7335", "#F5F0E8", "#FFFFFF"] },
  { id: "pret-a-porter", label: { fr: "Prêt-à-porter", en: "Fashion" }, sub: { fr: "Minimal, noir, épuré", en: "Minimal, black, clean" }, dots: ["#1a1a1a", "#555555", "#F0F0F0"], colors: ["#1a1a1a", "#555555", "#888888", "#F5F5F5", "#FFFFFF"] },
  { id: "maison-deco", label: { fr: "Maison & déco", en: "Home & decor" }, sub: { fr: "Terracotta, chaleureux", en: "Terracotta, warm" }, dots: ["#8B5E3C", "#D4A574", "#F5EDE6"], colors: ["#8B5E3C", "#D4A574", "#6B4226", "#FAF5F0", "#FFFFFF"] },
  { id: "complements", label: { fr: "Compléments", en: "Supplements" }, sub: { fr: "Vert, naturel, santé", en: "Green, natural, health" }, dots: ["#2D5016", "#8FBC5A", "#F4F1EC"], colors: ["#2D5016", "#8FBC5A", "#5A7D3A", "#F4F1EC", "#FFFFFF"] },
  { id: "cbd", label: { fr: "CBD", en: "CBD" }, sub: { fr: "Zen, vert foncé, premium", en: "Zen, dark green, premium" }, dots: ["#1B3A2D", "#6B9B7E", "#E8F0EB"], colors: ["#1B3A2D", "#6B9B7E", "#3D6B52", "#EDF5F0", "#FFFFFF"] },
  { id: "animaux", label: { fr: "Animaux", en: "Pets" }, sub: { fr: "Joyeux, orange, vivant", en: "Joyful, orange, lively" }, dots: ["#7C2D12", "#EA580C", "#FFF7ED"], colors: ["#7C2D12", "#EA580C", "#B45309", "#FFF7ED", "#FFFFFF"] },
  { id: "numeriques", label: { fr: "Numériques", en: "Digital" }, sub: { fr: "Bleu, moderne, tech", en: "Blue, modern, tech" }, dots: ["#0A1628", "#3B82F6", "#F0F4FF"], colors: ["#0A1628", "#3B82F6", "#1E40AF", "#F0F4FF", "#FFFFFF"] },
  { id: "idees-cadeaux", label: { fr: "Idées cadeaux", en: "Gift ideas" }, sub: { fr: "Coloré, festif, fun", en: "Colorful, festive, fun" }, dots: ["#7C3AED", "#F59E0B", "#FEF3C7"], colors: ["#7C3AED", "#F59E0B", "#EC4899", "#FEF3C7", "#FFFFFF"] },
  { id: "alimentaire", label: { fr: "Alimentaire", en: "Food & Drink" }, sub: { fr: "Chaud, appétissant, artisan", en: "Warm, appetizing, artisan" }, dots: ["#8B2500", "#D4A017", "#FFF5E6"], colors: ["#8B2500", "#D4A017", "#C85A17", "#FFF5E6", "#FFFFFF"] },
  { id: "sport", label: { fr: "Sport & Outdoor", en: "Sport & Outdoor" }, sub: { fr: "Énergique, bold, dynamique", en: "Energetic, bold, dynamic" }, dots: ["#1a1a1a", "#FF6600", "#E8F5E9"], colors: ["#1a1a1a", "#FF6600", "#2E7D32", "#F5F5F5", "#FFFFFF"] },
  { id: "bebe", label: { fr: "Bébé & Enfants", en: "Baby & Kids" }, sub: { fr: "Pastel, doux, tendre", en: "Pastel, soft, tender" }, dots: ["#D4919A", "#A7C7E7", "#FFF9E3"], colors: ["#D4919A", "#A7C7E7", "#F0C987", "#FFF9F0", "#FFFFFF"] },
  { id: "eco", label: { fr: "Éco & Durable", en: "Eco & Sustainable" }, sub: { fr: "Terre, naturel, organique", en: "Earthy, natural, organic" }, dots: ["#5F6F52", "#A9B388", "#F5ECD7"], colors: ["#5F6F52", "#A9B388", "#8B7355", "#F5ECD7", "#FFFFFF"] },
  { id: "luxe", label: { fr: "Luxe & Premium", en: "Luxury & Premium" }, sub: { fr: "Noir, or, exclusif", en: "Black, gold, exclusive" }, dots: ["#1a1a1a", "#C5A55A", "#F5F0E8"], colors: ["#1a1a1a", "#C5A55A", "#8B7355", "#F8F5F0", "#FFFFFF"] },
  { id: "vintage", label: { fr: "Vintage & Rétro", en: "Vintage & Retro" }, sub: { fr: "Muted, chaleureux, nostalgique", en: "Muted, warm, nostalgic" }, dots: ["#6B4E3D", "#C19A6B", "#F0E6D3"], colors: ["#6B4E3D", "#C19A6B", "#9B7653", "#F0E6D3", "#FFFFFF"] },
  { id: "sante", label: { fr: "Santé & Bien-être", en: "Health & Wellness" }, sub: { fr: "Apaisant, bleu, serein", en: "Calming, blue, serene" }, dots: ["#2C5F7C", "#7FB5D3", "#F0F7FA"], colors: ["#2C5F7C", "#7FB5D3", "#4A8DAB", "#F0F7FA", "#FFFFFF"] },
];

/* ═══════════════════ STYLES & AMBIANCES ═══════════════════ */

const STYLES = [
  { id: "luxe", label: { fr: "Luxe", en: "Luxury" } },
  { id: "minimaliste", label: { fr: "Minimaliste", en: "Minimalist" } },
  { id: "bold", label: { fr: "Bold", en: "Bold" } },
  { id: "naturel", label: { fr: "Naturel", en: "Natural" } },
  { id: "doux", label: { fr: "Doux", en: "Soft" } },
];

const AMBIANCES = {
  luxe: [
    { id: "or-noir", name: { fr: "Or noir", en: "Black gold" }, sub: { fr: "Joaillerie", en: "Jewelry" }, moodId: "luxe", colors: ["#1a1a1a", "#C5A55A", "#8B7355", "#F8F5F0", "#FFFFFF"], dots: ["#1a1a1a", "#2C2C2A", "#C5A55A", "#D4A574", "#F5F0E8"] },
    { id: "bordeaux-imperial", name: { fr: "Bordeaux impérial", en: "Imperial bordeaux" }, sub: { fr: "Mode premium", en: "Premium fashion" }, moodId: "bijoux", colors: ["#4A0E2C", "#8B2252", "#C4849B", "#FDF5F8", "#FFFFFF"], dots: ["#4A0E2C", "#4A0E2C", "#8B2252", "#C4849B", "#D4A574"] },
    { id: "marbre-cuivre", name: { fr: "Marbre & cuivre", en: "Marble & copper" }, sub: { fr: "Déco haut de gamme", en: "High-end decor" }, moodId: "maison-deco", colors: ["#2C2C2A", "#B87333", "#D4A574", "#F5F0E8", "#FFFFFF"], dots: ["#2C2C2A", "#6B4E3D", "#B87333", "#C5A55A", "#F5F0E8"] },
  ],
  minimaliste: [
    { id: "noir-blanc", name: { fr: "Noir & blanc", en: "Black & white" }, sub: { fr: "Épuré", en: "Clean" }, moodId: "pret-a-porter", colors: ["#1a1a1a", "#555555", "#888888", "#F5F5F5", "#FFFFFF"], dots: ["#1a1a1a", "#555555", "#888888", "#CCCCCC", "#F5F5F5"] },
    { id: "bleu-glacial", name: { fr: "Bleu glacial", en: "Ice blue" }, sub: { fr: "Tech & digital", en: "Tech & digital" }, moodId: "numeriques", colors: ["#0A1628", "#3B82F6", "#1E40AF", "#F0F4FF", "#FFFFFF"], dots: ["#0A1628", "#1E40AF", "#3B82F6", "#93C5FD", "#F0F4FF"] },
    { id: "gris-perle", name: { fr: "Gris perle", en: "Pearl gray" }, sub: { fr: "Éditorial", en: "Editorial" }, moodId: "pret-a-porter", colors: ["#2C2C2C", "#6B7280", "#9CA3AF", "#F9FAFB", "#FFFFFF"], dots: ["#2C2C2C", "#6B7280", "#9CA3AF", "#D1D5DB", "#F9FAFB"] },
  ],
  bold: [
    { id: "orange-vitamine", name: { fr: "Orange vitaminé", en: "Vitamin orange" }, sub: { fr: "Sport & énergie", en: "Sport & energy" }, moodId: "sport", colors: ["#1a1a1a", "#FF6600", "#2E7D32", "#F5F5F5", "#FFFFFF"], dots: ["#1a1a1a", "#FF6600", "#2E7D32", "#FFA500", "#F5F5F5"] },
    { id: "violet-electrique", name: { fr: "Violet électrique", en: "Electric purple" }, sub: { fr: "Créatif & fun", en: "Creative & fun" }, moodId: "idees-cadeaux", colors: ["#7C3AED", "#F59E0B", "#EC4899", "#FEF3C7", "#FFFFFF"], dots: ["#7C3AED", "#EC4899", "#F59E0B", "#A78BFA", "#FEF3C7"] },
    { id: "rouge-passion", name: { fr: "Rouge passion", en: "Passion red" }, sub: { fr: "Impact & gourmand", en: "Impact & gourmet" }, moodId: "alimentaire", colors: ["#8B2500", "#D4A017", "#C85A17", "#FFF5E6", "#FFFFFF"], dots: ["#8B2500", "#C85A17", "#D4A017", "#E8A040", "#FFF5E6"] },
  ],
  naturel: [
    { id: "vert-sauge", name: { fr: "Vert sauge", en: "Sage green" }, sub: { fr: "Éco & durable", en: "Eco & sustainable" }, moodId: "eco", colors: ["#5F6F52", "#A9B388", "#8B7355", "#F5ECD7", "#FFFFFF"], dots: ["#5F6F52", "#8B7355", "#A9B388", "#C7D4A5", "#F5ECD7"] },
    { id: "terracotta", name: { fr: "Terracotta", en: "Terracotta" }, sub: { fr: "Artisan & maison", en: "Artisan & home" }, moodId: "maison-deco", colors: ["#8B5E3C", "#D4A574", "#6B4226", "#FAF5F0", "#FFFFFF"], dots: ["#8B5E3C", "#6B4226", "#D4A574", "#C19A6B", "#FAF5F0"] },
    { id: "foret-profonde", name: { fr: "Forêt profonde", en: "Deep forest" }, sub: { fr: "CBD & zen", en: "CBD & zen" }, moodId: "cbd", colors: ["#1B3A2D", "#6B9B7E", "#3D6B52", "#EDF5F0", "#FFFFFF"], dots: ["#1B3A2D", "#3D6B52", "#6B9B7E", "#A3C4B1", "#EDF5F0"] },
  ],
  doux: [
    { id: "rose-poudre", name: { fr: "Rose poudré", en: "Powder pink" }, sub: { fr: "Beauté & cosmétique", en: "Beauty & cosmetics" }, moodId: "beaute", colors: ["#C4849B", "#E8B4C8", "#9B5C74", "#FDF5F8", "#FFFFFF"], dots: ["#C4849B", "#9B5C74", "#E8B4C8", "#F0C6D8", "#FDF5F8"] },
    { id: "ciel-creme", name: { fr: "Ciel & crème", en: "Sky & cream" }, sub: { fr: "Bébé & enfants", en: "Baby & kids" }, moodId: "bebe", colors: ["#D4919A", "#A7C7E7", "#F0C987", "#FFF9F0", "#FFFFFF"], dots: ["#D4919A", "#A7C7E7", "#F0C987", "#B8D4E8", "#FFF9F0"] },
    { id: "bleu-serenite", name: { fr: "Bleu sérénité", en: "Serenity blue" }, sub: { fr: "Santé & bien-être", en: "Health & wellness" }, moodId: "sante", colors: ["#2C5F7C", "#7FB5D3", "#4A8DAB", "#F0F7FA", "#FFFFFF"], dots: ["#2C5F7C", "#4A8DAB", "#7FB5D3", "#A8D4E8", "#F0F7FA"] },
  ],
};

/* ═══════════ SCHEME BUILDER (5 pre-configured schemes) ═══════════ */

const SCHEME_LABELS = {
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

const MAPPING_ZONES = [
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

function buildScheme(bgColor, fgColor, btnBg, btnText, btnBorder, btn2Bg, btn2Text, btn2Border, badgeBg, badgeText, borderColor, starsColor) {
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

function buildAllSchemes(colors) {
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

/* ═══════════════════════════ UTILS ═══════════════════════════ */

function extractColorsFromImage(img, count = 5) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 120;
  canvas.height = 120;
  ctx.drawImage(img, 0, 0, 120, 120);
  const data = ctx.getImageData(0, 0, 120, 120).data;
  const buckets = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 32) * 32;
    const g = Math.round(data[i + 1] / 32) * 32;
    const b = Math.round(data[i + 2] / 32) * 32;
    if (data[i + 3] < 128) continue;
    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
  const result = [];
  for (const [key] of sorted) {
    const [r, g, b] = key.split(",").map(Number);
    const hex = "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    const isDupe = result.some((c) => {
      const cr = parseInt(c.slice(1, 3), 16);
      const cg = parseInt(c.slice(3, 5), 16);
      const cb = parseInt(c.slice(5, 7), 16);
      return Math.abs(cr - r) + Math.abs(cg - g) + Math.abs(cb - b) < 80;
    });
    if (!isDupe) result.push(hex);
    if (result.length >= count) break;
  }
  while (result.length < count) result.push("#F5F5F5");
  return result;
}

function detectMoodFromColors(colors) {
  let bestMood = "_default";
  let bestDist = Infinity;
  const toRGB = (hex) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  const dist = (a, b) => { const [r1, g1, b1] = toRGB(a); const [r2, g2, b2] = toRGB(b); return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2); };
  for (const mood of MOODS) {
    let d = 0;
    for (let i = 0; i < Math.min(3, colors.length, mood.colors.length); i++) d += dist(colors[i], mood.colors[i]);
    if (d < bestDist) { bestDist = d; bestMood = mood.id; }
  }
  return bestMood;
}

function getDuosForMood(moodId) {
  return FONT_DUOS[moodId] || FONT_DUOS._default;
}

function loadGoogleFont(name) {
  if (typeof window === "undefined") return;
  const id = `gf-${name.replace(/\s/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, "+")}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function getPixelColor(canvas, x, y) {
  const ctx = canvas.getContext("2d");
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  return "#" + [pixel[0], pixel[1], pixel[2]].map((v) => v.toString(16).padStart(2, "0")).join("");
}

/* ═══════════════════════════ COMPONENTS ═══════════════════════════ */

function StepBar({ step, lang, totalSteps = 4 }) {
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

function LangSwitch({ lang, setLang }) {
  return (
    <div className="absolute top-4 right-4 flex rounded-full overflow-hidden border border-gray-200 z-10">
      {["fr", "en"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className={`px-3.5 py-1.5 text-xs border-none cursor-pointer transition-colors ${lang === l ? "bg-[#1a1a1a] text-white" : "bg-white text-gray-400"}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

function MoodCard({ mood, lang, selected, onClick }) {
  return (
    <button onClick={onClick} className={`border rounded-xl p-3 text-center cursor-pointer transition-all bg-white ${selected ? "border-[#1a1a1a] bg-gray-50" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
      <div className="flex gap-1 justify-center mb-1.5">
        {mood.dots.map((c, i) => (<div key={i} className="w-4 h-4 rounded-full border border-gray-100" style={{ background: c }} />))}
      </div>
      <div className="text-xs font-medium text-[#1a1a1a]">{mood.label[lang]}</div>
      <div className="text-xs text-gray-400 mt-0.5">{mood.sub[lang]}</div>
    </button>
  );
}

function PipetteCanvas({ imageSrc, colors, onColorsChange, lang }) {
  const t = T[lang];
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [pipettes, setPipettes] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;
      const maxW = container.clientWidth;
      const ratio = img.height / img.width;
      const w = Math.min(img.width, maxW);
      const h = w * ratio;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      setImageLoaded(true);
      const positions = [];
      for (let i = 0; i < 5; i++) {
        positions.push({ x: Math.round((w * (i + 1)) / 6), y: Math.round(h / 2) });
      }
      setPipettes(positions);
      const newColors = positions.map((p) => getPixelColor(canvas, p.x, p.y));
      onColorsChange(newColors);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round(Math.max(0, Math.min(canvas.width, ((clientX - rect.left) / rect.width) * canvas.width))),
      y: Math.round(Math.max(0, Math.min(canvas.height, ((clientY - rect.top) / rect.height) * canvas.height))),
    };
  };

  const handleDown = (e, idx) => { e.preventDefault(); setDragging(idx); };

  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e) => {
      e.preventDefault();
      const coords = getCanvasCoords(e);
      setPipettes((prev) => { const next = [...prev]; next[dragging] = coords; return next; });
      const canvas = canvasRef.current;
      if (canvas) {
        const color = getPixelColor(canvas, coords.x, coords.y);
        onColorsChange((prev) => { const next = [...prev]; next[dragging] = color; return next; });
      }
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); window.removeEventListener("touchmove", handleMove); window.removeEventListener("touchend", handleUp); };
  }, [dragging, onColorsChange]);

  return (
    <div ref={containerRef} className="relative mt-4 rounded-xl overflow-hidden border border-gray-200">
      <canvas ref={canvasRef} className="block w-full" style={{ cursor: dragging !== null ? "grabbing" : "default" }} />
      {imageLoaded && pipettes.map((p, i) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const left = (p.x / canvas.width) * 100;
        const top = (p.y / canvas.height) * 100;
        return (
          <div key={i} onMouseDown={(e) => handleDown(e, i)} onTouchStart={(e) => handleDown(e, i)}
            className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)", width: 32, height: 32, zIndex: dragging === i ? 20 : 10 }}>
            <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" style={{ background: colors[i] || "#ccc" }} />
            <span className="relative text-white text-xs font-bold drop-shadow-md">{i + 1}</span>
          </div>
        );
      })}
      {imageLoaded && <p className="text-xs text-gray-400 text-center py-2 bg-gray-50">{t.pipetteHint}</p>}
    </div>
  );
}

function ColorSwatch({ color, label, onCopy }) {
  return (
    <button onClick={() => { navigator.clipboard.writeText(color); onCopy(color); }}
      className="flex-1 group relative cursor-pointer border-none p-0 bg-transparent">
      <div className="h-14 rounded-lg transition-transform group-hover:scale-105 border border-gray-100" style={{ background: color }} />
      <span className="block text-xs text-gray-500 mt-1.5 text-center font-mono">{color}</span>
      <span className="block text-xs text-gray-400 text-center">{label}</span>
    </button>
  );
}

function FontPairPicker({ duos, selectedIdx, onSelect, lang }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {duos.map((duo, i) => (
        <button key={i} onClick={() => { loadGoogleFont(duo.heading); loadGoogleFont(duo.body); onSelect(i); }}
          className={`border rounded-xl p-4 text-center cursor-pointer transition-all bg-white ${selectedIdx === i ? "border-[#1a1a1a] ring-2 ring-gray-100" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
          <span className="block text-xl font-medium mb-1 leading-tight" style={{ fontFamily: `'${duo.heading}', serif` }}>Aa</span>
          <span className="block text-sm text-gray-500 mb-2" style={{ fontFamily: `'${duo.body}', sans-serif` }}>Aa Bb Cc</span>
          <span className="block text-sm font-medium text-[#1a1a1a]">{duo.tag[lang]}</span>
          <span className="block text-xs text-gray-400 mt-0.5 leading-tight">{duo.heading}</span>
          <span className="block text-xs text-gray-400 leading-tight">+ {duo.body}</span>
        </button>
      ))}
    </div>
  );
}

function TypoPreview({ heading, body, lang }) {
  const t = T[lang];
  return (
    <div className="border border-gray-100 rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs text-gray-400 uppercase min-w-[60px]">{t.typoHeading}</span>
        <span className="text-2xl font-medium" style={{ fontFamily: `'${heading}', serif` }}>{t.typoSample}</span>
        <span className="text-xs text-gray-400 text-right">{heading}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-gray-400 uppercase min-w-[60px]">{t.typoBody}</span>
        <span className="text-[15px] leading-relaxed text-gray-500 flex-1 mx-4" style={{ fontFamily: `'${body}', sans-serif` }}>{t.typoBodySample}</span>
        <span className="text-xs text-gray-400 text-right">{body}</span>
      </div>
    </div>
  );
}

function StorePreview({ colors, heading, lang }) {
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

/* ═══════════════ SECTION PREVIEW COMPONENTS (Mockup style) ═══════════════ */

function SectionHeader({ label, scheme }) {
  return (
    <div className="px-3 py-1.5 text-xs uppercase tracking-widest font-medium rounded-t-lg"
      style={{ background: scheme.primary_button_background + "12", color: scheme.primary_button_background, borderBottom: `1px solid ${scheme.border}` }}>
      {label}
    </div>
  );
}

function StarRating({ scheme, count = 5, filled = 4 }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < filled ? scheme.stars_icons_color : "none"} stroke={scheme.stars_icons_color} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

function SectionImageBanner({ scheme, headingFont, bodyFont, lang, colors }) {
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
        {/* Image placeholder right */}
        <div className="sm:w-[45%] min-h-[200px] relative" style={{
          background: `linear-gradient(135deg, ${scheme.primary_button_background}10, ${scheme.primary_button_background}25, ${scheme.primary_button_background}08)`,
        }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs tracking-wider uppercase" style={{ color: scheme.foreground + "30" }}>
              {lang === "fr" ? "Image 1920×800" : "Image 1920×800"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionProductDetail({ scheme, headingFont, bodyFont, lang, colors }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: scheme.border }}>
      <SectionHeader label={lang === "fr" ? "Section — Produit en vedette" : "Section — Featured product"} scheme={scheme} />
      <div className="flex flex-col sm:flex-row" style={{ background: scheme.background }}>
        {/* Product image left */}
        <div className="sm:w-[42%] p-3">
          <div className="relative rounded-lg overflow-hidden" style={{
            paddingBottom: "100%",
            background: `linear-gradient(160deg, ${scheme.primary_button_background}08, ${scheme.primary_button_background}18, ${scheme.primary_button_background}05)`,
          }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-wider" style={{ color: scheme.foreground + "25" }}>800×800</span>
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-12 h-12 rounded-md" style={{
                background: i === 0
                  ? `linear-gradient(135deg, ${scheme.primary_button_background}15, ${scheme.primary_button_background}30)`
                  : `linear-gradient(135deg, ${scheme.foreground}08, ${scheme.foreground}15)`,
                border: i === 0 ? `1.5px solid ${scheme.primary_button_background}` : `1px solid ${scheme.border}`,
              }} />
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

function SectionReassuranceMockup({ scheme, bodyFont, lang }) {
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

/* ---------- Scheme Preview Card ---------- */
function SchemePreviewCard({ scheme, heading, lang, isDefault, isEnabled, onSetDefault, onToggle, label }) {
  const t = T[lang];
  const s = scheme;
  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${isDefault ? "border-[#1a1a1a] ring-2 ring-gray-100" : isEnabled ? "border-gray-300" : "border-gray-200 opacity-60"}`}>
      {/* Mini preview */}
      <div className="px-3 py-2 flex items-center justify-between" style={{ background: s.primary_button_background }}>
        <span className="font-semibold text-xs" style={{ color: s.primary_button_text }}>{t.storeName}</span>
        <div className="flex gap-1.5 text-xs" style={{ color: s.primary_button_text + "b3" }}>
          <span>Shop</span><span>About</span>
        </div>
      </div>
      <div className="p-3" style={{ background: s.background }}>
        <p className="text-xs font-medium mb-1.5" style={{ fontFamily: `'${heading}', serif`, color: s.foreground }}>{t.heroTitle}</p>
        <div className="flex gap-1.5 mb-2">
          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: s.primary_button_background, color: s.primary_button_text }}>{t.heroCta}</span>
          <span className="px-2 py-1 rounded text-xs" style={{ background: s.secondary_button_background, color: s.secondary_button_text, border: `1px solid ${s.secondary_button_border}` }}>Info</span>
        </div>
        <div className="flex gap-1">
          <span className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: s.primary_badge_background, color: s.primary_badge_text }}>New</span>
        </div>
      </div>
      {/* Controls */}
      <div className="px-3 py-2 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <span className="text-xs text-gray-500 flex-1 mr-2 leading-tight">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="checkbox" checked={isEnabled} onChange={onToggle} className="w-3.5 h-3.5 accent-[#1a1a1a] cursor-pointer" />
            <span className="text-xs text-gray-400">{lang === "fr" ? "Actif" : "Active"}</span>
          </label>
          <button onClick={onSetDefault}
            className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all ${isDefault ? "bg-[#1a1a1a] text-white border-none" : "bg-white text-gray-400 border border-gray-300 hover:border-[#1a1a1a]"}`}>
            {lang === "fr" ? "Par défaut" : "Default"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Customizer Zone Row (scheme 1 only) ---------- */
function CustomizerZoneRow({ zone, value, colors, lang, onChange }) {
  const pickerRef = useRef(null);
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0">
      <span className="text-xs text-gray-600 flex-1">{zone.label[lang]}</span>
      <div className="flex items-center gap-1">
        {colors.map((c, i) => (
          <button key={i} onClick={() => onChange(zone.key, c)}
            className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${value === c || value?.startsWith(c) ? "border-[#1a1a1a] scale-110" : "border-gray-200 hover:border-gray-400"}`}
            style={{ background: c, borderColor: c === "#ffffff" || c === "#FFFFFF" ? (value === c ? "#1a1a1a" : "#ddd") : undefined }} />
        ))}
        {/* Color picker */}
        <div className="relative">
          <button onClick={() => pickerRef.current?.click()}
            className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 hover:border-[#1a1a1a] cursor-pointer transition-all flex items-center justify-center bg-white"
            title={lang === "fr" ? "Couleur personnalisée" : "Custom color"}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <input ref={pickerRef} type="color" value={value?.slice(0, 7) || "#000000"}
            onChange={(e) => onChange(zone.key, e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
      </div>
      <div className="w-6 h-6 rounded ml-2 border border-gray-200 shrink-0" style={{ background: value }} />
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm transition-all duration-300 z-50 ${message ? "translate-y-0 opacity-100" : "translate-y-[100px] opacity-0 pointer-events-none"}`}>
      {message}
    </div>
  );
}

/* ═══════════════════════════ PAGE ═══════════════════════════ */

export default function BrandKit() {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState(1);
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

  /* Copy settings */
  const handleCopySettings = () => {
    const text = `${t.primaryLabel}: ${colors[0]}\n${t.secondaryLabel}: ${colors[1]}\n${t.accentLabel}: ${colors[2]}\n${t.bgLabel}: ${colors[3]}\n${t.bgAltLabel}: ${colors[4]}\n${t.headingLabel}: ${fonts.heading}\n${t.bodyLabel}: ${fonts.body}`;
    navigator.clipboard.writeText(text);
    showToast(t.settingsCopied);
  };

  /* Reset */
  const handleReset = () => {
    setStep(1);
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

      <StepBar step={step} lang={lang} totalSteps={4} />

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
              <div className="grid grid-cols-3 gap-2.5">
                {(AMBIANCES[selectedStyle] || []).map((amb) => (
                  <button key={amb.id} onClick={() => handleAmbiance(amb)}
                    className={`border rounded-xl p-4 text-left cursor-pointer transition-all bg-white ${selectedAmbiance === amb.id ? "border-[#1a1a1a] ring-2 ring-gray-100" : "border-gray-200 hover:border-[#1a1a1a]"}`}>
                    <div className="flex gap-0.5 mb-2">
                      {amb.dots.map((c, i) => (
                        <div key={i} className="flex-1 h-6 first:rounded-l-md last:rounded-r-md" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-[#1a1a1a] leading-tight">{amb.name[lang]}</div>
                    <div className="text-xs text-gray-400 mt-1">{amb.sub[lang]}</div>
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

              {/* Divider */}
              <div className="border-t border-gray-200 my-4" />

              {/* Section 2: Customize selected scheme in detail */}
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium block mb-1">
                {lang === "fr" ? `Personnaliser — ${SCHEME_LABELS[lang][parseInt(previewScheme.split("-")[1]) - 1]?.split(" — ")[0]}` : `Customize — ${SCHEME_LABELS[lang][parseInt(previewScheme.split("-")[1]) - 1]?.split(" — ")[0]}`}
              </span>
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

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-5 mt-6 font-mono text-sm leading-relaxed text-[#1a1a1a]">
            {colors.map((c, i) => (
              <div key={i} className="flex justify-between py-1">
                <span className="text-gray-400">{t.colorLabels[i]}</span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full border border-gray-200" style={{ background: c }} />
                  {c}
                </span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between py-1"><span className="text-gray-400">{t.headingLabel}</span><span>{fonts.heading}</span></div>
            <div className="flex justify-between py-1"><span className="text-gray-400">{t.bodyLabel}</span><span>{fonts.body}</span></div>
          </div>

          <div className="flex gap-2 mt-6">
            <button onClick={handleCopySettings} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-white border-none cursor-pointer hover:bg-[#333] transition-colors">{t.copyBtn}</button>
            <button onClick={handleReset} className="flex-1 py-3.5 rounded-xl text-sm font-medium bg-white text-[#1a1a1a] border-[1.5px] border-gray-200 cursor-pointer hover:border-[#1a1a1a] transition-colors">{t.resetBtn}</button>
          </div>
        </section>
      )}

      <Toast message={toast} />
    </main>
  );
}
