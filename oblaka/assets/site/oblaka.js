/* Движение стиля «Облака» (см. oblaka.mjs). Lenis — если есть (assets/vendor/lenis.min.js), остальное — свой код.
   Часы вечера: время идёт от прокрутки между разделами (data-time), шапка и циферблат показывают его;
   шапка темнеет к ночи. Слова заголовков и блоки появляются при входе в экран. Облака первого экрана — лёгкий параллакс.
   Программы для двоих: при наведении/фокусе циферблат рисует дугу «начнёте сейчас — закончите в …».
   Прелоадер «закат» — один раз за визит. «Меньше движения» — всё сразу на месте, без прелоадера. Только transform / opacity. */
(function () {
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };
  if (still || !('IntersectionObserver' in window)) { root.classList.add('ob-done'); return; }

  /* заставка «Свеча»: ob-intro ставит встроенный скрипт в начале страницы (один раз за визит). Здесь — её ход:
     2,0 с — свеча и название, затем свет раскрывается (ob-open), через 1,2 с заставка убирается (ob-done). Клик или клавиша — сразу к сайту.
     ob-go — движение на странице включено (появления при прокрутке), при каждом заходе */
  root.classList.add('ob-go');
  if (root.classList.contains('ob-intro')) {
    var opened = false;
    var open = function () { if (opened) return; opened = true; root.classList.add('ob-open'); setTimeout(function () { root.classList.add('ob-done'); }, 1250); };
    setTimeout(open, 2000);
    ['pointerdown', 'keydown'].forEach(function (e) { addEventListener(e, open, { once: true, passive: true }); });
  } else root.classList.add('ob-skip');

  /* слова заголовков: каждое — в маску, поднимается по очереди */
  $$('[data-words]').forEach(function (el) {
    var i = 0;
    var walk = function (node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement('span'); w.className = 'ob-w'; w.setAttribute('aria-hidden', 'true');
            var s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++); w.appendChild(s); frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('ob-w')) walk(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    walk(el);
  });

  /* появление: в группах — по очереди */
  var io = new IntersectionObserver(function (list) {
    list.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('[data-rise]').forEach(function (el) {
    var sib = el.parentNode ? [].slice.call(el.parentNode.children).filter(function (x) { return x.hasAttribute('data-rise'); }) : [];
    el.style.setProperty('--i', Math.min(6, sib.indexOf(el)));
    io.observe(el);
  });
  $$('[data-words]').forEach(function (el) { io.observe(el); });
  /* первый экран — сразу после прелоадера */
  var heroH = $('.ob-hero h1');
  if (heroH) setTimeout(function () { heroH.classList.add('is-in'); }, seen ? 80 : 1500);

  /* плавная прокрутка */
  var lenis = null;
  if (window.Lenis && matchMedia('(pointer: fine)').matches) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -70 } });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  }

  /* часы вечера: разделы с data-time → минуты; между разделами — по доле прокрутки */
  var secs = $$('section[data-time]');
  var toM = function (t) { var m = String(t).match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : 0; };
  var two = function (n) { return (n < 10 ? '0' : '') + n; };
  var fmt = function (m) { m = Math.round(m) % 1440; return two(Math.floor(m / 60)) + ':' + two(m % 60); };
  var marks = [], top = $('.ob-top'), clocks = $$('[data-clock]'), phaseEl = $('.ob-top [data-phase]'), note = $('[data-dial-note]');
  var dial = $('.ob-dial'), hH = $('.ob-hand-h'), hM = $('.ob-hand-m'), arc = $('.ob-dial-arc');
  var measure = function () {
    marks = secs.map(function (s) { var r = s.getBoundingClientRect(); return { y: r.top + scrollY, m: toM(s.getAttribute('data-time')), phase: s.getAttribute('data-phase'), night: s.classList.contains('ob-night'), b: getComputedStyle(s).getPropertyValue('--a') }; });
  };
  measure(); addEventListener('resize', measure); addEventListener('load', measure);
  /* разделы раскладываются по мере прокрутки (content-visibility) — уточняем отметки времени, когда прокрутка остановилась */
  var mT = 0; addEventListener('scroll', function () { clearTimeout(mT); mT = setTimeout(measure, 250); }, { passive: true });
  var now = 18 * 60, phase = '', hover = 0;
  var draw = function () {
    clocks.forEach(function (c) { c.textContent = fmt(now); });
    if (hH) hH.style.transform = 'rotate(' + (((now / 60) % 12) * 30).toFixed(2) + 'deg)';
    if (hM) hM.style.transform = 'rotate(' + ((now % 60) * 6).toFixed(2) + 'deg)';
    if (note && !hover) note.textContent = phase;
  };
  var arcPath = function (from, len) {
    /* дуга на циферблате: от текущего времени на len минут (12 часов = круг) */
    var a0 = ((from / 60) % 12) * 30, a1 = a0 + len / 2, r = 40;
    var pt = function (a) { var rad = (a - 90) * Math.PI / 180; return (50 + r * Math.cos(rad)).toFixed(2) + ' ' + (50 + r * Math.sin(rad)).toFixed(2); };
    return 'M' + pt(a0) + ' A' + r + ' ' + r + ' 0 ' + (len / 2 > 180 ? 1 : 0) + ' 1 ' + pt(a1);
  };
  var tick = function () {
    var y = scrollY + innerHeight * 0.45, m = marks.length ? marks[0].m : now, k = 0;
    for (var i = 0; i < marks.length; i++) {
      if (y >= marks[i].y) {
        k = i;
        var nx = marks[i + 1];
        m = nx ? marks[i].m + (nx.m - marks[i].m) * Math.min(1, (y - marks[i].y) / Math.max(1, nx.y - marks[i].y)) : marks[i].m;
      }
    }
    now = m; phase = marks[k] ? marks[k].phase : '';
    if (phaseEl) phaseEl.textContent = phase;
    if (top) {
      var cur = marks[k]; var past = scrollY > 40;
      top.classList.toggle('is-night', !!(cur && cur.night && past));
      top.classList.toggle('is-solid', past);
      if (cur) top.style.setProperty('--top-bg', cur.night ? '#151215' : cur.b.trim() || '#f6bf98');
    }
    if (dial) dial.classList.toggle('is-on', scrollY > innerHeight * 0.6);
    draw();
  };
  var ticking = false;
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; tick(); parallax(); }); } }, { passive: true });

  /* облака первого экрана — медленнее прокрутки */
  var heroClouds = $('.ob-hero-clouds'), sun = $('.ob-sun');
  var parallax = function () {
    var y = scrollY; if (y > innerHeight * 1.2) return;
    if (heroClouds) heroClouds.style.transform = 'translate3d(0,' + (y * 0.25).toFixed(1) + 'px,0)';
    if (sun) sun.style.transform = 'translate3d(0,' + (y * 0.45).toFixed(1) + 'px,0)';
  };
  tick();

  /* программы: дуга длительности на циферблате */
  $$('.ob-pair').forEach(function (p) {
    var m = +p.getAttribute('data-min') || 0;
    var on = function () {
      hover = 1; $$('.ob-pair.is-on').forEach(function (x) { x.classList.remove('is-on'); }); p.classList.add('is-on');
      if (arc) arc.setAttribute('d', arcPath(now, m));
      if (note) note.textContent = 'начнёте в ' + fmt(now) + ' — закончите в ' + fmt(now + m);
    };
    var off = function () { hover = 0; p.classList.remove('is-on'); if (arc) arc.setAttribute('d', ''); draw(); };
    p.addEventListener('mouseenter', on); p.addEventListener('focus', on);
    p.addEventListener('mouseleave', off); p.addEventListener('blur', off);
  });
})();

/* «Ваш вечер» (блок [data-plan] в разделе «для двоих»): программа → день → начало = приглашение со временем «19:00 — 21:05».
   Работает и в режиме «меньше движения» (отдельно от анимаций выше). Дни — ближайшие 4 рабочих по data-hours (ключ — день недели getDay),
   начало — с 17:00 (или от открытия, если позже) шагом 30 минут, так чтобы закончить до закрытия; сегодня — не раньше чем через 30 минут.
   Кнопки: записаться (запись по ссылке ?s=<услуга>), подарить (приложение ?tab=cert), пригласить (поделиться / скопировать текст). */
(function () {
  var box = document.querySelector('[data-plan]');
  if (!box) return;
  var q = function (s) { return box.querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var toM = function (t) { var m = String(t || '').match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : 0; };
  var fmt = function (m) { m = ((m % 1440) + 1440) % 1440; return Math.floor(m / 60) + ':' + ('0' + m % 60).slice(-2); };
  var NB = ' ';
  var hours = {}; try { hours = JSON.parse(box.getAttribute('data-hours')) || {}; } catch (e) { /* без часов — блок не показываем */ }
  var WD = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  var WDA = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу'];
  var MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var now = new Date(), nowM = now.getHours() * 60 + now.getMinutes();
  var days = [];
  for (var i = 0; i < 10 && days.length < 4; i++) {
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), hh = hours[d.getDay()];
    if (!hh) continue;
    days.push({ d: d, i: i, open: toM(hh[0]), close: toM(hh[1]) <= toM(hh[0]) ? toM(hh[1]) + 1440 : toM(hh[1]) });
  }
  var progs = [].slice.call(q('[data-p]').children);
  if (!days.length || !progs.length) return;
  var st = { p: Math.min(2, progs.length - 1), d: 0, t: null };
  /* программа с названием студии — по умолчанию, если есть («В облаках» у «В облаках») */
  var brand = box.getAttribute('data-brand') || '';
  progs.forEach(function (b, k) { if (brand && b.getAttribute('data-short').indexOf(brand) >= 0) st.p = k; });

  var slots = function (day, dur) {
    var from = Math.max(day.open, 17 * 60), out = [];
    if (day.i === 0) from = Math.max(from, Math.ceil((nowM + 30) / 30) * 30);
    for (var m = Math.ceil(from / 30) * 30; m + dur <= day.close; m += 30) out.push(m);
    return out;
  };
  var dayLabel = function (x) { return x.i === 0 ? 'Сегодня' : x.i === 1 ? 'Завтра' : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][x.d.getDay()] + ', ' + x.d.getDate(); };
  var press = function (wrap, k) { [].slice.call(wrap.children).forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); }); };

  var render = function () {
    var p = progs[st.p], dur = +p.getAttribute('data-min') || 60;
    /* дни: если сегодня уже не успеть — сразу следующий */
    var dBox = q('[data-d]');
    dBox.innerHTML = days.map(function (x) { var n = slots(x, dur).length; return '<button type="button"' + (n ? '' : ' disabled') + '>' + esc(dayLabel(x)) + '</button>'; }).join('');
    if (!slots(days[st.d], dur).length) { for (var k = 0; k < days.length; k++) if (slots(days[k], dur).length) { st.d = k; break; } }
    var day = days[st.d], list = slots(day, dur);
    if (st.t == null || list.indexOf(st.t) < 0) { var pref = list.filter(function (m) { return m >= 19 * 60; })[0]; st.t = pref != null ? pref : list[0]; }
    q('[data-t]').innerHTML = list.map(function (m) { return '<button type="button" data-m="' + m + '">' + fmt(m) + '</button>'; }).join('') || '<span class="ob-plan-none">Свободного вечера нет — позвоните нам</span>';
    press(q('[data-p]'), st.p); press(dBox, st.d); press(q('[data-t]'), list.indexOf(st.t));
    if (st.t == null) { q('[data-inv]').innerHTML = ''; return; }
    var end = st.t + dur, name = p.getAttribute('data-name'), short = p.getAttribute('data-short'), price = p.getAttribute('data-price');
    var date = WD[day.d.getDay()] + ', ' + day.d.getDate() + NB + MON[day.d.getMonth()];
    var span = Math.max(1, day.close - 17 * 60), a = Math.max(0, (st.t - 17 * 60) / span), w = dur / span;
    var book = box.getAttribute('data-book'), app = box.getAttribute('data-app'), after = box.getAttribute('data-after'), place = box.getAttribute('data-place');
    q('[data-inv]').innerHTML =
      '<p class="ob-inv-k"><span>Приглашение</span><span>' + esc(brand) + '</span></p>' +
      '<p class="ob-inv-d">' + esc(date[0].toUpperCase() + date.slice(1)) + '</p>' +
      '<p class="ob-inv-t"><b>' + fmt(st.t) + '</b><i aria-hidden="true"></i><b>' + fmt(end) + '</b></p>' +
      '<p class="ob-inv-n">' + esc(short) + '</p>' +
      '<div class="ob-inv-bar" aria-hidden="true"><span style="left:' + (a * 100).toFixed(1) + '%;width:' + (w * 100).toFixed(1) + '%"></span><small>17:00</small><small>' + fmt(day.close) + '</small></div>' +
      '<p class="ob-inv-m">' + esc(place) + (after ? ' · ' + esc(after) : '') + '</p>' +
      (price ? '<p class="ob-inv-p">' + esc(price) + ' <small>за двоих</small></p>' : '') +
      '<div class="ob-inv-act"><a class="btn btn-main" href="' + esc(book) + '?s=' + encodeURIComponent(name) + '" data-booking>Записаться на это время</a>' +
      (app ? '<a class="ob-link" href="' + esc(app) + '?tab=cert">Подарить этот вечер</a>' : '') +
      '<button type="button" class="ob-link" data-share>Пригласить</button></div>';
    q('[data-share]').addEventListener('click', function (e) {
      var text = 'Приглашаю тебя ' + (day.i === 0 ? 'сегодня' : day.i === 1 ? 'завтра' : WDA[day.d.getDay()]) + ' в «' + brand + '»: ' + short + ', с ' + fmt(st.t) + ' до ' + fmt(end) + '. ' + place;
      var url = location.href.split('#')[0] + '#pairs', btn = e.currentTarget;
      if (navigator.share) { navigator.share({ title: brand, text: text, url: url }).catch(function () {}); return; }
      try { navigator.clipboard.writeText(text + ' ' + url).then(function () { btn.textContent = 'Текст скопирован'; }); } catch (err) { /* без буфера обмена — ничего */ }
    });
  };
  box.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button'); if (!b || b.disabled || b.hasAttribute('data-share')) return;
    var wrap = b.parentNode, k = [].indexOf.call(wrap.children, b);
    if (wrap.hasAttribute('data-p')) { st.p = k; st.t = null; }
    else if (wrap.hasAttribute('data-d')) { st.d = k; st.t = null; }
    else if (wrap.hasAttribute('data-t')) st.t = +b.getAttribute('data-m');
    render();
  });
  box.hidden = false;
  render();
  /* пока выбирают вечер — часы-циферблат в углу прячутся (не перекрывают кнопки времени) */
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { document.documentElement.classList.toggle('ob-plan-in', es[0].isIntersecting); }, { rootMargin: '-20% 0px -20% 0px' }).observe(box);
})();

/* «Кадры»: петли играют только в кадре; «меньше движения» — постер без проигрывания */
(function () {
  var vids = [].slice.call(document.querySelectorAll('video[data-film]'));
  if (!vids.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  /* грузим и играем только после того, как человек начал листать: кто не листает — не тратит трафик на видео */
  var start = function () {
    removeEventListener('scroll', start);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var v = e.target; if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
    }, { rootMargin: '120px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  };
  addEventListener('scroll', start, { passive: true });
})();
