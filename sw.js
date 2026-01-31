const CACHE_NAME = 'kotappa-v1';
// List every file you want to work offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css',
  'https://tiles.openfreemap.org/styles/liberty'
];

// 1. Install Phase: Download and save files to phone
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Files Cached for Jathara Offline Mode');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Fetch Phase: If offline, serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});