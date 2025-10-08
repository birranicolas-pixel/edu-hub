import { safeGet, shuffleArray } from '../../utils.js';
import { auth, db } from '../../core.js';

let bonneReponse = 0;
let mauvaiseReponse = 0;
let tableChoisie = null;
let questionCount = 0;
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
  questionEl.textContent = "🎉 Quiz terminé !";
  answersEl.innerHTML = "";
  feedbackEl.textContent = `Score final : ${bonneReponse} bonnes réponses, ${mauvaiseReponse