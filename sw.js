const CACHE_NAME = 'kotappakonda-v1';
const MAP_CACHE = 'map-tiles-v1';

const APP_ASSETS = [
    '/',
    '/index.html',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.js',
    'https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css'
];

// 1. Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Fetch Event (This saves the map tiles as you view them)
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    if (url.hostname.includes('openfreemap.org') || url.hostname.includes('openstreetmap.org')) {
        event.respondWith(
            caches.open(MAP_CACHE).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
