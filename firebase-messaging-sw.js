importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "22272415602"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

  return self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "pertamina-logoicon.png"
    }
  );

});
