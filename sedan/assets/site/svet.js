/* Движение и «Карта защиты» стиля «Свет» (см. svet.mjs). Lenis — если есть, остальное — свой код, только transform / opacity.
   Заставка «Включаем свет»: класс sv-intro ставит встроенный скрипт в начале страницы (один раз за визит); здесь — её ход:
   2,3 с — лампы и название, затем полоса света идёт сверху вниз (sv-open), через 1,1 с заставка убрана (sv-done). Клик/клавиша — сразу.
   Разделы «включаются» (is-lit), когда доходят до экрана. «Меньше движения» — всё сразу на месте. */
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };
  var nb = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  /* «Карта защиты» работает и без движения */
  protect();
  if (!still) film();

  /* шапка темнеет, когда первый экран ушёл */
  var top = $('.sv-top');
  if (top) { var onS = function () { top.classList.toggle('is-solid', scrollY > 40); }; onS(); addEventListener('scroll', onS, { passive: true }); }

  if (still || !('IntersectionObserver' in window)) { root.classList.add('sv-done'); $$('.sv-sec, .sv-ticket-sec').forEach(function (s) { s.classList.add('is-lit'); }); return; }

  root.classList.add('sv-go');
  if (root.classList.contains('sv-intro')) {
    var opened = false;
    var open = function () { if (opened) return; opened = true; root.classList.add('sv-open'); setTimeout(function () { root.classList.add('sv-done'); }, 1150); };
    setTimeout(open, 2300);
    ['pointerdown', 'keydown'].forEach(function (e) { addEventListener(e, open, { once: true, passive: true }); });
  } else root.classList.add('sv-skip');

  /* слова заголовков — каждое в маску */
  $$('[data-words]').forEach(function (el) {
    var i = 0;
    var walk = function (node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement('span'); w.className = 'sv-w'; w.setAttribute('aria-hidden', 'true');
            var s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++); w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('sv-w')) walk(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
  });

  var io = new IntersectionObserver(function (list) {
    list.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(e.target.matches('section') ? 'is-lit' : 'is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px' });
  $$('[data-rise]').forEach(function (el) {
    var sib = [].slice.call(el.parentNode.children).filter(function (x) { return x.hasAttribute('data-rise'); });
    el.style.setProperty('--i', Math.min(sib.indexOf(el), 8));
    io.observe(el);
  });
  $$('[data-words]').forEach(function (el) { if (!el.closest('.sv-hero')) io.observe(el); });
  $$('.sv-sec, .sv-ticket-sec').forEach(function (s) { io.observe(s); });
  /* заголовок первого экрана — после заставки (или сразу при повторном заходе) */
  var h1 = $('.sv-hero [data-words]');
  if (h1) setTimeout(function () { h1.classList.add('is-in'); }, root.classList.contains('sv-intro') ? 2700 : 120);

  if (window.Lenis && matchMedia('(hover: hover)').matches) {
    var lenis = new Lenis({ lerp: 0.1 });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    $$('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function (e) { var t = $(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); } }); });
  }

  /* «Кадры»: петли играют, только пока в кадре (и лампа над ними горит). Грузятся после того, как гость начал листать:
     кто не листает — не тратит трафик на видео. «Меньше движения» — сюда не попадаем, остаются постеры. */
  function film() {
    var vids = $$('video[data-film]');
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var start = function () {
      removeEventListener('scroll', start);
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target, fig = v.closest('.sv-clip');
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
          if (fig) fig.classList.toggle('is-play', e.isIntersecting);
        });
      }, { rootMargin: '120px 0px' });
      vids.forEach(function (v) { vio.observe(v); });
    };
    addEventListener('scroll', start, { passive: true });
  }

  /* «Карта защиты»: точки на чертеже и строки списка связаны; «Паспорт защиты» — выбранные работы, сумма «от», самая долгая работа */
  function protect() {
    var box = $('[data-protect]');
    if (!box) return;
    box.hidden = false;
    var boxes = $$('input[data-z]', box), pts = $$('.sv-pt', box), pass = $('[data-pass]', box);
    var book = box.getAttribute('data-book'), note = box.getAttribute('data-note');
    var dur = function (hh) { return hh >= 24 ? 'от ' + Math.round(hh / 24) + ' дн.' : hh >= 1 ? 'от ' + Math.round(hh) + ' ч' : hh > 0 ? 'от ' + Math.round(hh * 60) + ' мин' : ''; };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var draw = function () {
      var on = boxes.filter(function (b) { return b.checked; });
      pts.forEach(function (p) { var b = boxes[+p.getAttribute('data-z')]; p.setAttribute('aria-pressed', b && b.checked ? 'true' : 'false'); });
      if (!on.length) { pass.innerHTML = '<p class="sv-pass-k">Паспорт защиты</p><p class="sv-pass-empty">Отметьте на машине, что защитить, — здесь появится план работ с ценами из прайса студии.</p>'; return; }
      var sum = 0, longest = 0;
      var rows = on.map(function (b) {
        sum += +b.getAttribute('data-price') || 0; longest = Math.max(longest, +b.getAttribute('data-h') || 0);
        return '<li>' + esc(b.getAttribute('data-name')) + '<span>' + esc(b.getAttribute('data-time') || '') + '</span></li>';
      }).join('');
      var list = on.map(function (b) { return b.getAttribute('data-service') || b.getAttribute('data-name'); }).join(', ');
      var href = book ? book + '?s=' + encodeURIComponent('Осмотр: ' + list) : '';
      pass.innerHTML = '<p class="sv-pass-k">Паспорт защиты · ' + on.length + ' ' + (on.length === 1 ? 'работа' : on.length < 5 ? 'работы' : 'работ') + '</p>'
        + '<p class="sv-pass-h">Ваш план</p><ul>' + rows + '</ul>'
        + '<p class="sv-pass-sum"><b>от ' + nb(sum) + ' ₽</b><span>' + (longest ? 'самая долгая работа — ' + dur(longest) : '') + '</span></p>'
        + (note ? '<p class="sv-pass-note">' + esc(note) + '</p>' : '')
        + (href ? '<div class="sv-cta"><a class="btn btn-main" href="' + esc(href) + '" data-booking>Записаться на осмотр</a></div>' : '');
    };
    boxes.forEach(function (b) { b.addEventListener('change', draw); });
    pts.forEach(function (p) { p.addEventListener('click', function () { var b = boxes[+p.getAttribute('data-z')]; if (b) { b.checked = !b.checked; draw(); } }); });
    draw();
  }
})();
