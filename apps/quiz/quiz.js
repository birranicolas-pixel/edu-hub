const questions = [
  {
    question: "Quelle est la capitale de l’Italie ?",
    options: ["Rome", "Paris", "Madrid"],
    answer: "Rome"
  },
  {
    question: "Quel animal vit dans la savane ?",
    options: ["Lion", "Pingouin", "Ours polaire"],
    answer: "Lion"
  },
  {
    question: "Combien de couleurs primaires existe-t-il ?",
    options: ["2", "3", "4"],
    answer: "3"
  }
];

let current = 0;
let score = 0;

function loadQuestion() {
  if (current >= questions.length) return;

  const q = questions[current];
  if (!q) return;

  document.getElementById("question").textContent = q.question;
  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => validate(opt);
    answersDiv.appendChild(btn);
  });
}


function validate(rep) {
  const correct = questions[current].answer;
  if (rep === correct) {
    score++;
    alert("✅ Bonne réponse !");
  } else {
    alert(`❌ Mauvaise réponse. C'était : ${correct}`);
  }

  document.getElementById("score").textContent = score;
  current++;

  if (current < questions.length) {
    loadQuestion();
  } else {
    document.getElementById("question").textContent = "🎉 Quiz terminé !";
    document.getElementById("answers").innerHTML = "";
  }
}

document.addEventListener("DOMContentLoaded", loadQuestion);
