/* Стиль «Полночь»: часы по разделам, «Открыто / откроемся», «до полуночи», меню-вкладки, появление, кольца в полночь.
   Без скрипта всё видно сразу (класс .js ставится здесь). */
(function () {
  var d = document, root = d.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* --- заставка: часы 18:00 → 00:00 (шаг 30 мин), на полуночи — неон, затем экран уходит вверх --- */
  var pre = d.querySelector('[data-pre]');
  if (pre && root.classList.contains('pre-on')) {
    var pc = pre.querySelector('[data-pre-clock]'), h = parseInt(pc.textContent, 10) || 18, m = 0, done = false;
    var out = function () { if (done) return; done = true; root.classList.add('pre-out'); setTimeout(function () { pre.hidden = true; root.classList.remove('pre-on', 'pre-out', 'pre-lit'); }, 900); };
    var tick = setInterval(function () {
      m += 30; if (m === 60) { m = 0; h = (h + 1) % 24; }
      pc.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
      if (h === 0 && m === 0) { clearInterval(tick); root.classList.add('pre-lit'); setTimeout(out, 650); }
    }, 900 / 12);
    pre.addEventListener('click', function () { clearInterval(tick); out(); });
  }

  /* --- открыто ли сейчас (часы работы через полночь: 18:00–02:00) --- */
  var st = d.querySelector('[data-status]');
  var toMin = function (s) { var p = String(s).split(':'); return (+p[0]) * 60 + (+p[1] || 0); };
  var plural = function (n, a, b, c) { n = Math.abs(n) % 100; var m = n % 10; return n > 10 && n < 20 ? c : m > 1 && m < 5 ? b : m === 1 ? a : c; };
  var dur = function (m) { var h = Math.floor(m / 60), mm = m % 60; return (h ? h + ' ч ' : '') + mm + ' мин'; };
  function state() {
    if (!st) return null;
    var now = new Date(), t = now.getHours() * 60 + now.getMinutes(), o = toMin(st.dataset.open), c = toMin(st.dataset.close);
    var open = c > o ? (t >= o && t < c) : (t >= o || t < c);
    var left = open ? ((c - t + 1440) % 1440) : ((o - t + 1440) % 1440);
    return { open: open, left: left, t: t };
  }
  function paint() {
    var s = state(); if (!s) return;
    st.classList.toggle('is-open', s.open);
    st.querySelector('b').textContent = s.open ? 'Открыто до ' + st.dataset.close : 'Откроемся в ' + st.dataset.open;
    var till = d.querySelector('[data-till]');
    if (till) {
      var toMid = (1440 - s.t) % 1440;
      till.textContent = s.open
        ? (toMid && toMid < 360 ? 'Сейчас открыто · до полуночи ' + dur(toMid) : 'Сейчас открыто · до закрытия ' + dur(s.left))
        : 'Сегодня откроемся в ' + st.dataset.open + ' · через ' + dur(s.left);
    }
  }
  paint(); setInterval(paint, 30000);

  /* --- часы в шапке и циферблат: какой «час» сейчас на экране --- */
  var clock = d.querySelector('[data-clock]'), dial = d.querySelectorAll('[data-dial]');
  var hours = d.querySelectorAll('[data-time]');
  function setTime(t, id) {
    if (clock && clock.textContent !== t) {
      if (reduce) clock.textContent = t;
      else { clock.classList.add('flip'); setTimeout(function () { clock.textContent = t; clock.classList.remove('flip'); }, 180); }
    }
    for (var i = 0; i < dial.length; i++) dial[i].classList.toggle('on', dial[i].dataset.dial === id);
  }
  if ('IntersectionObserver' in window && hours.length) {
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setTime(e.target.dataset.time, e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    hours.forEach(function (h) { seen.observe(h); });
  }

  /* --- появление --- */
  var rs = d.querySelectorAll('[data-r]');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rs.forEach(function (r) { io.observe(r); });
  } else rs.forEach(function (r) { r.classList.add('in'); });

  /* --- меню: вкладки (стрелки, Home/End) --- */
  var tabs = Array.prototype.slice.call(d.querySelectorAll('.m-tabs [role="tab"]'));
  function pick(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      d.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, j = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : null;
      if (j === null) return; e.preventDefault(); pick(tabs[(j + tabs.length) % tabs.length], true);
    });
  });

  /* --- полночь: кольца растут, пока раздел проходит через экран (только transform) --- */
  var mid = d.getElementById('midnight'), big = mid && mid.querySelector('.rings.big');
  if (big && !reduce) {
    var ticking = false;
    var upd = function () {
      ticking = false;
      var r = mid.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      big.style.setProperty('--grow', (0.45 + p * 0.9).toFixed(3));
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
})();
