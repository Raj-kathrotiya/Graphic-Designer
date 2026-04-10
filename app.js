/* ══════════════════════════════════════════════════════
   RAJ KATHROTIYA PORTFOLIO — app.js v3.0
   Complete JS: Preloader · Canvas · Cursor · Magnetic
   Parallax · 3DTilt · Counters · Skills · Testimonials
   Filter · Form · Scroll Reveals · Typewriter · Reel
══════════════════════════════════════════════════════ */
'use strict';

const $ = (s,c=document) => c.querySelector(s);
const $$ = (s,c=document) => [...c.querySelectorAll(s)];
const lerp = (a,b,t) => a+(b-a)*t;
const clamp = (v,mn,mx) => Math.min(Math.max(v,mn),mx);

/* ═══════ 1. PRELOADER ═══════════════════════════════ */
(function() {
  const pre   = $('#preloader');
  const bar   = $('.pre-progress-bar');
  const pct   = $('#prePct');
  const tiles = $$('.pre-tile');
  if (!pre) return;

  let p = 0;
  const dur = 1800;
  const t0 = performance.now();

  const ease = v => 1 - Math.pow(1-v, 3);

  const tick = now => {
    const e = now - t0;
    p = clamp((e / dur) * 100, 0, 100);
    const v = Math.round(p);
    if (bar) bar.style.width = v + '%';
    if (pct) pct.textContent = v;
    if (p < 100) return requestAnimationFrame(tick);

    /* Tile reveal out */
    tiles.forEach((t, i) => {
      t.style.transitionDelay = (i * 60) + 'ms';
    });
    pre.classList.add('done');
    setTimeout(() => {
      pre.style.pointerEvents = 'none';
      document.body.classList.remove('is-loading');
      pre.classList.add('gone');
      onReady();
    }, tiles.length * 60 + 700);
  };
  requestAnimationFrame(tick);
})();

/* ═══════ 2. POST-LOAD INIT ══════════════════════════ */
function onReady() {
  initHeroCanvas();
  initContactCanvas();
  initReveals();
  initCounters();
  initSkillBars();
  initSkillOrbs();
}

/* ═══════ 3. CURSOR ═══════════════════════════════════ */
(function() {
  const dot   = $('#curDot');
  const ring  = $('#curRing');
  const label = $('#curLabel');
  if (!dot) return;

  let mx=0,my=0,rx=0,ry=0,lx=0,ly=0;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, {passive:true});
  document.addEventListener('mousedown', () => document.body.classList.add('cc'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cc'));

  /* hover detection */
  const hEl = 'a, button, .mag, .proj-card, .svc-card, .wf, .reel-item, .testi-card';
  const hoverLabels = {
    '.proj-card': 'View',
    '.hbtn-primary': 'Go →',
    '.svc-card': 'Details',
    '.reel-item': 'See It',
  };

  document.addEventListener('mouseover', e => {
    const t = e.target.closest(hEl);
    if (!t) return;
    document.body.classList.add('ch');
    let lb = '';
    for (const [sel, txt] of Object.entries(hoverLabels)) {
      if (e.target.closest(sel)) { lb = txt; break; }
    }
    if (label) label.textContent = lb;
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hEl)) document.body.classList.remove('ch');
  });

  const loop = () => {
    /* dot: instant */
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    /* ring: lagged */
    rx = lerp(rx, mx, .12);
    ry = lerp(ry, my, .12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    /* label: lag more */
    lx = lerp(lx, mx, .08);
    ly = lerp(ly, my, .08);
    if (label) { label.style.left = lx + 'px'; label.style.top = ly + 'px'; }
    requestAnimationFrame(loop);
  };
  loop();
})();

/* ═══════ 4. NAV ═════════════════════════════════════ */
(function() {
  const nav    = $('#nav');
  const burger = $('#burger');
  const mob    = $('#mobNav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', window.scrollY > 60);
  }, {passive:true});

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
(function() {
  const bar = $('#scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = clamp(pct,0,100) + '%';
  }, {passive:true});
})();

/* ═══════ 6. SMOOTH ANCHOR SCROLL ══════════════════ */
(function() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav')) || 72;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior:'smooth' });
    });
  });
})();

/* ═══════ 7. MAGNETIC BUTTONS ═══════════════════════ */
(function() {
  $$('[data-mag]').forEach(el => {
    let tid, ox=0, oy=0;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)*.4;
      const dy=(e.clientY-r.top -r.height/2)*.4;
      cancelAnimationFrame(tid);
      const go=()=>{ox=lerp(ox,dx,.14);oy=lerp(oy,dy,.14);el.style.transform=`translate(${ox}px,${oy}px)`;if(Math.abs(ox-dx)>.1||Math.abs(oy-dy)>.1)tid=requestAnimationFrame(go)};
      tid=requestAnimationFrame(go);
    });
    el.addEventListener('mouseleave',()=>{
      cancelAnimationFrame(tid);
      const go=()=>{ox=lerp(ox,0,.1);oy=lerp(oy,0,.1);el.style.transform=`translate(${ox}px,${oy}px)`;if(Math.abs(ox)>.05||Math.abs(oy)>.05)tid=requestAnimationFrame(go);else el.style.transform='';};
      tid=requestAnimationFrame(go);
    });
  });
})();

/* ═══════ 8. HERO CANVAS — particles ════════════════ */
function initHeroCanvas() {
  const cv = $('#heroCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const resize=()=>{cv.width=window.innerWidth;cv.height=window.innerHeight};
  resize();
  window.addEventListener('resize',resize,{passive:true});

  const N = window.innerWidth < 768 ? 70 : 160;
  const particles = [];
  class P {
    constructor(init=false){
      this.x = Math.random()*cv.width;
      this.y = init ? Math.random()*cv.height : cv.height+10;
      this.vx= (Math.random()-.5)*.5;
      this.vy= -(Math.random()*.7+.2);
      this.a = 0;
      this.ta= Math.random()*.4+.05;
      this.r = Math.random()*1.6+.2;
      this.c = Math.random()>.55 ? [255,69,0] : [212,175,55];
    }
    update(){
      this.x+=this.vx; this.y+=this.vy;
      this.a = lerp(this.a,this.ta,.025);
      if(this.y<-10) { this.x=Math.random()*cv.width; this.y=cv.height+10; this.a=0; }
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }
  for(let i=0;i<N;i++) particles.push(new P(true));

  /* mouse interaction */
  let mx=-9999,my=-9999;
  window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY},{passive:true});

  const drawLines=()=>{
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<90){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(255,69,0,${(1-d/90)*.05})`;
          ctx.lineWidth=.4;
          ctx.stroke();
        }
      }
    }
  };

  /* mouse repel */
  const repel=()=>{
    particles.forEach(p=>{
      const dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);
      if(d<80){const f=(80-d)/80; p.vx+=dx/d*f*.5; p.vy+=dy/d*f*.5;}
      p.vx*=.99; p.vy=p.vy*.99+(-Math.random()*.7-.2)*.01;
    });
  };

  const loop=()=>{ctx.clearRect(0,0,cv.width,cv.height);repel();drawLines();particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(loop)};
  loop();
}

/* ═══════ 9. CONTACT CANVAS — dot grid ══════════════ */
function initContactCanvas() {
  const cv = $('canvas#contactCanvas');
  if (!cv) return;
  const ctx=cv.getContext('2d');
  const parent=cv.closest('.contact-bg-canvas');
  const resize=()=>{cv.width=parent.offsetWidth||window.innerWidth;cv.height=parent.offsetHeight||600};
  resize();
  window.addEventListener('resize',resize,{passive:true});
  let t=0;
  const loop=()=>{
    ctx.clearRect(0,0,cv.width,cv.height);
    t+=.012;
    const cols=24,rows=12;
    const cw=cv.width/cols,rh=cv.height/rows;
    for(let c=0;c<=cols;c++){for(let r=0;r<=rows;r++){
      const wave=Math.sin(c*.6+t)*Math.cos(r*.6+t);
      const a=(wave+1)/2*.15,sz=(wave+1)/2*2+.3;
      ctx.beginPath();
      ctx.arc(c*cw,r*rh,sz,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,69,0,${a})`;
      ctx.fill();
    }}
    requestAnimationFrame(loop);
  };
  loop();
}

/* ═══════ 10. SCROLL REVEALS ════════════════════════ */
function initReveals() {
  const els = $$('.rv');
  if (!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target;
      const delay=+(el.dataset.delay||0);
      setTimeout(()=>el.classList.add('visible'), delay);
      io.unobserve(el);
    });
  },{threshold:.1,rootMargin:'0px 0px -60px 0px'});
  els.forEach(el=>io.observe(el));
}

/* ═══════ 11. COUNTERS ══════════════════════════════ */
function initCounters() {
  const els = $$('.counter,[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target;
      const target=+(el.dataset.count||0);
      const dur=1800, t0=performance.now();
      const tick=now=>{
        const p=Math.min((now-t0)/dur,1);
        const e=1-Math.pow(1-p,3);
        el.textContent=Math.round(e*target);
        if(p<1) requestAnimationFrame(tick); else el.textContent=target;
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  },{threshold:.5});
  els.forEach(el=>io.observe(el));
}

/* ═══════ 12. SKILL BAR FILLS ══════════════════════ */
function initSkillBars() {
  const fills = $$('.sbi-fill');
  if (!fills.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el=en.target;
      const delay=+(el.closest('.skill-bar-item')?.dataset.delay||0);
      setTimeout(()=>{el.style.width=el.dataset.w+'%'},delay+200);
      io.unobserve(el);
    });
  },{threshold:.3});
  fills.forEach(el=>io.observe(el));
}

/* ═══════ 13. SKILL ORBS — radial placement ════════ */
function initSkillOrbs() {
  const orbs = $$('.skill-orb');
  if (!orbs.length) return;
  const R = 130;
  orbs.forEach((orb, i) => {
    const angle = (i / orbs.length) * Math.PI * 2 - Math.PI / 2;
    const x = R * Math.cos(angle);
    const y = R * Math.sin(angle);
    orb.style.transform = `translate(${x}px, ${y}px)`;
    orb.style.top = '50%';
    orb.style.left = '50%';
    orb.style.position = 'absolute';
    orb.style.marginTop = '-35px';
    orb.style.marginLeft = '-35px';
    /* spin on hover */
    const wrap = orb.closest('.skill-orb-wrap');
    if (wrap) {
      let angle2 = angle;
      const tick = () => {
        angle2 += .005;
        const nx = R * Math.cos(angle2);
        const ny = R * Math.sin(angle2);
        orb.style.transform = `translate(${nx}px, ${ny}px)`;
        requestAnimationFrame(tick);
      };
      tick();
    }
  });
}

/* ═══════ 14. WORKS FILTER ══════════════════════════ */
(function() {
  const btns  = $$('.wf');
  const cards = $$('.proj-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      cards.forEach(c => {
        const show = f==='all' || c.dataset.cat===f;
        c.style.transition='opacity .4s,transform .4s';
        if (show) {
          c.style.opacity='0'; c.style.transform='translateY(16px)';
          c.style.display='';
          requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.opacity='1';c.style.transform=''}));
        } else {
          c.style.opacity='0'; c.style.transform='scale(.96)';
          setTimeout(()=>{c.style.display='none'},420);
        }
      });
    });
  });
})();

/* ═══════ 15. 3D TILT on PROJECT CARDS ═════════════ */
(function() {
  $$('.proj-card').forEach(card => {
    let tid, cx=0, cy=0, tx=0, ty=0;
    card.addEventListener('mousemove', e => {
      const r=card.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5)*10;
      ty=-((e.clientY-r.top)/r.height-.5)*10;
    });
    card.addEventListener('mouseleave',()=>{tx=0;ty=0});
    card.addEventListener('mouseenter',()=>{
      cancelAnimationFrame(tid);
      const go=()=>{
        cx=lerp(cx,tx,.1); cy=lerp(cy,ty,.1);
        card.style.transform=`perspective(900px) rotateX(${cy}deg) rotateY(${cx}deg) translateZ(8px)`;
        tid=requestAnimationFrame(go);
      };
      go();
    });
    card.addEventListener('mouseleave',()=>{
      cancelAnimationFrame(tid);
      const go=()=>{cx=lerp(cx,0,.08);cy=lerp(cy,0,.08);card.style.transform=`perspective(900px) rotateX(${cy}deg) rotateY(${cx}deg)`;if(Math.abs(cx)>.05||Math.abs(cy)>.05)requestAnimationFrame(go);else card.style.transform=''};
      go();
    });
  });
})();

/* ═══════ 16. SERVICE CARD GLOW on mouse ═══════════ */
(function() {
  $$('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');
      card.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%');
    });
  });
})();

/* ═══════ 17. TESTIMONIALS SLIDER ═══════════════════ */
(function() {
  const cards = $$('.testi-card');
  const dots  = $$('.tc-dot');
  const prev  = $('#testiPrev');
  const next  = $('#testiNext');
  if (!cards.length) return;

  let cur = 0;
  let autoTid;

  function goTo(idx) {
    cards[cur].classList.remove('active');
    cards[cur].style.position='absolute';
    dots[cur]?.classList.remove('active');
    cur = (idx + cards.length) % cards.length;
    cards[cur].classList.add('active');
    cards[cur].style.position='relative';
    dots[cur]?.classList.add('active');
  }

  prev?.addEventListener('click', () => { goTo(cur-1); resetAuto(); });
  next?.addEventListener('click', () => { goTo(cur+1); resetAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.i); resetAuto(); }));

  const auto = () => { goTo(cur+1); };
  const resetAuto = () => { clearInterval(autoTid); autoTid = setInterval(auto, 4000); };
  autoTid = setInterval(auto, 4000);

  /* init */
  cards.forEach((c,i)=>{if(i>0){c.style.position='absolute';c.style.opacity='0';c.style.transform='translateX(40px)'}});
})();

/* ═══════ 18. REEL DRAG SCROLL ══════════════════════ */
(function() {
  const strip = $('.reel-strip');
  if (!strip) return;
  let isDown=false, startX, scrollLeft;
  const wrap = strip.parentElement;
  wrap.addEventListener('mousedown', e=>{isDown=true;startX=e.pageX-wrap.offsetLeft;scrollLeft=wrap.scrollLeft;wrap.style.cursor='grabbing'});
  wrap.addEventListener('mouseleave',()=>{isDown=false;wrap.style.cursor=''});
  wrap.addEventListener('mouseup',()=>{isDown=false;wrap.style.cursor=''});
  wrap.addEventListener('mousemove',e=>{if(!isDown)return;e.preventDefault();const x=e.pageX-wrap.offsetLeft;wrap.scrollLeft=scrollLeft-(x-startX)*1.8},{passive:false});
})();

/* ═══════ 19. TYPEWRITER (hero role) ════════════════ */
(function() {
  const el = $('#roleWord');
  if (!el) return;
  const words = ['Graphic','Creative','Brand','Print','Visual'];
  let wi=0, ci=0, del=false, paused=false;
  const type=()=>{
    if(paused){paused=false;setTimeout(type,1800);return}
    const w=words[wi];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;paused=true}setTimeout(type,100);}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length}setTimeout(type,50);}
  };
  setTimeout(type,3000);
})();

/* ═══════ 20. PARALLAX DECORATIVES ═════════════════ */
(function() {
  const items = [
    {el:$('.hero-bg-word'),     speed:-.06},
    {el:$('.footer-giant-text'),speed:-.03},
    {el:$('.sb-bg-text'),       speed:-.04},
    {el:$('.orb-1'),            speed:-.05},
    {el:$('.orb-2'),            speed: .04},
    {el:$('.orb-3'),            speed:-.07},
  ].filter(d=>d.el);

  let last=-1;
  const loop=()=>{
    const y=window.scrollY;
    if(Math.abs(y-last)>.5){
      last=y;
      items.forEach(d=>{d.el.style.transform=`translateY(${y*d.speed}px)`;});
    }
    requestAnimationFrame(loop);
  };
  loop();
})();

/* ═══════ 21. CONTACT FORM ══════════════════════════ */
(function() {
  const form = $('#contactForm');
  const ok   = $('#cfSuccess');
  if (!form) return;

  const validate=(input,wrapper)=>{
    const v=input.value.trim();
    const em=wrapper.querySelector('.cf-error-msg');
    if(!v){if(em)em.textContent='Required field';wrapper.classList.add('err');return false}
    if(input.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){if(em)em.textContent='Valid email needed';wrapper.classList.add('err');return false}
    if(em)em.textContent='';
    wrapper.classList.remove('err');
    return true;
  };

  ['fName','fEmail','fMsg'].forEach(id=>{
    const inp=$(('#'+id));
    if(!inp)return;
    const wrap=inp.closest('.cf-field');
    inp.addEventListener('blur',()=>validate(inp,wrap));
    inp.addEventListener('input',()=>{if(wrap.classList.contains('err'))validate(inp,wrap)});
  });

  form.addEventListener('submit',e=>{
    e.preventDefault();
    const fName=$('#fName'); const wName=fName?.closest('.cf-field');
    const fEmail=$('#fEmail');const wEmail=fEmail?.closest('.cf-field');
    const fMsg=$('#fMsg');  const wMsg=fMsg?.closest('.cf-field');
    const valid=[validate(fName,wName),validate(fEmail,wEmail),validate(fMsg,wMsg)].every(Boolean);
    if(!valid)return;

    const btn=$('#cfSubmit');
    btn.disabled=true;
    const txt=btn.querySelector('.cf-submit-text');
    if(txt)txt.textContent='Sending…';

    setTimeout(()=>{
      btn.disabled=false;
      if(txt)txt.textContent='Send Message';
      form.reset();
      if(ok){
        ok.textContent=`✦ Thank you, ${fName.value||''}! I'll be in touch within 24 hours.`;
        setTimeout(()=>{ok.textContent=''},6000);
      }
    },2000);
  });
})();

/* ═══════ 22. ACTIVE NAV HIGHLIGHT ═════════════════ */
(function() {
  const sections = $$('section[id]');
  const links    = $$('.nm-link');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const id=en.target.id;
        links.forEach(l=>l.classList.toggle('nm-active',l.getAttribute('href')==='#'+id));
      }
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  sections.forEach(s=>io.observe(s));
})();

/* ═══════ 23. HERO CARD 3D PARALLAX ════════════════ */
(function() {
  /* floating badges on hero */
  const badges = $$('.hero-badge-float');
  window.addEventListener('mousemove', e => {
    const hw = window.innerWidth/2, hh = window.innerHeight/2;
    const dx = (e.clientX-hw)/hw, dy = (e.clientY-hh)/hh;
    badges.forEach((b,i)=>{
      const depth=(i+1)*.5;
      b.style.transform=`translate(${dx*8*depth}px,${dy*8*depth}px)`;
    });
  }, {passive:true});
})();

/* ═══════ 24. STAGGER WORKS CARDS ══════════════════ */
(function() {
  const cards = $$('.proj-card');
  cards.forEach((c,i)=>{c.style.opacity='0';c.style.transform='translateY(44px)';c.style.transition=`opacity .7s ease ${i*.15}s,transform .7s ease ${i*.15}s`});
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      en.target.style.opacity='1'; en.target.style.transform='';
      io.unobserve(en.target);
    });
  },{threshold:.08});
  cards.forEach(c=>io.observe(c));
})();

/* ═══════ 25. MARQUEE PAUSE on hover ════════════════ */
$$('.marquee-inner').forEach(m=>{
  const row=m.closest('.marquee-row');
  if(row){row.addEventListener('mouseenter',()=>m.style.animationPlayState='paused');row.addEventListener('mouseleave',()=>m.style.animationPlayState='running');}
});

/* ═══════ 26. FLOATING ABOUT CARDS pulse ═══════════ */
(function() {
  const cards = $$('.am-floating-card');
  cards.forEach((c,i) => {
    let t = i * 1200;
    const tick = () => {
      t += 16;
      const y = Math.sin(t / 1800) * 8;
      c.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(tick);
    };
    tick();
  });
})();

/* ═══════ 27. LAZY IMAGES blur-up ══════════════════ */
(function() {
  const imgs = $$('img[loading="lazy"]');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const img=en.target;
      img.style.filter='blur(10px) brightness(.7)';
      img.style.transition='filter 1s ease';
      const done=()=>{img.style.filter='';img.style.transition=''};
      if(img.complete)done(); else img.addEventListener('load',done);
      io.unobserve(img);
    });
  },{rootMargin:'300px'});
  imgs.forEach(i=>io.observe(i));
})();

/* ═══════ 28. REEL SCROLL DIRECTION ════════════════ */
(function() {
  const strip = $('.reel-strip');
  if (!strip) return;
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastY;
    lastY = window.scrollY;
    /* Shift animation-play-state based on direction */
    if (Math.abs(delta) > 2) {
      strip.style.animationDirection = delta > 0 ? 'normal' : 'reverse';
    }
  }, {passive:true});
})();

/* ═══════ 29. FOOTER links hover stagger ═══════════ */
$$('.ftl-col a').forEach((a,i)=>{
  a.style.transitionDelay=`${i*30}ms`;
  a.addEventListener('mouseenter',()=>{a.style.paddingLeft='8px'});
  a.addEventListener('mouseleave',()=>{a.style.paddingLeft='0'});
});

/* ═══════ 30. CONSOLE BRAND ════════════════════════ */
console.log(
  `%c✦ Raj Kathrotiya ✦\n%cSenior Graphic Designer\nCorelDRAW · Photoshop · Print Expert\n📧 raj2932005@gmail.com\n📞 +91 9726626076`,
  'color:#FF4500;font-size:22px;font-weight:bold;font-family:sans-serif',
  'color:#D4AF37;font-size:13px;font-family:monospace;line-height:1.8'
);
