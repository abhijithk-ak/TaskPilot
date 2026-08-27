const CACHE_NAME = 'taskpilot-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/next.svg',
  '/vercel.svg',
  '/window.svg',
  '/file.svg',
  '/globe.svg'
];

// Install Service Worker and cache essential static shells
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return (self as any).skipWaiting();
    })
  );
});

// Activate Service Worker and clean old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return (self as any).clients.claim();
    })
  );
});

// Fetch events: Network first, fallback to Cache
self.addEventListener('fetch', (event: any) => {
  // Only intercept HTTP/S requests (skip chrome-extension://, etc)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid network response, clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network offline -> try Cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          
          // Return offline fallback if navigating to a page
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline resource unavailable', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
