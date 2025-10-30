
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCb0bWuyziUmMzsTtBM3x6G4zykMwei0Cc",
  authDomain: "soundshow-app.firebaseapp.com",
  projectId: "soundShow-app",
  storageBucket: "soundshow-app.firebasestorage.app",
  messagingSenderId: "121324960557",
  appId: "1:121324960557:web:193f70407dcb2e308131a4",
  measurementId: "G-EH26XSJ9MC"
};

const app = initializeApp(firebaseConfig);

// dependencias necessarias pro funcionamento do app
export const auth = getAuth(app);
export const db = getFirestore(app);
