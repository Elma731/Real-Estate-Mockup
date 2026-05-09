'use strict';

/* ═══════════════════════════════════════════════════════
   PRIME REALTY — main.js
   Custom cursor · Navbar morph · Hero stagger load
   Parallax · Scroll reveal · Section fade-ins
   ═══════════════════════════════════════════════════════ */

// ── Utility: clamp ──────────────────────────────────────
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ── Utility: lerp ──────────────────────────────────────
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ══════════════════════════════════════════════════════
// 1. CUSTOM CURSOR
// ══════════════════════════════════════════════════════
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Hide on touch devices
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Dot follows instantly
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';

    // Ring follows with lerp lag
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Hover state on interactive elements
  const interactives = 'a, button, input, textarea, select, [role="button"]';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    }
  });
})();

// ══════════════════════════════════════════════════════
// 2. NAVBAR MORPH ON SCROLL
// ══════════════════════════════════════════════════════
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ══════════════════════════════════════════════════════
// 3. MOBILE MENU
// ══════════════════════════════════════════════════════
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const menu       = document.getElementById('mobileMenu');
  const closeBtn   = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
})();

// ══════════════════════════════════════════════════════
// 4. HERO STAGGER LOAD
// ══════════════════════════════════════════════════════
(function initHeroLoad() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  // Trigger after a short paint delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hero.classList.add('loaded');
    });
  });
})();

// ══════════════════════════════════════════════════════
// 5. PARALLAX SCROLLING
// ══════════════════════════════════════════════════════
(function initParallax() {
  // Skip on mobile/touch
  if (window.matchMedia('(max-width: 767px)').matches) return;

  const heroPanels = document.querySelectorAll('.hero-panel img');
  const visionImg  = document.querySelector('.vision-image img');
  const wellnessBg = document.querySelector('.wellness-bg img');

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;

    heroPanels.forEach(img => {
      const speed = 0.3;
      img.style.transform = `translateY(${scrollY * speed}px)`;
    });

    if (visionImg) {
      const section = visionImg.closest('.vision');
      if (section) {
        const rect   = section.getBoundingClientRect();
        const offset = -rect.top * 0.2;
        visionImg.style.transform = `translateY(${offset}px)`;
      }
    }

    if (wellnessBg) {
      const section = wellnessBg.closest('.wellness');
      if (section) {
        const rect   = section.getBoundingClientRect();
        const offset = -rect.top * 0.15;
        wellnessBg.style.transform = `translateY(${offset}px) scale(1.1)`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }, { passive: true });
})();

// ══════════════════════════════════════════════════════
// 6. TEXT REVEAL ON SCROLL (Intersection Observer)
// ══════════════════════════════════════════════════════
(function initTextReveal() {
  // Wrap each block-level heading line into a .reveal-line span
  document.querySelectorAll('.vision-content h2, .wellness-content h2, .contact-content h2, .properties-header h2').forEach(heading => {
    const html = heading.innerHTML;
    // Split on <br> tags
    const parts = html.split(/<br\s*\/?>/i);
    heading.innerHTML = parts.map(part =>
      `<span class="reveal-line">${part}</span>`
    ).join('');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.reveal-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 120);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.vision-content h2, .wellness-content h2, .contact-content h2, .properties-header h2').forEach(el => {
    observer.observe(el);
  });
})();

// ══════════════════════════════════════════════════════
// 7. SECTION FADE-IN (Intersection Observer)
// ══════════════════════════════════════════════════════
(function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  // Feature cards
  document.querySelectorAll('.feature-card').forEach(el => observer.observe(el));

  // Property cards
  document.querySelectorAll('.property-card').forEach(el => observer.observe(el));

  // Features side text
  const sideText = document.querySelector('.features-side-text');
  if (sideText) observer.observe(sideText);

  // Quote section
  const quoteSection = document.querySelector('.quote-section');
  if (quoteSection) observer.observe(quoteSection);
})();

// ══════════════════════════════════════════════════════
// 8. HERO SUBTITLE PANELS — subtle entry scale on load
// ══════════════════════════════════════════════════════
// (handled entirely via CSS hero.loaded classes above)

// ══════════════════════════════════════════════════════
// 9. SCROLL TO TOP BUTTON
// ══════════════════════════════════════════════════════
(function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ══════════════════════════════════════════════════════
// 10. CONTACT FORM — basic submit feedback
// ══════════════════════════════════════════════════════
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const original = btn.textContent;
    btn.textContent = 'Enquiry Sent ✓';
    btn.style.background = 'rgba(201, 169, 110, 0.15)';
    btn.style.color = '#C9A96E';
    btn.style.borderColor = '#C9A96E';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      form.reset();
    }, 3500);
  });
})();

// ══════════════════════════════════════════════════════
// 11. SMOOTH ANCHOR SCROLL
// ══════════════════════════════════════════════════════
(function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ══════════════════════════════════════════════════════
// 12. PROPERTY CARD IMAGE SCALE — reinforced via JS
// ══════════════════════════════════════════════════════
// (CSS :hover handles the 1.05 scale — no JS needed)

// ══════════════════════════════════════════════════════
// 13. HERO PANELS — subtle idle scale animation after load
// ══════════════════════════════════════════════════════
(function initHeroPanelScale() {
  const panels = document.querySelectorAll('.hero-panel img');
  if (!panels.length) return;

  setTimeout(() => {
    panels.forEach(img => {
      img.style.transition = 'transform 8s ease';
      img.style.transform  = 'scale(1.03)';
    });
  }, 1200);
})();
