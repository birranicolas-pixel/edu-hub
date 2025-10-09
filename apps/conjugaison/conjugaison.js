import { auth, db, safeGet, parler } from '../../core.js';

// 📚 Verbes par groupe
const verbes = {
  1: ["aimer", "jouer", "marcher", "parler"],
  2: ["finir", "choisir", "grandir", "réussir"],
  3: ["prendre", "voir", "faire", "venir"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
let score = 0;

// 🔁 Mélange un tableau
function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// 🔤 Conjugue un verbe selon le pronom et le temps
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

// ▶️ Lance une question
function startQuiz() {
  const temps = safeGet("temps")?.value;
  const groupe = parseInt(safeGet("groupe")?.value);
  const groupeVerbes = verbes[groupe];

  if (!temps || !groupeVerbes) {
    alert("⛔ Sélectionne un temps et un groupe valide.");
    return;
  }

  const verbe = shuffle(groupeVerbes)[0];
  const pronom = shuffle(pronoms)[0];
  const bonne = conjugue(verbe, pronom, temps);

  safeGet("quiz-zone").style.display = "block";
  safeGet("question").textContent = `Conjugue "${verbe}" avec "${pronom}" au ${temps}`;

  const propositions = new Set([bonne]);
  let essais = 0;
  while (propositions.size < 4 && essais < 10) {
    const fauxTemps = shuffle(["présent", "passé", "futur"])[0];
    const faux = conjugue(verbe, pronom, fauxTemps);
    if (!propositions.has(faux)) propositions.add(faux);
    essais++;
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

// ✅ Vérifie la réponse
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

// 💾 Enregistre les résultats
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
    msg.classList.add("save-message");
    setTimeout(() => msg.classList.remove("save-message"), 1000);
    parler("Bravo ! Tes résultats ont été enregistrés avec succès.");

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

// 🚀 Initialise l'app
export function initConjugaison() {
  score = 0;
  const startBtn = safeGet("start-btn");
  const nextBtn = safeGet("next-btn");
  const saveBtn = safeGet("save-results-btn");

  if (!startBtn || !nextBtn || !saveBtn) {
    console.warn("⛔ Éléments manquants dans le DOM. initConjugaison annulé.");
    return;
  }

  safeGet("score-count").textContent = "0";
  startBtn.addEventListener("click", () => {
    if (!tempsChoisi || !groupeChoisi) {
      alert("⛔ Sélectionne un temps et un groupe.");
      return;
    }
    startQuiz(tempsChoisi, groupeChoisi);
  });

  nextBtn.addEventListener("click", () => {
    startQuiz(tempsChoisi, groupeChoisi);
  });

  saveBtn.addEventListener("click", enregistrerScore);
  setupConjugaisonSelectors(); // si tu utilises des boutons pour temps/groupe
}

