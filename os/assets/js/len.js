/* Кофейня «Лён»: утро ↔ вечер для всей страницы, «солнце» с часами, план с точками обзора, 3D-зал (грузится по требованию). */
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

  // ---- проявление: текст — мягко снизу, арки — «вырастают» из-под нижней кромки
  if (hasGsap && !reduce) {
    $$('.rv').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
    $$('.story-img .arch, .arch-row .arch').forEach((el) => {
      el.classList.add('unveil');
      gsap.to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.from('.hero h1', { yPercent: 14, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero-arch .arch', { clipPath: 'inset(100% 0 0 0)', duration: 1.7, ease: 'power3.inOut', delay: 0.15, clearProps: 'clipPath' });
    gsap.to('.hero-arch .arch img', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  } else { $$('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; }); }

  // ---- утро / вечер для всей страницы
  const pill = $('.light-pill'), sw = $$('.light-pill button');
  let light = 'day';
  try { light = sessionStorage.getItem('os-light') || 'day'; } catch (e) { /* без хранилища — утро */ }
  function setLight(m) {
    light = m; root.dataset.light = m;
    sw.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.set === m)));
    try { sessionStorage.setItem('os-light', m); } catch (e) { /* нет хранилища */ }
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = m === 'day' ? '#f1ebdd' : '#ecdcbb';
  }
  sw.forEach((b) => b.addEventListener('click', () => setLight(b.dataset.set)));
  setLight(light);
  const wsec = $('#walk');
  if (pill && wsec) new IntersectionObserver((en) => pill.classList.toggle('hide', en[0].isIntersecting), { threshold: 0.2 }).observe(wsec);

  // ---- «солнце»: часы 8–21, картинка плавно переходит из утра в вечер
  const rng = $('#hoursRange');
  if (rng) {
    const eve = $('#hoursEve'), clock = $('#hoursClock'), mood = $('#hoursMood');
    const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const moods = [[10.5, 'Утро. Свет из арок ложится на пол.'], [14.5, 'День. Стены светлые, тени мягкие.'], [17, 'Ближе к вечеру. Дуб теплеет.'], [19, 'Закат. Загораются бумажные шары.'], [99, 'Вечер. В арках — синие сумерки.']];
    const upd = () => {
      const h = +rng.value, hh = Math.floor(h), mm = Math.round((h - hh) * 60);
      clock.textContent = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0');
      mood.textContent = moods.find((m) => h < m[0])[1];
      eve.style.opacity = sm(16.5, 19.5, h);
      rng.setAttribute('aria-valuetext', clock.textContent + ', ' + mood.textContent);
    };
    rng.addEventListener('input', upd); upd();
    // при появлении «солнце» само проходит от утра к вечеру и возвращается — показывает приём
    if (hasGsap && !reduce) {
      const o = { v: 9 };
      ScrollTrigger.create({ trigger: '#hoursFrame', start: 'top 65%', once: true, onEnter: () => {
        gsap.timeline().to(o, { v: 20, duration: 2.4, ease: 'power2.inOut', onUpdate: () => { rng.value = o.v; upd(); } }).to(o, { v: 12, duration: 1.8, ease: 'power2.inOut', onUpdate: () => { rng.value = o.v; upd(); } });
      } });
    }
  }

  // ---- приложение в телефоне: экраны меняются сами (меню → бронь → бонусы), пока блок на экране; пункты слева — тоже переключают
  const stage = $('.phone-stage');
  if (stage) {
    const views = $$('.view', stage), tabs = $$('.tabs span', stage), steps = $$('.app-steps li');
    let k = 0, timer = null;
    const show = (n) => { k = n; [views, tabs, steps].forEach((list) => list.forEach((el, i) => el.classList.toggle('on', i === n))); };
    const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show((k + 1) % views.length), 3600); };
    steps.forEach((li, i) => {
      li.tabIndex = 0; li.setAttribute('role', 'button');
      li.addEventListener('click', () => { show(i); restart(); });
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); restart(); } });
    });
    new IntersectionObserver((en) => { if (en[0].isIntersecting) restart(); else clearInterval(timer); }, { threshold: 0.3 }).observe(stage);
  }

  // ---- план: метры как в Blender (зал 9 × 7, окна на стороне Y = 7, вход слева)
  const svg = $('#planSvg');
  if (svg) {
    const S = 100, X0 = 30, Y0 = 90;
    const px = (x) => X0 + x * S, py = (y) => Y0 + 700 - y * S;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (n, a, p = svg, t) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (t) e.textContent = t; p.appendChild(e); return e; };
    const ink = '#2b2a22', sage = '#55694a', sageL = '#8ea07f', oak = '#c9a877', warm = '#e0a54a', lime = '#f7f2e6';
    el('rect', { x: px(0), y: py(7), width: 900, height: 700, fill: lime });
    el('rect', { x: px(0), y: py(7), width: 900, height: 700, fill: 'none', stroke: ink, 'stroke-width': 7 });
    // арочные окна в южной (верхней) стене: проём, подоконник и дуга снаружи
    [2.0, 4.5, 7.0].forEach((c) => {
      el('path', { d: `M ${px(c - 0.7)} ${py(7) - 4} a 70 70 0 0 1 140 0`, fill: 'none', stroke: sage, 'stroke-width': 3 });
      el('line', { x1: px(c - 0.7), x2: px(c + 0.7), y1: py(7), y2: py(7), stroke: lime, 'stroke-width': 10 });
      el('line', { x1: px(c - 0.7), x2: px(c + 0.7), y1: py(7) - 3, y2: py(7) - 3, stroke: sage, 'stroke-width': 2 });
      el('line', { x1: px(c - 0.7), x2: px(c + 0.7), y1: py(7) + 3, y2: py(7) + 3, stroke: sage, 'stroke-width': 2 });
      el('line', { x1: px(c - 0.8), x2: px(c + 0.8), y1: py(6.82), y2: py(6.82), stroke: oak, 'stroke-width': 8, 'stroke-linecap': 'round' });
    });
    // вход слева: проём в стене
    el('line', { x1: px(0), x2: px(0), y1: py(3.7), y2: py(2.7), stroke: lime, 'stroke-width': 10 });
    el('path', { d: `M ${px(0) + 6} ${py(3.2)} h 44 m -14 -14 l 14 14 l -14 14`, fill: 'none', stroke: ink, 'stroke-width': 3 });
    // стойка и задний стеллаж
    el('rect', { x: px(7.6), y: py(5.7), width: 75, height: 440, rx: 4, fill: sageL, stroke: ink, 'stroke-width': 2 });
    el('rect', { x: px(8.55), y: py(5.7), width: 40, height: 440, fill: oak, stroke: ink, 'stroke-width': 2 });
    // общий стол и стулья
    el('rect', { x: px(3.0), y: py(4.0), width: 240, height: 100, rx: 4, fill: oak, stroke: ink, 'stroke-width': 2 });
    [3.4, 4.2, 5.0].forEach((x) => { [2.65, 4.35].forEach((y) => el('rect', { x: px(x) - 18, y: py(y) - 18, width: 36, height: 36, rx: 6, fill: lime, stroke: ink, 'stroke-width': 2 })); });
    // столики у окон и у скамьи
    [[2.0, 6.0], [7.0, 6.0]].forEach(([x, y]) => {
      el('circle', { cx: px(x), cy: py(y), r: 38, fill: oak, stroke: ink, 'stroke-width': 2 });
      el('rect', { x: px(x - 0.55) - 17, y: py(y - 0.1) - 17, width: 34, height: 34, rx: 6, fill: lime, stroke: ink, 'stroke-width': 2 });
      el('rect', { x: px(x + 0.5) - 17, y: py(y + 0.1) - 17, width: 34, height: 34, rx: 6, fill: lime, stroke: ink, 'stroke-width': 2 });
    });
    el('rect', { x: px(0.9), y: py(0.6), width: 370, height: 55, rx: 6, fill: '#d7c9aa', stroke: ink, 'stroke-width': 2 });
    [1.9, 3.6].forEach((x) => el('circle', { cx: px(x), cy: py(1.15), r: 30, fill: oak, stroke: ink, 'stroke-width': 2 }));
    // бумажные шары (пунктир) и растения
    [[6.8, 2.1, 22], [6.8, 3.5, 22], [6.8, 4.9, 22], [3.4, 3.5, 17], [4.2, 3.5, 17], [5.0, 3.5, 17]].forEach(([x, y, r]) => el('circle', { cx: px(x), cy: py(y), r, fill: 'none', stroke: warm, 'stroke-width': 3, 'stroke-dasharray': '5 5' }));
    [[0.55, 6.5, 30], [8.5, 6.4, 24], [5.8, 0.5, 22]].forEach(([x, y, r]) => el('circle', { cx: px(x), cy: py(y), r, fill: sageL, stroke: sage, 'stroke-width': 2 }));
    // подписи
    const t = (x, y, s, anc = 'middle') => el('text', { x: px(x), y: py(y), fill: ink, 'font-family': 'Manrope, sans-serif', 'font-size': 22, 'letter-spacing': 3, 'text-anchor': anc, opacity: 0.7 }, svg, s);
    t(0.55, 2.3, 'ВХОД', 'start'); t(8.0, 6.35, 'СТОЙКА'); t(4.5, 6.45, 'ТРИ АРКИ');
    // точки обзора
    const pts = [
      { n: 1, x: 0.45, y: 3.2, tx: 8.0, ty: 3.5, key: 'cam1', cap: 'Первый взгляд от двери: общий стол по оси, в глубине стойка и бумажные шары.' },
      { n: 2, x: 5.6, y: 0.45, tx: 2.6, ty: 6.6, key: 'cam2', cap: 'К окнам: арки с шторами-вуаль, дубовые стулья, свет ложится на пол длинным пятном.' },
      { n: 3, x: 5.9, y: 5.9, tx: 8.9, ty: 3.3, key: 'cam3', cap: 'К стойке: три полки с подсветкой, кофемашина и посуда ручной работы.' },
      { n: 4, x: 3.4, y: 2.4, tx: 0.7, ty: 6.3, key: 'cam4', cap: 'Угол у окна: столик на двоих и фикус — единственное большое растение в зале.' },
    ];
    const hots = pts.map((p) => {
      const ang = Math.atan2(p.ty - p.y, p.tx - p.x), half = 0.45, L = 5;
      const a1 = ang - half, a2 = ang + half;
      const cone = el('polygon', { class: 'cone', points: `${px(p.x)},${py(p.y)} ${px(p.x + Math.cos(a1) * L)},${py(p.y + Math.sin(a1) * L)} ${px(p.x + Math.cos(a2) * L)},${py(p.y + Math.sin(a2) * L)}` });
      const g = el('g', { class: 'hot', tabindex: 0, role: 'button', 'aria-label': 'Точка обзора ' + p.n });
      el('circle', { cx: px(p.x), cy: py(p.y), r: 64, fill: 'transparent' }, g); el('circle', { cx: px(p.x), cy: py(p.y), r: 30, class: 'dot' }, g); el('text', { x: px(p.x), y: py(p.y) }, g, String(p.n));
      p.g = g; p.cone = cone;
      g.addEventListener('click', () => pick(p.n)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p.n); } });
      return p;
    });
    const tabs = $$('.plan-tabs button'), day = $('#pvDay'), eve = $('#pvEve'), cap = $('#pvCap');
    function pick(n) {
      const p = pts[n - 1];
      hots.forEach((h) => { h.g.classList.toggle('on', h === p); h.cone.classList.toggle('on', h === p); });
      tabs.forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.v === n)));
      day.src = `assets/img/len/day-${p.key}-1600.webp`; eve.src = `assets/img/len/evening-${p.key}-1600.webp`;
      cap.textContent = p.cap;
    }
    tabs.forEach((b) => b.addEventListener('click', () => pick(+b.dataset.v)));
    pick(1);
  }

  // ---- 3D-зал: подключаем, когда блок почти виден
  const host = $('#walkHost');
  if (host) {
    const msg = $('#fbMsg'), fb = $('#walkFb');
    const ctl = $$('.walk-ctl button');
    let api = null;
    const webgl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } })();
    async function boot() {
      if (!webgl) { msg.textContent = 'На этом устройстве 3D недоступно — показываем фото.'; return; }
      try {
        const mod = await import('./walk-len.js');
        api = mod.startWalk(host, { mode: light === 'day' ? 'day' : 'evening' });
        fb.remove();
        sync();
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
