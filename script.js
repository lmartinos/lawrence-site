// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (remembers choice, falls back safely if storage is blocked)
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Mobile menu
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", false);
  })
);

// Typing effect
const phrases = [
  "Technical Support Specialist",
  "Information Technology Student",
];
const typedEl = document.getElementById("typed");
let p = 0, c = 0, deleting = false;
function type() {
  const word = phrases[p];
  typedEl.textContent = word.slice(0, c);
  if (!deleting && c < word.length) { c++; return setTimeout(type, 80); }
  if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  if (c > 0) { c--; return setTimeout(type, 40); }
  deleting = false; p = (p + 1) % phrases.length;
  setTimeout(type, 300);
}
type();

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

// Highlight active nav link
const sections = document.querySelectorAll("main section[id]");
window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  sections.forEach(s => {
    const link = navLinks.querySelector(`a[href="#${s.id}"]`);
    if (link) link.classList.toggle("active", y >= s.offsetTop && y < s.offsetTop + s.offsetHeight);
  });
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
document.querySelectorAll(".g-item").forEach(btn =>
  btn.addEventListener("click", () => {
    lbImg.src = btn.dataset.full;
    lbImg.alt = btn.querySelector("img").alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  })
);
function closeLb() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

// Contact form: opens the visitor's email app with the message pre-filled
// (no server needed; a static site can't send email by itself)
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) {
    note.textContent = "Please fill in all fields with a valid email.";
    return;
  }
  const subject = encodeURIComponent(`Website message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:martinoslawrence@gmail.com?subject=${subject}&body=${body}`;
  note.textContent = "Opening your email app…";
});
