const apps = [
  {
    name: "Tables de multiplication",
    path: "apps/multiplication/index.html",
    icon: "📚"
  },
  {
    name: "Conjugaison",
    path: "apps/conjugaison/index.html",
    icon: "📖"
  },
  {
    name: "Quiz général",
    path: "apps/quiz/index.html",
    icon: "🧠"
  }
];

function generateMenu() {
  const container = document.getElementById("app-links");
  apps.forEach(app => {
    const link = document.createElement("a");
    link.href = app.path;
    link.textContent = `${app.icon} ${app.name}`;
    link.className = "app-link";
    container.appendChild(link);
  });
}

window.onload = generateMenu;

const messages = [
  "Prêt à apprendre en t’amusant ?",
  "On révise les conjugaisons aujourd’hui !",
  "Tu vas devenir un champion des tables !",
  "Bienvenue sur EduHub, petit génie !"
];

document.getElementById("mascotteMessage").textContent =
  messages[Math.floor(Math.random() * messages.length)];

