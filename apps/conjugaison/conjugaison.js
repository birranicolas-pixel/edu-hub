import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db } from '../../core.js';

let bonneReponse = 0;
let mauvaiseReponse = 0;
let questionCount = 0;
let quizTerminé = false;
let tempsChoisi = null;
let groupeChoisi = null;
let reponseEnCours = false;

const verbes = {
  1: ["aimer", "chanter", "marcher", "jouer"],
  2: ["finir", "choisir", "réussir", "grandir"],
  3: ["prendre", "voir", "venir", "faire"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];

function conjugue(verbe, pronom, temps) {
  return `${pronom} ${verbe}-${temps}`; // Forme fictive pour l'exemple
}

function lancerQuestion(questionEl, answersEl, feedbackEl) {
  if (!questionEl || !answersEl || !feedbackEl || !tempsChoisi || !groupeChoisi) {
    console.error("❌ Impossible de lancer la question : éléments manquants");
    return;
  }

  const verbe = shuffleArray(verbes[groupeChoisi])[0];
  const pronom = shuffleArray(pronoms)[0];
  const bonne = conjugue(verbe, pronom, tempsChoisi);

  questionEl.textContent = `Conjugue le verbe "${verbe}" avec "${pronom}" au temps "${tempsChoisi}"`;

  const propositions = [bonne];
  while (propositions.length < 4) {
    const fauxTemps = shuffleArray(["passé", "présent", "futur"])[0];
    const faux = `${pronom} ${verbe}-${fauxTemps}`;
    if (!propositions.includes(faux)) {
      propositions.push(faux);
    }
  }

  const shuffled = shuffleArray(propositions);
  answersEl.innerHTML = "";
  reponseEnCours = false;

  shuffled.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => verifierReponse(rep, bonne, questionEl, answersEl, feedbackEl));
    answersEl.appendChild(btn);
  });
}

function verifierReponse(reponse, bonne, questionEl, answersEl, feedbackEl) {
  if (quizTerminé || reponseEnCours) return;
  reponseEnCours = true;

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

  setTimeout(() => {
    lancerQuestion(safeGet("question"), safeGet("answers"), safeGet("feedback"));
    feedbackEl.textContent = "";
  }, 1500);
}

function enregistrerConjugaison() {
  const user = auth.currentUser;
  const saveMessage = safeGet("save-message");

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

function essayerDeLancerQuiz(selectors, quizContainer, questionEl, answersEl, feedbackEl) {
  if (tempsChoisi && groupeChoisi) {
    console.log("✅ Lancement du quiz...");
    selectors.classList.add("fade-out");
    setTimeout(() => {
      selectors.classList.add("hidden");
      quizContainer?.classList.remove("hidden");
      quizContainer?.classList.add("fade-in");
      lancerQuestion(questionEl, answersEl, feedbackEl);
    }, 500);
  }
}

export function initConjugaison() {
  console.log("✅ initConjugaison appelée");

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
  safeGet("save-message").style.display = "none";

  safeGet("save-results-btn")?.addEventListener("click", enregistrerConjugaison);

  tempsButtons.forEach(btn => {
    if (!btn.dataset.listenerAttached) {
      btn.addEventListener("click", () => {
        tempsChoisi = btn.dataset.temps;
        tempsButtons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        essayerDeLancerQuiz(selectors, quizContainer, questionEl, answersEl, feedbackEl);
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
        essayerDeLancerQuiz(selectors, quizContainer, questionEl, answersEl, feedbackEl);
      });
      btn.dataset.listenerAttached = "true";
    }
  });
}
