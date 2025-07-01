import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyD3XmP-F4mhlYWC272LQBFB3sawFkL-JYs",
    authDomain: "notifications-19039.firebaseapp.com",
    projectId: "notifications-19039",
    storageBucket: "notifications-19039.firebasestorage.app",
    messagingSenderId: "128132936205",
    appId: "1:128132936205:web:12a1d4973fe1fa9e4cdb44",
    measurementId: "G-1LT2M5KYY6"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };