# FullStack Theme Architecture Reference

## Table of Contents
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [settings_data.json](#settings_data)
4. [Color Schemes](#color-schemes)
5. [Typography](#typography)
6. [Template JSON Structure](#template-json)
7. [Section Types Catalog](#section-types)
8. [Block Types Catalog](#block-types)
9. [Classic vs Sleep: Key Differences](#classic-vs-sleep)

---

## Overview

A FullStack theme style is a customization layer applied on top of the FullStack base theme for Shopify. It consists of:
- **config/settings_data.json** — Global settings (colors, fonts, spacing, UI preferences)
- **templates/*.json** — Page composition (which sections, in what order, with what content)
- **sections/*.json** — Global section groups (header, footer, cart drawer, breadcrumbs)

A "style" transforms the neutral base theme into a niche-specific store by modifying these files.

## File Structure

```
theme-style/
├── config/
│   └── settings_data.json          # Global settings (colors, fonts, spacing)
├── templates/
│   ├── index.json                  # Homepage
│   ├── product.json                # Product page
│   ├── collection.json             # Collection page
│   ├── page.json                   # Default page
│   ├── page.contact.json           # Contact page
│   ├── page.about.json             # About page (optional, style-specific)
│   ├── page.faq.json               # FAQ page (optional, style-specific)
│   ├── blog.json                   # Blog listing
│   ├── article.json                # Blog article
│   ├── cart.json                   # Cart page
│   ├── search.json                 # Search results
│   ├── list-collections.json       # Collections listing
│   ├── 404.json                    # 404 page
│   ├── password.json               # Password page
│   └── customers/                  # Customer account pages (rarely modified)
│       ├── account.json
│       ├── login.json
│       ├── register.json
│       ├── addresses.json
│       ├── order.json
│       ├── activate_account.json
│       └── reset_password.json
└── sections/
    ├── header-group.json           # Header + announcement bar
    ├── footer-group.json           # Footer + pre-footer section
    ├── cart-drawer-group.json       # Slide-out cart
    ├── breadcrumbs-group.json      # Breadcrumb navigation
    └── auto-gifts-group.json       # Auto-gift system
```

## settings_data.json

The file wraps everything in `{"current": { ... }}`. Key categories:

### Global UI Settings
```json
{
  "general_radius": "very_rounded|rounded|slightly_rounded|square|custom",
  "container_padding": "normal|larger|largest",
  "max_page_width": 1300,
  "grids_horizontal_gap": "normal|larger|largest",
  "grids_vertical_gap": "normal|larger|largest",
  "icon_size": "normal|large|very_large",
  "icon_style": "outlined|filled|rounded",
  "icon_fill": false,
  "force_icons_display": true
}
```

### Button Styling
```json
{
  "button_primary_font_weight": 400,
  "button_primary_text_case": "none|uppercase|lowercase",
  "button_secondary_font_weight": 400,
  "button_secondary_text_case": "none|uppercase",
  "button_border_radius": 20,
  "button_secondary_border_width": 1
}
```

### Border/Input Styling
```json
{
  "badge_border_radius": 10,
  "card_border_radius": 22,
  "inputs_border_radius": 6,
  "inputs_border_width": 1,
  "separator_border_width": 0.5
}
```

### Badges
```json
{
  "badge_position_on_cards": "top-right|top-left|bottom-right|bottom-left",
  "badge_text_case": "default|uppercase|lowercase",
  "badge_color_scheme_sold_out": "scheme-1",
  "badge_color_scheme_custom": "scheme-2",
  "show_sold_out_badge_on_cards": true,
  "show_sales_badge_on_cards": true
}
```

## Color Schemes

The theme supports 3+ color schemes. Each scheme has this structure:

```json
{
  "scheme-1": {
    "settings": {
      "background": "#ffffff",
      "background_gradient": "",
      "foreground": "#252525",
      "border": "#0000000f",
      "stars_icons_color": "#000000",
      "primary_button_background": "#000000",
      "primary_button_text": "#ffffff",
      "primary_button_border": "#000000",
      "secondary_button_background": "#ffffff",
      "secondary_button_text": "#000000",
      "secondary_button_border": "#00000021",
      "primary_badge_background": "#000000",
      "primary_badge_text": "#ffffff",
      "primary_badge_border": "#000000",
      "secondary_badge_background": "#ffffff",
      "secondary_badge_text": "#000000",
      "secondary_badge_border": "#00000021",
      "input_background": "#ffffff",
      "input_text_color": "#000000",
      "input_border_color": "#00000021",
      "selected_input_background": "#ffffff",
      "selected_input_text_color": "#000000",
      "selected_input_border_color": "#000000",
      "variant_background_color": "#ffffff",
      "variant_text_color": "#000000",
      "variant_border_color": "#00000021",
      "selected_variant_background_color": "#ffffff",
      "selected_variant_text_color": "#000000",
      "selected_variant_border_color": "#000000",
      "tab_background_color": "#ffffff",
      "tab_text_color": "#000000",
      "tab_border_color": "#00000021",
      "selected_tab_background_color": "#ffffff",
      "selected_tab_text_color": "#000000",
      "selected_tab_border_color": "#000000"
    }
  }
}
```

### Scheme Convention
- **scheme-1**: Light background (main pages, product pages)
- **scheme-2**: Slightly tinted background (sections, alternating bands)
- **scheme-3**: Dark background (contrast sections, hero, CTA)
- **scheme-4** (optional): Extra scheme — warm/neutral tint for variety

When a style has a 4th scheme, it uses a UUID key like `scheme-bd470296-2415-4358-a0cc-2b9fd805ffec`. For new styles, use `scheme-4` for simplicity.

### Color Derivation Rules
Given a brand color palette (primary, secondary, accent):
- scheme-1: white bg, primary foreground, primary buttons
- scheme-2: light tint bg (derived from primary at ~10% opacity), primary foreground
- scheme-3: primary/dark bg, white foreground, inverted buttons
- scheme-4 (optional): warm/neutral bg, primary foreground, primary buttons

## Typography

### Shopify Native Fonts (font_from: "shopify")
```json
{
  "font_from": "shopify",
  "type_heading_font": "instrument_sans_n6",
  "type_body_font": "instrument_sans_n4",
  "type_subheading_font": "instrument_sans_n5",
  "type_primary_font": "inter_n4",
  "show_advanced_font_settings": false
}
```

### Custom Fonts (font_from: "custom")
```json
{
  "font_from": "custom",
  "custom_type_heading_font": "https://cdn.shopify.com/s/files/.../Font-Bold.woff2",
  "custom_type_heading_font_format": "woff2",
  "custom_type_body_font": "https://cdn.shopify.com/s/files/.../Font-Regular.woff",
  "custom_type_body_font_format": "woff",
  "custom_type_subheading_font": "https://cdn.shopify.com/s/files/.../Font-Medium.woff2",
  "custom_type_subheading_font_format": "woff2",
  "show_advanced_font_settings": true
}
```

### Font Size Settings
```json
{
  "type_size_h1": 72,
  "type_size_h2": 48,
  "type_size_h3": 32,
  "type_size_h4": 24,
  "type_size_h5": 20,
  "type_size_h6": 18,
  "type_size_paragraph": 14,
  "type_size_paragraph_mobile": 14
}
```

## Template JSON Structure

Each template file follows this structure:

```json
{
  "sections": {
    "section_id_ABC123": {
      "type": "section-type",
      "settings": { /* section-level settings */ },
      "blocks": {
        "block_id_XYZ789": {
          "type": "block-type",
          "name": "t:display_name",
          "settings": { /* block settings */ },
          "blocks": {
            /* sub-blocks (recursive nesting) */
          }
        }
      },
      "block_order": ["block_id_XYZ789", ...]
    }
  },
  "order": ["section_id_ABC123", ...]
}
```

### ID Generation Rules
- Section IDs: `{type}_{random6chars}` (e.g., `custom_section_fJ9Hg6`)
- Block IDs: `{type}_{random6chars}` (e.g., `text_mNUdYY`, `group_DgQq6e`)
- Use 6 random alphanumeric chars for the suffix

### Section-Level Settings (custom-section)
```json
{
  "show_on_display": "desktop_and_mobile",
  "color_scheme": "scheme-1",
  "wrap_in_card": false,
  "color_scheme_card": "",
  "section_width": "normal",
  "layout_type": "flex",
  "layout_flex_direction_desktop": "row|column",
  "layout_grid_columns_desktop": 3,
  "layout_gap_desktop": 20,
  "layout_wrap_desktop": "nowrap|wrap",
  "layout_flex_justify_desktop": "flex-start|center|space-between",
  "layout_flex_align_items_desktop": "flex-start|center|stretch",
  "same_as_desktop": true,
  "layout_flex_direction_mobile": "column",
  "layout_gap_mobile": 20,
  "padding_top": 60,
  "padding_bottom": 60,
  "margin_top": 0,
  "margin_bottom": 0
}
```

## Section Types Catalog

### Content Sections (used in templates)
| Type | Purpose | Key Settings |
|------|---------|-------------|
| `image-banner` | Hero banner with slides | full_width, color_scheme, autoplay |
| `custom-section` | Flexible layout container | color_scheme, layout_type, flex direction |
| `collection-featured` | Product grid/slider | collection, max_products, layout_type |
| `reviews` | Review carousel | color_scheme |
| `comparison-table` | Feature comparison | color_scheme |
| `marquee` | Scrolling text strip | — |
| `blog-featured` | Blog post grid | blog, max_articles |
| `product-recommendations` | Related products | — |
| `main-product` | Product detail page | color_scheme |
| `main-page` | Static page content | — |
| `main-collection` | Collection listing | filters, layout |
| `navigation` | Page-level navigation | — |

### Global Sections (in sections/)
| Type | Purpose |
|------|---------|
| `header` | Site header |
| `announcement-bar` | Top bar |
| `footer` | Site footer |
| `cart-drawer` | Slide-out cart |
| `breadcrumbs` | Breadcrumb nav |

## Block Types Catalog

### Layout Blocks
| Type | Purpose | Can Contain Sub-blocks |
|------|---------|----------------------|
| `group` | Flex/grid container | Yes — holds any blocks |
| `slider` | Carousel container | Yes — holds `_slide` blocks |
| `tabs` | Tabbed container | Yes — holds `_tab` blocks |
| `accordions` | Collapsible panels | Yes — holds `_accordion` blocks |
| `timeline` | Step timeline | Yes — holds `_timeline-step` blocks |

### Content Blocks
| Type | Purpose | Key Settings |
|------|---------|-------------|
| `text` | Rich text | text (HTML), text_style (h1-h6, paragraph), alignment |
| `image` | Image | image (shopify://), image_ratio, enable_rounded_corners |
| `image-card` | Image with overlay | Similar to image with card wrapper |
| `button` | CTA button | text, link, button_style (primary/secondary) |
| `icon` | SVG icon | icon_name |
| `icon-with-text` | Icon + label | icon, text, description |
| `video` | Video embed | video_url |
| `separator` | Horizontal line | — |
| `countdown` | Countdown timer | date |

### Commerce Blocks
| Type | Purpose |
|------|---------|
| `product-price` | Price display |
| `rating-stars` | Star rating |
| `reviews-badge` | Trust badge (Trustpilot style) |
| `review` | Single review card |
| `cross-sells` | Cross-sell products |
| `delivery-estimation` | Delivery date |
| `product-inventory` | Stock indicator |
| `collection-featured` | Inline collection |

### Form Blocks
| Type | Purpose |
|------|---------|
| `contact-form` | Contact form |
| `newsletter-signup` | Email signup |

### Product-Specific Blocks (prefixed with _)
| Type | Purpose |
|------|---------|
| `_product-media-gallery` | Image gallery |
| `_product-variant-picker` | Variant selector |
| `_product-add-to-cart-button` | Add to cart |
| `_product-form` | Product form |
| `_product-quantity-selector` | Qty selector |

## Classic vs Sleep: Key Differences

### Settings Changes
| Setting | Classic | Sleep |
|---------|---------|-------|
| font_from | shopify | custom |
| general_radius | very_rounded | custom |
| container_padding | normal | larger |
| icon_size | normal | very_large |
| icon_style | outlined | rounded |
| button_primary_font_weight | 400 | 600 |
| button_primary_text_case | (default) | uppercase |
| grids_horizontal_gap | larger | largest |
| grids_vertical_gap | normal | larger |
| max_page_width | 1300 | 1500 |

### Color Scheme Differences
- Classic: 3 schemes (white/light gray/black), all monochrome
- Sleep: 4 schemes using navy blue #051a3c as brand color, gold #ffcd4e stars, warm beige #f9f6f3 for scheme-4

### Template Composition Differences
- Sleep adds: page.about.json, page.faq.json
- Sleep homepage: +marquee section, +blog-featured, no demo-design-system
- Sleep product: +accordions section, +reviews-badge blocks, more custom sections
- Sleep uses more group nesting with statistics (e.g., "90% douleurs cervicales réduites")
- All text content is niche-specific (sleep/bedding industry)
