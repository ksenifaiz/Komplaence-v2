// Smooth scroll for anchor links (with reduced-motion respect)
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const el = document.querySelector(id);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", id);
  });
})();

// Mobile menu toggle (with overlay + scroll lock)
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".nav-overlay");
  if (!toggle || !menu || !overlay) return;

  const sr = toggle.querySelector(".sr-only");

  const setState = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);

    overlay.hidden = !open;

    if (sr) sr.textContent = open ? "Закрыть меню" : "Открыть меню";
  };

  const closeMenu = () => setState(false);
  const openMenu = () => setState(true);

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  menu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) closeMenu();
  });

  // Close on overlay click
  overlay.addEventListener("click", closeMenu);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close if viewport becomes desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  });
})();

// Footer year
(function () {
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());
})();

const heroPhoto = document.querySelector('.hero-photo');

if (heroPhoto) {
  let rafId = null;

  const resetTransform = () => {
    heroPhoto.style.transform =
      'perspective(1100px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0) scale(1)';
  };

  heroPhoto.addEventListener('mousemove', (e) => {
    const rect = heroPhoto.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;

    const rotateY = px * 10;
    const rotateX = py * -8;
    const moveX = px * 8;
    const moveY = py * 8;

    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      heroPhoto.style.transform =
        `perspective(1100px) rotateX(${ rotateX }deg) rotateY(${ rotateY }deg) translate3d(${ moveX }px, ${ moveY }px, 0) scale(1.02)`;
    });
  });

  heroPhoto.addEventListener('mouseleave', () => {
    if (rafId) cancelAnimationFrame(rafId);
    resetTransform();
  });

  heroPhoto.addEventListener('touchstart', () => {
    resetTransform();
  }, { passive: true });

  resetTransform();
}