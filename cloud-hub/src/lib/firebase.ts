import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDhmP-CIOFzPrOtj3B-irlu9QxozAxarLc",
  authDomain: "cloudhub-a3e8d.firebaseapp.com",
  projectId: "cloudhub-a3e8d",
  storageBucket: "cloudhub-a3e8d.firebasestorage.app",
  messagingSenderId: "1023021020997",
  appId: "1:1023021020997:web:a4cc1620493a69edf6702c",
  measurementId: "G-YJ6ZCMN3J5",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const ADMIN_EMAIL = "dishakokane106@gmail.com";
export const ADMIN_PASSWORD = "admin1234";
