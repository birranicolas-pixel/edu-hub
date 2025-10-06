// 🔥 Initialisation Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCabQZ5O5mPkcAd2_W8dF6qiwA-s7QntRo",
  authDomain: "edu-hud.firebaseapp.com",
  projectId: "edu-hud",
  storageBucket: "edu-hud.appspot.com",
  messagingSenderId: "647416475215",
  appId: "1:647416475215:web:df8d67a5d6a7d516c5843a",
  measurementId: "G-R6WBTZ23JE"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

// 📚 Liste des applications éducatives
const apps = [
  { name: "Tables de multiplication", path: "apps/multiplication/index.html", icon: "📚" },
  { name: "Conjugaison", path: "apps/conjugaison/index.html", icon: "📖" },
  { name: "Quiz général", path: "apps/quiz/index.html", icon: "🧠" }
];

// 🧠 Message mascotte
const mascotteMessages = [
  "Prêt à apprendre en t’amusant ?",
  "On révise les conjugaisons aujourd’hui !",
  "Tu vas devenir un champion des tables !",
  "Bienvenue sur EduHub, petit génie !"
];
document.getElementById("mascotteMessage").textContent =
  mascotteMessages[Math.floor(Math.random() * mascotteMessages.length)];

// 🧩 Génère le menu des applications
function generateMenu() {
  const container = document.getElementById("app-links");
  container.innerHTML = "";
  apps.forEach(app => {
    const link = document.createElement("a");
    link.href = app.path;
    link.textContent = `${app.icon} ${app.name}`;
    link.className = "app-link";
    container.appendChild(link);
  });
}

// 🔐 Connexion utilisateur
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log("Connecté :", userCredential.user.uid);
    })
    .catch(error => {
      alert("Erreur : " + error.message);
    });
});

// 🔓 Déconnexion utilisateur
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    console.log("Déconnecté");
  });
});

// 👤 Rétractation de la barre utilisateur
const collapseBtn = document.getElementById("collapseBtn");
const expandBtn = document.getElementById("expandBtn");

if (collapseBtn && expandBtn) {
  collapseBtn.addEventListener("click", () => {
    userBar.classList.add("collapsed");
    expandBtn.style.display = "block";
  });

  expandBtn.addEventListener("click", () => {
    userBar.classList.remove("collapsed");
    expandBtn.style.display = "none";
  });
}


// 👤 Surveillance de l’état de connexion
auth.onAuthStateChanged(user => {
  const authSection = document.getElementById("authSection");
  const appSection = document.getElementById("appSection");
  const userBar = document.getElementById("userBar");
  const leaderboardWrapper = document.querySelector(".leaderboard-wrapper");

  if (user) {
    authSection.style.display = "none";
    appSection.style.display = "block";
    userBar.style.display = "flex";
    leaderboardWrapper.style.display = "block";

    const nom = user.displayName || user.email;
    document.getElementById("userInfo").textContent = `Connecté : ${nom}`;

    generateMenu();
    fetchLeaderboard();
  } else {
    authSection.style.display = "block";
    appSection.style.display = "none";
    userBar.style.display = "none";
    leaderboardWrapper.style.display = "none";
  }
});

// 📊 Récupération des scores
function fetchLeaderboard() {
  db.collection("result").get().then(snapshot => {
    const rawData = snapshot.docs.map(doc => doc.data());
    const aggregated = {};

    rawData.forEach(entry => {
      const app = entry.application || "inconnue";
      const user = entry.username || entry.email || "anonyme";
      const key = `${app}__${user}`;

      if (!aggregated[key]) {
        aggregated[key] = {
          application: app,
          username: user,
          totalBonnes: 0,
          totalMauvaises: 0
        };
      }

      aggregated[key].totalBonnes += entry.totalBonnes || 0;
      aggregated[key].totalMauvaises += entry.totalMauvaises || 0;
    });

    const leaderboard = Object.values(aggregated).sort((a, b) => b.totalBonnes - a.totalBonnes);
    displayLeaderboard(leaderboard);
  }).catch(error => {
    console.error("Erreur lors du chargement du leaderboard :", error);
  });
}


// 🖼️ Affichage du tableau
function displayLeaderboard(data) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  data.forEach((entry, index) => {
    const total = entry.totalBonnes + entry.totalMauvaises;
    const pourcentage = total > 0 ? Math.round((entry.totalBonnes / total) * 100) : 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.username}</td>
      <td>${entry.application}</td>
      <td>${entry.totalBonnes}</td>
      <td>${entry.totalMauvaises}</td>
      <td>${pourcentage}%</td>
    `;
    tbody.appendChild(row);
  });
}

// 🔁 Bouton de rafraîchissement
document.getElementById("refreshLeaderboardBtn").addEventListener("click", () => {
  fetchLeaderboard("multiplication");
});
