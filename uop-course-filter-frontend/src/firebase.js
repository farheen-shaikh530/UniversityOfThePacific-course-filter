// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqoaVAIQpG-02RbV44_oTi7Xf4xrGmpQo",
  authDomain: "course-filter-eb557.firebaseapp.com",
  projectId: "course-filter-eb557",
  storageBucket: "course-filter-eb557.appspot.com",
  messagingSenderId: "738599206272",
  appId: "1:738599206272:web:1ad217bb23718cc47a1565",
  measurementId: "G-ZNV7YQT7NE",
};

// ✅ Prevent re-initializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default db;