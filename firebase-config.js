// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG6Da7AIwDtauK2D1cjurMh2LQ84hp1kM",
  authDomain: "genz-wallet-b73ed.firebaseapp.com",
  projectId: "genz-wallet-b73ed",
  storageBucket: "genz-wallet-b73ed.appspot.com", // ✅ fixed this line
  messagingSenderId: "680894022030",
  appId: "1:680894022030:web:f45e03d6c23310cd7be4df",
  measurementId: "G-SQJG0GS75H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
