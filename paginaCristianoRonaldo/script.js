/* ===================================
   MENU MÓVIL TOGGLE (Accesible)
   =================================== */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function closeNav() {
  if (navLinks && navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    if (navToggle) {
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    }
  }
}

function toggleNav() {
  if (!navToggle || !navLinks) return;
  const isOpening = !navLinks.classList.contains('active');
  navLinks.classList.toggle('active', isOpening);
  navToggle.classList.toggle('active', isOpening);
  navToggle.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
  navToggle.setAttribute('aria-label', isOpening ? 'Cerrar menú' : 'Abrir menú');
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', toggleNav);

  // Cerrar menú al hacer clic en un enlace y devolver foco al botón
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
      navToggle.focus();
    });
  });

  // Cerrar menú con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Cerrar menú al hacer clic fuera del mismo
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeNav();
    }
  });
}

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ===================================
   NAVEGACIÓN ACTIVA SEGÚN SCROLL
   (Incluye #contacto / footer)
   =================================== */
const sections = document.querySelectorAll('.section, .hero, #contacto');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height && id) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + id) {
          item.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ===================================
   FILTROS DE TRAYECTORIA
   =================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar botón activo
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    const filter = btn.getAttribute('data-filter');

    timelineItems.forEach(item => {
      const category = item.getAttribute('data-category');

      if (filter === 'todos' || category === filter) {
        item.classList.remove('hidden');
        item.style.display = '';
      } else {
        item.classList.add('hidden');
        setTimeout(() => {
          if (item.classList.contains('hidden')) {
            item.style.display = 'none';
          }
        }, 500);
      }
    });
  });
});

/* ===================================
   CONTADOR DE ESTADÍSTICAS ANIMADO
   (Soporte prefers-reduced-motion y limpieza de listener)
   =================================== */
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;

  const statsSection = document.getElementById('estadisticas');
  if (!statsSection) return;

  const rect = statsSection.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
    statsAnimated = true;
    window.removeEventListener('scroll', animateStats);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);

      if (prefersReduced) {
        stat.textContent = target;
        return;
      }

      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        stat.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }
}

window.addEventListener('scroll', animateStats, { passive: true });
animateStats();

/* ===================================
   GALERÍA - MODAL (Accesible con inert)
   =================================== */
const modalOverlay = document.getElementById('modalOverlay');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');
const galleryItems = document.querySelectorAll('.gallery-item');
let lastFocusedElement = null;

// Elementos a aislar cuando el modal esté abierto
const backgroundElements = [
  document.querySelector('header'),
  document.querySelector('nav'),
  document.querySelector('main'),
  document.querySelector('footer')
];

function openModal(item) {
  const src = item.getAttribute('data-src');
  const alt = item.getAttribute('data-alt');
  lastFocusedElement = item;
  modalImg.src = src;
  modalImg.alt = alt;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Aislar contenido exterior para lectores de pantalla
  backgroundElements.forEach(el => {
    if (el) el.setAttribute('inert', '');
  });

  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  modalImg.src = '';
  modalImg.alt = '';

  // Restaurar accesibilidad del contenido de fondo
  backgroundElements.forEach(el => {
    if (el) el.removeAttribute('inert');
  });

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

if (modalOverlay && modalImg && modalClose) {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openModal(item));
  });

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Trampa de foco: mantener el foco dentro del modal
  modalOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modalOverlay.classList.contains('active')) return;

    const focusables = modalOverlay.querySelectorAll(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

/* ===================================
   ANIMACIONES AL SCROLL (Intersection Observer con prefers-reduced-motion)
   =================================== */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fadeElements = document.querySelectorAll(
  '.bio-grid, .stat-card, .timeline-content, .gallery-item, .footer-col'
);

if (!prefersReduced && 'IntersectionObserver' in window) {
  fadeElements.forEach(el => el.classList.add('fade-in'));

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}
