# CLAUDE.md

> **Regla primordial:** invocar siempre al agente `habitat-decor-designer` para cualquier edición del proyecto. Ningún cambio en slides, CSS, JS o HTML se ejecuta sin ese agente.

## Project Overview

Static HTML interactive slide presentation ("Book de Empresa") for Habitat & Decor — custom upholstery, curtains and interior decoration in Jaca (Pirineo Aragonés, Spain). Targets hotels and interior designers. **Zero dependencies:** no build step, no package.json. Open `index.html` directly in a browser.

## Files

- [index.html](index.html) — main presentation (11 slides, ~1480 lines, all CSS + JS embedded)
- [index_domingo.html](index_domingo.html) — variant for a specific date; same structure
- `slide_1.png`, `slide_3.png`, `slide_11.png` — slide preview images

## Architecture

Single-file: `<head>` CDN imports → `<style>` design system → `<body>` `.stage` (1440×810px canvas, 11 `.slide` divs) → `<script>` navigation.

## CSS Design System (Custom Properties)

| Group | Variables |
|---|---|
| Colors | `--c-ink`, `--c-gold`, `--c-sand`, `--c-linen`, `--c-bg`, `--c-white`, `--c-dark` |
| Typography | `--f-display` (Dancing Script), `--f-body` (Quicksand) |
| Type scale | `--t-hero`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-body`, `--t-sm`, `--t-xs` — all `clamp()` |
| Spacing | `--pad-x`, `--pad-y`, `--gap-xs/sm/md/lg/xl` |
| Animation | `--ease`, `--ease-out`, `--dur-fast`, `--dur-mid`, `--dur-slow` |
| Z-index | `--z-progress`, `--z-controls`, `--z-fullscreen` |

Always use these tokens — never raw values.

## Slides

| # | Content |
|---|---|
| 1 | Cover / Portada |
| 2 | Para quién |
| 3 | Manifiesto |
| 4 | Quiénes somos |
| 5 | Servicios (5 tarjetas) |
| 6 | Proceso (4 pasos) |
| 7 | Caso de éxito (Hotel Canfranc) |
| 8 | Testimonios |
| 9 | Red de artesanos |
| 10 | Por qué elegirnos |
| 11 | Contacto (formulario + mapa) |

Active slide gets `.slide--active`; transitions via `goTo(n, dir)`.

## JavaScript Navigation

Key functions: `goTo()`, `initDots()`, `updateUI()`, `scaleStage()`, `toggleFullscreen()`.  
Keyboard: `←/→`, `PageUp/Down`, `Home/End`, `F`. Touch swipe supported (48px threshold).

## External Images

All photos load from `raw.githubusercontent.com/rgasienica/...`. Replacing images = update URLs in HTML.

## Workflow

- Edits apply only to the file you edit; sync `index.html` ↔ `index_domingo.html` manually.
- Commit messages in Spanish.
