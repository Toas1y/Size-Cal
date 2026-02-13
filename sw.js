// THE MAGIC VERSION NUMBER
// Change this text every time you update your index.html (e.g., v18.4, v18.5)
const CACHE_NAME = 'size-calc-v18.3'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 1. INSTALL: Save the files to the phone
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE: The "Trash Can" for old versions
// This looks for any old caches (like v18.2) and deletes them permanently
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Network-First Strategy
// Always try to get the newest code from the internet. If offline, use the cache.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
