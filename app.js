/* ═══════════════════════════════════════════════════════════════
   RAJ KATHROTIYA PORTFOLIO — app.js  BAUHAUS EDITION
   Preloader · Cursor · Nav · Counters · Reveals · Skills
   Works Filter · Typewriter · Testimonials · Contact Form
═══════════════════════════════════════════════════════════════ */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, mn, mx) => Math.min(Math.max(v, mn), mx);

/* ═══════ 1. PRELOADER ═══════════════════════════════ */
(function () {
  const pre   = $('#preloader');
  const bar   = $('.pre-bar');
  const pct   = $('#prePct');
  const tiles = $$('.pre-tile');
  if (!pre) return;

  let p = 0;
  const dur = 1600;
  const t0  = performance.now();

  const tick = now => {
    const elapsed = now - t0;
    p = clamp((elapsed / dur) * 100, 0, 100);
    const v = Math.round(p);
    if (bar) bar.style.width = v + '%';
    if (pct) pct.textContent = v + '%';
    if (p < 100) return requestAnimationFrame(tick);

    // Staggered tile exit
    tiles.forEach((t, i) => {
      t.style.transitionDelay = (i * 80) + 'ms';
    });
    pre.classList.add('done');
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      pre.classList.add('gone');
      onReady();
    }, tiles.length * 80 + 600);
  };
  requestAnimationFrame(tick);
})();

/* ═══════ 2. POST-LOAD INIT ══════════════════════════ */
function onReady() {
  initReveals();
  initCounters();
  initSkillBars();
}

/* ═══════ 3. CURSOR ═══════════════════════════════════ */
(function () {
  const dot  = $('#curDot');
  const ring = $('#curRing');
  if (!dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  document.addEventListener('mousedown', () => document.body.classList.add('cc'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cc'));

  /* hover detection */
  const hEl = 'a, button, .proj-card, .svc-card, .wf-btn, .ap-pill, .sgg-cell, .ci-row';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hEl)) document.body.classList.add('ch');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hEl)) document.body.classList.remove('ch');
  });

  const loop = () => {
    rx = lerp(rx, mx, .1);
    ry = lerp(ry, my, .1);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  };
  loop();
})();

/* ═══════ 4. NAV ═════════════════════════════════════ */
(function () {
  const nav    = $('#nav');
  const burger = $('#burger');
  const mob    = $('#mobNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });

  if (burger && mob) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mob.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('.mob-a', mob).forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }
})();

/* ═══════ 5. SCROLL PROGRESS ════════════════════════ */
(function () {
  const bar = $('#scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = clamp(pct, 0, 100) + '%';
  }, { passive: true });
})();

/* ═══════ 6. SMOOTH ANCHOR SCROLL ══════════════════ */
(function () {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });
})();

/* ═══════ 7. SCROLL REVEALS ════════════════════════ */
function initReveals() {
  const els = $$('.rv');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el    = en.target;
      const delay = +(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
}

/* ═══════ 8. COUNTERS ══════════════════════════════ */
function initCounters() {
  const els = $$('.counter, [data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el     = en.target;
      const target = +(el.dataset.count || 0);
      const dur    = 1800;
      const t0     = performance.now();
      const tick   = now => {
        const p = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(e * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: .5 });
  els.forEach(el => io.observe(el));
}

/* ═══════ 9. SKILL BAR FILLS ═══════════════════════ */
function initSkillBars() {
  const fills = $$('.sbi-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el    = en.target;
      const delay = +(el.closest('.skill-bar-item')?.dataset.delay || 0);
      setTimeout(() => { el.style.width = el.dataset.w + '%'; }, delay + 200);
      io.unobserve(el);
    });
  }, { threshold: .3 });
  fills.forEach(el => io.observe(el));
}

/* ═══════ 10. WORKS FILTER ══════════════════════════ */
(function () {
  const btns  = $$('.wf-btn');
  const cards = $$('.proj-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('wf-active'));
      btn.classList.add('wf-active');
      const f = btn.dataset.f;
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.style.transition = 'opacity .35s, transform .35s';
        if (show) {
          c.style.opacity = '0';
          c.style.transform = 'translateY(12px)';
          c.style.display = '';
          requestAnimationFrame(() => requestAnimationFrame(() => {
            c.style.opacity = '1';
            c.style.transform = '';
          }));
        } else {
          c.style.opacity = '0';
          c.style.transform = 'scale(.96)';
          setTimeout(() => { c.style.display = 'none'; }, 360);
        }
      });
    });
  });
})();

/* ═══════ 11. 3D TILT on PROJECT CARDS ═════════════ */
(function () {
  $$('.proj-card').forEach(card => {
    let tid, cx = 0, cy = 0, tx = 0, ty = 0;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 8;
      ty = -((e.clientY - r.top) / r.height - .5) * 8;
    });
    card.addEventListener('mouseenter', () => {
      cancelAnimationFrame(tid);
      const go = () => {
        cx = lerp(cx, tx, .12);
        cy = lerp(cy, ty, .12);
        card.style.transform = `perspective(900px) rotateX(${cy}deg) rotateY(${cx}deg) translateZ(6px)`;
        tid = requestAnimationFrame(go);
      };
      go();
    });
    card.addEventListener('mouseleave', () => {
      tx = 0; ty = 0;
      cancelAnimationFrame(tid);
      const go = () => {
        cx = lerp(cx, 0, .1);
        cy = lerp(cy, 0, .1);
        card.style.transform = `perspective(900px) rotateX(${cy}deg) rotateY(${cx}deg)`;
        if (Math.abs(cx) > .05 || Math.abs(cy) > .05) requestAnimationFrame(go);
        else card.style.transform = '';
      };
      go();
    });
  });
})();

/* ═══════ 12. SERVICE CARD — hover colour  ══════════ */
(function () {
  const svcCards = $$('.svc-card:not(.svc-card-cta)');
  const colors   = [null, '#D02020', '#1040C0', '#F0C020', '#1040C0', '#D02020'];
  svcCards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      // The card already handles color with CSS hover; nothing extra needed
    });
  });
})();

/* ═══════ 13. HERO PANELS — stagger reveal ══════════ */
(function () {
  const cards = $$('.proj-card');
  cards.forEach((c, i) => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(32px)';
    c.style.transition = `opacity .6s ease ${i * .1}s, transform .6s ease ${i * .1}s`;
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.style.opacity = '1';
      en.target.style.transform = '';
      io.unobserve(en.target);
    });
  }, { threshold: .06 });
  cards.forEach(c => io.observe(c));
})();

/* ═══════ 14. ACTIVE NAV HIGHLIGHT ═════════════════ */
(function () {
  const sections = $$('section[id]');
  const links    = $$('.nm-link');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const id = en.target.id;
        links.forEach(l => l.classList.toggle('nm-active', l.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
})();

/* ═══════ 15. MARQUEE PAUSE ═════════════════════════ */
(function () {
  const inner = $('.marquee-inner');
  const band  = $('.marquee-band');
  if (!inner || !band) return;
  band.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
  band.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
})();

/* ═══════ 16. GEOMETRIC SHAPES — subtle parallax ════ */
(function () {
  const items = [
    { el: $('.hbs-circle'),  speed: -.04 },
    { el: $('.hbs-square'),  speed: .05  },
    { el: $('.hbs-triangle'), speed: -.03 },
    { el: $('.ars-circle'),  speed: -.05 },
    { el: $('.footer-giant'), speed: -.03 },
  ].filter(d => d.el);

  let lastY = -1;
  const loop = () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) > .5) {
      lastY = y;
      items.forEach(d => {
        d.el.style.transform = `translateY(${y * d.speed}px)`;
      });
    }
    requestAnimationFrame(loop);
  };
  loop();
})();

/* ═══════ 17. CONTACT FORM VALIDATION ══════════════ */
(function () {
  const form = $('#contactForm');
  const ok   = $('#cfSuccess');
  if (!form) return;

  const validate = (input, wrapper) => {
    const v  = input.value.trim();
    const em = wrapper.querySelector('.cf-error-msg');
    if (!v) {
      if (em) em.textContent = 'Required field';
      wrapper.style.color = '#cc0000';
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      if (em) em.textContent = 'Valid email needed';
      return false;
    }
    if (em) em.textContent = '';
    wrapper.style.color = '';
    return true;
  };

  ['fName', 'fEmail', 'fMsg'].forEach(id => {
    const inp = $('#' + id);
    if (!inp) return;
    const wrap = inp.closest('.cf-field');
    inp.addEventListener('blur', () => validate(inp, wrap));
    inp.addEventListener('input', () => { if (wrap.querySelector('.cf-error-msg')?.textContent) validate(inp, wrap); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const fName    = $('#fName');    const wName    = fName?.closest('.cf-field');
    const fEmail   = $('#fEmail');   const wEmail   = fEmail?.closest('.cf-field');
    const fMsg     = $('#fMsg');     const wMsg     = fMsg?.closest('.cf-field');
    const fPhone   = $('#fPhone');
    const fService = $('#fService');

    const valid = [validate(fName, wName), validate(fEmail, wEmail), validate(fMsg, wMsg)].every(Boolean);
    if (!valid) return;

    const btn = $('#cfSubmit');
    const txt = btn.querySelector('.cf-submit-text');
    btn.disabled = true;
    if (txt) txt.textContent = 'OPENING WHATSAPP…';

    /* ── Build the WhatsApp message ── */
    const name    = fName.value.trim();
    const email   = fEmail.value.trim();
    const phone   = fPhone?.value.trim()   || 'Not provided';
    const service = fService?.value        || 'Not specified';
    const message = fMsg.value.trim();

    const waText =
`*New Portfolio Enquiry* ✦

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Service Needed:* ${service}

*Message:*
${message}

_Sent via rajkathrotiya.com_`;

    const waUrl = `https://wa.me/919726626076?text=${encodeURIComponent(waText)}`;

    /* Show success feedback, then open WhatsApp */
    if (ok) {
      ok.textContent = `✦ Opening WhatsApp — just tap Send, ${name}!`;
    }

    setTimeout(() => {
      window.open(waUrl, '_blank');
      btn.disabled = false;
      if (txt) txt.textContent = 'SEND MESSAGE';
      form.reset();
      setTimeout(() => { if (ok) ok.textContent = ''; }, 8000);
    }, 600);
  });
})();

/* ═══════ 18. FOOTER LINKS HOVER STAGGER ═══════════ */
$$('.ftl-col a').forEach((a, i) => {
  a.style.transitionDelay = `${i * 30}ms`;
});

/* ═══════ 19. SKILL CELL HOVER TILT ════════════════ */
(function () {
  $$('.sgg-cell').forEach(cell => {
    cell.addEventListener('mousemove', e => {
      const r  = cell.getBoundingClientRect();
      const tx = ((e.clientX - r.left) / r.width - .5) * 12;
      const ty = -((e.clientY - r.top) / r.height - .5) * 12;
      cell.style.transform = `scale(1.04) perspective(600px) rotateX(${ty}deg) rotateY(${tx}deg)`;
    });
    cell.addEventListener('mouseleave', () => { cell.style.transform = ''; });
  });
})();

/* ═══════ 20. LAZY IMAGES blur-up ══════════════════ */
(function () {
  const imgs = $$('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const img = en.target;
      img.style.filter = 'blur(8px)';
      img.style.transition = 'filter .8s ease';
      const done = () => { img.style.filter = ''; setTimeout(() => img.style.transition = '', 900); };
      if (img.complete) done(); else img.addEventListener('load', done);
      io.unobserve(img);
    });
  }, { rootMargin: '300px' });
  imgs.forEach(i => io.observe(i));
})();

/* ═══════ 21. BAUHAUS GEOMETRIC ANIMATION —————————— */
/* Animate hero panel shapes on load */
(function () {
  const panel = $('.hero-panel');
  if (!panel) return;
  // Add subtle pulse to center square
  const sq = $('.hp-center-sq');
  if (!sq) return;
  let t = 0;
  const tick = () => {
    t += .02;
    const scale = 1 + Math.sin(t) * .04;
    sq.style.transform = `translate(-50%,-50%) scale(${scale})`;
    requestAnimationFrame(tick);
  };
  tick();
})();

/* ═══════ 22. CONSOLE BRAND ════════════════════════ */
console.log(
  `%c▲ ■ ●\n%cRAJ KATHROTIYA\n%cSenior Graphic Designer\nCorelDRAW · Photoshop · Print Expert\n📧 raj2932005@gmail.com\n📞 +91 9726626076`,
  'color:#F0C020;font-size:28px;font-weight:900',
  'color:#D02020;font-size:16px;font-weight:900;letter-spacing:4px',
  'color:#1040C0;font-size:12px;font-family:monospace;line-height:2'
);
