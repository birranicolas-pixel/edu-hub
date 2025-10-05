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

// Inscription
document.getElementById("signupBtn").addEventListener("click", function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("Compte créé :", userCredential.user.uid);
      alert("Compte créé avec succès !");
    })
    .catch((error) => {
      alert("Erreur lors de l’inscription : " + error.message);
    });
});

// Déconnexion
document.getElementById("logoutBtn").addEventListener("click", function() {
  auth.signOut().then(() => {
    console.log("Déconnecté");
  });
});

// État de connexion
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("authSection").style.display = "none";
    document.getElementById("appSection").style.display = "block";
    generateMenu();
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
  }
});