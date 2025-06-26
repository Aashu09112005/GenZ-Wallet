// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCG6Da7AIwDtauK2D1cjurMh2LQ84hp1kM",
  authDomain: "genz-wallet-b73ed.firebaseapp.com",
  projectId: "genz-wallet-b73ed",
  storageBucket: "genz-wallet-b73ed.firebasestorage.app",
  messagingSenderId: "680894022030",
  appId: "1:680894022030:web:f45e03d6c23310cd7be4df",
  measurementId: "G-SQJG0GS75H"
};

// 🔥 Initialize Firebase app
const app = initializeApp(firebaseConfig);

// 🔐 Export Auth & Firestore for use across the site
export const auth = getAuth(app);
export const db = getFirestore(app);
