function startQuiz() {
  const operation = document.getElementById("operation").value;
  const difficulty = document.getElementById("difficulty").value;
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";

  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
  const questions = [];

  for (let i = 0; i < 10; i++) {
    const a = Math.floor(Math.random() * max) + 1;
    const b = Math.floor(Math.random() * max) + 1;
    let questionText = "";
    let correctAnswer = 0;

    switch (operation) {
      case "addition":
        questionText = `${a} + ${b}`;
        correctAnswer = a + b;
        break;
      case "soustraction":
        questionText = `${a} - ${b}`;
        correctAnswer = a - b;
        break;
      case "multiplication":
        questionText = `${a} × ${b}`;
        correctAnswer = a * b;
        break;
    }

    questions.push({ questionText, correctAnswer });
  }

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${index + 1}. ${q.questionText} = </label>
      <input type="number" id="answer-${index}" />
    `;
    quizContainer.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Vérifier mes réponses";
  submitBtn.onclick = () => checkAnswers(questions);
  quizContainer.appendChild(submitBtn);
}

function checkAnswers(questions) {
  let score = 0;
  questions.forEach((q, index) => {
    const userAnswer = parseInt(document.getElementById(`answer-${index}`).value);
    if (userAnswer === q.correctAnswer) {
      score++;
    }
  });
  alert(`Tu as ${score}/10 bonnes réponses !`);
}