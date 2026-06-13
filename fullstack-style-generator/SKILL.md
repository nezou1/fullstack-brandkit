---
name: fullstack-style-generator
description: >
  Générateur automatique de styles de thème FullStack pour Shopify.
  Crée un style de thème complet (settings_data.json + templates JSON) à partir d'une description de niche.
  Utilise ce skill quand l'utilisateur veut créer un nouveau style de thème FullStack,
  générer un thème pré-configuré pour une niche spécifique (sleep, skincare, home, food, sport, etc.),
  ou quand il mentionne "style de thème", "thème pré-configuré", "template de boutique",
  "créer un style", "nouveau style", "style comme Sleep/Skin/Home".
  Déclenche aussi quand l'utilisateur parle de hub.themefullstack.com,
  de styles vendus sur le hub, ou de créer un thème pour un client.
---

# FullStack Style Generator

Ce skill génère automatiquement un **style de thème FullStack** complet pour Shopify, prêt à être uploadé et vendu sur hub.themefullstack.com.

## Contexte

FullStack vend un thème Shopify modulaire accompagné de "styles" pré-configurés. Chaque style est un ensemble de fichiers JSON (pas de code Liquid) qui transforme le thème de base en une boutique spécialisée pour une niche donnée (literie, cosmétique, maison, alimentaire, sport, etc.). Ces styles sont vendus 34.90€ sur le hub.

Un style modifie trois couches :
1. **Couleurs & typographie** — `config/settings_data.json` (color schemes, fonts, spacing, UI)
2. **Composition des pages** — `templates/*.json` (quelles sections, dans quel ordre, avec quel contenu)
3. **Sections globales** — `sections/*.json` (header, footer)

## Workflow

### Phase 1 — Briefing

Demande à l'utilisateur les informations suivantes (ou déduis-les de la conversation) :

1. **Niche / industrie** — Ex: "literie et sommeil", "cosmétique bio", "décoration intérieure"
2. **Nom du style** — Ex: "Sleep", "Skin", "Home" (court, un mot)
3. **Couleur principale de la marque** — Un hex code ou une description ("bleu nuit", "vert sauge")
4. **Ambiance visuelle** — Luxe, minimaliste, naturel, dynamique, cosy, technique, etc.
5. **Boutique de référence** (optionnel) — URL d'une boutique existante pour s'inspirer
6. **Pages spéciales** (optionnel) — En plus de la homepage et page produit, faut-il une page About, FAQ, etc.?

### Phase 2 — Génération

Tu vas générer ces fichiers dans l'ordre :

#### Étape 1 : settings_data.json

Lis `references/architecture.md` pour comprendre la structure, puis `references/classic-settings-data.json` comme base et `references/sleep-settings-data.json` comme exemple de style.

**Ce qu'il faut personnaliser :**

- **color_schemes** — Génère 3 ou 4 schemes cohérents à partir de la couleur principale :
  - scheme-1 : Fond blanc, texte en couleur primaire, boutons primaires
  - scheme-2 : Fond teinté léger (couleur primaire à ~10% d'opacité), texte primaire
  - scheme-3 : Fond sombre (couleur primaire foncée), texte blanc, boutons inversés
  - scheme-4 (optionnel) : Fond neutre/chaud, texte primaire
  
  Pour chaque scheme, remplis TOUTES les 36 propriétés (background, foreground, border, stars_icons_color, primary_button_*, secondary_button_*, primary_badge_*, secondary_badge_*, input_*, selected_input_*, variant_*, selected_variant_*, tab_*, selected_tab_*). Ne laisse aucun champ vide.

- **Typographie** — Choisis des polices cohérentes avec l'ambiance. Utilise `font_from: "shopify"` sauf si l'utilisateur fournit des polices custom.

- **Espacement & UI** — Ajuste general_radius, container_padding, icon_size, icon_style, button weights, etc. selon l'ambiance (luxe = larger spacing, rounded; technique = normal, square).

- **Ne touche PAS** aux settings spécifiques à une boutique : logo, favicon, klaviyo, instagram_url. Utilise des valeurs placeholder.

#### Étape 2 : Templates JSON

Génère au minimum ces templates (lis les références classic et sleep pour comprendre la structure) :

**Homepage (index.json)** — La plus importante. Structure type :
1. image-banner (hero)
2. collection-featured (produits vedettes)
3. marquee (bandeau défilant — optionnel mais recommandé)
4. custom-section (bloc de réassurance / proposition de valeur)
5. custom-section (image + texte split)
6. custom-section (avis clients ou statistiques)
7. custom-section (newsletter)
8. blog-featured (articles récents — optionnel)

**Page produit (product.json)** — Structure type :
1. main-product (galerie + infos produit)
2. custom-section (accordéons FAQ produit)
3. custom-section (image + texte descriptif)
4. custom-section (témoignages/avis)
5. product-recommendations
6. comparison-table
7. custom-section (réassurance)

**Pages additionnelles** selon le brief : page.about.json, page.faq.json

Pour chaque template :
- Génère des **IDs uniques** pour chaque section et bloc (format: `{type}_{6_chars_alphanumeriques}`)
- Remplis **tout le contenu texte** avec du texte réaliste et spécifique à la niche (pas de lorem ipsum)
- Alterne les color_scheme entre les sections pour créer du rythme visuel
- Utilise des blocks variés (text, image, group, icon-with-text, reviews-badge, slider, accordions)
- Les images référencent `shopify://shop_images/placeholder.jpg` — elles seront remplacées après

#### Étape 3 : Sections globales

Copie les sections globales du classique (header-group.json, footer-group.json) et adapte les color_scheme.

### Phase 3 — Preview HTML

Après avoir généré tous les JSON, crée une **preview HTML** pour permettre à l'utilisateur de vérifier le résultat visuellement avant de finaliser.

Lance le script de preview :
```bash
python3 {skill_path}/scripts/generate_preview.py \
  --settings <path>/settings_data.json \
  --index <path>/index.json \
  --product <path>/product.json \
  --output <path>/preview.html \
  --style-name "NomDuStyle"
```

Ce script génère un HTML autonome qui montre :
- Les 3-4 color schemes côte à côte avec leurs couleurs
- La typographie (headings + body)
- Un résumé de la composition des pages (sections et leur contenu)
- Un aperçu visuel simplifié de la homepage

Présente le fichier preview.html à l'utilisateur et demande validation.

### Phase 4 — Packaging ZIP

Une fois validé, assemble le ZIP final :

```bash
python3 {skill_path}/scripts/package_style.py \
  --input-dir <dossier_avec_les_json> \
  --base-theme <path_du_theme_classique.zip> \
  --output <nom-du-style>.zip \
  --style-name "NomDuStyle"
```

Ce script :
1. Extrait le thème de base
2. Remplace settings_data.json par la version personnalisée
3. Remplace les templates JSON modifiés
4. Remplace les sections globales modifiées
5. Recrée le ZIP avec les en-têtes de commentaires Shopify

## Règles Importantes

### Génération d'IDs
Les IDs de sections et de blocs doivent être **uniques** dans tout le template. Format : `{type_snake_case}_{6chars}` où les 6 chars sont alphanumériques aléatoires (mélange majuscules/minuscules).

### Texte de contenu
Tout le texte doit être **réaliste et spécifique à la niche**. Pas de placeholder generic. Exemples pour la niche "sommeil" :
- Hero : "Réveillez-vous chaque matin comme neuf"
- Réassurance : "100 nuits d'essai", "Livraison gratuite", "Garantie 10 ans"
- Avis : "J'ai enfin trouvé l'oreiller parfait pour mes cervicales"
- FAQ : "Quelle fermeté choisir ?", "Comment entretenir mon matelas ?"

### Color Scheme Coherence
Les couleurs dérivées doivent former un ensemble harmonieux. Pour les bordures, utiliser la couleur principale avec opacité réduite (ex: `#0000000f`, `#00000021`). Pour les étoiles/icônes, utiliser soit la couleur primaire soit une couleur d'accent (comme l'or #ffcd4e pour le luxe).

### Responsive
Toutes les sections doivent avoir des settings mobile cohérents (`same_as_desktop: false` ou `true` selon le cas, `layout_flex_direction_mobile: "column"` pour les layouts row sur desktop).

## Fichiers de Référence

Tous dans le dossier `references/` de ce skill :

| Fichier | Usage |
|---------|-------|
| `architecture.md` | Documentation complète de l'architecture du thème |
| `classic-settings-data.json` | Settings de base (point de départ) |
| `sleep-settings-data.json` | Exemple de style complet (Sleep) |
| `classic-index.json` | Homepage de base |
| `classic-product.json` | Page produit de base |
| `sleep-index.json` | Homepage Sleep (exemple) |
| `sleep-product.json` | Page produit Sleep (exemple) |
| `sleep-page.about.json` | Page About Sleep (exemple de page additionnelle) |
| `sleep-page.faq.json` | Page FAQ Sleep (exemple) |

Commence toujours par lire `architecture.md`, puis les fichiers classic comme base, puis les fichiers sleep comme exemple du résultat attendu.
