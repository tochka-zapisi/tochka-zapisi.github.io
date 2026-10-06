/* Шаблон «Лендинг»: карта по нажатию, цели Яндекс Метрики (звонок, мессенджер, запись, маршрут), уведомление о cookie. Без зависимостей. */
(function () {
  var map = document.querySelector('.map[data-src]');
  if (map) map.addEventListener('click', function (e) {
    if (!e.target.closest('.map-load')) return;
    var f = document.createElement('iframe');
    f.src = map.getAttribute('data-src'); f.title = 'Карта проезда'; f.allowFullscreen = true;
    map.appendChild(f);
  });

  /* Стиль «Ателье»: плавное появление блоков при прокрутке и «матовая» шапка после первого экрана.
     Класс .js ставится в <head> (без скрипта всё просто видно); при reduce-motion блоки видны сразу (см. atelier.css). */
  var reveal = document.querySelectorAll('[data-reveal]');
  if (reveal.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (list) {
        list.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      reveal.forEach(function (el) { io.observe(el); });
    } else reveal.forEach(function (el) { el.classList.add('in'); });
  }
  var top = document.querySelector('[data-style="atelier"] .top');
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouse = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (top) {
    /* одна обработка прокрутки на кадр: матовая шапка, полоса прогресса, параллакс фото первого экрана */
    var hero = document.querySelector('.hero');
    var root = document.documentElement, tick = false;
    var mark = function () {
      tick = false;
      var y = window.scrollY;
      top.classList.toggle('is-scrolled', y > 40);
      var max = root.scrollHeight - window.innerHeight;
      top.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
      if (hero && !still) {
        var hh = hero.offsetHeight;
        if (y < hh) {
          hero.style.setProperty('--py', (y * 0.32).toFixed(1));
          hero.style.setProperty('--fade', Math.max(0, 1 - y / (hh * 0.75)).toFixed(3));
        }
      }
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(mark); } }, { passive: true });
    window.addEventListener('resize', mark, { passive: true });
    mark();

    /* мягкий свет за курсором на первом экране (только мышь) */
    if (hero && mouse && !still) {
      var lit = false, mx = 0, my = 0;
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
        if (!lit) { lit = true; requestAnimationFrame(function () { lit = false; hero.style.setProperty('--mx', mx + 'px'); hero.style.setProperty('--my', my + 'px'); }); }
        hero.classList.add('lit');
      });
      hero.addEventListener('pointerleave', function () { hero.classList.remove('lit'); });
    }

    /* кнопки слегка тянутся к курсору (только мышь) */
    if (mouse && !still) document.querySelectorAll('main .btn, .top .btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.classList.add('magnet'); b.style.translate = (dx * 0.18).toFixed(1) + 'px ' + (dy * 0.3).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.classList.remove('magnet'); b.style.translate = ''; });
    });

    /* цифры рейтинга и отзывов отсчитываются, когда появляется строка фактов */
    if (!still) document.querySelectorAll('[data-count]').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count')); if (!(to > 0)) return;
      var text = el.textContent, frac = /\d[.,]\d/.test(text) ? 1 : 0; /* «5,0» и «4,9» — с десятыми, «1 289» — целое */
      var fmt = function (v) { return frac ? v.toFixed(1).replace('.', ',') : String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
      el.textContent = fmt(0);
      setTimeout(function () {
        var t0 = performance.now(), dur = 1600;
        (function step(t) {
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
          el.textContent = k < 1 ? fmt(to * e) : text;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      }, 1000);
    });
  }

  var ym = document.body.getAttribute('data-ym');
  if (ym) document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || typeof window.ym !== 'function') return;
    var h = a.getAttribute('href');
    var goal = /^tel:/.test(h) ? 'call' : a.hasAttribute('data-booking') ? 'booking'
      : /t\.me|wa\.me|max\.ru|vk\.com/.test(h) ? 'messenger' : /rtext=|maps/.test(h) ? 'route' : '';
    if (goal) window.ym(+ym, 'reachGoal', goal);
  });

  var c = document.querySelector('.cookie');
  if (c) {
    var ok = null;
    try { ok = localStorage.getItem('cookie-ok'); } catch (e) { /* хранилище недоступно */ }
    if (!ok) c.hidden = false;
    c.querySelector('button').addEventListener('click', function () {
      c.hidden = true;
      try { localStorage.setItem('cookie-ok', '1'); } catch (e) { /* не страшно */ }
    });
  }
})();
