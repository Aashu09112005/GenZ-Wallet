// profile.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Display basic auth info
      document.getElementById("user-name").textContent = user.displayName || "Anonymous";
      document.getElementById("user-email").textContent = user.email;
      document.getElementById("user-photo").src = user.photoURL || "https://via.placeholder.com/100";

      // Fetch ecoPoints and badge from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        document.getElementById("eco-points").textContent = data.ecoPoints || 0;
        document.getElementById("badge").textContent = data.badge || "🌱 Newbie";
      } else {
        console.warn("User data not found in Firestore.");
      }
    } else {
      window.location.href = "login.html";
    }
  });
});

import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const name = user.displayName || "Anonymous";
    const email = user.email;
    const pic = user.photoURL || "assets/icons/default-profile.png";

    document.getElementById("profile-name").textContent = name;
    document.getElementById("profile-email").textContent = email;
    document.getElementById("profile-pic").src = pic;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let ecoPoints = 0;

    if (userSnap.exists()) {
      ecoPoints = userSnap.data().ecoPoints || 0;
    }

    // Set eco points
    document.getElementById("profile-points").textContent = ecoPoints;

    // Set level bar
    const fill = document.getElementById("level-fill");
    const label = document.getElementById("eco-level-label");

    let level = "🌱 Level 1: Seedling";
    let width = "20%";
    if (ecoPoints >= 100) {
      level = "🏆 Level 3: Champion";
      width = "100%";
    } else if (ecoPoints >= 50) {
      level = "🌟 Level 2: Conscious Buyer";
      width = "60%";
    }

    fill.style.width = width;
    label.textContent = level;

    // Set rank emoji
    const rank = ecoPoints >= 100 ? "🥇"
              : ecoPoints >= 50 ? "🥈"
              : "🥉";
    document.getElementById("profile-rank").textContent = rank;

    // Show badges
    const badgeGrid = document.getElementById("badge-grid");
    const badges = [];

    if (ecoPoints >= 10) badges.push("🌱");
    if (ecoPoints >= 50) badges.push("🌟");
    if (ecoPoints >= 100) badges.push("🏆");

    badges.forEach(badge => {
      const span = document.createElement("span");
      span.textContent = badge;
      badgeGrid.appendChild(span);
    });

    // Get activity log
    const logList = document.getElementById("activity-list");
    const q = query(collection(db, "ecoImpact"), where("user", "==", email));
    const snapshot = await getDocs(q);

    const logs = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      logs.push(`${data.product} (+${data.score} pts) — ${new Date(data.timestamp?.seconds * 1000).toLocaleString()}`);
    });

    if (logs.length === 0) {
      logList.innerHTML = "<li>No activity yet. Start shopping sustainably!</li>";
    } else {
      logs.reverse().forEach(log => {
        const li = document.createElement("li");
        li.textContent = log;
        logList.appendChild(li);
      });
    }

  } else {
    window.location.href = "login.html";
  }
});
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
const storage = getStorage();

document.getElementById("save-pic-btn").addEventListener("click", async () => {
  const fileInput = document.getElementById("upload-pic");
  const file = fileInput.files[0];

  if (!file) {
    alert("❌ Please choose a file!");
    return;
  }

  const user = auth.currentUser;
  const storageRef = ref(storage, `profilePics/${user.uid}.jpg`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  // Save image URL to Firestore
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    photoURL: downloadURL
  }, { merge: true });

  alert("✅ Profile picture updated!");
  document.getElementById("profile-pic").src = downloadURL;
});
