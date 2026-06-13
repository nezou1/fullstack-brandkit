#!/usr/bin/env python3
"""
Package a FullStack theme style into a ZIP file.
Takes the base theme ZIP and replaces settings + templates with the generated style files.
"""

import json
import re
import argparse
import os
import shutil
import zipfile
import tempfile
from pathlib import Path


SHOPIFY_COMMENT_HEADER = """/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
"""


def load_json(path):
    """Load JSON file, stripping Shopify comment headers."""
    with open(path) as f:
        content = f.read()
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    return json.loads(content)


def save_json_with_header(data, path):
    """Save JSON file with Shopify comment header."""
    json_str = json.dumps(data, indent=2, ensure_ascii=False)
    with open(path, 'w') as f:
        f.write(SHOPIFY_COMMENT_HEADER)
        f.write(json_str)
        f.write('\n')


def package_style(input_dir, base_theme_zip, output_zip, style_name):
    """
    Package a style by overlaying generated files onto the base theme.
    
    Args:
        input_dir: Directory containing generated JSON files:
                   - config/settings_data.json
                   - templates/*.json
                   - sections/*.json (optional)
        base_theme_zip: Path to the base FullStack theme ZIP
        output_zip: Output ZIP path
        style_name: Name for the style (used in naming)
    """
    input_dir = Path(input_dir)
    
    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir = Path(tmpdir)
        work_dir = tmpdir / 'theme'
        
        # Extract base theme
        print(f'Extracting base theme from {base_theme_zip}...')
        with zipfile.ZipFile(base_theme_zip, 'r') as zf:
            zf.extractall(work_dir)
        
        # Find the actual theme root (might be nested in a folder)
        # Look for config/settings_data.json
        theme_root = None
        for root, dirs, files in os.walk(work_dir):
            if 'config' in dirs:
                config_path = Path(root) / 'config' / 'settings_data.json'
                if config_path.exists():
                    theme_root = Path(root)
                    break
        
        if not theme_root:
            raise ValueError("Could not find theme root (config/settings_data.json) in base ZIP")
        
        print(f'Theme root: {theme_root}')
        
        # Overlay settings_data.json
        settings_src = input_dir / 'config' / 'settings_data.json'
        if settings_src.exists():
            settings_data = load_json(str(settings_src))
            save_json_with_header(settings_data, str(theme_root / 'config' / 'settings_data.json'))
            print('  ✓ config/settings_data.json replaced')
        
        # Overlay templates
        templates_dir = input_dir / 'templates'
        if templates_dir.exists():
            for tmpl_file in templates_dir.glob('*.json'):
                dest = theme_root / 'templates' / tmpl_file.name
                tmpl_data = load_json(str(tmpl_file))
                save_json_with_header(tmpl_data, str(dest))
                print(f'  ✓ templates/{tmpl_file.name} replaced')
            
            # Also check for customer templates
            customers_dir = templates_dir / 'customers'
            if customers_dir.exists():
                dest_customers = theme_root / 'templates' / 'customers'
                dest_customers.mkdir(exist_ok=True)
                for tmpl_file in customers_dir.glob('*.json'):
                    tmpl_data = load_json(str(tmpl_file))
                    save_json_with_header(tmpl_data, str(dest_customers / tmpl_file.name))
                    print(f'  ✓ templates/customers/{tmpl_file.name} replaced')
        
        # Overlay sections
        sections_dir = input_dir / 'sections'
        if sections_dir.exists():
            for sec_file in sections_dir.glob('*.json'):
                dest = theme_root / 'sections' / sec_file.name
                sec_data = load_json(str(sec_file))
                save_json_with_header(sec_data, str(dest))
                print(f'  ✓ sections/{sec_file.name} replaced')
        
        # Create output ZIP
        print(f'\nCreating {output_zip}...')
        with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, dirs, files in os.walk(work_dir):
                for file in sorted(files):
                    file_path = Path(root) / file
                    arcname = file_path.relative_to(work_dir)
                    zf.write(file_path, arcname)
        
        file_size = os.path.getsize(output_zip)
        print(f'✓ Style packaged: {output_zip} ({file_size // 1024}KB)')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Package FullStack theme style')
    parser.add_argument('--input-dir', required=True, help='Directory with generated style files')
    parser.add_argument('--base-theme', required=True, help='Path to base FullStack theme ZIP')
    parser.add_argument('--output', required=True, help='Output ZIP path')
    parser.add_argument('--style-name', default='Custom', help='Style name')
    args = parser.parse_args()

    package_style(args.input_dir, args.base_theme, args.output, args.style_name)
