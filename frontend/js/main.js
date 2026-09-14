/* ==========================================================================
   CERTIFICATE LINKS CONFIGURATION
   ========================================================================== */
const certifications = [
  {
    title: "AWS Academy Data Engineering",
    issuer: "Amazon Web Services",
    year: "2026",
    description: "Cloud-based data engineering pipelines, ETL workflows, and AWS data services.",
    certificateUrl: "https://drive.google.com/file/d/1s86TtCOR05FhcXZk6tiy152xofYJ7iG1/view?usp=sharing"
  },
  {
    title: "Computer Networks & Internet Protocol",
    issuer: "NPTEL — IIT",
    year: "2026",
    description: "Network architecture, TCP/IP, routing protocols, and internet fundamentals.",
    certificateUrl: "https://drive.google.com/file/d/1os-Vtdx4M8HrBN_7vQN6eCx_EFEjqQJ0/view?usp=sharing"
  },
  {
    title: "HTML & CSS Certification",
    issuer: "Pearson",
    year: "2025",
    description: "Front-end markup, responsive design patterns, and CSS architecture.",
    certificateUrl: "https://drive.google.com/file/d/1b5WEgkBsNZToSATvshqxrpVBPe061Kr_/view?usp=sharing"
  },
  {
    title: "JavaScript Certification",
    issuer: "Pearson",
    year: "2025",
    description: "Core JS fundamentals, DOM manipulation, async programming, and ES6+.",
    certificateUrl: "https://drive.google.com/file/d/1LzwVrTJT7D-6QlM-9pmXE36QYZQlVU8c/view?usp=sharing"
  },
  {
    title: "Python Certification",
    issuer: "IBM",
    year: "July 2025",
    description: "Python programming, data analysis, and application development with IBM.",
    certificateUrl: "https://drive.google.com/file/d/1esGNcro7ZA8XKrJfezJESx0P1OGiaQqv/view?usp=sharing"
  },
  {
    title: "Building RAG Agents with LLM",
    issuer: "NVIDIA",
    year: "August 2026",
    description: "Retrieval-Augmented Generation architectures and LLM agent development.",
    certificateUrl: "https://drive.google.com/file/d/14H2NHvBY7VAzmPmbIkb3GQnHPvEitZ-h/view?usp=sharing"
  }
];

function initCertificates() {
  certifications.forEach(cert => {
    const linkEl = document.querySelector(`.btn-cert-link[data-cert-title="${cert.title}"]`);
    if (linkEl) {
      const url = (cert.certificateUrl || '').trim();
      if (url && url !== "PASTE_DRIVE_LINK_HERE" && (url.startsWith("http://") || url.startsWith("https://"))) {
        linkEl.href = url;
      } else {
        linkEl.href = "#";
      }
      linkEl.style.display = "inline-flex";
    }
  });
}

document.addEventListener('click', e => {
  const link = e.target.closest('.btn-cert-link');
  if (link) {
    const certTitle = link.getAttribute('data-cert-title');
    const certObj = certifications.find(c => c.title === certTitle);
    const url = certObj ? (certObj.certificateUrl || '').trim() : '#';
    if (!url || url === 'PASTE_DRIVE_LINK_HERE' || url === '#' || link.getAttribute('href') === '#') {
      e.preventDefault();
    }
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertificates);
} else {
  initCertificates();
}

/* ── Sticky Nav ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── Mobile Nav ── */
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.toggle('open');
  });
}

/* ── Close mobile nav on link click ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks')?.classList.remove('open');
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

/* ── Fade-up reveal ── */
const faders = document.querySelectorAll('.fade-up');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1 });
faders.forEach(f => io.observe(f));

/* ── Animated counters ── */
const counters = document.querySelectorAll('.achieve-num');
const observerAchieve = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(timer);
      }, 20);
      observerAchieve.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => observerAchieve.observe(c));

/* ── Form submit ── */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;

  const nameVal = (document.getElementById('name')?.value || '').trim();
  const emailVal = (document.getElementById('email')?.value || '').trim();
  const messageVal = (document.getElementById('message')?.value || '').trim();
  const websiteVal = (document.getElementById('website')?.value || '').trim();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!nameVal || !emailVal || !emailRegex.test(emailVal) || !messageVal) {
    note.style.display = 'block';
    note.style.color = '#ff6b6b';
    note.textContent = "Please fill in all fields with a valid name, email, and message.";
    return;
  }

  // Configurable API URL for production / local dev
  const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || !window.location.hostname || window.location.protocol === 'file:';
  const apiBaseUrl = window.VITE_API_URL || window.PORTFOLIO_API_URL || (isLocalDev ? 'http://localhost:5000' : '');
  const endpoint = `${apiBaseUrl.replace(/\/+$/, '')}/api/contact`;

  console.log("Contact API URL:", endpoint);
  console.log("Submitting contact form");

  // Set loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
  note.style.display = 'none';
  note.style.color = 'var(--purple-light)';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: nameVal,
        email: emailVal,
        message: messageVal,
        website: websiteVal
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      console.log("Contact API succeeded:", data);
      form.reset();
      note.style.display = 'block';
      note.style.color = 'var(--purple-light)';
      note.textContent = "Message sent successfully! I'll get back to you soon.";
    } else {
      console.error("Contact API failed:", response.status, data);
      note.style.display = 'block';
      note.style.color = '#ff6b6b';
      note.textContent = data.message || "Something went wrong. Please try again.";
    }
  } catch (err) {
    console.error('Contact form error:', err);
    note.style.display = 'block';
    note.style.color = '#ff6b6b';
    note.textContent = "Something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
}

/* ── Scroll hint fade ── */
const scrollHint = document.querySelector('.hero-scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    scrollHint.style.opacity = window.scrollY > 80 ? '0' : '1';
  });
}
