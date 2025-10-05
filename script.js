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

// Initialisation Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCabQZ5O5mPkcAd2_W8dF6qiwA-s7QntRo",
  authDomain: "edu-hud.firebaseapp.com",
  projectId: "edu-hud",
  storageBucket: "edu-hud.firebasestorage.app",
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

// Inscription
// document.getElementById("signupBtn").addEventListener("click", function() {
//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   auth.createUserWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       console.log("Compte créé :", userCredential.user.uid);
//       alert("Compte créé avec succès !");
//     })
//     .catch((error) => {
//       alert("Erreur lors de l’inscription : " + error.message);
//     });
// });


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
  } else {
    document.getElementById("authSection").style.display = "block";
    document.getElementById("appSection").style.display = "none";
    document.getElementById("userBar").style.display = "none";
  }
});

// Récupération du classement pour multiplication
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";

const db = getFirestore();

async function fetchLeaderboard(appName = "multiplication") {
  const resultsRef = collection(db, "result");
  const q = query(
    resultsRef,
    where("application", "==", appName),
    orderBy("totalBonnes", "desc")
  );

  const snapshot = await getDocs(q);

  const leaderboard = snapshot.docs.map((doc, index) => ({
    rank: index + 1,
    username: doc.data().username || doc.data().email,
    score: doc.data().totalBonnes,
    avatarUrl: doc.data().avatarUrl || null,
  }));

  return leaderboard;
}
