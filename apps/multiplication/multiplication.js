import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db, parler } from '../../core.js';

// 🔢 Variables globales
let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;
let questionCount = 0;
let quizTerminé = false;

// 🎯 Génère une nouvelle question
function lancerQuestion(questionEl, answersEl, feedbackEl) {
  if (!questionEl || !answersEl || !feedbackEl || !tableChoisie) return;

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

  const goodMessageEl = safeGet("good-message");
  const badMessageEl = safeGet("bad-message");

  if (reponse === bonne) {
    bonneReponse++;
    feedbackEl.textContent = "✅ Bravo !";
    safeGet("good-count").textContent = bonneReponse;
    if (goodMessageEl) goodMessageEl.textContent = "Bonne réponse !";
    if (badMessageEl) badMessageEl.textContent = "";
  } else {
    mauvaiseReponse++;
    feedbackEl.textContent = `❌ Mauvaise réponse. La bonne était ${bonne}.`;
    safeGet("bad-count").textContent = `Mauvaises réponses : ${mauvaiseReponse}`;
    if (badMessageEl) badMessageEl.textContent = `Mauvaise réponse. La bonne était ${bonne}.`;
    if (goodMessageEl) goodMessageEl.textContent = "";
  }

  questionCount++;

  setTimeout(() => {
    lancerQuestion(questionEl, answersEl, feedbackEl);
    feedbackEl.textContent = "";
    if (goodMessageEl) goodMessageEl.textContent = "";
    if (badMessageEl) badMessageEl.textContent = "";
  }, 1500);
}

// 💾 Enregistre les résultats dans Firebase
function enregistrerMultiplication() {
  const user = auth.currentUser;
  const msg = safeGet("save-message");

  if (!user || !msg) return;

  db.collection("result").add({
    uid: user.uid,
    email: user.email,
    table: tableChoisie,
    totalBonnes: bonneReponse,
    totalMauvaises: mauvaiseReponse,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    application: "multiplication"
  }).then(() => {
    msg.textContent = "✅ Résultats enregistrés avec succès.";
    msg.style.display = "block";
    msg.classList.add("save-message");
    setTimeout(() => msg.classList.remove("save-message"), 1000);
    parler("Bravo ! Tes résultats ont été enregistrés avec succès.");

    // 🔄 Réinitialisation
    bonneReponse = 0;
    mauvaiseReponse = 0;
    questionCount = 0;
    safeGet("good-count").textContent = "0";
    safeGet("bad-count").textContent = "Mauvaises réponses : 0";
    safeGet("answers").innerHTML = "";
    safeGet("feedback").textContent = "";
    safeGet("question").textContent = "";
  }).catch(() => {
    msg.textContent = "❌ Erreur lors de l'enregistrement.";
    msg.style.display = "block";
  });
}

// 🚀 Initialise l'application
export function initMultiplication() {
  const tableButtons = document.querySelectorAll(".table-btn");
  const quizContainer = safeGet("quiz");
  const questionEl = safeGet("question");
  const answersEl = safeGet("answers");
  const feedbackEl = safeGet("feedback");
  const tableSelection = safeGet("table-selection");

  // 🔄 Réinitialisation
  bonneReponse = 0;
  mauvaiseReponse = 0;
  questionCount = 0;
  quizTerminé = false;

  safeGet("quiz-end")?.classList.add("hidden");
  quizContainer?.classList.add("hidden");
  feedbackEl.textContent = "";
  safeGet("good-count").textContent = "0";
  safeGet("bad-count").textContent = "Mauvaises réponses : 0";
  safeGet("save-message").style.display = "none";

  tableSelection?.classList.remove("hidden");
  tableSelection?.classList.remove("fade-out");

  const saveBtn = safeGet("save-results-btn");
  if (saveBtn && !saveBtn.dataset.listenerAttached) {
    saveBtn.addEventListener("click", enregistrerMultiplication);
    saveBtn.dataset.listenerAttached = "true";
  }

  tableButtons.forEach(button => {
    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", () => {
        tableChoisie = parseInt(button.dataset.table);

        tableButtons.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");

        tableSelection.classList.add("fade-out");
        setTimeout(() => {
          tableSelection.classList.add("hidden");
          quizContainer?.classList.remove("hidden");
          quizContainer?.classList.add("fade-in");
          lancerQuestion(questionEl, answersEl, feedbackEl);
        }, 500);
      });
      button.dataset.listenerAttached = "true";
    }
  });

  const changeBtn = safeGet("change-table-btn");
  if (changeBtn && !changeBtn.dataset.listenerAttached) {
    changeBtn.addEventListener("click", () => {
      quizContainer?.classList.add("fade-out");
      setTimeout(() => {
        quizContainer?.classList.add("hidden");
        tableSelection?.classList.remove("hidden");
        tableSelection?.classList.remove("fade-out");
        tableSelection?.classList.add("fade-in");

        bonneReponse = 0;
        mauvaiseReponse = 0;
        questionCount = 0;
        quizTerminé = false;

        safeGet("good-count").textContent = "0";
        safeGet("bad-count").textContent = "Mauvaises réponses : 0";
        feedbackEl.textContent = "";
        safeGet("save-message").style.display = "none";
      }, 500);
    });
    changeBtn.dataset.listenerAttached = "true";
  }
}
