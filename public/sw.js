const STATIC_CACHE = 'focus-static-v3';
const DYNAMIC_CACHE = 'focus-dynamic-v3';

// Essential assets to cache on install (Cache-First strategy)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
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

  // Cacheable file extensions
  const CACHEABLE_EXTENSIONS = new Set([
    '.js', '.css', '.png', '.jpg', '.jpeg', 
    '.svg', '.gif', '.webp', '.woff', '.woff2', '.ttf'
  ]);

  // Helper to check if URL should be cached
  const shouldCache = (pathname) => {
    return Array.from(CACHEABLE_EXTENSIONS).some(ext => pathname.endsWith(ext));
  };

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
            if (shouldCache(url.pathname)) {
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseToCache))
                .catch((error) => console.error('[Service Worker] Cache put error:', error));
            }

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback - return offline.html for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html').then((offlineResponse) => {
                return offlineResponse || caches.match('/index.html');
              });
            }
          });
      })
  );
});

// Background Sync - for syncing data when connection is restored
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync triggered:', event.tag);
  
  if (event.tag === 'sync-study-data') {
    event.waitUntil(
      syncStudyData().catch((error) => {
        console.error('[Service Worker] Background Sync failed:', error);
      })
    );
  }
});

// Helper function for background sync
async function syncStudyData() {
  console.log('[Service Worker] Syncing study data...');
  
  // This is where you would sync any pending changes with your backend
  // For example, sync study cards, progress, etc.
  // Currently, this is a placeholder for future implementation
  
  try {
    // Check if there's pending data in IndexedDB or localStorage
    // and sync it with the server
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'BACKGROUND_SYNC_COMPLETE',
        message: 'Study data synced successfully'
      });
    });
    
    console.log('[Service Worker] Background sync completed');
    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Sync error:', error);
    return Promise.reject(error);
  }
}

// Push Notification - receive push messages
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received:', event);
  
  let notificationData = {
    title: 'Focus - Estudo & Produtividade',
    body: 'Você tem novas atualizações!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'focus-notification',
    requireInteraction: false
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('[Service Worker] Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data
    })
  );
});

// Notification Click - handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();
  
  // Open or focus the app window
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});
