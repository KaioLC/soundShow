// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCb0bWuyziUmMzsTtBM3x6G4zykMwei0Cc",
  authDomain: "soundshow-app.firebaseapp.com",
  projectId: "soundshow-app",
  storageBucket: "soundshow-app.firebasestorage.app",
  messagingSenderId: "121324960557",
  appId: "1:121324960557:web:193f70407dcb2e308131a4",
  measurementId: "G-EH26XSJ9MC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);