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

export function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`⚠️ Élément introuvable : #${id}`);
  return el;
}

export const apps = [
  { name: "Tables de multiplication", key: "multiplication", icon: "🧮" },
  { name: "Conjugaison", key: "conjugaison", icon: "📚" }
];

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

function setupLogout() {
  const btn = safeGet("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    auth.signOut().then(() => {
      console.log("Déconnecté");
    });
  });
}

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

function setupRefreshButton() {
  const btn = safeGet("refreshLeaderboardBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    fetchLeaderboard().then(displayLeaderboard);
  });
}

export function monitorAuthState() {
  auth.onAuthStateChanged(user => {
    const authSection = safeGet("authSection");
    const userBar = safeGet("userBar");
    const userInfo = safeGet("userInfo");
    const leaderboardWrapper = document.querySelector(".leaderboard-wrapper");
    const homeScreen = safeGet("home-screen");

    if (user) {
      authSection?.style.setProperty("display", "none");
      userBar?.style.setProperty("display", "flex");
      leaderboardWrapper?.style.setProperty("display", "block");
      homeScreen?.style.setProperty("display", "block");

      if (userInfo) userInfo.textContent = `Connecté : ${user.displayName || user.email}`;
      fetchLeaderboard().then(displayLeaderboard);
    } else {
      authSection?.style.setProperty("display", "block");
      userBar?.style.setProperty("display", "none");
      leaderboardWrapper?.style.setProperty("display", "none");
      homeScreen?.style.setProperty("display", "none");
    }
  });
}

export function initScript() {
  setMascotteMessage();
  setupLogin();
  setupLogout();
  setupUserBarToggle();
  setupRefreshButton();
  monitorAuthState();
  setupNavigation();
}

function setupNavigation() {
  const homeScreen = safeGet("home-screen");
  const appSections = {
    multiplication: safeGet("multiplication"),
    conjugaison: safeGet("conjugaison")
  };

  document.querySelectorAll(".app-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const appKey = btn.dataset.app;

      // 🔄 Réinitialise toutes les sections
      homeScreen.style.display = "none";
      Object.values(appSections).forEach(section => {
        section.style.display = "none";
        section.innerHTML = "";
        section.dataset.loaded = "";
      });

      const container = appSections[appKey];
      container.style.display = "block";

      fetch(`apps/${appKey}/${appKey}.html`)
        .then(res => res.text())
        .then(html => {
          container.innerHTML = html;
          container.dataset.loaded = "true";

          setTimeout(() => initializeAppModule(appKey), 50);
        });
    });
  });

  window.backToHome = () => {
    homeScreen.style.display = "block";
    Object.values(appSections).forEach(section => section.style.display = "none");
  };
}

export function parler(message) {
  const voix = new SpeechSynthesisUtterance(message);
  voix.lang = 'fr-FR';
  voix.rate = 1;
  speechSynthesis.speak(voix);
}

function initializeAppModule(appKey) {
  console.log(`🔄 Initialisation de l'app : ${appKey}`);
  const container = safeGet(appKey);
  if (!container || container.dataset.loaded !== "true") return;

  if (appKey === "multiplication") {
    import(`./apps/multiplication/multiplication.js`).then(mod => mod.initMultiplication());
  } else if (appKey === "conjugaison") {
    import(`./apps/conjugaison/conjugaison.js`).then(mod => mod.initConjugaison());
  }
}
