/* ============================================================
   LA SALUTE A TAVOLA E IN PALESTRA — script.js
   Struttura: DOMContentLoaded
     ├── Navbar hamburger
     ├── Navbar scroll scura
     ├── Navbar link attivo (IntersectionObserver)
     ├── Navbar scroll personalizzato
     ├── Barre sport
     ├── Reveal on scroll
     └── Form contatti
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     NAVBAR — hamburger
     ===================================================== */
  const burger   = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      const isOpen = burger.classList.contains('open');
      burger.setAttribute('aria-expanded', isOpen);
      burger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu di navigazione');
    });

    // Chiudi menu al click su un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        burger.setAttribute('aria-label', 'Apri menu di navigazione');
      });
    });
  }


  /* =====================================================
     NAVBAR — scura allo scroll
     ===================================================== */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }


  /* =====================================================
     NAVBAR — link attivo per sezione visibile
     ===================================================== */
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => navObserver.observe(s));
  }


  /* =====================================================
     NAVBAR — scroll personalizzato per i link
     ===================================================== */
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 0;
      const startY    = window.pageYOffset;
      const targetY   = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;
      const duration  = 900;
      const startTime = performance.now();

      function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }

      function animate(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + (targetY - startY) * easeInOutQuad(progress));
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    });
  });


  /* =====================================================
     BARRE SPORT — animazione riempimento
     ===================================================== */
  const sportCards = document.querySelectorAll('.sport-card');

  if (sportCards.length > 0) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.sport-bar-fill').forEach(bar => {
            bar.classList.add('animated');
          });
          barObserver.unobserve(entry.target); // anima una volta sola
        }
      });
    }, { threshold: 0.3 });

    sportCards.forEach(card => barObserver.observe(card));
  }


  /* =====================================================
     REVEAL ON SCROLL
     ===================================================== */
  const reveals = document.querySelectorAll('.reveal, .reveal-right, .reveal-left');

  if (reveals.length > 0) {
    if (!('IntersectionObserver' in window)) {
      // Fallback: mostra tutto subito se il browser non supporta IO
      reveals.forEach(el => el.classList.add('reveal-visible'));
    } else {
      const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold:   0.12,
        rootMargin: '0px 0px -10% 0px'
      });

      reveals.forEach(el => revealObserver.observe(el));
    }
  }


  /* =====================================================
     FORM CONTATTI — Formspree
     ===================================================== */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn      = document.getElementById('btn-contact-text');
      const feedback = document.getElementById('contact-feedback');
      const name     = document.getElementById('contact-name').value.trim();
      const email    = document.getElementById('contact-email').value.trim();
      const message  = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) return;

      if (btn) btn.textContent = '⏳ Invio in corso...';

      try {
        const res = await fetch('https://formspree.io/f/mkoqqqrj', {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(contactForm)
        });

        if (res.ok) {
          if (feedback) {
            feedback.textContent = '✅ Messaggio inviato! Ti risponderemo il prima possibile.';
            feedback.className   = 'contact-feedback success';
          }
          contactForm.reset();
        } else {
          throw new Error('Errore server');
        }
      } catch {
        if (feedback) {
          feedback.textContent = '❌ Invio fallito. Scrivici a serviziocivilenicotera2025@outlook.com';
          feedback.className   = 'contact-feedback error';
        }
      } finally {
        if (btn) btn.textContent = '📨 Invia messaggio';
        setTimeout(() => {
          if (feedback) {
            feedback.textContent = '';
            feedback.className   = 'contact-feedback';
          }
        }, 6000);
      }
    });
  }

}); // fine DOMContentLoaded
