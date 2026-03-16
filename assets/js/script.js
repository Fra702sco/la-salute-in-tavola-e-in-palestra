 // NAVBAR — hamburger
 const burger   = document.getElementById('nav-burger');
 const navLinks = document.getElementById('nav-links');

 burger.addEventListener('click', function() {
   burger.classList.toggle('open');
   navLinks.classList.toggle('open');
   const isOpen = burger.classList.contains('open');
   burger.setAttribute('aria-expanded', isOpen);
   burger.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu di navigazione');
 });

 navLinks.querySelectorAll('a').forEach(link => {
   link.addEventListener('click', () => {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
   });
 });

 // NAVBAR — scura allo scroll
 window.addEventListener('scroll', () => {
   document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
 });

 // NAVBAR — link attivo per sezione visibile
 const sections = document.querySelectorAll('section[id]');
 const navObserver = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
  if (entry.isIntersecting) {
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const id = entry.target.id;
    const active = document.querySelector('.nav-links a[href="#' + id + '"]');
    if (active) active.classList.add('active');
  }
   });
 }, { threshold: 0.4 });
 sections.forEach(s => navObserver.observe(s));

 // FORM CONTATTI
 function handleContact(e) {
   e.preventDefault();
   const btn   = document.getElementById('btn-contact-text');
   const feedback = document.getElementById('contact-feedback');
   const name  = document.getElementById('contact-name').value;
   const email = document.getElementById('contact-email').value;
   const message  = document.getElementById('contact-message').value;
   const subject  = encodeURIComponent('Messaggio da ' + name + ' - La Salute a Tavola');
   const body  = encodeURIComponent('Nome: ' + name + '\nEmail: ' + email + '\n\nMessaggio:\n' + message);
   const mailto   = 'mailto:serviziocivilenicotera2025@outlook.com?subject=' + subject + '&body=' + body;

   btn.textContent = '⏳ Apertura email...';

   const a = document.createElement('a');
   a.href = mailto;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);

   setTimeout(function() {
  btn.textContent = '📨 Invia messaggio';
  feedback.textContent = '✅ Client email aperto! Se non si apre, scrivi a serviziocivilenicotera2025@outlook.com';
  feedback.className = 'contact-feedback success';
  setTimeout(function() {
    e.target.reset();
    feedback.textContent = '';
    feedback.className = 'contact-feedback';
  }, 6000);
   }, 1500);
 }

 // BARRE SPORT — animazione riempimento
 const barObserver = new IntersectionObserver(function(entries) {
   entries.forEach(function(entry) {
  if (entry.isIntersecting) {
    entry.target.querySelectorAll('.sport-bar-fill').forEach(function(bar) {
   bar.classList.add('animated');
    });
  }
   });
 }, { threshold: 0.3 });

 document.querySelectorAll('.sport-card').forEach(function(card) {
   barObserver.observe(card);
 });

 // REVEAL ON SCROLL
 const revealEls = document.querySelectorAll(
   '.reveal, .reveal-right, .reveal-left'
 );

 if ('IntersectionObserver' in window && revealEls.length > 0) {
   const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
   if (entry.isIntersecting) {
     entry.target.classList.add('reveal-visible');
     revealObserver.unobserve(entry.target);
   }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  }
   );

   revealEls.forEach(el => revealObserver.observe(el));
 } else {
   revealEls.forEach(el => el.classList.add('reveal-visible'));
 }
 // SCROLL PERSONALIZZATO PER I LINK DELLA NAVBAR
 document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
   link.addEventListener('click', function (e) {
  const targetId = this.getAttribute('href').slice(1);
  const targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  e.preventDefault();

  const navbar = document.getElementById('navbar');
  const navHeight = navbar ? navbar.offsetHeight : 0;

  const startY = window.pageYOffset;
  const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 8;

  const duration = 900; // ms: aumenta per scorrere più lento
  const startTime = performance.now();

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuad(progress);
    const newY = startY + (targetY - startY) * eased;

    window.scrollTo(0, newY);

    if (progress < 1) {
   requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
   });
 });
 document.addEventListener('DOMContentLoaded', () => {
   const reveals = document.querySelectorAll(
  '.reveal, .reveal-right, .reveal-left'
   );
   if (!('IntersectionObserver' in window) || reveals.length === 0) {
  reveals.forEach(el => el.classList.add('reveal-visible'));
  return;
   }

   const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
   if (entry.isIntersecting) {
     entry.target.classList.add('reveal-visible');
     observer.unobserve(entry.target);
   }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  }
   );

   reveals.forEach(el => observer.observe(el));
 });
