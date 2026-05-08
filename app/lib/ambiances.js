export const STYLES = [
  { id: "luxe", label: { fr: "Luxe", en: "Luxury" } },
  { id: "minimaliste", label: { fr: "Minimaliste", en: "Minimalist" } },
  { id: "bold", label: { fr: "Bold", en: "Bold" } },
  { id: "naturel", label: { fr: "Naturel", en: "Natural" } },
  { id: "doux", label: { fr: "Doux", en: "Soft" } },
];

export const AMBIANCES = {
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
