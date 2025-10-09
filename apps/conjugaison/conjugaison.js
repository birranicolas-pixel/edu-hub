import { auth, db, safeGet, parler } from '../../core.js';

const verbes = {
  1: ["aimer", "jouer", "marcher", "parler"],
  2: ["finir", "choisir", "grandir", "réussir"],
  3: ["prendre", "voir", "faire", "venir"]
};

const pronoms = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
let score = 0;
let tempsChoisi = null;
let groupeChoisi = null;

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
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

  const elision = pronom === "je" && /^[aeiouh]/i.test(verbe) ? "j’" : pronom + " ";

  if (temps === "présent") {
    const radical = verbe.slice(0, -2);
    return elision + radical + terminaisons.présent[groupe][index];
  }

  if (temps === "futur") {
    return elision + verbe + terminaisons.futur.all[index];
  }

  if (temps === "passé") {
    const participe = verbe.slice(0, -2) + (groupe === 1 ? "é" : groupe === 2 ? "i" : "u");
    return `${terminaisons.passé.auxiliaire[pronom]} ${participe}`;
  }

  return `${pronom} ${verbe}-${temps}`;
}

function startQuiz() {
  const verbe = shuffle(verbes[groupeChoisi])[0];
  const pronom = shuffle(pronoms)[0];
  const bonne = conjugue(verbe, pronom, tempsChoisi);

  safeGet("question").textContent = `Conjugue "${verbe}" avec "${pronom}" au ${tempsChoisi}`;
  parler(`Conjugue ${verbe} avec ${pronom} au ${tempsChoisi}`);

  const propositions = [bonne];
  while (propositions.length < 4) {
    const fauxTemps = shuffle(["présent", "passé", "futur"])[0];
    const faux = conjugue(verbe, pronom, fauxTemps);
    if (!propositions.includes(faux)) propositions.push(faux);
  }

  const answers = safeGet("answers");
  answers.innerHTML = "";
  shuffle(propositions).forEach(rep => {
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
  if (rep === bonne) {
    feedback.textContent = "✅ Bravo !";
    score++;
    safeGet("score-count").textContent = score;
  } else {
    feedback.textContent = `❌ Mauvaise réponse. La bonne était : ${bonne}`;
  }
  safeGet("next-btn").style.display = "inline-block";
}

function enregistrerScore() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("result").add({
    uid: user.uid,
    email: user.email,
    application: "conjugaison",
    totalBonnes: score,
    totalMauvaises: 0,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    safeGet("save-message").textContent = "✅ Score enregistré.";
    parler("Bravo ! Tes résultats ont été enregistrés.");
    score = 0;
    safeGet("score-count").textContent = "0";
  });
}

function setupSelectors() {
  document.querySelectorAll(".temps-btn").forEach(btn => {
    btn.onclick = () => {
      tempsChoisi = btn.dataset.temps;
      document.querySelectorAll(".temps-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
  });

  document.querySelectorAll(".groupe-btn").forEach(btn => {
    btn.onclick = () => {
      groupeChoisi = parseInt(btn.dataset.groupe);
      document.querySelectorAll(".groupe-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
  });
}

export function initConjugaison() {
  score = 0;
  safeGet("score-count").textContent = "0";
  safeGet("feedback").textContent = "";
  safeGet("answers").innerHTML = "";
  safeGet("question").textContent = "";
  safeGet("save-message").textContent = "";

  setupSelectors();

  safeGet("start-btn").onclick = () => {
    if (!tempsChoisi || !groupeChoisi) {
      alert("⛔ Sélectionne un temps et un groupe.");
      return;
    }
    startQuiz();
  };

  safeGet("next-btn").onclick = startQuiz;
  safeGet("save-results-btn").onclick = enregistrerScore;
}
