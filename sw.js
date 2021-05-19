self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        'TwMj/',
        'TwMj/index.html',
        'TwMj/icon.ico',
        'TwMj/main.js',
        'TwMj/manifest.webmanifest',
        'TwMj/style.css',
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
