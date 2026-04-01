self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  return self.clients.claim();
});

self.addEventListener("notificationclick", function(event){

  event.notification.close();

  event.waitUntil(
    clients.openWindow("index.html")
  );

});
