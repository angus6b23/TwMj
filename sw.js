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
    console.log('Handling fetch event for', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                if (response && response.status == 200 && response.type =='basic'){
                    caches.open(webversion).then(function(cache){
                        cache.put(event.request, response.clone());
                        return response
                    })
                }
            }).catch(function(error) {
                console.error('Fetching failed:', error);

                throw error;
            });
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
