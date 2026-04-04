import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJqLtjHzAFjZVoDidNUXE97rVI6R86U2s",
  authDomain: "sai-rohan-driving-schools.firebaseapp.com",
  projectId: "sai-rohan-driving-schools",
  storageBucket: "sai-rohan-driving-schools.firebasestorage.app",
  messagingSenderId: "164177127907",
  appId: "1:164177127907:web:ad95ca7dd236917476d8d6",
  measurementId: "G-48S0BGP231",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
