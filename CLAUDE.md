# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML interactive slide presentation ("Book de Empresa") for Habitat & Decor, a custom upholstery, curtains, and interior decoration company in Jaca (Pirineo Aragonés, Spain). The presentation is in Spanish and targets professional clients such as hotels and interior designers.

## No Build System

This is a zero-dependency static project. There is no package.json, no build step, no linter, no test runner. Open `index.html` directly in a browser to preview. No server or compilation required.

## File Inventory

- [index.html](index.html) — main presentation file (11 slides, ~1480 lines, all CSS and JS embedded)
- [index_domingo.html](index_domingo.html) — variant copy for a specific presentation date ("domingo" = Sunday); same structure as `index.html`
- [notas-roman.md](notas-roman.md) — personal development notes (git config only)
- `slide_1.png`, `slide_3.png`, `slide_11.png` — slide preview images

## Architecture: Single-File Presentation

All HTML, CSS, and JavaScript live inside a single `index.html`. The structure is:

1. `<head>` — CDN imports (Google Fonts: Dancing Script + Quicksand, Font Awesome 6.4.0)
2. `<style>` block — full CSS design system + per-slide styles
3. `<body>` — `.stage` (1440×810px fixed canvas) containing 11 `.slide` divs
4. `<script>` block — vanilla JS for navigation, scaling, fullscreen, touch/keyboard input

The stage scales responsively via `scaleStage()` (CSS transform on the `.stage` element) so the layout always fits the viewport without reflow.

## CSS Design System (CSS Custom Properties)

All tokens are defined in `:root` at the top of `<style>`. Key groups:

| Group | Variables |
|---|---|
| Colors | `--c-ink`, `--c-gold`, `--c-sand`, `--c-linen`, `--c-bg`, `--c-white`, `--c-dark` |
| Typography | `--f-display` (Dancing Script), `--f-body` (Quicksand) |
| Type scale | `--t-hero`, `--t-h1`, `--t-h2`, `--t-h3`, `--t-body`, `--t-sm`, `--t-xs` — all use `clamp()` |
| Spacing | `--pad-x`, `--pad-y`, `--gap-xs/sm/md/lg/xl` |
| Animation | `--ease`, `--ease-out`, `--dur-fast`, `--dur-mid`, `--dur-slow` |
| Z-index | `--z-progress`, `--z-controls`, `--z-fullscreen` |

When modifying visual styles, always use these tokens rather than raw values.

## Slide Structure

Each slide is `.slide.slide-N` (e.g. `.slide-11`). Slides transition via opacity and translateX. Current active slide gets `.slide--active`; exiting slide gets `.slide--exit-left` or `.slide--exit-right`, managed by `goTo(n, dir)`.

| Slide | Content |
|---|---|
| 1 | Cover / Portada |
| 2 | Para quién (target customers) |
| 3 | Manifiesto (philosophy) |
| 4 | Quiénes somos (about us) |
| 5 | Servicios (5 service cards) |
| 6 | Proceso (4-step process) |
| 7 | Caso de éxito (Hotel Canfranc) |
| 8 | Testimonios |
| 9 | Red de artesanos |
| 10 | Por qué elegirnos |
| 11 | Contacto (formulario + mapa) |

**Slide 11 layout** — dos columnas:
- `.s11-info` (izquierda, fondo oscuro): dirección, teléfono, WhatsApp, email, tabla de horario, iframe de Google Maps, enlaces sociales (Instagram, Facebook, habitatdecor.es)
- `.s11-form-panel` (derecha, fondo lino): `.s11-form-card` con formulario POST a `../procesar-formulario.php` (campos: nombre, email, teléfono, mensaje) + `.s11-thanks-title` ("¡Gracias por tu tiempo!")

## JavaScript Navigation

Key functions in the `<script>` block:

- `goTo(n, dir)` — navigates to slide `n`, animates in direction `dir` (+1 forward, -1 back); uses an `animating` flag to prevent overlap
- `initDots()` — generates 11 `.nav-dot` buttons inside `#nav-dots` on page load; each dot calls `goTo()` on click
- `updateUI()` — syncs progress bar width, prev/next disabled state, and marks the active `.nav-dot--active`
- `scaleStage()` — recalculates transform scale on resize
- `toggleFullscreen()` — wraps the Fullscreen API

**Bottom controls bar** (`.slide-controls`): prev button · dot navigation (`#nav-dots`) · next button · PDF link (`print.html`). The old `1 / 11` text counter has been replaced by dot navigation.

Keyboard shortcuts: `←/→` arrows, `PageUp/PageDown`, `Home`/`End`, `F` (fullscreen). Touch swipe is also supported (threshold: 48px).

## External Images

All photographic content loads from GitHub raw content URLs (`raw.githubusercontent.com/rgasienica/...`). Replacing images requires updating these URLs in the HTML.

## Workflow Notes

- When editing content, changes apply only to the file you edit (`index.html` or `index_domingo.html`); keep them in sync manually if both are active variants.
- The commit language is Spanish (see git log).
