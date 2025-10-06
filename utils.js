// 🔐 Accès DOM sécurisé
export function safeGet(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`⚠️ Élément introuvable : #${id}`);
  return el;
}

// 🔍 Sélecteur CSS sécurisé
export function safeQuery(selector) {
  const el = document.querySelector(selector);
  if (!el) console.warn(`⚠️ Sélecteur introuvable : ${selector}`);
  return el;
}

// 🔀 Mélange aléatoire d’un tableau
export function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

// 📊 Formatage d’un pourcentage
export function formatPourcentage(bonnes, mauvaises) {
  const total = bonnes + mauvaises;
  return total > 0 ? Math.round((bonnes / total) * 100) : 0;
}

// 🧪 Générateur de variantes (ex. pour quiz)
export function generateVariations(correct) {
  const variations = new Set();
  const lower = correct.toLowerCase();
  variations.add(lower);

  if (correct.length > 2) {
    variations.add((correct + "x").toLowerCase());
    variations.add(correct.slice(0, -1).toLowerCase());
    variations.add(correct.replace(/.$/, "z").toLowerCase());
  }

  if (variations.size < 4) {
    variations.add(correct.toUpperCase().toLowerCase());
    variations.add([...correct].reverse().join("").toLowerCase());
  }

  return shuffleArray(Array.from(variations)).slice(0, 4).map(rep =>
    rep === lower ? correct : rep
  );
}
