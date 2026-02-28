import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDykuJkY7QRUPpNGKt0fSf1LSDGuD-YU9E",
  authDomain: "codecamp-9f769.firebaseapp.com",
  projectId: "codecamp-9f769",
  storageBucket: "codecamp-9f769.firebasestorage.app",
  messagingSenderId: "377885017887",
  appId: "1:377885017887:web:834beabf01c5047722922a",
  measurementId: "G-1RXJGM40HC"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
