importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBGvEB_pxl_Wh_8mEiH8TzRmjOMpi6RtwE",
  authDomain: "scooton-debug.firebaseapp.com",
  projectId: "scooton-debug",
  storageBucket: "scooton-debug.firebasestorage.app",
  messagingSenderId: "767080447811",
  appId: "1:767080447811:web:c6a3ec4edd3f2f300a39f6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});
