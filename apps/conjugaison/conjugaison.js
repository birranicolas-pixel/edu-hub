// Initialisation Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Variables de session
let temps = null;
let groupe = null;
let bonnesReponses = 0;
let mauvaisesReponses = 0;
let validationEnCours = false;
const sessionId = Date.now().toString();

// Terminaisons régulières
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

// Pronoms
const pronoms = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

// Irréguliers
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

// Fonctions principales
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

  const verbe = getVerbe(groupe);
  if (!verbe || typeof verbe !== "string") {
    document.getElementById("question").textContent = "⚠️ Verbe non défini.";
    return;
  }

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

  document.getElementById("question").textContent = `${pronom} (${verbe}) au ${temps}`;
  document.getElementById("reponses").innerHTML = "";
  document.getElementById("feedback").textContent = "";

  const propositions = generatePropositions(bonneReponse);
  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.className = "answer-btn";
    btn.onclick = () => validate(rep, bonneReponse);
    document.getElementById("reponses").appendChild(btn);
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

function generatePropositions(correct) {
  const variations = new Set();
  const lowerCorrect = correct.toLowerCase();
  variations.add(lowerCorrect);

  if (correct.length > 2) {
    variations.add((correct + "x").toLowerCase());
    variations.add(correct.slice(0, -1).toLowerCase());
    variations.add(correct.replace(/.$/, "z").toLowerCase());
  }

  if (variations.size < 4) {
    variations.add(correct.toUpperCase().toLowerCase());
    variations.add([...correct].reverse().join("").toLowerCase());
  }

  const shuffled = Array.from(variations).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4).map(rep => (rep === lowerCorrect ? correct : rep));
}

function validate(rep, correct) {
  if (validationEnCours) return;
  validationEnCours = true;

  const feedback = document.getElementById("feedback");
  if (!feedback) return;

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

  const scoreEl = document.getElementById("score");
  const badCountEl = document.getElementById("bad-count");
  if (scoreEl) scoreEl.textContent = bonnesReponses;
  if (badCountEl) badCountEl.textContent = mauvaisesReponses;

  setTimeout(() => {
    validationEnCours = false;
    generateQuestion();
  }, 1000);
}

// Initialisation des événements
function initConjugaison() {
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

  const saveBtn = document.getElementById("saveSessionBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const user = auth.currentUser;
      if (user && (bonnesReponses + mauvaisesReponses > 0)) {
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
      } else {
        alert("⚠️ Aucun score à enregistrer.");
      }
    });
  }
}

// Lancement automatique
document.addEventListener("DOMContentLoaded", initConjugaison);
