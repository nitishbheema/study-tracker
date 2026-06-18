// src/firebase.js
// Replace these values with your Firebase project config
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdRi7VACc8ZoqWYsR2F2HPIL__-eHEGyU",
  authDomain: "study-tracker-28bb6.firebaseapp.com",
  projectId: "study-tracker-28bb6",
  storageBucket: "study-tracker-28bb6.firebasestorage.app",
  messagingSenderId: "957705171262",
  appId: "1:957705171262:web:ded07c8d593a610acefc6f",
  measurementId: "G-VBRP6LT7BV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
