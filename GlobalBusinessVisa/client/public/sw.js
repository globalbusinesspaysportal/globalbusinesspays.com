// Service worker for offline functionality

const CACHE_NAME = 'gbp-visa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/LOGO_NN1.png',
  '/logo-dark.png',
  '/cards'
];

// Install the service worker and cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from cache
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          (response) => {
            // Don't cache if it's not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response - one to cache, one to return
            const responseToCache = response.clone();

            // Cache API responses selectively
            if (event.request.url.includes('/api/cards') || 
                event.request.url.includes('/api/bnb-price')) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        );
      })
      .catch(() => {
        // If both cache and network fail, show a generic fallback
        return caches.match('/offline.html');
      })
  );
});

// Update caches when service worker activates
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});