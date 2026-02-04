const CACHE_NAME = 'kotappakonda-v5';
const ASSETS = [
  './',
  './index.html',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css'
];

// Installs the app into phone storage
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Serves the saved files when internet is gone
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});