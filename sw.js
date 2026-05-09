const CACHE_NAME = 'habitatdeco-book-v1';

const ASSETS = [
  './',
  './index.html',
  './print.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600&family=Quicksand:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/hero-curtain.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/logo.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/cortina_salon_biescas.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/tapizado_sofa.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/papel_pintado_texturas-3.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/cabeceros.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/alfombra.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/muebles_aux.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/equipo_familia.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/furgoneta_casa_rural.webp',
  'https://raw.githubusercontent.com/rgasienica/estructura-book-servicios-/main/assets/images/webp/hero_valle_pirineo.webp',
  'https://raw.githubusercontent.com/rgasienica/habitat-decor-style-library/main/03-assets/photography/tapiceria/cabecero_cama_ajustada_instalacion.jpg',
  'https://raw.githubusercontent.com/rgasienica/habitat-decor-style-library/main/03-assets/photography/tapiceria/tapizando_estructura_banco.jpg',
  'https://raw.githubusercontent.com/rgasienica/habitat-decor-style-library/main/03-assets/photography/H_D_cortinas.webp',
  'https://github.com/rgasienica/habitat-decor-style-library/blob/main/03-assets/photography/muebles/muebles_hero.jpg?raw=true',
  'https://github.com/rgasienica/habitat-decor-style-library/blob/main/03-assets/photography/tapiceria/cabecero_cama_acabado.jpeg?raw=true',
  'https://github.com/rgasienica/habitat-decor-style-library/blob/main/03-assets/photography/H_D_negocios1.jpg?raw=true',
  'https://github.com/rgasienica/habitat-decor-style-library/blob/main/03-assets/photography/tapiceria/tapizado_paredes.jpeg?raw=true',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(
        ASSETS.map(url =>
          cache.add(url).catch(() => { /* ignora errores de cache por CORS */ })
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('maps.google.com')) return;
  if (event.request.url.includes('procesar-formulario')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      }).catch(() => undefined);
    })
  );
});
