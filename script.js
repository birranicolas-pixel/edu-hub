const apps = [
  {
    name: "Tables de multiplication",
    path: "apps/multiplication/index.html",
    icon: "📚"
  }
    {
    name: "Conjugaison",
    path: "apps/conjugaison/index.html",
    icon: "📚"
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
