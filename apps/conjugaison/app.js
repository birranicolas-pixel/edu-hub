let temps = null;
let groupe = null;
let bonnesReponses = 0;
let mauvaisesReponses = 0;

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

function setTemps(t) {
  temps = t;
  generateQuestion();
}

function setGroupe(g) {
  groupe = g;
  generateQuestion();
}

function generateQuestion() {
  if (!temps || !groupe) return;

  const verbe = getVerbe(groupe);
  const index = Math.floor(Math.random() * pronoms.length);
  const pronom = pronoms[index];
  const terminaison = terminaisons[temps][groupe][index];
  const base = getRadical(verbe, groupe);

  document.getElementById("question").textContent = `${pronom} (${verbe}) au ${temps}`;
  document.getElementById("reponses").innerHTML = "";

  const bonneReponse = base + terminaison;
  const propositions = generatePropositions(bonneReponse);

  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.onclick = () => validate(rep, bonneReponse);
    document.getElementById("reponses").appendChild(btn);
  });
}

function getVerbe(groupe) {
  const verbes = {
    1: ["chanter", "jouer", "marcher"],
    2: ["finir", "grandir", "choisir"],
    3: ["prendre", "venir", "voir"]
  };
  const liste = verbes[groupe];
  return liste[Math.floor(Math.random() * liste.length)];
}

function getRadical(verbe, groupe) {
  if (temps === "futur") {
    if (groupe === 3 && radicauxIrreguliersFutur[verbe]) {
      return radicauxIrreguliersFutur[verbe];
    }
    if (groupe === 1) return verbe; // ex: chanter → chanterai
    if (groupe === 2) return verbe.slice(0, -2); // finir → finirai
    if (groupe === 3) return verbe.slice(0, -2); // fallback
  }

  // Présent et imparfait
  return verbe.slice(0, -2);
}


function generatePropositions(correct) {
  const faux = [correct + "x", correct.slice(0, -1), correct.replace(/.$/, "z")];
  return [correct, ...faux].sort(() => Math.random() - 0.5);
}

function validate(rep, correct) {
  if (rep === correct) {
    bonnesReponses++;
    alert("✅ Bravo !");
  } else {
    mauvaisesReponses++;
    alert(`❌ Mauvaise réponse. C'était : ${correct}`);
  }

  // Mettre à jour l'affichage
  document.getElementById("score").textContent = bonnesReponses;
  document.getElementById("bad-count").textContent = mauvaisesReponses;

  // Générer une nouvelle question
  generateQuestion();
}
