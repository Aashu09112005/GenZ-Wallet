import { auth, db } from "./firebase.js";
import {
  collection,
  getDocs,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const impactRef = collection(userRef, "ecoImpact"); // nested collection

  const snapshot = await getDocs(impactRef);

  const dateMap = {};
  const categoryMap = {};

  snapshot.forEach((doc) => {
    const impact = doc.data();

    const date = new Date(impact.timestamp.seconds * 1000)
      .toISOString().split("T")[0];
    dateMap[date] = (dateMap[date] || 0) + impact.score;

    const category = impact.category || "Other";
    categoryMap[category] = (categoryMap[category] || 0) + impact.score;
  });

  const dateLabels = Object.keys(dateMap);
  const dateValues = Object.values(dateMap);

  const categoryLabels = Object.keys(categoryMap);
  const categoryValues = Object.values(categoryMap);

  // 📈 Line Chart
  new Chart(document.getElementById("impactChart"), {
    type: "line",
    data: {
      labels: dateLabels,
      datasets: [{
        label: "Eco Points Over Time",
        data: dateValues,
        borderColor: "#2e7d32",
        backgroundColor: "rgba(46,125,50,0.2)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Eco Points Over Time"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // 📊 Bar Chart
// Dummy category data (replace with real Firestore logic later)
const categoryData = {
  Fashion: 20,
  "Personal Care": 15,
  Home: 30
};

const labels = Object.keys(categoryData);
const scores = Object.values(categoryData);

new Chart(document.getElementById("categoryChart"), {
  type: "bar",
  data: {
    labels: labels,
    datasets: [{
      label: "Eco Points by Category",
      data: scores,
      backgroundColor: "#81c784"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Category-wise Eco Impact"
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

});

const quotes = [
  {
    text: "The greatest threat to our planet is the belief that someone else will save it.",
    author: "Robert Swan"
  },
  {
    text: "Live simply so others may simply live.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Buy less, choose well, make it last.",
    author: "Vivienne Westwood"
  },
  {
    text: "We do not inherit the earth from our ancestors, we borrow it from our children.",
    author: "Native American Proverb"
  },
  {
    text: "Every small change makes a big impact.",
    author: "GenZ Wallet"
  }
];

let quoteIndex = 0;

function showNextQuote() {
  const quote = quotes[quoteIndex];
  document.getElementById("quote-text").textContent = `“${quote.text}”`;
  document.getElementById("quote-author").textContent = `– ${quote.author}`;
  quoteIndex = (quoteIndex + 1) % quotes.length;
}

setInterval(showNextQuote, 5000); // change every 5 seconds
showNextQuote(); // show first quote
