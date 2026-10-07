/* Бар «Станок»: переключатель света, сравнение день/вечер, план с точками обзора, 3D-прогулка (грузится по требованию). */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // ---- плавная прокрутка
  if (!reduce && window.Lenis && hasGsap) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -10, duration: 1.4 });
    }));
  }

  // ---- проявление
  if (hasGsap && !reduce) {
    $$('.rv').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    gsap.from('.case-hero h1', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.1 });
    gsap.to('.case-hero .pair img', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.case-hero', start: 'top top', end: 'bottom top', scrub: true } });
  } else { $$('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; }); }

  // в 3D-блоке своё переключение света — общий прячем
  const lsw = $('.lightswitch'), wsec = $('#walk');
  if (lsw && wsec) new IntersectionObserver((en) => lsw.style.opacity = en[0].isIntersecting ? 0 : 1, { threshold: 0.15 }).observe(wsec);

  // ---- общий переключатель света (шапка проекта и план)
  const sw = $$('.lightswitch button');
  let light = 'day';
  try { light = sessionStorage.getItem('os-light') || 'day'; } catch (e) { /* без хранилища — день */ }
  function setLight(m) {
    light = m; root.dataset.light = m;
    sw.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.set === m)));
    try { sessionStorage.setItem('os-light', m); } catch (e) { /* нет хранилища */ }
  }
  sw.forEach((b) => b.addEventListener('click', () => setLight(b.dataset.set)));
  setLight(light);

  // ---- сравнение «день — вечер»
  const rng = $('#cmpRange'), wrap = $('#eveWrap'), bar = $('#cmpBar');
  if (rng) {
    const upd = () => { const v = +rng.value; wrap.style.clipPath = `inset(0 0 0 ${v}%)`; bar.style.left = v + '%'; };
    rng.addEventListener('input', upd); upd();
    // при появлении — сама «проезжает» один раз, чтобы показать приём
    if (hasGsap && !reduce) {
      const o = { v: 50 };
      ScrollTrigger.create({ trigger: '#compare', start: 'top 70%', once: true, onEnter: () => {
        gsap.timeline().to(o, { v: 12, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { rng.value = o.v; upd(); } }).to(o, { v: 50, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { rng.value = o.v; upd(); } });
      } });
    }
  }

  // ---- план с точками обзора (в метрах, как в Blender; на плане север — вверху, окна на стороне Y = 8)
  const svg = $('#planSvg');
  if (svg) {
    const S = 100, X0 = 50, Y0 = 50, H = 800;
    const px = (x) => X0 + x * S, py = (y) => Y0 + H - y * S;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (n, a, p = svg, t) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (t) e.textContent = t; p.appendChild(e); return e; };
    const ink = '#121110', brass = '#b98a3a', red = '#b5160b';
    el('rect', { x: px(0), y: py(8), width: 1600, height: 800, fill: '#f4eee2', stroke: ink, 'stroke-width': 8 });
    // окна на южной стене (сверху)
    [2.4, 6.0, 9.6, 13.2].forEach((c) => el('line', { x1: px(c - 1.15), x2: px(c + 1.15), y1: py(8), y2: py(8), stroke: brass, 'stroke-width': 14 }));
    // бар и задняя стойка
    el('rect', { x: px(13), y: py(7.2), width: 85, height: 640, fill: '#3a1a0b' });
    el('rect', { x: px(12.88), y: py(7.25), width: 110, height: 650, fill: 'none', stroke: ink, 'stroke-width': 3 });
    el('rect', { x: px(15), y: py(7.2), width: 90, height: 640, fill: '#6b4a2a' });
    // графика на торцевой стене
    el('circle', { cx: px(15.96), cy: py(4.1), r: 46, fill: red });
    // столы, стулья, табуреты
    [[5, 2.2], [5, 5.8], [8.4, 2.2], [8.4, 5.8], [3, 4], [10.2, 4]].forEach(([x, y]) => {
      el('circle', { cx: px(x), cy: py(y), r: 42, fill: '#d8ceb8', stroke: ink, 'stroke-width': 3 });
      for (let k = 0; k < 3; k++) { const a = (Math.PI * 2 * k) / 3 + 0.4; el('circle', { cx: px(x + Math.cos(a) * 0.72), cy: py(y + Math.sin(a) * 0.72), r: 18, fill: '#8a3a1a' }); }
    });
    for (let i = 0; i < 6; i++) el('circle', { cx: px(12.35), cy: py(1.4 + i), r: 18, fill: '#8a3a1a' });
    // подписи
    const t = (x, y, s, anc = 'middle') => el('text', { x: px(x), y: py(y), fill: ink, 'font-family': 'Golos Text, sans-serif', 'font-size': 32, 'letter-spacing': 4, 'text-anchor': anc, opacity: 0.75 }, svg, s);
    t(0.95, 0.35, 'ВХОД'); t(13.4, 7.55, 'БАР'); t(8, 7.6, 'ОКНА НА ЮГ');
    el('path', { d: `M ${px(0)} ${py(3.4) - 30} l -30 30 l 30 30`, fill: 'none', stroke: ink, 'stroke-width': 4 });
    // точки обзора
    const pts = [
      { n: 1, x: 0.7, y: 3.4, tx: 13.0, ty: 4.5, key: 'cam1', cap: 'Первый взгляд от входа: длинный зал, фермы под потолком, в глубине — стойка и красный круг.' },
      { n: 2, x: 9.0, y: 1.2, tx: 13.6, ty: 5.2, key: 'cam2', cap: 'Вдоль стойки: подсвеченные полки, латунь и орех. Вечером этот ракурс главный для фото гостей.' },
      { n: 3, x: 9.6, y: 6.6, tx: 15.2, ty: 3.4, key: 'cam3', cap: 'К графике: красный круг и чёрная диагональ над полками — знак всего места.' },
    ];
    const hots = pts.map((p) => {
      const ang = Math.atan2(p.ty - p.y, p.tx - p.x), half = 0.5, L = 6;
      const a1 = ang - half, a2 = ang + half;
      const cone = el('polygon', { class: 'cone', points: `${px(p.x)},${py(p.y)} ${px(p.x + Math.cos(a1) * L)},${py(p.y + Math.sin(a1) * L)} ${px(p.x + Math.cos(a2) * L)},${py(p.y + Math.sin(a2) * L)}` });
      const g = el('g', { class: 'hot', tabindex: 0, role: 'button', 'aria-label': 'Точка обзора ' + p.n });
      el('circle', { cx: px(p.x), cy: py(p.y), r: 64, fill: 'transparent', class: 'hit' }, g); el('circle', { cx: px(p.x), cy: py(p.y), r: 38, class: 'dot' }, g); el('text', { x: px(p.x), y: py(p.y) }, g, String(p.n));
      p.g = g; p.cone = cone;
      g.addEventListener('click', () => pick(p.n)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.n); } });
      return p;
    });
    const tabs = $$('.plan-tabs button'), day = $('#pvDay'), eve = $('#pvEve'), cap = $('#pvCap');
    function pick(n) {
      const p = pts[n - 1];
      hots.forEach((h) => { h.g.classList.toggle('on', h === p); h.cone.classList.toggle('on', h === p); });
      tabs.forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.v === n)));
      day.src = `assets/img/render/day-${p.key}-1600.webp`; eve.src = `assets/img/render/evening-${p.key}-1600.webp`;
      cap.textContent = p.cap;
    }
    tabs.forEach((b) => b.addEventListener('click', () => pick(+b.dataset.v)));
    pick(1);
  }

  // ---- 3D-прогулка: подключаем, когда блок почти виден
  const host = $('#walkHost');
  if (host) {
    const msg = $('#fbMsg'), fb = $('#walkFb');
    const ctl = $$('.walk-ctl button');
    let api = null;
    const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
    async function boot() {
      if (!webgl) { msg.textContent = 'На этом устройстве 3D недоступно — показываем фото.'; return; }
      try {
        const mod = await import('./walk.js');
        api = mod.startWalk(host, { mode: light === 'day' ? 'day' : 'evening' });
        fb.remove();
        sync();
      } catch (e) { msg.textContent = 'Не удалось запустить 3D — показываем фото.'; }
    }
    function sync() {
      ctl.forEach((b) => {
        if (b.dataset.m) b.setAttribute('aria-pressed', String(api && api.mode === b.dataset.m));
      });
    }
    ctl.forEach((b) => b.addEventListener('click', () => {
      if (!api) return;
      if (b.dataset.v) { api.goto(b.dataset.v); ctl.filter((x) => x.dataset.v).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); }
      if (b.dataset.m) { api.setMode(b.dataset.m); sync(); }
    }));
    new IntersectionObserver((en, io) => { if (en[0].isIntersecting) { io.disconnect(); boot(); } }, { rootMargin: '400px' }).observe(host);
  }
})();
