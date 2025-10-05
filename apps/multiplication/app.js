const quizDiv = document.getElementById('quiz');
const questionP = document.getElementById('question');
const feedbackP = document.getElementById('feedback');
const scoreDiv = document.getElementById('score');
const goodCountSpan = document.getElementById('good-count');
const badCountSpan = document.getElementById('bad-count');
const tableButtonsDiv = document.getElementById('table-buttons');
const answersDiv = document.getElementById('answers');

let table = 2;
let score = 0;
let badScore = 0;
let total = 0;
let currentA = 0;
let currentB = 0;
let selectedTableBtn = null;

// 🔥 Initialisation Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// 🔢 Génère un entier aléatoire
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 🧮 Nouvelle question
function newQuestion() {
  currentA = table;
  currentB = getRandomInt(1, 10);
  questionP.textContent = `Combien font ${currentA} × ${currentB} ?`;
  feedbackP.textContent = '';

  let results = [];
  for (let i = 1; i <= 10; i++) {
    results.push(currentA * i);
  }

  // Mélange les réponses
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  answersDiv.innerHTML = '';
  results.forEach(result => {
    const btn = document.createElement('button');
    btn.textContent = result;
    btn.className = 'answer-btn';
    btn.onclick = () => validateAnswer(result);
    answersDiv.appendChild(btn);
  });
}

// ✅ Valide la réponse
function validateAnswer(selectedResult) {
  total++;
  if (selectedResult === currentA * currentB) {
    feedbackP.textContent = "Bravo ! 👍";
    feedbackP.style.color = "#059669";
    score++;
  } else {
    feedbackP.textContent = `Oups ! La bonne réponse était ${currentA * currentB}.`;
    feedbackP.style.color = "#be185d";
    badScore++;
  }
  updateScoreDisplay();
  setTimeout(() => {
    if (total < 10) {
      newQuestion();
    } else {
      showScore();
    }
  }, 1000);
}

// 🔄 Met à jour l'affichage du score
function updateScoreDisplay() {
  goodCountSpan.textContent = score;
  badCountSpan.textContent = `Mauvaises réponses : ${badScore}`;
}

// 📝 Enregistre le score dans Firestore
function showScore() {
  quizDiv.classList.add('hidden');
  updateScoreDisplay();

  const user = auth.currentUser;
  if (user) {
    const resultData = {
      userId: user.uid,
      email: user.email,
      app: "multiplication",
      table: table,
      correct: score,
      incorrect: badScore,
      total: total,
      timestamp: firebase.firestore.Timestamp.now()
    };

    console.log("📤 Envoi des données :", resultData);

    db.collection("results").add(resultData)
      .then(() => {
        console.log("✅ Résultat enregistré dans Firestore !");
        feedbackP.textContent = "Session terminée ! Ton score a été enregistré.";
        feedbackP.style.color = "#2563eb";
      })
      .catch(error => {
        console.error("❌ Erreur lors de l'enregistrement :", error);
      });

    // Réinitialisation
    score = 0;
    badScore = 0;
    total = 0;
  } else {
    console.warn("⚠️ Utilisateur non connecté, résultat non enregistré.");
  }
}

// 🎯 Sélection de la table
tableButtonsDiv.querySelectorAll('.table-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    if (selectedTableBtn) selectedTableBtn.classList.remove('selected');
    btn.classList.add('selected');
    selectedTableBtn = btn;
    table = parseInt(btn.getAttribute('data-table'), 10);
    score = 0;
    badScore = 0;
    total = 0;
    updateScoreDisplay();
    quizDiv.classList.remove('hidden');
    feedbackP.textContent = '';
    newQuestion();
  });
});

updateScoreDisplay();

// 👤 Affichage de l'utilisateur connecté
auth.onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById("userBar").style.display = "flex";
    const nom = user.displayName || user.email;
    document.getElementById("userInfo").textContent = `Connecté : ${nom}`;
  } else {
    document.getElementById("userBar").style.display = "none";
    window.location.href = "/index.html";
  }
});

// 🔓 Déconnexion
document.getElementById("logoutBtn").addEventListener("click", function() {
  auth.signOut().then(() => {
    window.location.href = "/index.html";
  });
});