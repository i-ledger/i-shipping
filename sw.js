self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // biarkan request normal
});

self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(
    clients.openWindow("/index.html")
  );

});
