// auth.js
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerLink = document.getElementById("register-link");

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    alert("✅ Logged in!");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ Login failed: " + error.message);
  }
});

registerLink.addEventListener("click", async () => {
  const email = prompt("Enter email to register:");
  const password = prompt("Enter password (min 6 chars):");

  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    alert("✅ Registered & logged in!");
    window.location.href = "index.html";
  } catch (error) {
    alert("❌ Registration failed: " + error.message);
  }
});
