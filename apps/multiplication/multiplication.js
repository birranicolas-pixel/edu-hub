import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db } from '../../core.js';

let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;
let questionCount = 0;
let quizTerminé = false;

// 🎯 Génère une question
function lancerQuestion(questionEl, answersEl, feedbackEl) {
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

  const shuffled = shuffleArray(propositions);
  answersEl.innerHTML = "";

  shuffled.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => verifierReponse(rep, bonne, questionEl, answersEl, feedbackEl));
    answersEl.appendChild(btn);
  });
}

// ✅ Vérifie la réponse
function verifierReponse(reponse, bonne, questionEl, answersEl, feedbackEl) {
  if (quizTerminé) return;

  if (reponse === bonne) {
    bonneReponse++;
    feedbackEl.textContent = "✅ Bravo !";
  } else {
    mauvaiseReponse++;
    feedbackEl.textContent = `❌ Mauvaise réponse. La bonne était ${bonne}.`;
  }

  safeGet("good-count").textContent = bonneReponse;
  safeGet("bad-count").textContent = `Mauvaises réponses : ${mauvaiseReponse}`;
  questionCount++;

  setTimeout(() => {
    lancerQuestion(safeGet("question"), safeGet("answers"), safeGet("feedback"));
    feedbackEl.textContent = "";
  }, 1500);
}

// 📝 Enregistre les résultats manuellement
function enregistrerMultiplication() {
  const user = auth.currentUser;
  const saveMessage = safeGet("save-message");

  if (user) {
    db.collection("result").add({
      uid: user.uid,
      email: user.email,
      table: tableChoisie,
      totalBonnes: bonneReponse,
      totalMauvaises: mauvaiseReponse,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      application: "multiplication"
    }).then(() => {
      saveMessage.textContent = "✅ Résultats enregistrés avec succès.";
      saveMessage.style.display = "block";
      bonneReponse = 0;
      mauvaiseReponse = 0;
      questionCount = 0;
      safeGet("good-count").textContent = "0";
      safeGet("bad-count").textContent = "Mauvaises réponses : 0";
    }).catch(error => {
      saveMessage.textContent = "❌ Erreur lors de l'enregistrement.";
      saveMessage.style.display = "block";
    });
  }
}

// 🚀 Initialisation du module
export function initMultiplication() {
  const tableButtons = document.querySelectorAll(".table-btn");
  const quizContainer = safeGet("quiz");
  const questionEl = safeGet("question");
  const answersEl = safeGet("answers");
  const feedbackEl = safeGet("feedback");

  bonneReponse = 0;
  mauvaiseReponse = 0;
  questionCount = 0;
  quizTerminé = false;

  safeGet("quiz-end")?.classList.add("hidden");
  quizContainer?.classList.add("hidden");
  safeGet("feedback").textContent = "";
  safeGet("good-count").textContent = "0";
  safeGet("bad-count").textContent = "Mauvaises réponses : 0";
  safeGet("save-message").style.display = "none";

  const tableSelection = safeGet("table-selection");
  tableSelection?.classList.remove("hidden");
  tableSelection?.classList.remove("fade-out");

  safeGet("save-results-btn")?.addEventListener("click", enregistrerMultiplication);

  tableButtons.forEach(button => {
    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", () => {
        tableChoisie = parseInt(button.dataset.table);

        tableButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");

        if (tableSelection) {
          tableSelection.classList.add("fade-out");
          setTimeout(() => {
            tableSelection.classList.add("hidden");
            quizContainer?.classList.remove("hidden");
            quizContainer?.classList.add("fade-in");
            lancerQuestion(questionEl, answersEl, feedbackEl);
          }, 500);
        }
      });
      button.dataset.listenerAttached = "true";
    }
  });
}
