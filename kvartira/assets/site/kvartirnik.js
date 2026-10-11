/* Движение стиля «Квартирник» (см. kvartirnik.mjs). Библиотеки — assets/vendor/: GSAP, ScrollTrigger, SplitText, Lenis.
   Прелоадер «игла» — один раз за визит (sessionStorage); пластинки крутятся всегда медленно и быстрее — от скорости прокрутки;
   «Сейчас играет» в шапке — по разделу; трек-лист — фото за курсором; ящик с пластинками — лента вбок при прокрутке (компьютер).
   «Меньше движения» или нет библиотек — всё сразу на месте, прелоадер убран. Только transform / opacity / clip-path. */
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = window.gsap, ST = window.ScrollTrigger, SPLIT = window.SplitText;
  if (still || !G || !ST) { root.classList.add('kv-done'); return; }
  G.registerPlugin(ST); if (SPLIT) G.registerPlugin(SPLIT);
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wide = matchMedia('(min-width: 900px)').matches;
  root.classList.add('kv-ready');

  /* плавная прокрутка: Lenis и ScrollTrigger в одном такте */
  var lenis = null, vel = 0;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -70 } });
    lenis.on('scroll', function (e) { vel = e.velocity || 0; ST.update(); });
    G.ticker.add(function (t) { lenis.raf(t * 1000); });
    G.ticker.lagSmoothing(0);
  } else {
    var ly = scrollY; addEventListener('scroll', function () { vel = (scrollY - ly) * 0.5; ly = scrollY; }, { passive: true });
  }

  /* ящик с пластинками (первым: закрепление сдвигает все разделы ниже — остальные триггеры считаются после него): на компьютере раздел закрепляется и лента едет вбок; активный конверт выпускает диск */
  var crate = $('.kv-crate-in'), lps = $$('.kv-lp');
  if (crate && wide) {
    var dist = function () { return Math.max(0, crate.scrollWidth - innerWidth + 40); };
    G.to(crate, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: '.kv-crate-sec', start: 'top+=110 top', end: function () { return '+=' + dist(); }, pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: function (s) { var k = Math.min(lps.length - 1, Math.round(s.progress * (lps.length - 1))); lps.forEach(function (l, i) { l.classList.toggle('is-on', i === k); }); } } });
  } else if (lps.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (l) { l.forEach(function (e) { e.target.classList.toggle('is-on', e.isIntersecting); }); }, { root: $('.kv-crate'), threshold: 0.7 });
    lps.forEach(function (l) { io.observe(l); });
  }

  /* пластинки: 33⅓ об/мин условно — медленно сами, быстрее от прокрутки; в титрах диск к концу страницы останавливается */
  var heroDisc = $('.kv-hero-disc'), footDisc = $('.kv-foot-disc'), mini = $('.kv-mini');
  var rot = 0, footK = 1;
  G.ticker.add(function (t, dt) {
    rot += dt * 0.024 + vel * 0.5; vel *= 0.92;
    if (heroDisc) heroDisc.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
    if (mini) mini.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
    if (footDisc) footDisc.style.transform = 'rotate(' + (rot * footK).toFixed(2) + 'deg)';
  });
  if (footDisc) ST.create({ trigger: '.kv-foot', start: 'top bottom', end: 'bottom bottom', onUpdate: function (s) { footK = 1 - s.progress * 0.85; } });

  /* маскам SplitText — запас сверху: иначе срезаются точки Ё, кратка Й и хвосты курсива */
  var roomy = function (s) { (s.masks || []).forEach(function (m) { m.style.paddingTop = '.32em'; m.style.marginTop = '-.32em'; m.style.paddingRight = '.06em'; }); };
  /* первый экран: буквы из-под маски, пластинка выезжает из конверта */
  var intro = function () {
    var tl = G.timeline({ defaults: { ease: 'expo.out' } });
    var big = $('.kv-big');
    if (big && SPLIT) {
      SPLIT.create(big, { type: 'chars', mask: 'chars', aria: 'none', onSplit: function (s) { roomy(s); tl.from(s.chars, { yPercent: 115, duration: 1.3, stagger: 0.035 }, 0); } });
    }
    tl.from('.kv-sleeve', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'power4.inOut' }, 0.1)
      .from('.kv-album .kv-disc', { xPercent: -34, duration: 1.6, ease: 'power3.inOut' }, 0.6)
      .from('.kv-meta > *, .kv-hero-text > *', { yPercent: 40, opacity: 0, duration: 1, stagger: 0.06 }, 0.45);
  };
  if (heroDisc) G.to('.kv-album', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.kv-hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* прелоадер: игла опускается, счётчик до 100, экран уходит вверх */
  var pre = $('.kv-pre'), seen = false;
  try { seen = sessionStorage.getItem('kv-pre') === '1'; sessionStorage.setItem('kv-pre', '1'); } catch (e) { /* без хранилища — показываем */ }
  if (!pre || seen) { root.classList.add('kv-skip'); intro(); }
  else {
    var cnt = $('[data-count]', pre), n = { v: 0 };
    G.timeline({ onComplete: function () { root.classList.add('kv-done'); } })
      .from('.kv-pre-disc', { scale: 0.86, opacity: 0, rotate: -90, duration: 0.9, ease: 'expo.out' }, 0)
      .to('.kv-pre-disc', { rotate: 300, duration: 1.6, ease: 'power2.in' }, 0)
      .to('.kv-arm', { rotate: 0, duration: 0.7, ease: 'power3.inOut' }, 0.25)
      .to(n, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: function () { cnt.textContent = String(Math.round(n.v)).padStart(2, '0'); } }, 0.15)
      .add(intro, 1.15)
      .to(pre, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'power4.inOut' }, 1.2);
  }

  /* «Сейчас играет» — название раздела в шапке */
  var now = $('[data-now]');
  if (now) $$('[data-track]').forEach(function (s) {
    /* закреплённый раздел (ящик) измеряем по его обёртке pin-spacer — она длиннее на время закрепления */
    var box = s.parentNode && s.parentNode.classList.contains('pin-spacer') ? s.parentNode : s;
    ST.create({ trigger: box, start: 'top 45%', end: 'bottom 45%', onToggle: function (e) { if (e.isActive) now.textContent = s.getAttribute('data-track'); } });
  });

  /* заголовки разделов — строками из-под маски */
  if (SPLIT) $$('[data-split]').forEach(function (el) {
    SPLIT.create(el, { type: 'lines', mask: 'lines', autoSplit: true, aria: el.tagName === 'H2' ? 'auto' : 'none', onSplit: function (s) { roomy(s);
      return G.from(s.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    } });
  });

  /* трек-лист: строки «проигрываются» слева направо; на компьютере — фото за курсором */
  $$('.kv-side ol, .kv-bonus ul').forEach(function (ol) {
    G.from(ol.children, { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power3.out', stagger: 0.05, scrollTrigger: { trigger: ol, start: 'top 85%', once: true } });
  });
  var flt = $('.kv-float'), menu = $('.kv-menu');
  if (flt && menu && fine) {
    var fx = G.quickTo(flt, 'x', { duration: 0.6, ease: 'power3' }), fy = G.quickTo(flt, 'y', { duration: 0.6, ease: 'power3' });
    var cur = '', lastX = 0;
    menu.addEventListener('pointermove', function (e) {
      var li = e.target.closest('li[data-img]');
      fx(e.clientX + 40); fy(e.clientY);
      G.to(flt, { rotate: Math.max(-8, Math.min(8, (e.clientX - lastX) * 0.4)), duration: 0.5 }); lastX = e.clientX;
      if (!li) return;
      var src = li.getAttribute('data-img');
      if (src !== cur) { cur = src; flt.src = src; }
      G.to(flt, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    });
    menu.addEventListener('pointerleave', function () { G.to(flt, { opacity: 0, scale: 0.8, duration: 0.35 }); });
  }

  /* состав: фото группы — параллакс внутри рамки; имена — буквами */
  if ($('.kv-band-img img')) G.fromTo('.kv-band-img img', { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.kv-band', start: 'top bottom', end: 'bottom top', scrub: true } });
  if (SPLIT) $$('.kv-name').forEach(function (el) {
    SPLIT.create(el, { type: 'chars', mask: 'chars', aria: 'none', onSplit: function (s) { roomy(s);
      return G.from(s.chars, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    } });
  });

  /* билет «выдаётся» — поворачивается и ложится ровно по мере прокрутки */
  if ($('.kv-ticket')) G.fromTo('.kv-ticket', { rotate: -4, scale: .94 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.kv-ticket-sec', start: 'top bottom', end: 'top 30%', scrub: true } });

  /* курсор с подписью и магнитные кнопки — только мышь */
  if (fine) {
    var cr = $('.kv-cursor'), dot = cr && cr.firstElementChild;
    if (cr) {
      var cx = G.quickTo(cr, 'x', { duration: 0.35, ease: 'power3' }), cy = G.quickTo(cr, 'y', { duration: 0.35, ease: 'power3' });
      addEventListener('pointermove', function (e) {
        cx(e.clientX); cy(e.clientY);
        var z = e.target.closest && e.target.closest('[data-cur]');
        var label = z && !e.target.closest('a, button') ? z.getAttribute('data-cur') : '';
        cr.classList.toggle('is-big', !!label); dot.textContent = label;
      }, { passive: true });
    }
    $$('.btn-main').forEach(function (b) {
      b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(); G.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 }); });
      b.addEventListener('pointerleave', function () { G.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, .4)' }); });
    });
  }
  addEventListener('load', function () { ST.refresh(); });
})();
