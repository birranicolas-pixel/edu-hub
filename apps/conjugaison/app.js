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

const conjugaisonsIrregulieresPresent = {
  venir: ["viens", "viens", "vient", "venons", "venez", "viennent"],
  voir: ["vois", "vois", "voit", "voyons", "voyez", "voient"],
  prendre: ["prends", "prends", "prend", "prenons", "prenez", "prennent"]
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
  document.getElementById("feedback").textContent = ""; // Réinitialise le message

  const propositions = generatePropositions(bonneReponse);
  propositions.forEach(rep => {
    const btn = document.createElement("button");
    btn.textContent = rep;
    btn.onclick = () => validate(rep, bonneReponse);
    document.getElementById("reponses").appendChild(btn);
  });
}

function fusionRadicalTerminaison(radical, terminaison) {
  if (radical.slice(-1) === terminaison.charAt(0)) {
    return radical + terminaison.slice(1);
  }
  return radical + terminaison;
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
    return verbe.slice(0, -2);
  }
  return verbe.slice(0, -2);
}

function generatePropositions(correct) {
  const faux = [
    correct + "x",
    correct.slice(0, -1),
    correct.replace(/.$/, "z")
  ];
  return [correct, ...faux].sort(() => Math.random() - 0.5);
}

function validate(rep, correct) {
  const feedback = document.getElementById("feedback");

  if (rep === correct) {
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

  setTimeout(() => generateQuestion(), 1000); // Petite pause avant la prochaine question
}
