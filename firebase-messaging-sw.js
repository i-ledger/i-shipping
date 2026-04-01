importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCtLh42xjTfCkak6G3vCj0zLGR3aht3iR4",
  authDomain: "i-shipping.firebaseapp.com",
  projectId: "i-shipping",
  storageBucket: "i-shipping.firebasestorage.app",
  messagingSenderId: "22272415602",
  appId: "1:22272415602:web:56db1f7e871dba9ff72feb",
  measurementId: "G-5EZSK8CT9G"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: "icon.png"
  };

  return self.registration.showNotification(title, options);

});
