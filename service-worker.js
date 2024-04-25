// Service Worker

// Define a cache name
const CACHE_NAME = 'memry-cache-v1';

// List of files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/images/icon.png',
  // Add other files to cache here
];

// Install the service worker and cache the files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercept requests and serve cached version if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request to make a fetch
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          // Check if we received a valid response
          response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response to make a cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Remove outdated caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});