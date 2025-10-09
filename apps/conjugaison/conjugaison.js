import { auth, db, safeGet } from '../../core.js';

const verbes = {
  1: ["aimer", "jouer", "marcher", "parler"],
  2: ["finir", "choisir", "grandir", "réussir"],
  3: ["prendre", "voir", "faire", "venir"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
let score = 0;

function conjugue(verbe, pronom, temps) {
  const terminaisons = {
    présent: {
      1: ["e", "es", "e", "ons", "ez", "ent"],
      2: ["is", "is", "it", "issons", "issez", "issent"],
      3: ["s", "s", "t", "ons", "ez", "ent"]
    },
    futur: {
      all: ["ai", "as", "a", "ons", "ez", "ont"]
    },
    passé: {
      auxiliaire: {
        je: "j’ai", tu: "tu as", "il/elle": "il/elle a",
        nous: "nous avons", vous: "vous avez", "ils/elles": "ils/elles ont"
      }
    }
  };

  const index = pronoms.indexOf(pronom);
  const groupe = verbe.endsWith("er") ? 1 : verbe.endsWith("ir") ? 2 : 3;

  if (temps === "présent") {
    const radical = verbe.slice(0, -2);
    return `${pronom} ${radical}${terminaisons.présent[groupe][index]}`;
  }

  if (temps === "futur") {
    return `${pronom} ${verbe}${terminaisons.futur.all[index]}`;
  }

  if (temps === "passé") {
    const participe = verbe.slice(0, -2) + (groupe === 1 ? "é" : groupe === 2 ? "i" : "u");
    return `${terminaisons.passé.auxiliaire[pronom]} ${participe}`;
  }

  return `${pronom} ${verbe}-${temps}`;
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function startQuiz() {
  const temps = safeGet("temps").value;
  const groupe = parseInt(safeGet("groupe").value);
  const verbe = shuffle(verbes[groupe])[0];
  const pronom = shuffle(pronoms)[0];
  const bonne = conjugue(verbe, pronom, temps);

  safeGet("quiz-zone").style.display = "block";
  safeGet("question").textContent = `Conjugue "${verbe}" avec "${pronom}" au ${temps}`;

  const propositions = new Set([bonne]);
  while (propositions.size < 4) {
    const fauxTemps = shuffle(["présent", "passé", "futur"])[0];
    propositions.add(conjugue(verbe, pronom, fauxTemps));
  }

  const answers = safeGet("answers");
  answers.innerHTML = "";
  shuffle(Array.from(propositions)).forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.onclick = () => checkAnswer(rep, bonne);
    answers.appendChild(btn);
  });

  safeGet("feedback").textContent = "";
  safeGet("next-btn").style.display = "none";
}

function checkAnswer(rep, bonne) {
  const feedback = safeGet("feedback");
  const scoreEl = safeGet("score-count");
  if (rep === bonne) {
    feedback.textContent = "✅ Bravo !";
    score++;
    scoreEl.textContent = score;
  } else {
    feedback.textContent = `❌ Mauvaise réponse. La bonne était : ${bonne}`;
  }
  safeGet("next-btn").style.display = "inline-block";
}

function enregistrerScore() {
  const user = auth.currentUser;
  const msg = safeGet("save-message");

  if (!user) {
    msg.textContent = "❌ Connecte-toi pour enregistrer ton score.";
    return;
  }

  db.collection("result").add({
    uid: user.uid,
    email: user.email,
    application: "conjugaison",
    totalBonnes: score,
    totalMauvaises: 0,
    temps: new Date().toISOString(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    msg.textContent = "✅ Score enregistré avec succès.";
  }).catch(() => {
    msg.textContent = "❌ Erreur lors de l'enregistrement.";
  });
}

export function initConjugaison() {
  score = 0;
  safeGet("score-count").textContent = "0";
  safeGet("start-btn").addEventListener("click", startQuiz);
  safeGet("next-btn").addEventListener("click", startQuiz);
  safeGet("save-results-btn").addEventListener("click", enregistrerScore);
}
