# Memoria PDF — Exportación a PDF desde presentación HTML

## Resumen de validación (slide 1)

Probado con `version2_test_pdf.html`. La captura con `html2canvas` + `jsPDF` funciona correctamente.

## Dependencias CDN

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

## Configuración de captura probada

```js
const canvas = await html2canvas(stage, {
  useCORS: true,
  scale: 2,
  backgroundColor: '#F2EFEC',
  logging: false,
});

const pdf = new jsPDF({
  orientation: 'landscape',
  unit: 'px',
  format: [1440, 810],
});

pdf.addImage(canvas, 'JPEG', 0, 0, 1440, 810);
```

- **scale: 2** — calidad retina, sin grano
- **pasar canvas directamente** a addImage (NO `toDataURL`) — evita pico de memoria que congela el navegador
- **formato**: landscape, 1440×810 px (mismas dimensiones que el stage)

## Reglas obligatorias

1. **Loader fuera del `.slide-stage`** — si está dentro, se captura en el PDF
2. **Ocultar controles durante captura** — clase `.capturing` → `display: none` en `.slide-controls`
3. **Recorrer slides 1-11 secuencialmente**: ocultar todos, mostrar solo el actual, capturar `.slide-stage`
4. **Restaurar estado original** al terminar (slide activo, controles visibles)
5. **`backgroundColor` fijo** en html2canvas — evita fondo transparente

## Loop de captura para 11 slides (pendiente de implementar)

```js
const TOTAL_SLIDES = 11;
const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1440, 810] });
const stage = document.getElementById('stage');
const ALL = document.querySelectorAll('.slide');

for (let i = 0; i < TOTAL_SLIDES; i++) {
  ALL.forEach(s => { s.style.display = 'none'; s.style.opacity = '0'; s.style.pointerEvents = 'none'; });
  const slide = ALL[i];
  slide.style.display = '';      /* restaurar display original (grid/flex) */
  slide.style.opacity = '1';
  slide.style.pointerEvents = 'auto';
  slide.style.transform = 'none';

  await new Promise(r => requestAnimationFrame(r));
  await new Promise(r => setTimeout(r, 80));

  const canvas = await html2canvas(stage, { useCORS: true, scale: 2, backgroundColor: '#F2EFEC' });
  if (i > 0) pdf.addPage();
  pdf.addImage(canvas, 'JPEG', 0, 0, 1440, 810);
}

pdf.save('Habitat&Decor-Book-Empresa-2026.pdf');
```

## Archivos de referencia

- `version2_test_pdf.html` — banco de pruebas funcional con slide 1
- `index.html` — presentación completa (origen de los 11 slides)

## Orden de implementación futura

1. Duplicar `index.html` → `index_pdf.html`
2. Añadir CDN scripts (html2canvas, jsPDF)
3. Añadir botón PDF en `.slide-controls`
4. Añadir CSS para `.capturing` + loader (fixed)
5. Implementar loop de captura (11 slides)
6. Testear en Chrome/Edge/Perplexity Chromium
