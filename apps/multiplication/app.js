// 🔥 Initialisation Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCabQZ5O5mPkcAd2_W8dF6qiwA-s7QntRo",
  authDomain: "edu-hud.firebaseapp.com",
  projectId: "edu-hud",
  storageBucket: "edu-hud.appspot.com",
  messagingSenderId: "647416475215",
  appId: "1:647416475215:web:df8d67a5d6a7d516c5843a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 👤 Gestion de l'utilisateur connecté
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("userBar").style.display = "flex";
    const nom = user.displayName || user.email;
    document.getElementById("userInfo").textContent = `Connecté : ${nom}`;

    document.getElementById("logoutBtn").addEventListener("click", function() {
      auth.signOut().then(() => {
        window.location.href = "/index.html";
      });
    });
  } else {
    window.location.href = "/index.html";
  }
});

// 🧮 Logique du quiz de multiplication
let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;

const tableButtons = document.querySelectorAll(".table-btn");
const quizContainer = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const goodCountEl = document.getElementById("good-count");
const badCountEl = document.getElementById("bad-count");

tableButtons.forEach(button => {
  button.addEventListener("click", () => {
    tableChoisie = parseInt(button.dataset.table);
    lancerQuestion();
    quizContainer.classList.remove("hidden");
    feedbackEl.textContent = "";
  });
});

function lancerQuestion() {
  const facteur = Math.floor(Math.random() * 10) + 1;
  const bonne = tableChoisie * facteur;
  questionEl.textContent = `Combien font ${tableChoisie} × ${facteur} ?`;

  const propositions = [bonne];
  while (propositions.length < 4) {
    const faux = bonne + Math.floor(Math.random() * 10) - 5;
    if (!propositions.includes(faux) && faux >= 0) {
      propositions.push(faux);
    }
  }

  propositions.sort(() => Math.random() - 0.5);

  answersEl.innerHTML = "";
  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => verifierReponse(rep, bonne));
    answersEl.appendChild(btn);
  });
}

function verifierReponse(reponse, bonne) {
  const user = auth.currentUser;

  if (reponse === bonne) {
    bonneReponse++;
    feedbackEl.textContent = "✅ Bravo !";
    enregistrerResultat(user, tableChoisie, true);
  } else {
    mauvaiseReponse++;
    feedbackEl.textContent = `❌ Mauvaise réponse. La bonne était ${bonne}.`;
    enregistrerResultat(user, tableChoisie, false);
  }

  goodCountEl.textContent = bonneReponse;
  badCountEl.textContent = `Mauvaises réponses : ${mauvaiseReponse}`;

  setTimeout(() => {
    lancerQuestion();
    feedbackEl.textContent = "";
  }, 1500);
}

// 🗂️ Enregistrement dans Firestore
function enregistrerResultat(user, table, estBonne) {
  if (!user) return;

  db.collection("result").add({
    uid: user.uid,
    email: user.email,
    table: table,
    bonneReponse: estBonne ? 1 : 0,
    mauvaiseReponse: estBonne ? 0 : 1,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch(error => {
    console.error("Erreur lors de l'enregistrement du résultat :", error);
  });
}