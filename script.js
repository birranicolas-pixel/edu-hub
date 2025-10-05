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

function generateMenu() {
  const container = document.getElementById("app-links");
  apps.forEach(app => {
    const link = document.createElement("a");
    link.href = app.path;
    link.textContent = `${app.icon} ${app.name}`;
    link.className = "app-link";
    container.appendChild(link);
  });
}

window.onload = generateMenu;

const messages = [
  "Prêt à apprendre en t’amusant ?",
  "On révise les conjugaisons aujourd’hui !",
  "Tu vas devenir un champion des tables !",
  "Bienvenue sur EduHub, petit génie !"
];

document.getElementById("mascotteMessage").textContent =
  messages[Math.floor(Math.random() * messages.length)];

//script pour firebase
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  appId: "TON_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Connecté avec l’ID :", user.uid);
    })
    .catch((error) => {
      console.error("Erreur :", error.message);
    });
});

