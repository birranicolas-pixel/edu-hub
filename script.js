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

// ✅ Exports Firebase
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
  { name: "Tables de multiplication", path: "apps/multiplication/index.html", icon: "📚" },
  { name: "Conjugaison", path: "apps/conjugaison/index.html", icon: "📖" },
  { name: "Quiz général", path: "apps/quiz/index.html", icon: "🧠" }
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
    const link = document.createElement("a");
    link.href = app.path;
    link.textContent = `${app.icon} ${app.name}`;
    link.className = "app-link";
    container.appendChild(link);
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