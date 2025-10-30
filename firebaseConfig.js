// Importe as funções que você precisa
import { initializeApp } from "firebase/app";
// Importe os serviços que VOCÊ vai usar: Auth e Firestore
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Sua configuração do Firebase (está correta)
const firebaseConfig = {
  apiKey: "AIzaSyCb0bWuyziUmMzsTtBM3x6G4zykMwei0Cc",
  authDomain: "soundshow-app.firebaseapp.com",
  projectId: "soundShow-app",
  storageBucket: "soundshow-app.firebasestorage.app",
  messagingSenderId: "121324960557",
  appId: "1:121324960557:web:193f70407dcb2e308131a4",
  measurementId: "G-EH26XSJ9MC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Dependencias necessarias pro funcionamento do app
export const auth = getAuth(app);
export const db = getFirestore(app);
