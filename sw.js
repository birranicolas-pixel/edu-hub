const CACHE_NAME = 'eduhub-cache-v1';
const urlsToCache = [
  '/edu-hub/',
  '/edu-hub/index.html',
  '/edu-hub/style.css',
  '/edu-hub/script.js',
  '/edu-hub/assets/mascotte.png'
];

// 🔧 Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker installé');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url =>
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            } else {
              console.warn(`Non mis en cache : ${url}`);
            }
          }).catch(err => {
            console.warn(`Erreur de cache pour ${url}`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// 🔄 Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activé');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => {
          console.log(`Suppression du cache obsolète : ${key}`);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// 🌐 Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    (async () => {
      try {
        const cached = await caches.match(event.request);
        return cached || await fetch(event.request);
      } catch (err) {
        console.error("Erreur réseau ou hors ligne :", err);
        return new Response("Contenu non disponible hors ligne", {
          status: 503,
          statusText: "Service Unavailable"
        });
      }
    })()
  );
});
