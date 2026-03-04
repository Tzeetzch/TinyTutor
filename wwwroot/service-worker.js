const CACHE = 'tinytutor-v1.1';
const PRECACHE = [
    '/',
    '/app.css?v=1.1',
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
    // Network-first for navigation (always fresh Blazor app)
    if (e.request.mode === 'navigate') {
        e.respondWith(fetch(e.request).catch(() => caches.match('/')));
        return;
    }
    // Cache-first for static assets
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
