const webversion = '1.08a';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(webversion).then((cache) => {
      return cache.addAll([
        './index.html',
        'assets/icon192.png',
        'assets/icon512.png',
        './main.js',
        './manifest.webmanifest',
        './style.css',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of static-v1
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== webversion) {
          return caches.delete(key);
        }
      })
    ))
  );
});
