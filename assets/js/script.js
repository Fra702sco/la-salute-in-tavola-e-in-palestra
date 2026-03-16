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

  // Domini di email temporanee/usa-e-getta da bloccare.
  // Per aggiornare la lista: controlla periodicamente i nuovi domini su
  // https://github.com/disposable-email-domains/disposable-email-domains
  // e aggiungi qui i più diffusi. La lista non potrà mai essere esaustiva,
  // ma riduce sensibilmente lo spam da email usa-e-getta.
  const TEMP_MAIL_DOMAINS = new Set([
    'mailinator.com','guerrillamail.com','guerrillamailblock.com','guerrillamail.info',
    'guerrillamail.biz','guerrillamail.de','guerrillamail.net','guerrillamail.org',
    'trashmail.com','trashmail.me','trashmail.net','trashmail.at','trashmail.io',
    'trashmail.xyz','tempmail.com','temp-mail.org','temp-mail.io','tempail.com',
    'tempr.email','tempinbox.com','throwam.com','throwam.net','throwaway.email',
    'mailnull.com','mailnesia.com','mailnull.com','maildrop.cc','mailnull.com',
    'yopmail.com','yopmail.fr','cool.fr.nf','jetable.fr.nf','nospam.ze.tc',
    'nomail.xl.cx','mega.zik.dj','speed.1s.fr','courriel.fr.nf','moncourrier.fr.nf',
    'monemail.fr.nf','monmail.fr.nf','sharklasers.com','guerrillamail.info',
    'grr.la','guerrillamailblock.com','spam4.me','dispostable.com',
    'fakeinbox.com','getairmail.com','filzmail.com','discard.email',
    'spamgourmet.com','spamgourmet.net','spamgourmet.org','spamspot.com',
    'spamthis.co.uk','spam.la','antispam.de','binkmail.com','bobmail.info',
    'chammy.info','devnullmail.com','discard.email','discardmail.com',
    'discardmail.de','disposableaddress.com','disposableemailaddresses.com',
    'dodgeit.com','dodgit.com','dumpmail.de','dumpyemail.com','e4ward.com',
    'emailias.com','emailinfive.com','emailsensei.com','emailtemporario.com.br',
    'emailwarden.com','emailx.at.hm','emailxfer.com','emz.net','fakedemail.com',
    'fakeinbox.com','fakemail.fr','filzmail.com','fizmail.com','freemail.ms',
    'fromru.com','fudgerub.com','garliclife.com','getonemail.com','gishpuppy.com',
    'great-host.in','greensloth.com','gsrv.co.uk','guerillamail.biz',
    'h.mintemail.com','hatespam.org','hidemail.de','hochsitze.com',
    'humaility.com','ieatspam.eu','ieatspam.info','ihateyoualot.info',
    'iheartspam.org','imails.info','inoutmail.de','inoutmail.eu',
    'inoutmail.info','inoutmail.net','insorg.org','instant-mail.de',
    'internet-e-mail.de','internet-mail.org','iwi.net','jetable.com',
    'jetable.fr.nf','jetable.net','jetable.org','jnxjn.com','jourrapide.com',
    'jsrsolutions.com','kasmail.com','kaspop.com','killmail.com','killmail.net',
    'koszmail.pl','kurzepost.de','letthemeatspam.com','lhsdv.com','lifebyfood.com',
    'link2mail.net','litedrop.com','lol.ovpn.to','lolfreak.net','lookugly.com',
    'lortemail.dk','lukecarrier.me','m4ilweb.info','mail-filter.com',
    'mail-temporaire.com','mail-temporaire.fr','mail.by','mail.mezimages.net',
    'mail2rss.org','mail333.com','mailbidon.com','mailbiz.biz','mailblocks.com',
    'mailbucket.org','mailcat.biz','mailcatch.com','mailchop.com','mailde.org',
    'maileater.com','mailed.in','mailexpire.com','mailf5.com','mailfall.com',
    'mailfree.ga','mailguard.me','mailhazard.com','mailimate.com',
    'mailin8r.com','mailinater.com','mailismagic.com','mailme.ir','mailme.lv',
    'mailme24.com','mailmetrash.com','mailmoat.com','mailnew.com','mailnull.com',
    'mailorganic.com','mailpick.biz','mailproxsy.com','mailquack.com',
    'mailrock.biz','mailseal.de','mailshell.com','mailsiphon.com',
    'mailslapping.com','mailslite.com','mailsme.net','mailsucker.net',
    'mailtemp.info','mailtome.de','mailtothis.com','mailtrash.net',
    'mailtv.net','mailzilla.com','mailzilla.org','mbx.cc','mega.zik.dj',
    'meinspamschutz.de','meltmail.com','messagebeamer.de','mezimages.net',
    'mintemail.com','misterpinball.de','moncourrier.fr.nf','monemail.fr.nf',
    'monmail.fr.nf','msa.minsmail.com','mt2009.com','mt2014.com','mx0.wwwnew.eu',
    'my10minutemail.com','myalias.pw','mymail-in.net','mymailoasis.com',
    'mynetstore.de','mypacks.net','mypartyclip.de','myphantomemail.com',
    'mysamp.de','mytempemail.com','mytrashmail.com','nabuma.com',
    'neomailbox.com','nepwk.com','nervmich.net','nervtmich.net','netmails.com',
    'netmails.net','neverbox.com','nice-4u.com','nincsmail.hu','nnh.com',
    'no-spam.ws','nobulk.com','noclickemail.com','nogmailspam.info','nomorespamemails.com',
    'nonspam.eu','nonspammer.de','noref.in','nospamfor.us','nospammail.net',
    'nospamthanks.info','notmailinator.com','nowhere.org','nowmymail.com',
    'nwldx.com','objectmail.com','obobbo.com','odnorazovoe.ru','one-time.email',
    'oneoffemail.com','onewaymail.com','online.ms','onqin.com','opayq.com',
    'ordinaryamerican.net','otherinbox.com','owlpic.com','pancakemail.com',
    'paplease.com','pcusers.otherinbox.com','pepbot.com','pfui.re',
    'phone-elkey.com','phreaker.net','plexolan.de','poczta.onet.pl',
    'politikerclub.de','pookmail.com','postonline.me','privacy.net',
    'proxymail.eu','prtnx.com','prtz.eu','public-inbox.org','put2.net',
    'putthisinyourspamdatabase.com','pwrby.com','quickinbox.com','rcpt.at',
    'recode.me','recursor.net','regbypass.com','regbypass.comsafe-mail.net',
    'rejectmail.com','rklips.com','rmqkr.net','royal.net','rppkn.com',
    'rtrtr.com','s0ny.net','safe-mail.net','safetymail.info','safetypost.de',
    'sandelf.de','saynotospams.com','schafmail.de','schrott-email.de',
    'secretemail.de','secure-mail.biz','selfdestructingmail.com','sendspamhere.com',
    'senseless-entertainment.com','sharklasers.com','shieldemail.com',
    'shiftmail.com','shitmail.me','shitware.nl','shmeriously.com',
    'shortmail.net','sibmail.com','sinnlos-mail.de','slapsfromlastnight.com',
    'smellfear.com','snakemail.com','sneakemail.com','snkmail.com',
    'sofimail.com','sogetthis.com','solopilotos.com','soodonims.com',
    'spam.la','spam.su','spam4.me','spamavert.com','spambob.com',
    'spambob.net','spambob.org','spambog.com','spambog.de','spambog.ru',
    'spambox.info','spambox.irishspringrealty.com','spambox.us','spamcannon.com',
    'spamcannon.net','spamcero.com','spamcon.org','spamcorptastic.com',
    'spamcowboy.com','spamcowboy.net','spamcowboy.org','spamday.com',
    'spamex.com','spamfree.eu','spamfree24.de','spamfree24.eu','spamfree24.info',
    'spamfree24.net','spamfree24.org','spamgoes.in','spamgourmet.com',
    'spamgourmet.net','spamgourmet.org','spamherelots.com','spamhereplease.com',
    'spamhole.com','spamify.com','spaminator.de','spamkill.info','spaml.com',
    'spaml.de','spammotel.com','spammy.host','spamoff.de','spamslicer.com',
    'spamspot.com','spamstack.net','spamthis.co.uk','spamthisplease.com',
    'spamtrail.com','spamtroll.net','speed.1s.fr','spikio.com',
    'spoofmail.de','sry.li','stinkefinger.net','stuffmail.de',
    'super-auswahl.de','supergreatmail.com','supermailer.jp','superrito.com',
    'superstachel.de','suremail.info','tafmail.com','tagyourself.com',
    'teewars.org','teleworm.com','teleworm.us','tempalias.com','tempe-mail.com',
    'tempemail.biz','tempemail.com','tempemail.net','tempinbox.co.uk',
    'tempinbox.com','tempmail.eu','tempmailo.com','tempomail.fr',
    'temporaryemail.net','temporaryemail.us','temporaryforwarding.com',
    'temporaryinbox.com','temporarymail.org','tempsky.com','tempthe.net',
    'thanksnospam.info','thecloudindex.com','thenullemail.com','thisisnotmyrealemail.com',
    'throwam.com','throwam.net','throwaway.email','tilien.com','tittbit.in',
    'tizi.com','tm.in.th','tmailinator.com','toiea.com','topranklist.de',
    'tradermail.info','trash-amil.com','trash-mail.at','trash-mail.cf',
    'trash-mail.com','trash-mail.de','trash-mail.ga','trash-mail.gq',
    'trash-mail.io','trash-mail.ml','trash-mail.tk','trash2009.com',
    'trash2010.com','trash2011.com','trashdevil.com','trashdevil.de',
    'trashemail.de','trashimail.com','trashinbox.com','trashmail.at',
    'trashmail.com','trashmail.io','trashmail.me','trashmail.net',
    'trashmail.org','trashmail.xyz','trashmailer.com','trashmailgenerator.de',
    'trashmails.com','trashspam.com','trbvm.com','trillianpro.com',
    'trmailinator.com','trollproject.com','ttmail.pro','tualias.com',
    'turual.com','twinmail.de','tyldd.com','uggsrock.com','umail.net',
    'uroid.com','utiket.us','valemail.net','venompen.com','veryrealemail.com',
    'viditag.com','viewcastmedia.com','viewcastmedia.net','viewcastmedia.org',
    'viralplays.com','vomoto.com','vpn.st','vsimcard.com','vubby.com',
    'walala.org','wasteland.rfc822.org','webemail.me','webm4il.info',
    'wegwerfadresse.de','wegwerfemail.com','wegwerfemail.de','wegwerfemail.net',
    'wegwerfemail.org','wegwerfmail.de','wegwerfmail.net','wegwerfmail.org',
    'wh4f.org','whyspam.me','willhackforfood.biz','willselfdestruct.com',
    'wilemail.com','winemaven.info','wronghead.com','wuzupmail.net',
    'www.e4ward.com','www.mailinator.com','wwwnew.eu','xagloo.com',
    'xemaps.com','xents.com','xmaily.com','xoxy.net','xyzfree.net',
    'yapped.net','yeah.net','yep.it','yogamaven.com','yopmail.com',
    'yopmail.fr','youmail.ga','ypmail.webarnak.fr.eu.org','yuurok.com',
    'z1p.biz','za.com','zehnminuten.de','zehnminutenmail.de','zippymail.info',
    'zoemail.com','zoemail.net','zoemail.org','zomg.info',
    // Domini aggiuntivi comuni
    '10minutemail.com','10minutemail.net','10minutemail.org','10minutemail.de',
    '20minutemail.com','33mail.com','filzmail.de','spamgob.com',
    'mohmal.com','tempr.email','dispostable.com','disposableinbox.com',
    'spamwc.de','einrot.com','einrot.de','spamfighter.com',
    'mailnew.com','mailsac.com','spamex.com','bccto.me',
    'chacuo.net','discard.email','discardmail.com','discardmail.de',
    'fakemailgenerator.com','getairmail.com','getnada.com','guerrillamail.biz',
    'inboxalias.com','mailboxy.fun','mailtemp.net','mvre.org',
    'nada.email','nada.ltd','nice.de','nospam.ze.tc','opmail.de',
    'rcpt.at','spamgob.com','tafmail.com','tempail.com','tempalias.com',
    'tempemail.net','tempinbox.co.uk','temporaryemail.net','trashemail.de',
    'trashmail.at','trashmail.io','trashmail.me','trashmail.xyz',
    'wegwerfadresse.de','wegwerfemail.de','wegwerfemail.net','wegwerfmail.de',
  ]);

  function isEmailValid(email) {
    // Formato base
    const formatOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!formatOk) return { ok: false, msg: '❌ Formato email non valido.' };

    // Domini sospetti (es. @test.com, @example.com, @foo.bar)
    const domain = email.split('@')[1].toLowerCase();
    const FAKE_DOMAINS = new Set(['test.com','example.com','email.com','fake.com','noemail.com','no-email.com','noreply.com']);
    if (FAKE_DOMAINS.has(domain)) return { ok: false, msg: '❌ Email non accettata. Usa un indirizzo reale.' };

    // Email temporanee
    if (TEMP_MAIL_DOMAINS.has(domain)) return { ok: false, msg: '❌ Email temporanea non accettata. Usa il tuo indirizzo reale.' };

    // Pattern evidentemente falsi (es. aaa@aaa.com, 123@123.com)
    const local = email.split('@')[0].toLowerCase();
    if (/^(.)\1{2,}$/.test(local)) return { ok: false, msg: '❌ Email non valida. Inserisci un indirizzo reale.' };

    return { ok: true };
  }

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

      // Validazione email
      const check = isEmailValid(email);
      if (!check.ok) {
        if (feedback) {
          feedback.textContent = check.msg;
          feedback.className   = 'contact-feedback error';
          setTimeout(() => { feedback.textContent = ''; feedback.className = 'contact-feedback'; }, 5000);
        }
        return;
      }

      if (btn) btn.textContent = '⏳ Invio in corso...';

      try {
        // SICUREZZA: L'endpoint Formspree è visibile lato client.
        // Per limitare l'accesso al solo dominio autorizzato, vai su
        // formspree.io → Form settings → Allowed domains e aggiungi
        // "fra702sco.github.io" — questo blocca invii da altri domini.
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
