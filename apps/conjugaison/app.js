// Initialisation des variables globales
let temps = null;
let groupe = null;
let bonnesReponses = 0;
let mauvaisesReponses = 0;

// Terminaisons régulières par temps et groupe
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

// Liste des pronoms
const pronoms = ["Je", "Tu", "Il/Elle", "Nous", "Vous", "Ils/Elles"];

// Radicaux irréguliers pour le futur
const radicauxIrreguliersFutur = {
  venir: "viendr",
  voir: "verr",
  prendre: "prendr"
};

// Conjugaisons irrégulières au présent
const conjugaisonsIrregulieresPresent = {
  venir: ["viens", "viens", "vient", "venons", "venez", "viennent"],
  voir: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
  prendre: ["prends", "prends", "prend", "prenons", "prenez", "prennent"]
};

// Initialisation Firebase
const db = firebase.firestore();

// Sélection du temps
function setTemps(t) {
  temps = t;
  generateQuestion();
}

// Sélection du groupe
function setGroupe(g) {
  groupe = g;
  generateQuestion();
}

// Génération d'une question
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

  // Debug console
  console.log("Temps:", temps, "Groupe:", groupe);
  console.log("Verbe sélectionné:", verbe);
  console.log("Bonne réponse:", bonneReponse);

  // Affichage de la question
  document.getElementById("question").textContent = `${pronom} (${verbe}) au ${temps}`;
  document.getElementById("reponses").innerHTML = "";
  document.getElementById("feedback").textContent = "";

  // Génération des propositions
  const propositions = generatePropositions(bonneReponse);
  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.className = "answer-btn";
    btn.onclick = () => validate(rep, bonneReponse);
    document.getElementById("reponses").appendChild(btn);
  });
}

// Fusionne radical et terminaison
function fusionRadicalTerminaison(radical, terminaison) {
  if (radical.slice(-1) === terminaison.charAt(0)) {
    return radical + terminaison.slice(1);
  }
  return radical + terminaison;
}

// Sélection aléatoire d'un verbe selon le groupe
function getVerbe(groupe) {
  const verbes = {
    1: ["chanter", "jouer", "marcher"],
    2: ["finir", "grandir", "choisir"],
    3: ["prendre", "venir", "voir"]
  };
  const liste = verbes[groupe];
  if (!liste || liste.length === 0) return "verbe inconnu";
  return liste[Math.floor(Math.random() * liste.length)];
}

// Déduction du radical selon le temps et le groupe
function getRadical(verbe, groupe) {
  if (temps === "futur") {
    if (groupe === 3 && radicauxIrreguliersFutur[verbe]) {
      return radicauxIrreguliersFutur[verbe];
    }
    return verbe.slice(0, -2);
  }
  return verbe.slice(0, -2);
}

// Génère des propositions de réponse
function generatePropositions(correct) {
  const variations = new Set();
  variations.add(correct);

  if (correct.length > 2) {
    variations.add(correct + "x");
    variations.add(correct.slice(0, -1));
    variations.add(correct.replace(/.$/, "z"));
  }

  if (variations.size < 4) {
    variations.add(correct.toUpperCase());
    variations.add([...correct].reverse().join(""));
  }

  const shuffled = Array.from(variations).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

// Validation de la réponse et enregistrement
function validate(rep, correct) {
  const feedback = document.getElementById("feedback");
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

  document.getElementById("score").textContent = bonnesReponses;
  document.getElementById("bad-count").textContent = mauvaisesReponses;

  const user = auth.currentUser;
  if (user && (bonnesReponses + mauvaisesReponses > 0)) {
    db.collection("result").add({
      uid: user.uid,
      email: user.email,
      username: user.displayName || user.email,
      application: "conjugaison",
      totalBonnes: bonnesReponses,
      totalMauvaises: mauvaisesReponses,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(error => {
      console.error("Erreur Firestore :", error);
    });
  }

  setTimeout(() => generateQuestion(), 1000);
}

// Bouton d'enregistrement manuel
document.getElementById("saveSessionBtn").addEventListener("click", () => {
  const user = auth.currentUser;
  if (user && (bonnesReponses + mauvaisesReponses > 0)) {
    db.collection("result").add({
      uid: user.uid,
      email: user.email,
      username: user.displayName || user.email,
      application: "conjugaison",
      totalBonnes: bonnesReponses,
      totalMauvaises: mauvaisesReponses,
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
