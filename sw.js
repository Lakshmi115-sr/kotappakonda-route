const CACHE_NAME = 'kotappakonda-thodu-v1';
const MAP_CACHE_NAME = 'kotappakonda-map-tiles-v1';

// Files to cache for the app shell (UI/Design)
const APP_ASSETS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js',
  'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css'
];

// 1. Install Event: Cache the UI assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(APP_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Fetch Event: Intercept requests to provide offline maps
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // LOGIC FOR MAP TILES: Cache-First
  // This targets OpenFreeMap or OpenStreetMap tiles
  if (url.hostname.includes('openfreemap.org') || url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.open(MAP_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // If tile is in cache, return it. Otherwise, fetch, cache, and return.
          return response || fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } 
  // LOGIC FOR APP DESIGN: Network-First
  // This ensures your Telugu header and design stay updated when online
  else {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
