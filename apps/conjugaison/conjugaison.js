import { auth, db } from '../../core.js';

const verbes = {
  1: ["aimer", "jouer", "marcher", "parler"],
  2: ["finir", "choisir", "grandir", "réussir"],
  3: ["prendre", "voir", "faire", "venir"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
let score = 0;

function get(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`⚠️ Élément introuvable : #${id}`);
  return el;
}

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
  const temps = get("temps")?.value;
  const groupe = parseInt(get("groupe")?.value);
  const groupeVerbes = verbes[groupe];

  if (!temps || !groupeVerbes) {
    alert("⛔ Sélectionne un temps et un groupe valide.");
    return;
  }

  const verbe = shuffle(groupeVerbes)[0];
  const pronom = shuffle(pronoms)[0];
  const bonne = conjugue(verbe, pronom, temps);

  get("quiz-zone").style.display = "block";
  get("question").textContent = `Conjugue "${verbe}" avec "${pronom}" au ${temps}`;

 const propositions = new Set([bonne]);
const tempsOptions = ["présent", "passé", "futur"];
let essais = 0;

while (propositions.size < 4 && essais < 10) {
  const fauxTemps = shuffle(tempsOptions)[0];
  const faux = conjugue(verbe, pronom, fauxTemps);
  if (!propositions.has(faux)) {
    propositions.add(faux);
  }
  essais++;
}

  const answers = get("answers");
  answers.innerHTML = "";
  shuffle(Array.from(propositions)).forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.onclick = () => checkAnswer(rep, bonne);
    answers.appendChild(btn);
  });

  get("feedback").textContent = "";
  get("next-btn").style.display = "none";
}

function checkAnswer(rep, bonne) {
  const feedback = get("feedback");
  const scoreEl = get("score-count");
  if (rep === bonne) {
    feedback.textContent = "✅ Bravo !";
    score++;
    scoreEl.textContent = score;
  } else {
    feedback.textContent = `❌ Mauvaise réponse. La bonne était : ${bonne}`;
  }
  get("next-btn").style.display = "inline-block";
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
    totalMauvaises: 0, // Si tu veux suivre les mauvaises réponses, ajoute une variable séparée
    temps: new Date().toISOString(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    msg.textContent = "✅ Score enregistré avec succès.";

    // 🔄 Réinitialisation des compteurs
    score = 0;
    safeGet("score-count").textContent = "0";
    safeGet("feedback").textContent = "";
    safeGet("answers").innerHTML = "";
    safeGet("question").textContent = "";
    safeGet("next-btn").style.display = "none";
  }).catch(() => {
    msg.textContent = "❌ Erreur lors de l'enregistrement.";
  });
}


export function initConjugaison() {
  score = 0;
  get("score-count").textContent = "0";

  get("start-btn")?.addEventListener("click", startQuiz);
  get("next-btn")?.addEventListener("click", startQuiz);
  get("save-results-btn")?.addEventListener("click", enregistrerScore);
}
