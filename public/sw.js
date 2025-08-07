const STATIC_CACHE = 'cq-static-v1';
const DYNAMIC_CACHE = 'cq-dynamic-v1';
const STATIC_ASSETS = [
  './',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if (![STATIC_CACHE, DYNAMIC_CACHE].includes(k)) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then(res => {
        const resClone = res.clone();
        caches.open(DYNAMIC_CACHE).then(cache => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
