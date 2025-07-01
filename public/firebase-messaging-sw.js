importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyD3XmP-F4mhlYWC272LQBFB3sawFkL-JYs",
    authDomain: "notifications-19039.firebaseapp.com",
    projectId: "notifications-19039",
    storageBucket: "notifications-19039.firebasestorage.app",
    messagingSenderId: "128132936205",
    appId: "1:128132936205:web:12a1d4973fe1fa9e4cdb44",
    measurementId: "G-1LT2M5KYY6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icons/default.png',
    badge: '/icons/badge.png',
    tag: 'expense-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Expense'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});