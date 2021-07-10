const webversion = '1.09a1';

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


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log(response);
          return response;
        }

        return fetch(event.request).then(
          function(response) {
              if(response && response.status == 200 && response.type == 'basic') {
                var responseToCache = response.clone();
                caches.open(webversion)
                  .then(function(cache) {
                    cache.put(event.request, responseToCache);
                  });
            }
            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
          }
        );
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
