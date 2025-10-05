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

// Génère le menu uniquement si l'utilisateur est connecté
function generateMenu() {
  const container = document.getElementById("app-links");
  container.innerHTML = ""; // Nettoie le menu précédent
  apps.forEach(app => {
    const link = document.createElement("a");
    link.href = app.path;
    link.textContent = `${app.icon} ${app.name}`;
    link.className = "app-link";
    container.appendChild(link);
  });
}

// Mascotte
const messages = [
  "Prêt à apprendre en t’amusant ?",
  "On révise les conjugaisons aujourd’hui !",
  "Tu vas devenir un champion des tables !",
  "Bienvenue sur EduHub, petit génie !"
];

document.getElementById("mascotteMessage").textContent =
  messages[Math.floor(Math.random() * messages.length)];

// Firebase config
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  appId: "TON_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Connecté avec l’ID :", userCredential.user.uid);
    })
    .catch((error) => {
      alert("Erreur : " + error.message);
    });
});

// Surveillance de l’état de connexion
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    generateMenu(); // Génère le menu une fois connecté
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
  }
});
