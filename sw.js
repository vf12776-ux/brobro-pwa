const CACHE_NAME = 'brobro-v16';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Для HTML всегда идем в сеть, чтобы получить обновления
  if (e.request.mode === 'navigate') {
  e.respondWith(fetch(e.request).catch(() => caches.match('./offline.html')));
} else {
    // Для картинок и скриптов сначала кэш
    e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});
