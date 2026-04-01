importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js");

firebase.initializeApp({
messagingSenderId:"SENDERID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){

self.registration.showNotification(
payload.notification.title,
{
body:payload.notification.body,
icon:"pertamina-logoicon.png"
}
);

});
