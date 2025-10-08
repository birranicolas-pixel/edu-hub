import { safeGet, generateVariations } from '../../utils.js';
import { auth, db } from '../../core.js';

let temps = null;
let groupe = null;
let bonnesReponses = 0;
let mauvaisesReponses = 0;
let validationEnCours = false;
const sessionId = Date.now().toString();

const terminaisons = {
  présent: {
    1: ["e", "es", "e", "ons", "ez", "ent"],
    2: ["is", "is", "it", "issons", "issez", "issent"],
    3: ["s", "s", "t", "ons", "ez", "ent"]
  },
  futur: {
    1: ["erai", "eras", "era", "erons", "erez", "eront"],
    2: ["irai", "iras", "ira", "irons", "irez", "iront"],
    3: ["rai", "ras", "ra", "rons", "rez", "ront"]
  },
  imparfait: {
    1: ["ais", "ais", "ait", "ions", "iez", "aient"],
    2: ["issais", "issais", "issait", "issions", "issiez", "issaient"],
    3: ["ais", "ais", "ait", "ions", "iez", "aient"]
  }
};

const pronoms = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

const radicauxIrreguliersFutur = {
  venir: "viendr",
  voir: "verr",
  prendre: "prendr"
};

const conjugaisonsIrregulieresPresent = {
  venir: ["viens", "viens", "vient", "venons", "venez", "viennent"],
  voir: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
  prendre: ["prends", "prends", "prend", "prenons", "prenez", "prennent"]
};

function setTemps(t) {
  temps = t;
  if (groupe) generateQuestion();
}

function setGroupe(g) {
  groupe = g;
  if (temps) generateQuestion();
}

function generateQuestion() {
  if (!temps || !groupe) return;

  const questionEl = safeGet("question");
  const reponsesEl = safeGet("reponses");
  const feedbackEl = safeGet("feedback");

  const verbe = getVerbe(groupe);
  const index = Math.floor(Math.random() * pronoms.length);
  const pronom = pronoms[index];
  let bonneReponse;

  if (temps === "présent" && groupe === 3 && conjugaisonsIrregulieresPresent[verbe]) {
    bonneReponse = conjugaisonsIrregulieresPresent[verbe][index];
  } else {
    const terminaison = terminaisons[temps][groupe][index];
    const radical = getRadical(verbe, groupe);
    bonneReponse = fusionRadicalTerminaison(radical, terminaison);
  }

  questionEl.textContent = `${pronom} (${verbe}) au ${temps}`;
  reponsesEl.innerHTML = "";
  feedbackEl.textContent = "";

  const propositions = generateVariations(bonneReponse);
  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.className = "answer-btn";
    btn.onclick = () => validate(rep, bonneReponse);
    reponsesEl.appendChild(btn);
  });
}

function fusionRadicalTerminaison(radical, terminaison) {
  return radical.slice(-1) === terminaison.charAt(0)
    ? radical + terminaison.slice(1)
    : radical + terminaison;
}

function getVerbe(groupe) {
  const verbes = {
    1: ["chanter", "jouer", "marcher"],
    2: ["finir", "grandir", "choisir"],
    3: ["prendre", "venir", "voir"]
  };
  const liste = verbes[groupe];
  return liste?.[Math.floor(Math.random() * liste.length)] || "verbe inconnu";
}

function getRadical(verbe, groupe) {
  if (temps === "futur" && groupe === 3 && radicauxIrreguliersFutur[verbe]) {
    return radicauxIrreguliersFutur[verbe];
  }
  return verbe.slice(0, -2);
}

function validate(rep, correct) {
  if (validationEnCours) return;
  validationEnCours = true;

  const feedback = safeGet("feedback");
  const scoreEl = safeGet("score");
  const badCountEl = safeGet("bad-count");

  const isCorrect = rep === correct;
  if (isCorrect) {
    bonnesReponses++;
    feedback.textContent = "✅ Bravo !";
    feedback.style.color = "green";
  } else {
    mauvaisesReponses++;
    feedback.textContent = `❌ Mauvaise réponse. C'était : ${correct}`;
    feedback.style.color = "red";
  }

  if (scoreEl) scoreEl.textContent = bonnesReponses;
  if (badCountEl) badCountEl.textContent = mauvaisesReponses;

  setTimeout(() => {
    validationEnCours = false;
    generateQuestion();
  }, 1000);
}

function enregistrerSession() {
  const user = auth.currentUser;
  if (!user || (bonnesReponses + mauvaisesReponses === 0)) {
    alert("⚠️ Aucun score à enregistrer.");
    return;
  }

  db.collection("result").add({
    uid: user.uid,
    email: user.email,
    username: user.displayName || user.email,
    application: "conjugaison",
    totalBonnes: bonnesReponses,
    totalMauvaises: mauvaisesReponses,
    sessionId: sessionId,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("✅ Scores enregistrés !");
  }).catch(error => {
    console.error("Erreur Firestore :", error);
  });
}

export function initConjugaison() {
  document.querySelectorAll("[data-temps]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.getAttribute("data-temps");
      setTemps(t);
    });
  });

  document.querySelectorAll("[data-groupe]").forEach(btn => {
    btn.addEventListener("click", () => {
      const g = parseInt(btn.getAttribute("data-groupe"));
      setGroupe(g);
    });
  });

  const saveBtn = safeGet("saveSessionBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", enregistrerSession);
  }
}
