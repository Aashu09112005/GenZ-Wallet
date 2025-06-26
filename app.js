// app.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  collection,
  addDoc,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let ecoPoints = 0;
let allProducts = [];

// 🔐 Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Authenticated:", user.email);
    initWalletApp(user);
  } else {
    window.location.href = "login.html";
  }
});

// 🧠 Log eco-impact in Firestore
async function logEcoImpact(productName, ecoScore, userEmail, category) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const impactRef = collection(userRef, "ecoImpact"); // nested subcollection

    await addDoc(impactRef, {
      user: userEmail,
      product: productName,
      score: ecoScore,
      category: category,
      timestamp: new Date()
    });
  } catch (e) {
    console.error("❌ Error logging impact:", e);
  }
}


// ✨ Update points and badge
function updateEcoPoints(points) {
  ecoPoints += points;
  document.getElementById("eco-points").textContent = ecoPoints;
  localStorage.setItem("ecoPoints", ecoPoints);

  if (ecoPoints >= 100) {
    document.getElementById("badge").textContent = "🏆 Champion of Sustainability";
  } else if (ecoPoints >= 50) {
    document.getElementById("badge").textContent = "🌟 Conscious Buyer";
  } else {
    document.getElementById("badge").textContent = "🌱 Newbie";
  }
}

// 🛒 Render products
function renderFilteredProducts(query = "") {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  allProducts
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .forEach(product => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>Eco Score: <strong>${product.ecoScore}/10</strong></p>
        <p>${product.description}</p>
        <button class="buy-btn">Buy</button>
      `;
      card.querySelector(".buy-btn").addEventListener("click", () => {
        updateEcoPoints(product.ecoScore);
        alert(`✅ You earned ${product.ecoScore} eco points for buying ${product.name}!`);
        logEcoImpact(product.name, product.ecoScore, auth.currentUser.email);
        logEcoImpact(product.name, product.ecoScore, auth.currentUser.email, product.category);
      });
      container.appendChild(card);
    });
}

// 🧠 Initialize App
function initWalletApp(user) {
  ecoPoints = parseInt(localStorage.getItem("ecoPoints")) || 0;
  document.getElementById("eco-points").textContent = ecoPoints;

  const badge = ecoPoints >= 100 ? "🏆 Champion of Sustainability"
              : ecoPoints >= 50 ? "🌟 Conscious Buyer"
              : "🌱 Newbie";
  document.getElementById("badge").textContent = badge;

  // 🌱 Load Products
  fetch("data/eco_scores.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderFilteredProducts();

      document.getElementById("product-search").addEventListener("input", (e) => {
        renderFilteredProducts(e.target.value);
      });
    });

  // Save user info for leaderboard
  saveUserToFirestore(user);
}

// 💾 Save user to Firestore
async function saveUserToFirestore(user) {
  try {
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      name: user.displayName || "Anonymous",
      email: user.email,
      ecoPoints: ecoPoints
    }, { merge: true });
  } catch (e) {
    console.error("❌ Failed to save user:", e);
  }
}

function animateCount(id, target, speed = 50) {
  let count = 0;
  const el = document.getElementById(id);
  const interval = setInterval(() => {
    count++;
    el.textContent = count;
    if (count >= target) clearInterval(interval);
  }, speed);
}

// Call when user is authenticated
animateCount("user-count", 123);  // Replace with dynamic values if needed
animateCount("product-count", 4);
animateCount("points-earned", 999);

import { signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

function logoutUser() {
  signOut(auth).then(() => {
    alert("✅ Logged out!");
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout error", error);
  });
}

// Call after login
function showUserGreeting(user) {
  document.getElementById("user-area").style.display = "block";
  document.getElementById("user-greeting").textContent = `Hi, ${user.displayName || "Friend"} 👋`;
}

import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

async function loadEcoStats() {
  // 👥 Users
  const usersSnap = await getDocs(collection(db, "users"));
  document.getElementById("user-count").textContent = usersSnap.size;

  // 📦 Products
  fetch("data/eco_scores.json")
    .then(res => res.json())
    .then(data => {
      document.getElementById("product-count").textContent = data.length;
    });

  // 🌿 Points Earned
  const impactSnap = await getDocs(collection(db, "ecoImpact"));
  let totalPoints = 0;
  impactSnap.forEach(doc => {
    const val = doc.data().score || 0;
    totalPoints += val;
  });
  document.getElementById("points-earned").textContent = totalPoints;
}

loadEcoStats();
