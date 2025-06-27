// logout.js
import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("✅ Signed out");
        window.location.href = "login.html";
      } catch (err) {
        console.error("❌ Sign out error:", err);
        alert("Logout failed: " + err.message);
      }
    });
  }
});
