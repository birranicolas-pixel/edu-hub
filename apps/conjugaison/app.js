let temps = null;
let groupe = null;

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
  if (groupe === 1) return verbe.slice(0, -2);
  if (groupe === 2) return verbe.slice(0, -2);
  if (groupe === 3) return verbe.slice(0, -2); // simplifié
}

function generatePropositions(correct) {
  const faux = [correct + "x", correct.slice(0, -1), correct.replace(/.$/, "z")];
  return [correct, ...faux].sort(() => Math.random() - 0.5);
}

function validate(rep, correct) {
  if (rep === correct) {
    alert("✅ Bravo !");
  } else {
    alert(`❌ Mauvaise réponse. C'était : ${correct}`);
  }
}