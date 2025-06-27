// leaderboard.js
import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const leaderboardTable = document.getElementById("leaderboard-data");

  try {
    const q = query(collection(db, "users"), orderBy("ecoPoints", "desc"), limit(10));
    const querySnapshot = await getDocs(q);

    let rank = 1;
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rank}</td>
        <td>${user.name || "Anonymous"}</td>
        <td>${user.ecoPoints || 0}</td>
      `;
      leaderboardTable.appendChild(tr);
      rank++;
    });
  } catch (error) {
    console.error("❌ Error loading leaderboard:", error);
    leaderboardTable.innerHTML = `<tr><td colspan="3">Error loading leaderboard.</td></tr>`;
  }
});
