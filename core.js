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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();

// 🔐 Utilitaire DOM sécurisé
export function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`⚠️ Élément introuvable : #${id}`);
  return el;
}

// 📚 Liste des applications éducatives
export const apps = [
  { name: "Tables de multiplication", key: "multiplication", icon: "🧮" },
  { name: "Conjugaison", key: "conjugaison", icon: "📚" }
];

// 🧠 Message mascotte
export function setMascotteMessage() {
  const mascotteEl = safeGet("mascotteMessage");
  if (mascotteEl) {
    const messages = [
      "Prêt à apprendre en t’amusant ?",
      "On révise les conjugaisons aujourd’hui !",
      "Tu vas devenir un champion des tables !",
      "Bienvenue sur EduHub, petit génie !"
    ];
    mascotteEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}

// 🧩 Génère le menu des applications
export function generateMenu() {
  const container = safeGet("app-links");
  if (!container) return;

  container.innerHTML = "";
  apps.forEach(app => {
    const button = document.createElement("button");
    button.textContent = `${app.icon} ${app.name}`;
    button.className = "app-link";
    button.addEventListener("click", () => {
      window.showApp(app.key);
    });
    container.appendChild(button);
  });
}

// 📊 Récupération des scores
export function fetchLeaderboard() {
  return db.collection("result").get().then(snapshot => {
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

    return Object.values(aggregated).sort((a, b) => b.totalBonnes - a.totalBonnes);
  });
}

// 🖼️ Affichage du tableau
export function displayLeaderboard(data) {
  const tbody = safeGet("leaderboard-body");
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

// 👤 Surveillance de l’état de connexion
export function monitorAuthState() {
  auth.onAuthStateChanged(user => {
    const authSection = safeGet("authSection");
    const appSection = safeGet("appSection");
    const userBar = safeGet("userBar");
    const userInfo = safeGet("userInfo");
    const leaderboardWrapper = document.querySelector(".leaderboard-wrapper");

    if (user) {
      authSection?.style.setProperty("display", "none");
      appSection?.style.setProperty("display", "block");
      userBar?.style.setProperty("display", "flex");
      leaderboardWrapper?.style.setProperty("display", "block");
      if (userInfo) userInfo.textContent = `Connecté : ${user.displayName || user.email}`;

      generateMenu();
      fetchLeaderboard().then(displayLeaderboard);
    } else {
      authSection?.style.setProperty("display", "block");
      appSection?.style.setProperty("display", "none");
      userBar?.style.setProperty("display", "none");
      leaderboardWrapper?.style.setProperty("display", "none");
    }
  });
}

// 🔐 Connexion utilisateur
function setupLogin() {
  const form = safeGet("loginForm");
  const emailInput = safeGet("email");
  const passwordInput = safeGet("password");
  if (!form || !emailInput || !passwordInput) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then(userCredential => {
        console.log("Connecté :", userCredential.user.uid);
      })
      .catch(error => {
        alert("Erreur : " + error.message);
      });
  });
}

// 🔓 Déconnexion utilisateur
function setupLogout() {
  const btn = safeGet("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    auth.signOut().then(() => {
      console.log("Déconnecté");
    });
  });
}

// 👤 Barre utilisateur
function setupUserBarToggle() {
  const collapseBtn = safeGet("collapseBtn");
  const expandBtn = safeGet("expandBtn");
  const userBar = safeGet("userBar");
  if (!collapseBtn || !expandBtn || !userBar) return;

  collapseBtn.addEventListener("click", () => {
    userBar.classList.add("collapsed");
    expandBtn.style.display = "block";
    localStorage.setItem("userBarCollapsed", "true");
  });

  expandBtn.addEventListener("click", () => {
    userBar.classList.remove("collapsed");
    expandBtn.style.display = "none";
    localStorage.setItem("userBarCollapsed", "false");
  });

  const isCollapsed = localStorage.getItem("userBarCollapsed") === "true";
  userBar.classList.toggle("collapsed", isCollapsed);
  expandBtn.style.display = isCollapsed ? "block" : "none";
}

// 🔁 Rafraîchissement du leaderboard
function setupRefreshButton() {
  const btn = safeGet("refreshLeaderboardBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    fetchLeaderboard().then(displayLeaderboard);
  });
}

// 🚀 Initialisation globale
export function initScript() {
  setMascotteMessage();
  setupLogin();
  setupLogout();
  setupUserBarToggle();
  setupRefreshButton();
  monitorAuthState();
}
