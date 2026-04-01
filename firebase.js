const firebaseConfig = {
  apiKey: "AIzaSyCtLh42xjTfCkak6G3vCj0zLGR3aht3iR4",
  authDomain: "i-shipping.firebaseapp.com",
  projectId: "i-shipping",
  storageBucket: "i-shipping.firebasestorage.app",
  messagingSenderId: "22272415602",
  appId: "1:22272415602:web:56db1f7e871dba9ff72feb",
  measurementId: "G-5EZSK8CT9G"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

Notification.requestPermission().then(permission => {

if (permission === "granted") {

  messaging.getToken().then(token => {

    console.log("FCM TOKEN:", token);

    localStorage.setItem("fcmToken", token);

  });

}

});
