const STATIC_CACHE = 'kore-static-v6';
const AUDIO_CACHE = 'kore-audio-v1';

const APP_SHELL = [
  './',
  './index.html',
  './styles.css?v=6',
  './app.js?v=6',
  './sw.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  const expectedCaches = new Set([STATIC_CACHE, AUDIO_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames.map((cacheName) => (
          expectedCaches.has(cacheName) ? undefined : caches.delete(cacheName)
        )),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, STATIC_CACHE, './index.html'));
    return;
  }

  if (event.request.destination === 'audio' || requestUrl.pathname.endsWith('.mp3')) {
    event.respondWith(cacheFirst(event.request, AUDIO_CACHE));
    return;
  }

  event.respondWith(networkFirst(event.request, STATIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await fetch(request);
  if (networkResponse && networkResponse.status === 200) {
    const cache = await caches.open(cacheName);
    await cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      await cache.put(fallbackUrl || request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    if (fallbackUrl) {
      const fallbackResponse = await caches.match(fallbackUrl);
      if (fallbackResponse) {
        return fallbackResponse;
      }
    }

    return Response.error();
  }
}
