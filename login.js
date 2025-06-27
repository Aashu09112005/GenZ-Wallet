// login.js
import { auth } from './firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const provider = new GoogleAuthProvider();

document.getElementById("login-btn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // ✅ Optional: Save user info to Firestore (to appear in leaderboard)
    // You can do this inside `app.js` instead, if you want a centralized user logging function

    console.log("✅ Logged in:", user.displayName || user.email);
    localStorage.setItem("ecoUser", JSON.stringify({
      name: user.displayName || "Anonymous",
      email: user.email
    }));

    window.location.href = "index.html";
  } catch (err) {
    console.error("❌ Login failed:", err.message);
    alert("Login failed: " + err.message);
  }
});
