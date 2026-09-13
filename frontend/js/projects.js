/* ---- Sticky nav ---- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ---- Mobile nav ---- */
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
}

/* ---- Fade-up reveal ---- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(f => io.observe(f));

/* ---- Filter + Search ---- */
const cards = Array.from(document.querySelectorAll('.project-card'));
const countEl = document.getElementById('countNum');
const noResults = document.getElementById('noResults');

if (countEl) {
  countEl.textContent = cards.length;
}

let activeFilter = 'all';
let searchTerm = '';

function applyFilters() {
  let visible = 0;
  cards.forEach(card => {
    const matchCat = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchSearch = (card.dataset.title || '').toLowerCase().includes(searchTerm);
    const show = matchCat && matchSearch;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  if (countEl) countEl.textContent = visible;
  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    applyFilters();
  });
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    searchTerm = e.target.value.toLowerCase().trim();
    applyFilters();
  });
}

/* ---- 3D card tilt ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---- Back to top ---- */
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Cursor trail ---- */
const canvas = document.getElementById('cursorCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = [];
  let mx = -200, my = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.size = Math.random() * 4 + 1;
      this.alpha = 0.65;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
    }
    update() { this.x += this.vx; this.y += this.vy; this.alpha -= 0.025; this.size *= 0.96; }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `rgba(139,92,246,${this.alpha})`;
      ctx.shadowBlur = 8; ctx.shadowColor = '#8B5CF6';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mx > 0) particles.push(new Particle(mx, my));
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(); particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(loop);
  })();
}
