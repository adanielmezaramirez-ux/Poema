// 1) Primero entra el título; cuando termina, empiezan las estrofas.
const title = document.querySelector('.head h1');
const stanzas = document.querySelectorAll('.stanza');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

let started = false;
function startStanzas() {
  if (started) return;
  started = true;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  stanzas.forEach((s) => io.observe(s));
}

if (reduce) {
  startStanzas();
} else {
  title.addEventListener('animationend', () => setTimeout(startStanzas, 400), { once: true });
  setTimeout(startStanzas, 4000); // respaldo por si la animación no dispara
}

// 2) Barra de progreso de lectura
const bar = document.getElementById('progress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// 3) Tema claro/oscuro (recordado)
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
