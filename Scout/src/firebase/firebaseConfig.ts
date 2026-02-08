import { initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Firebase configuration structure
const firebaseConfig = {
  apiKey: "AIzaSyAdnQJi7uAtrbFfFmn_TKGaUQXYx2SMNys",
  authDomain: "itobot-ee9cf.firebaseapp.com",
  projectId: "itobot-ee9cf",
  storageBucket: "itobot-ee9cf.firebasestorage.app",
  messagingSenderId: "239153831411",
  appId: "1:239153831411:web:51364c69552f373f974686",
  measurementId: "G-DJC63MWD54"
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);