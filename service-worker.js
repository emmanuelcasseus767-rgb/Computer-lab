// Nom du cache
const CACHE_NAME = 'salle-informatique-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Erreur lors de la mise en cache:', error);
      })
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  console.log('Service Worker activé');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression du cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Stratégie: Cache First, Network Fallback
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Répondre avec le cache s'il existe
          if (response) {
            return response;
          }

          // Sinon, faire une requête réseau
          return fetch(event.request)
            .then(response => {
              // Vérifier que la réponse est valide
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Mettre en cache la nouvelle réponse
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Retourner une page offline si disponible
              return caches.match('/index.html');
            });
        })
    );
  } else {
    // Pour les requêtes POST, utiliser Network First avec cache fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache les réponses réussies
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // En cas d'erreur réseau, essayer le cache
          return caches.match(event.request);
        })
    );
  }
});

// Écouter les messages du client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
