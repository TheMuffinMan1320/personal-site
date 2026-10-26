// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Highlight current section in nav on scroll
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const targets = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (targets.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  targets.forEach((target) => observer.observe(target));
}

// 3D: section animations, scroll-linked car photos and pointer tilt (CSS transforms).
// The WebGL pieces live in scene.js (page backdrop).
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

if (!reduceMotion) {
  // Pointer tilt
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.proj, .mini, .stat, .licence, .role, .photo-frame').forEach((el) => {
      el.classList.add('tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.remove('leaving');
        el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
      });
      el.addEventListener('pointerleave', () => {
        el.classList.add('leaving');
        el.style.transform = '';
      });
    });
  }

  // Scroll-linked 3D for the two car photos
  const depthEls = document.querySelectorAll('.exp-figure, .footer-figure');
  const updateDepth = () => {
    depthEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--t', clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1).toFixed(3));
    });
  };
  addEventListener('scroll', updateDepth, { passive: true });
  addEventListener('resize', updateDepth);
  updateDepth();

  // Count-up for the stats band
  const countUp = (stat) => {
    const b = stat.querySelector('b');
    const node = b && Array.from(b.childNodes).find((n) => n.nodeType === 3);
    const m = node && node.textContent.match(/^([\d,]+)(.*)$/);
    if (!m) return;
    const end = parseInt(m[1].replace(/,/g, ''), 10);
    const start = performance.now();
    const tick = (now) => {
      const t = clamp((now - start) / 1400, 0, 1);
      const v = Math.round(end * (1 - Math.pow(1 - t, 3)));
      node.textContent = v.toLocaleString('en-US') + m[2];
      if (t < 1) requestAnimationFrame(tick);
    };
    node.textContent = '0' + m[2];
    requestAnimationFrame(tick);
  };

  // [selector, animation (or alternating list), base delay ms, stagger ms]
  const plan = [
    ['.hero .eyebrow', 'rise', 0, 0],
    ['.hero-name', 'wipe', 120, 0],
    ['.sticker', 'pop', 500, 0],
    ['.figure', 'zoom', 300, 0],
    ['.intro-lede', 'wipe', 0, 0],
    ['.intro-body', 'rise', 200, 0],
    ['.stat', 'flip', 0, 110],
    ['.sh-num', 'flip', 0, 0],
    ['.sh-title', 'wipe', 140, 0],
    ['.sh-sub', 'rise', 380, 0],
    ['.rule2', 'grow', 220, 0],
    ['.checker', 'wipe', 0, 0],
    ['.proj', ['slide-l', 'slide-r'], 0, 0],
    ['.subhead', 'rise', 0, 0],
    ['.mini', 'rise', 0, 90],
    ['.exp-figure .photo-frame', 'zoom', 0, 0],
    ['.roles-head', 'wipe', 0, 0],
    ['.role', 'wipe', 0, 0],
    ['.licence', 'deal', 0, 0],
    ['.sk', 'slide-r', 0, 80],
    ['.oss-intro', 'rise', 0, 0],
    ['.pr', 'slide-l', 0, 70],
    ['.footer-figure', 'wipe', 0, 0],
    ['.footer-kicker', 'rise', 0, 0],
    ['.footer-title', 'wipe', 100, 0],
    ['.footer-links a', 'rise', 200, 90],
    ['.plate', 'flip', 250, 0],
  ];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          observer.unobserve(el);
          el.classList.add('in');
          if (el.classList.contains('stat')) countUp(el);
          // tilt targets must drop the reveal transition/transform once settled
          setTimeout(() => {
            if (!el.classList.contains('tilt')) return;
            el.removeAttribute('data-anim');
            el.classList.remove('reveal', 'in');
            el.style.removeProperty('--d');
          }, 1900);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    plan.forEach(([sel, kind, base, step]) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.dataset.anim = Array.isArray(kind) ? kind[i % kind.length] : kind;
        el.style.setProperty('--d', `${base + (step ? (i % 6) * step : 0)}ms`);
        el.classList.add('reveal');
        observer.observe(el);
      });
    });
  }
}
