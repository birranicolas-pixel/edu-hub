const quizData = {
  geographie: [
    { question: "Quel est le plus grand océan du monde ?", options: ["Atlantique", "Pacifique", "Indien"], answer: "Pacifique" },
    { question: "Dans quel pays se trouve la Tour Eiffel ?", options: ["Italie", "France", "Espagne"], answer: "France" },
    { question: "Quelle est la capitale du Canada ?", options: ["Toronto", "Ottawa", "Vancouver"], answer: "Ottawa" },
    { question: "Quel pays a une feuille d’érable sur son drapeau ?", options: ["Canada", "Brésil", "Japon"], answer: "Canada" },
    { question: "Quel est le plus petit continent ?", options: ["Europe", "Océanie", "Antarctique"], answer: "Océanie" },
    { question: "Quel est le désert le plus chaud du monde ?", options: ["Sahara", "Gobi", "Kalahari"], answer: "Sahara" },
    { question: "Quel pays est célèbre pour ses pyramides ?", options: ["Grèce", "Égypte", "Mexique"], answer: "Égypte" },
    { question: "Quel est le fleuve qui traverse Paris ?", options: ["Seine", "Loire", "Rhône"], answer: "Seine" },
    { question: "Quel est le plus haut sommet du monde ?", options: ["Mont Blanc", "Everest", "Kilimandjaro"], answer: "Everest" },
    { question: "Quel pays est en forme de botte ?", options: ["Italie", "Espagne", "Grèce"], answer: "Italie" },
    { question: "Quel continent contient le plus de pays ?", options: ["Afrique", "Europe", "Asie"], answer: "Afrique" },
    { question: "Quel est le plus long fleuve du monde ?", options: ["Nil", "Amazon", "Mississippi"], answer: "Amazon" },
    { question: "Quel pays est célèbre pour les kangourous ?", options: ["Australie", "Afrique du Sud", "Inde"], answer: "Australie" }
  ],

  animaux: [
    { question: "Quel animal pond des œufs ?", options: ["Chat", "Poule", "Chien"], answer: "Poule" },
    { question: "Quel animal a une trompe ?", options: ["Éléphant", "Girafe", "Lion"], answer: "Éléphant" },
    { question: "Quel est le plus grand mammifère marin ?", options: ["Requin", "Baleine bleue", "Dauphin"], answer: "Baleine bleue" },
    { question: "Quel animal vit dans la savane ?", options: ["Lion", "Pingouin", "Ours polaire"], answer: "Lion" },
    { question: "Quel animal saute et a une poche ?", options: ["Kangourou", "Koala", "Chien"], answer: "Kangourou" },
    { question: "Quel animal miaule ?", options: ["Chien", "Chat", "Cheval"], answer: "Chat" },
    { question: "Quel animal est le roi de la jungle ?", options: ["Lion", "Tigre", "Panthère"], answer: "Lion" },
    { question: "Quel insecte produit du miel ?", options: ["Mouche", "Abeille", "Papillon"], answer: "Abeille" },
    { question: "Quel animal a des écailles et vit dans l’eau ?", options: ["Poisson", "Chien", "Oiseau"], answer: "Poisson" },
    { question: "Quel animal a une carapace ?", options: ["Tortue", "Serpent", "Lapin"], answer: "Tortue" },
    { question: "Quel animal est le plus rapide au monde ?", options: ["Guépard", "Aigle", "Cheval"], answer: "Guépard" },
    { question: "Quel animal vit dans les arbres et mange des bananes ?", options: ["Singe", "Ours", "Chèvre"], answer: "Singe" },
    { question: "Quel insecte aide les fleurs à pousser ?", options: ["Abeille", "Moustique", "Araignée"], answer: "Abeille" }
  ],

  arts: [
    { question: "De quelle couleur est le ciel quand il fait beau ?", options: ["Bleu", "Vert", "Rouge"], answer: "Bleu" },
    { question: "Quel instrument a des touches noires et blanches ?", options: ["Guitare", "Piano", "Tambour"], answer: "Piano" },
    { question: "Quel outil utilise un peintre ?", options: ["Stylo", "Pinceau", "Ciseaux"], answer: "Pinceau" },
    { question: "Quel art utilise des notes de musique ?", options: ["Peinture", "Danse", "Musique"], answer: "Musique" },
    { question: "Quel instrument a des cordes ?", options: ["Flûte", "Guitare", "Triangle"], answer: "Guitare" },
    { question: "Quel artiste est célèbre pour la Joconde ?", options: ["Picasso", "Van Gogh", "Léonard de Vinci"], answer: "Léonard de Vinci" },
    { question: "Quel art utilise des couleurs et des formes ?", options: ["Peinture", "Théâtre", "Chant"], answer: "Peinture" },
    { question: "Quel instrument fait boum boum ?", options: ["Tambour", "Violon", "Harmonica"], answer: "Tambour" },
    { question: "Quel art utilise des gestes et des mouvements ?", options: ["Danse", "Peinture", "Musique"], answer: "Danse" },
    { question: "Quel instrument se joue en soufflant dedans ?", options: ["Flûte", "Guitare", "Piano"], answer: "Flûte" },
    { question: "Quel artiste est célèbre pour les tournesols ?", options: ["Van Gogh", "Monet", "Picasso"], answer: "Van Gogh" },
    { question: "Quel art utilise des costumes et des scènes ?", options: ["Théâtre", "Peinture", "Chant"], answer: "Théâtre" },
    { question: "Quel instrument est petit et se joue avec les doigts ?", options: ["Triangle", "Harmonica", "Violon"], answer: "Harmonica" }
  ],

  sciences: [
    { question: "Combien de doigts a une main ?", options: ["4", "5", "6"], answer: "5" },
    { question: "Quel organe sert à respirer ?", options: ["Poumons", "Cœur", "Estomac"], answer: "Poumons" },
    { question: "Quel est l’état de l’eau quand elle bout ?", options: ["Liquide", "Solide", "Gazeux"], answer: "Gazeux" },
    { question: "Quel est le plus proche de la Terre ?", options: ["Lune", "Soleil", "Mars"], answer: "Lune" },
    { question: "Quel sens utilise le nez ?", options: ["Vue", "Odorat", "Toucher"], answer: "Odorat" },
    { question: "Quel est l’organe du goût ?", options: ["Langue", "Oreille", "Nez"], answer: "Langue" },
    { question: "Quel liquide coule dans nos veines ?", options: ["Eau", "Sang", "Lait"], answer: "Sang" },
    { question: "Quel est le nom du gaz qu’on respire ?", options: ["Oxygène", "Hydrogène", "Azote"], answer: "Oxygène" },
    { question: "Quel est l’état de l’eau quand elle gèle ?", options: ["Solide", "Liquide", "Gazeux"], answer: "Solide" },
    { question: "Quel organe fait battre le sang ?", options: ["Cœur", "Poumons", "Foie"], answer: "Cœur" },
    { question: "Quel sens utilise les yeux ?", options: ["Vue", "Toucher", "Goût"], answer: "Vue" },
    { question: "Quel est le nom de notre planète ?", options: ["Mars", "Terre", "Jupiter"], answer: "Terre" },
    { question: "Quel est le nom du satellite naturel de la Terre ?", options: ["Lune", "Soleil", "Étoile"], answer: "Lune" }
  ],

  mythes: [
    { question: "Qui vit dans une maison en pain d’épices ?", options: ["Hansel et Gretel", "Le Petit Chaperon Rouge", "Cendrillon"], answer: "Hansel et Gretel" },
    { question: "Quel personnage a une pantoufle de verre ?", options: ["Cendrillon", "Blanche-Neige", "Raiponce"], answer: "Cendrillon" },
    { question: "Qui a une chevelure magique ?", options: ["Raiponce", "Ariel", "Belle"], answer: "Raiponce" },
    { question: "Quel animal parle dans Le Livre de la Jungle ?", options: ["Panthère", "Serpent", "Tous"], answer: "Tous" },
    { question: "Qui vit dans la mer et a une queue de poisson ?", options: ["Sirène", "Fée", "Sorcière"], answer: "Sirène" },
    { question: "Quel géant a un haricot magique ?", options: ["Jack", "Tom Pouce", "Gulliver"], answer: "Jack" },
    { question: "Qui souffle sur les maisons des petits cochons ?", options: ["Le loup", "Le renard", "Le dragon"], answer: "Le loup" },
    { question: "Quel héros vole avec une cape rouge ?", options: ["Superman", "Batman", "Spiderman"], answer: "Superman" }
  ],
  
quotidien : [
    { question: "Quel objet sert à couper du papier ?", options: ["Ciseaux", "Stylo", "Règle"], answer: "Ciseaux" },
    { question: "Quel appareil sert à garder les aliments au frais ?", options: ["Four", "Réfrigérateur", "Grille-pain"], answer: "Réfrigérateur" },
    { question: "Quel jour vient après vendredi ?", options: ["Samedi", "Dimanche", "Jeudi"], answer: "Samedi" },
    { question: "Quel repas mange-t-on le matin ?", options: ["Petit-déjeuner", "Déjeuner", "Dîner"], answer: "Petit-déjeuner" },
    { question: "Quel objet sert à se brosser les dents ?", options: ["Peigne", "Brosse à dents", "Savon"], answer: "Brosse à dents" },
    { question: "Quel vêtement porte-t-on sur les pieds ?", options: ["Chaussures", "Chapeau", "Gants"], answer: "Chaussures" },
    { question: "Quel objet sert à écrire ?", options: ["Stylo", "Cuillère", "Télécommande"], answer: "Stylo" },
    { question: "Quel jour commence la semaine ?", options: ["Lundi", "Dimanche", "Samedi"], answer: "Lundi" }
 ]
};
 

let current = 0;
let score = 0;
let current = 0;
let score = 0;
let questions = [];

function startQuiz() {
  const theme = document.getElementById("themeSelect").value;
  questions = quizData[theme];
  current = 0;
  score = 0;
  document.getElementById("score").textContent = score;
  loadQuestion();
}

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
