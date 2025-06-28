import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyBtFezQNwfH9bN8JNwz25_6pjiXqFYONz0",
    authDomain: "swiftsummarypro.firebaseapp.com",
    projectId: "swiftsummarypro",
    storageBucket: "swiftsummarypro.firebasestorage.app",
    messagingSenderId: "399936968812",
    appId: "1:399936968812:web:6e3934ba5360abbc5ba049",
    measurementId: "G-BB5ZFEK76Y"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only in production and if supported
let analytics = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics not available:', error);
  }
}

export { analytics };
export default app;