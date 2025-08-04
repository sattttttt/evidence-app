import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Tambahkan Firestore
import { getStorage } from "firebase/storage"; // Tambahkan Storage

const firebaseConfig = {
  apiKey: "AIzaSyCsRMgQDr2SDbMu05gObGitfXdZpJ0UaWo",
  authDomain: "evidence-app-49a30.firebaseapp.com",
  projectId: "evidence-app-49a30",
  storageBucket: "evidence-app-49a30.appspot.com", // Perbaiki domain storage
  messagingSenderId: "659045611042",
  appId: "1:659045611042:web:d00fb150ad1d7724447c7b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Ekspor Firestore
export const storage = getStorage(app); // Ekspor Storage