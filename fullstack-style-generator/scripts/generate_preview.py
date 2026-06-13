#!/usr/bin/env python3
"""
Generate an HTML preview of a FullStack theme style.
Shows color schemes, typography, and page composition at a glance.
"""

import json
import re
import argparse
import os
import random
import string
from pathlib import Path


def load_json(path):
    """Load JSON file, stripping Shopify comment headers."""
    with open(path) as f:
        content = f.read()
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    return json.loads(content)


def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) == 8:  # with alpha
        hex_color = hex_color[:6]
    if len(hex_color) == 6:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    return (0, 0, 0)


def contrast_color(hex_color):
    """Return black or white based on luminance."""
    r, g, b = hex_to_rgb(hex_color)
    luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return '#000000' if luminance > 0.5 else '#ffffff'


def render_scheme_card(scheme_id, scheme_data):
    """Render a color scheme card."""
    s = scheme_data.get('settings', {})
    bg = s.get('background', '#ffffff')
    fg = s.get('foreground', '#000000')
    border = s.get('border', '#00000020')
    stars = s.get('stars_icons_color', '#000000')
    btn_bg = s.get('primary_button_background', '#000000')
    btn_text = s.get('primary_button_text', '#ffffff')
    btn2_bg = s.get('secondary_button_background', '#ffffff')
    btn2_text = s.get('secondary_button_text', '#000000')
    btn2_border = s.get('secondary_button_border', '#000000')
    badge_bg = s.get('primary_badge_background', '#000000')
    badge_text = s.get('primary_badge_text', '#ffffff')

    label = scheme_id.replace('scheme-', 'Scheme ')
    if len(label) > 12:
        label = 'Scheme 4'

    return f'''
    <div class="scheme-card" style="background:{bg}; color:{fg}; border: 1px solid {border}">
      <div class="scheme-header">
        <span class="scheme-label" style="color:{fg}">{label}</span>
        <span class="scheme-bg-hex">{bg}</span>
      </div>
      <div class="scheme-body">
        <p style="color:{fg}; margin:0 0 8px">Texte principal — {fg}</p>
        <div class="scheme-colors-row">
          <div class="color-swatch" style="background:{bg}" title="Background">&nbsp;</div>
          <div class="color-swatch" style="background:{fg}" title="Foreground">&nbsp;</div>
          <div class="color-swatch" style="background:{stars}" title="Stars/Icons">&nbsp;</div>
          <div class="color-swatch" style="background:{border}" title="Border">&nbsp;</div>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap">
          <button style="background:{btn_bg}; color:{btn_text}; border:2px solid {btn_bg}; padding:8px 16px; border-radius:6px; font-size:13px; cursor:pointer">Bouton primaire</button>
          <button style="background:{btn2_bg}; color:{btn2_text}; border:2px solid {btn2_border}; padding:8px 16px; border-radius:6px; font-size:13px; cursor:pointer">Bouton secondaire</button>
        </div>
        <div style="margin-top:10px; display:flex; gap:6px">
          <span style="background:{badge_bg}; color:{badge_text}; padding:4px 10px; border-radius:4px; font-size:11px; font-weight:600">Badge</span>
          <span style="color:{stars}; font-size:16px">★★★★★</span>
        </div>
      </div>
    </div>
    '''


def render_section_summary(section_id, section_data, template_name):
    """Render a summary of a section."""
    stype = section_data.get('type', '?')
    settings = section_data.get('settings', {})
    scheme = settings.get('color_scheme', 'default')
    blocks = section_data.get('blocks', {})
    block_order = section_data.get('block_order', list(blocks.keys()))

    block_types = []
    for bid in block_order[:6]:
        block = blocks.get(bid, {})
        btype = block.get('type', '?')
        # Get first text content
        bsettings = block.get('settings', {})
        text_val = ''
        for k in ['text', 'title', 'heading', 'content']:
            v = bsettings.get(k, '')
            if isinstance(v, str) and v and len(v) < 120:
                # Strip HTML tags
                text_val = re.sub(r'<[^>]+>', '', v)[:60]
                break
        if text_val:
            block_types.append(f'<span class="block-tag">{btype}</span> <span class="block-text">{text_val}</span>')
        else:
            block_types.append(f'<span class="block-tag">{btype}</span>')

    remaining = max(0, len(block_order) - 6)
    if remaining:
        block_types.append(f'<span class="block-more">+{remaining} blocs</span>')

    blocks_html = '<br>'.join(block_types) if block_types else '<span class="no-blocks">Aucun bloc personnalisé</span>'

    return f'''
    <div class="section-row">
      <div class="section-type">{stype}</div>
      <div class="section-scheme">{scheme}</div>
      <div class="section-blocks">{blocks_html}</div>
    </div>
    '''


def generate_preview(settings_path, index_path=None, product_path=None,
                     output_path='preview.html', style_name='Style'):
    """Generate the full HTML preview."""
    settings = load_json(settings_path)
    current = settings.get('current', settings)

    # Color schemes
    schemes = current.get('color_schemes', {})
    schemes_html = ''
    for sid, sdata in schemes.items():
        schemes_html += render_scheme_card(sid, sdata)

    # Typography
    font_from = current.get('font_from', 'shopify')
    heading_font = current.get('type_heading_font', 'sans-serif')
    body_font = current.get('type_body_font', 'sans-serif')
    if font_from == 'custom':
        heading_url = current.get('custom_type_heading_font', '')
        body_url = current.get('custom_type_body_font', '')
        heading_display = heading_url.split('/')[-1].split('.')[0].split('?')[0] if heading_url else heading_font
        body_display = body_url.split('/')[-1].split('.')[0].split('?')[0] if body_url else body_font
    else:
        heading_display = heading_font.replace('_n', ' ').replace('_', ' ').title()
        body_display = body_font.replace('_n', ' ').replace('_', ' ').title()

    font_sizes = {
        'H1': current.get('type_size_h1', 72),
        'H2': current.get('type_size_h2', 48),
        'H3': current.get('type_size_h3', 32),
        'H4': current.get('type_size_h4', 24),
        'Paragraph': current.get('type_size_paragraph', 14),
    }

    typo_html = ''
    for level, size in font_sizes.items():
        is_heading = level.startswith('H')
        font_family = heading_display if is_heading else body_display
        typo_html += f'<div class="typo-row"><span class="typo-label">{level} — {size}px</span><span class="typo-sample" style="font-size:{min(int(size) if isinstance(size, (int,float)) else 48, 48)}px">{font_family}</span></div>'

    # UI Settings summary
    ui_settings = {
        'Radius': current.get('general_radius', 'rounded'),
        'Container padding': current.get('container_padding', 'normal'),
        'Icon size': current.get('icon_size', 'normal'),
        'Icon style': current.get('icon_style', 'outlined'),
        'Button weight': current.get('button_primary_font_weight', 400),
        'Button case': current.get('button_primary_text_case', 'none'),
        'Grid H gap': current.get('grids_horizontal_gap', 'normal'),
        'Grid V gap': current.get('grids_vertical_gap', 'normal'),
        'Max width': current.get('max_page_width', 1300),
    }
    ui_html = ''
    for label, val in ui_settings.items():
        ui_html += f'<div class="ui-setting"><span class="ui-label">{label}</span><span class="ui-value">{val}</span></div>'

    # Templates
    templates_html = ''
    if index_path and os.path.exists(index_path):
        index_data = load_json(index_path)
        templates_html += '<h3>Homepage (index.json)</h3><div class="sections-list">'
        for sec_id in index_data.get('order', []):
            sec = index_data['sections'].get(sec_id, {})
            templates_html += render_section_summary(sec_id, sec, 'index')
        templates_html += '</div>'

    if product_path and os.path.exists(product_path):
        product_data = load_json(product_path)
        templates_html += '<h3>Page produit (product.json)</h3><div class="sections-list">'
        for sec_id in product_data.get('order', []):
            sec = product_data['sections'].get(sec_id, {})
            templates_html += render_section_summary(sec_id, sec, 'product')
        templates_html += '</div>'

    # Get primary color for accent
    scheme1 = schemes.get('scheme-1', {}).get('settings', {})
    accent = scheme1.get('primary_button_background', '#000000')

    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Preview — {style_name}</title>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f5f5f5; color:#1a1a1a; }}
  .container {{ max-width:1100px; margin:0 auto; padding:40px 20px; }}
  .header {{ text-align:center; margin-bottom:48px; }}
  .header h1 {{ font-size:36px; font-weight:700; margin-bottom:8px; }}
  .header p {{ color:#666; font-size:16px; }}
  .badge {{ display:inline-block; background:{accent}; color:{contrast_color(accent)}; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; margin-bottom:12px; }}
  
  h2 {{ font-size:22px; font-weight:600; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid {accent}; }}
  h3 {{ font-size:18px; font-weight:600; margin:24px 0 12px; color:#333; }}
  
  .section {{ background:#fff; border-radius:16px; padding:32px; margin-bottom:32px; box-shadow:0 1px 3px rgba(0,0,0,0.06); }}
  
  .schemes-grid {{ display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; }}
  .scheme-card {{ border-radius:12px; padding:20px; }}
  .scheme-header {{ display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }}
  .scheme-label {{ font-weight:700; font-size:15px; }}
  .scheme-bg-hex {{ font-size:12px; opacity:0.6; font-family:monospace; }}
  .scheme-colors-row {{ display:flex; gap:6px; }}
  .color-swatch {{ width:32px; height:32px; border-radius:6px; border:1px solid rgba(0,0,0,0.1); }}
  
  .typo-row {{ display:flex; align-items:baseline; gap:16px; padding:12px 0; border-bottom:1px solid #f0f0f0; }}
  .typo-label {{ width:140px; font-size:13px; color:#888; flex-shrink:0; }}
  .typo-sample {{ font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }}
  
  .ui-grid {{ display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:8px; }}
  .ui-setting {{ display:flex; justify-content:space-between; padding:8px 12px; background:#f8f8f8; border-radius:8px; }}
  .ui-label {{ font-size:13px; color:#666; }}
  .ui-value {{ font-size:13px; font-weight:600; font-family:monospace; }}
  
  .sections-list {{ display:flex; flex-direction:column; gap:2px; }}
  .section-row {{ display:grid; grid-template-columns:160px 120px 1fr; gap:12px; padding:10px 12px; background:#fafafa; border-radius:6px; align-items:start; }}
  .section-row:nth-child(odd) {{ background:#f4f4f4; }}
  .section-type {{ font-weight:600; font-size:13px; color:{accent}; }}
  .section-scheme {{ font-size:12px; color:#888; font-family:monospace; }}
  .section-blocks {{ font-size:12px; line-height:1.8; }}
  .block-tag {{ background:{accent}15; color:{accent}; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:600; }}
  .block-text {{ color:#666; font-style:italic; }}
  .block-more {{ color:#999; font-size:11px; }}
  .no-blocks {{ color:#ccc; font-style:italic; }}
  
  @media(max-width:768px) {{
    .section-row {{ grid-template-columns:1fr; }}
    .schemes-grid {{ grid-template-columns:1fr; }}
  }}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="badge">FullStack Theme Style</div>
    <h1>{style_name}</h1>
    <p>Preview du style de thème généré</p>
  </div>
  
  <div class="section">
    <h2>Color Schemes</h2>
    <div class="schemes-grid">{schemes_html}</div>
  </div>
  
  <div class="section">
    <h2>Typographie</h2>
    <p style="color:#888; margin-bottom:16px; font-size:14px">Source : {font_from} — Titres : {heading_display} / Corps : {body_display}</p>
    {typo_html}
  </div>
  
  <div class="section">
    <h2>Paramètres UI</h2>
    <div class="ui-grid">{ui_html}</div>
  </div>
  
  <div class="section">
    <h2>Composition des pages</h2>
    {templates_html if templates_html else '<p style="color:#999">Aucun template fourni</p>'}
  </div>
</div>
</body>
</html>'''

    with open(output_path, 'w') as f:
        f.write(html)
    print(f'✓ Preview generated: {output_path}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate FullStack theme style preview')
    parser.add_argument('--settings', required=True, help='Path to settings_data.json')
    parser.add_argument('--index', help='Path to index.json template')
    parser.add_argument('--product', help='Path to product.json template')
    parser.add_argument('--output', default='preview.html', help='Output HTML path')
    parser.add_argument('--style-name', default='Style', help='Name of the style')
    args = parser.parse_args()

    generate_preview(args.settings, args.index, args.product, args.output, args.style_name)
