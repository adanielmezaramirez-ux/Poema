const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const views = {
  carta: document.getElementById('carta'),
  poema: document.getElementById('poema'),
};
const bar = document.getElementById('progress');

// Cada vista: primero entra el título y, al terminar, las estrofas/párrafos.
const started = new Set();

function startReveal(name) {
  if (started.has(name)) return;
  started.add(name);
  const items = views[name].querySelectorAll('.stanza');
  if (reduce) { items.forEach((s) => s.classList.add('visible')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach((s) => observer.observe(s));
}

function waitForTitle(name) {
  const title = views[name].querySelector('.head h1');
  if (reduce) return startReveal(name);
  title.addEventListener('animationend', () => setTimeout(() => startReveal(name), 400), { once: true });
  setTimeout(() => startReveal(name), 4000); // respaldo
}

const armed = new Set();
function show(name) {
  if (!views[name]) name = 'carta';
  for (const k in views) views[k].hidden = k !== name;
  scrollTo(0, 0);
  if (!armed.has(name)) { armed.add(name); waitForTitle(name); }
  updateProgress();
}

addEventListener('hashchange', () => show(location.hash.slice(1)));

// Barra de progreso de lectura
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
}
addEventListener('scroll', updateProgress, { passive: true });

// Tema claro/oscuro (recordado)
const root = document.documentElement;
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
} catch (_) {}
document.getElementById('theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'light' ? 'dark' : 'light';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (_) {}
});

show(location.hash.slice(1) || 'carta');
