const CACHE = 'tinytutor-v1.03'; // keep in sync with AppVersion.cs
const PRECACHE = [
    '/app.css?v=1.03',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/js/speech.js'
];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Always fetch navigation from network (WASM index.html must be fresh)
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request));
        return;
    }
    // Cache-first for static assets
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
