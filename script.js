// Liste des applications éducatives
const apps = [
  {
    name: "Tables de multiplication",
    path: "apps/multiplication/index.html",
    icon: "📚"
  },
  {
    name: "Conjugaison",
    path: "apps/conjugaison/index.html",
    icon: "📖"
  },
  {
    name: "Quiz général",
    path: "apps/quiz/index.html",
    icon: "🧠"
  }
];

// Génère le menu après connexion
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

// Message mascotte
const messages = [
  "Prêt à apprendre en t’amusant ?",
  "On révise les conjugaisons aujourd’hui !",
  "Tu vas devenir un champion des tables !",
  "Bienvenue sur EduHub, petit génie !"
];
document.getElementById("mascotteMessage").textContent =
  messages[Math.floor(Math.random() * messages.length)];

// 🔥 Initialisation Firebase (version compat)
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

// Connexion
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Connecté :", userCredential.user.uid);
    })
    .catch((error) => {
      alert("Erreur : " + error.message);
    });
});

// Déconnexion
document.getElementById("logoutBtn").addEventListener("click", function() {
  auth.signOut().then(() => {
    console.log("Déconnecté");
  });
});

// Surveillance de l’état de connexion
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    document.getElementById("userBar").style.display = "flex";

    const nom = user.displayName || user.email;
    document.getElementById("userInfo").textContent = `Connecté : ${nom}`;

    generateMenu();
    fetchAggregatedLeaderboard(); // 👈 Appel du leaderboard agrégé
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
    document.getElementById("userBar").style.display = "none";
  }
});

// 🧮 Récupération et agrégation des scores
function fetchAggregatedLeaderboard() {
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
          totalBonnes: 0
        };
      }

      aggregated[key].totalBonnes += entry.totalBonnes || 0;
    });

    const leaderboard = Object.values(aggregated).sort((a, b) => b.totalBonnes - a.totalBonnes);
    displayLeaderboard(leaderboard);
  }).catch(error => {
    console.error("Erreur lors du chargement du leaderboard :", error);
  });
}

// 🎨 Affichage du tableau
function displayLeaderboard(data) {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.username}</td>
      <td>${entry.application}</td>
      <td>${entry.totalBonnes}</td>
    `;
    tbody.appendChild(row);
  });
}
