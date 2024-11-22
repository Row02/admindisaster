import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1XjK0n_8e_4xfdmvGt3u3DJqdyHKLid0",
  authDomain: "santa-ana-9d60a.firebaseapp.com",
  projectId: "santa-ana-9d60a",
  storageBucket: "santa-ana-9d60a.firebasestorage.app",
  messagingSenderId: "866937912923",
  appId: "1:866937912923:web:7fc3d905b469b2c53ac97e",
  measurementId: "G-4HJNMS3K98"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db } 
