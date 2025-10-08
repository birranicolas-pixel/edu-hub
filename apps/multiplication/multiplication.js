import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db } from '../../core.js';

let bonneReponse = 0;
let mauvaiseReponse = 0;
let questionCount = 0;
let quizTerminé = false;
const maxQuestions = 10;
let tempsChoisi = null;
let groupeChoisi = null;

const verbes = {
  1: ["aimer", "chanter", "marcher", "jouer"],
  2: ["finir", "choisir", "réussir", "grandir"],
  3: ["prendre", "voir", "venir", "faire"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

function conjugue(verbe, pronom, temps) {
  // Simplification : retourne une forme fictive pour l'exemple
  return `${pronom} ${verbe}-${temps}`;
}

function lancerQuestion(questionEl, answersEl, feedbackEl) {
  const verbe = shuffleArray(verbes[groupeChoisi])[0];
  const pronom = shuffleArray(pronoms)[0];
  const bonne = conjugue(verbe, pronom, tempsChoisi);

  questionEl.textContent = `Conjugue le verbe "${verbe}" au pronom "${pronom}" au temps "${tempsChoisi}"`;

  const propositions = [bonne];
  while (propositions.length < 4) {
    const faux = `${pronom} ${verbe}-${shuffleArray(["passé", "présent", "futur"])[0]}`;
    if (!propositions.includes(faux)) {
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
    feedbackEl.textContent = `❌ Mauvaise réponse. La bonne était : ${bonne}`;
  }

  safeGet("good-count").textContent = bonneReponse;
  safeGet("bad-count").textContent = `Mauvaises réponses : ${mauvaiseReponse}`;
  questionCount++;

  if (questionCount >= maxQuestions) {
    quizTerminé = true;
    terminerQuiz();
  } else {
    setTimeout(() => {
      lancerQuestion(safeGet("question"), safeGet("answers"), safeGet("feedback"));
      feedbackEl.textContent = "";
    }, 1500);
  }
}

function terminerQuiz() {
  const user = auth.currentUser;

  safeGet("quiz")?.classList.add("hidden");
  safeGet("quiz-end")?.classList.remove("hidden");

  const finalScore = safeGet("final-score");
  finalScore.textContent = `🎉 Quiz terminé ! Score : ${bonneReponse} bonnes réponses, ${mauvaiseReponse} mauvaises.`;

  const replayBtn = safeGet("replay-btn");
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

    safeGet("selectors")?.classList.remove("hidden");
  };

  if (user) {
    db.collection("result").add({
      uid: user.uid,
      email: user.email,
      temps: tempsChoisi,
      groupe: groupeChoisi,
      totalBonnes: bonneReponse,
      totalMauvaises: mauvaiseReponse,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      application: "conjugaison"
    }).then(() => {
      console.log("Résultat de conjugaison enregistré !");
    }).catch(error => {
      console.error("Erreur lors de l'enregistrement :", error);
    });
  }
}

export function initConjugaison() {
  const tempsButtons = document.querySelectorAll(".temps-btn");
  const groupeButtons = document.querySelectorAll(".groupe-btn");
  const selectors = safeGet("selectors");
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
  selectors?.classList.remove("hidden");
  feedbackEl.textContent = "";
  safeGet("good-count").textContent = "0";
  safeGet("bad-count").textContent = "Mauvaises réponses : 0";

  tempsButtons.forEach(btn => {
    if (!btn.dataset.listenerAttached) {
      btn.addEventListener("click", () => {
        tempsChoisi = btn.dataset.temps;
        tempsButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
      btn.dataset.listenerAttached = "true";
    }
  });

  groupeButtons.forEach(btn => {
    if (!btn.dataset.listenerAttached) {
      btn.addEventListener("click", () => {
        groupeChoisi = parseInt(btn.dataset.groupe);
        groupeButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        if (tempsChoisi && groupeChoisi) {
          selectors.classList.add("fade-out");
          setTimeout(() => {
            selectors.classList.add("hidden");
            quizContainer?.classList.remove("hidden");
            quizContainer?.classList.add("fade-in");
            lancerQuestion(questionEl, answersEl, feedbackEl);
          }, 500);
        }
      });
      btn.dataset.listenerAttached = "true";
    }
  });
}
