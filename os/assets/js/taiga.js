/* Ресторан «Тайга»: горизонтальная галерея (на компьютере — прокруткой, на телефоне — пальцем), обед/ужин, 3D-зал в ноутбуке. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  if (!reduce && window.Lenis && hasGsap) {
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -60, duration: 1.4 });
    }));
  }

  if (hasGsap && !reduce) {
    // заголовок «Тайга» проявляется по буквам, фото — медленно приближается при прокрутке
    const h1 = $('.hero h1');
    h1.setAttribute('aria-label', h1.textContent);
    h1.innerHTML = [...h1.textContent].map((c) => `<span aria-hidden="true" style="display:inline-block">${c}</span>`).join('');
    gsap.from('.hero h1 span', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'power3.out', stagger: 0.07, delay: 0.15 });
    gsap.from('.hero .sub, .hero-stats, .hero .demo', { y: 24, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.6 });
    gsap.to('.bgimg', { scale: 1.16, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('.chap > div, .g-head, .f-text, .w-head, .m-head, .mlist li, .facts > div').forEach((el) => {
      el.classList.add('rv');
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // горизонтальная галерея: только на широком экране; на телефоне — обычная лента со «щелчком» кадров
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const sec = $('#gallery'), track = $('#gTrack');
      sec.classList.add('pin');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      // кадр в центре — чуть ярче, остальные приглушены
      $$('.g-item', track).forEach((it) => gsap.fromTo(it, { opacity: 0.45 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: it, containerAnimation: tw, start: 'left 85%', end: 'left 35%', scrub: true } }));
      return () => sec.classList.remove('pin');
    });
  }

  // ---- обед / ужин
  const pair = $('#firePair'), seg = $$('.seg button');
  seg.forEach((b) => b.addEventListener('click', () => {
    pair.classList.toggle('is-day', b.dataset.t === 'day');
    seg.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));

  // ---- 3D-зал
  const host = $('#walkHost');
  if (host) {
    const msg = $('#fbMsg'), fb = $('#walkFb'), ctl = $$('.walk-ctl button');
    let api = null;
    const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
    async function boot() {
      if (!webgl) { msg.textContent = 'На этом устройстве 3D недоступно — показываем фото.'; return; }
      try {
        const mod = await import('./walk-taiga.js');
        api = mod.startWalk(host, { mode: 'evening' });
        fb.remove(); sync();
      } catch (e) { msg.textContent = 'Не удалось запустить 3D — показываем фото.'; }
    }
    function sync() { ctl.forEach((b) => { if (b.dataset.m) b.setAttribute('aria-pressed', String(api && api.mode === b.dataset.m)); }); }
    ctl.forEach((b) => b.addEventListener('click', () => {
      if (!api) return;
      if (b.dataset.v) { api.goto(b.dataset.v); ctl.filter((x) => x.dataset.v).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }
      if (b.dataset.m) { api.setMode(b.dataset.m); sync(); }
    }));
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { io.disconnect(); boot(); } }, { rootMargin: '400px' }).observe(host);
  }
})();
