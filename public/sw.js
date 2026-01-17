const CACHE_NAME = 'focus-v2';
const STATIC_CACHE = 'focus-static-v2';
const DYNAMIC_CACHE = 'focus-dynamic-v2';

// Essential assets to cache on install (Cache-First strategy)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.css',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache-First strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache-First strategy for all requests
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[Service Worker] Serving from cache:', request.url);
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if response is not valid
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();

            // Cache dynamic resources (JS, CSS, images, fonts)
            if (
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.jpeg') ||
              url.pathname.endsWith('.svg') ||
              url.pathname.endsWith('.gif') ||
              url.pathname.endsWith('.webp') ||
              url.pathname.endsWith('.woff') ||
              url.pathname.endsWith('.woff2') ||
              url.pathname.endsWith('.ttf')
            ) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback - return cached index.html for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});
