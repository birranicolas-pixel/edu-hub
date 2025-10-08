import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db } from '../../core.js';

let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;
let questionCount = 0;
let quizTerminé = false;
const maxQuestions = 10;

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

  if (questionCount >= maxQuestions) {
    quizTerminé = true;
    terminerQuiz(questionEl, answersEl, feedbackEl);
  } else {
    setTimeout(() => {
      lancerQuestion(questionEl, answersEl, feedbackEl);
      feedbackEl.textContent = "";
    }, 1500);
  }
}

function terminerQuiz(questionEl, answersEl, feedbackEl) {
  const user = auth.currentUser;

  safeGet("quiz")?.classList.add("hidden");
  safeGet("table-selection")?.classList.add("hidden");

  const endScreen = safeGet("quiz-end");
  const finalScore = safeGet("final-score");
  const replayBtn = safeGet("replay-btn");

  if (endScreen && finalScore && replayBtn) {
    finalScore.textContent = `🎉 Quiz terminé ! Score : ${bonneReponse} bonnes réponses, ${mauvaiseReponse} mauvaises.`;
    endScreen.classList.remove("hidden");

    replayBtn.onclick = () => {
      bonneReponse = 0;
      mauvaiseReponse = 0;
      questionCount = 0;
      quizTerminé = false;

      safeGet("quiz-end")?.classList.add("hidden");
      safeGet("quiz")?.classList.add("hidden");
      safeGet("feedback").textContent = "";
      safeGet("good-count").textContent = "0";
      safeGet("bad-count").textContent = "Mauvaises réponses : 0";

      safeGet("table-selection")?.classList.remove("hidden");
    };
  }

  if (!user) return;

  db.collection("result").add({
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
    console.error("Erreur lors de l'enregistrement du score :", error);
  });
}

export function initMultiplication() {
  const tableButtons = document.querySelectorAll(".table-btn");
  const quizContainer = safeGet("quiz");
  const questionEl = safeGet("question");
  const answersEl = safeGet("answers");
  const feedbackEl = safeGet("feedback");
  const endScreen = safeGet("quiz-end");

  bonneReponse = 0;
  mauvaiseReponse = 0;
  questionCount = 0;
  quizTerminé = false;

  if (endScreen) endScreen.classList.add("hidden");
  safeGet("table-selection")?.classList.remove("hidden");
  quizContainer?.classList.add("hidden");

  tableButtons.forEach(button => {
    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", () => {
        tableChoisie = parseInt(button.dataset.table);
        safeGet("table-selection")?.classList.add("hidden");
        lancerQuestion(questionEl, answersEl, feedbackEl);
        quizContainer?.classList.remove("hidden");
        feedbackEl.textContent = "";
      });
      button.dataset.listenerAttached = "true";
    }
  });
}
