// Variables du quiz
let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;
let questionCount = 0;
const maxQuestions = 10;

// Références DOM
const tableButtons = document.querySelectorAll(".table-btn");
const quizContainer = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const goodCountEl = document.getElementById("good-count");
const badCountEl = document.getElementById("bad-count");

// Lancement du quiz
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

// Vérification de la réponse
function verifierReponse(reponse, bonne) {
  if (reponse === bonne) {
    bonneReponse++;
    feedbackEl.textContent = "✅ Bravo !";
  } else {
    mauvaiseReponse++;
    feedbackEl.textContent = `❌ Mauvaise réponse. La bonne était ${bonne}.`;
  }

  goodCountEl.textContent = bonneReponse;
  badCountEl.textContent = `Mauvaises réponses : ${mauvaiseReponse}`;
  questionCount++;

  if (questionCount >= maxQuestions) {
    terminerQuiz();
  } else {
    setTimeout(() => {
      lancerQuestion();
      feedbackEl.textContent = "";
    }, 1500);
  }
}

// Fin du quiz et enregistrement
function terminerQuiz() {
  const user = firebase.auth().currentUser;
  questionEl.textContent = "🎉 Quiz terminé !";
  answersEl.innerHTML = "";
  feedbackEl.textContent = `Score final : ${bonneReponse} bonnes réponses, ${mauvaiseReponse} mauvaises.`;

  if (!user) return;

  firebase.firestore().collection("result").add({
    uid: user.uid,
    email: user.email,
    table: tableChoisie,
    totalBonnes: bonneReponse,
    totalMauvaises: mauvaiseReponse,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    application: "multiplication"
  }).then(() => {
    console.log("Résultat final enregistré !");
  }).catch(error => {
    console.error("Erreur lors de l'enregistrement du score final :", error);
  });
}

// Initialisation du module
function initMultiplication() {
  tableButtons.forEach(button => {
    button.addEventListener("click", () => {
      tableChoisie = parseInt(button.dataset.table);
      bonneReponse = 0;
      mauvaiseReponse = 0;
      questionCount = 0;
      lancerQuestion();
      quizContainer.classList.remove("hidden");
      feedbackEl.textContent = "";
    });
  });
}

// Démarrage automatique
document.addEventListener("DOMContentLoaded", initMultiplication);
