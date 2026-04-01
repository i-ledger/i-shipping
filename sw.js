const CACHE_NAME = "i-shipping-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/manifest.json",
  "/icon.png"
];

/* INSTALL */
self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );

});

/* ACTIVATE */
self.addEventListener("activate", event => {

  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();

});

/* FETCH (agar bisa offline) */
self.addEventListener("fetch", event => {

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});

/* NOTIFICATION CLICK */
self.addEventListener("notificationclick", function(event){

  event.notification.close();

  event.waitUntil(
    clients.openWindow("dashboard.html")
  );

});
