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
    /* одна обработка прокрутки на кадр: матовая шапка, полоса прогресса, параллакс фото первого экрана.
       Размеры страницы запоминаются заранее (resize, load) — в кадре прокрутки только запись, без пересчёта вёрстки;
       стили пишутся прямо в нужный элемент, а не переменной на весь блок (иначе браузер пересчитывает всё внутри). */
    var hero = document.querySelector('.hero');
    var heroImg = hero && hero.querySelector('.hero-bg img');
    /* фоновое видео (hero.video): только если движение можно, без экономии трафика, на экране от 768 px
       (data-mobile — и на телефоне); играет, пока первый экран виден; до начала и вместо — фото */
    var heroVid = hero && hero.querySelector('.hero-video[data-src]');
    var conn = navigator.connection || {};
    if (heroVid && !still && !conn.saveData && !/(^|-)2g$/.test(conn.effectiveType || '') && (heroVid.hasAttribute('data-mobile') || matchMedia('(min-width: 768px)').matches)) {
      heroVid.addEventListener('playing', function () { heroVid.classList.add('on'); }, { once: true });
      heroVid.src = heroVid.getAttribute('data-src');
      var playVid = function () { var p = heroVid.play(); if (p && p.catch) p.catch(function () {}); };
      if ('IntersectionObserver' in window) new IntersectionObserver(function (l) { if (l[0].isIntersecting) playVid(); else heroVid.pause(); }).observe(hero);
      else playVid();
    } else heroVid = null;
    var heroIn = hero && hero.querySelector('.hero-in');
    var bar = top.querySelector('.progress');
    var root = document.documentElement, tick = false, max = 1, hh = 1, scrolled = null, heroDone = false;
    var measure = function () { max = Math.max(1, root.scrollHeight - window.innerHeight); hh = hero ? hero.offsetHeight : 1; };
    var mark = function () {
      tick = false;
      var y = window.scrollY;
      var s = y > 40;
      if (s !== scrolled) { scrolled = s; top.classList.toggle('is-scrolled', s); }
      if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / max).toFixed(4) + ')';
      if (hero && !still) {
        if (y < hh) {
          heroDone = false;
          if (heroImg) heroImg.style.translate = '0 ' + (y * 0.32).toFixed(1) + 'px';
          if (heroVid) heroVid.style.translate = heroImg.style.translate;
          if (heroIn) { heroIn.style.opacity = Math.max(0, 1 - y / (hh * 0.75)).toFixed(3); heroIn.style.translate = '0 ' + (y * -0.08).toFixed(1) + 'px'; }
        } else if (!heroDone) { heroDone = true; if (heroIn) heroIn.style.opacity = '0'; }
      }
    };
    var onScroll = function () { if (!tick) { tick = true; requestAnimationFrame(mark); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
    window.addEventListener('load', function () { measure(); onScroll(); });
    measure(); mark();

    /* мягкий свет за курсором на первом экране (только мышь): двигается transform, градиент не перерисовывается */
    var light = hero && hero.querySelector('.hero-light');
    if (light && mouse && !still) {
      var lit = false, mx = 0, my = 0, box = null;
      hero.addEventListener('pointerenter', function () { box = hero.getBoundingClientRect(); hero.classList.add('lit'); });
      hero.addEventListener('pointermove', function (e) {
        if (!box) box = hero.getBoundingClientRect();
        mx = e.clientX - box.left; my = e.clientY - box.top;
        if (!lit) { lit = true; requestAnimationFrame(function () { lit = false; light.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; }); }
      });
      hero.addEventListener('pointerleave', function () { hero.classList.remove('lit'); });
      window.addEventListener('scroll', function () { box = null; }, { passive: true });
    }

    /* бегущая строка стоит, когда её не видно — не тратит силы телефона */
    var mq = document.querySelector('.marquee');
    if (mq && 'IntersectionObserver' in window) new IntersectionObserver(function (l) { mq.classList.toggle('off', !l[0].isIntersecting); }).observe(mq);

    /* кнопки слегка тянутся к курсору (только мышь) */
    if (mouse && !still) document.querySelectorAll('main .btn, .top .btn').forEach(function (b) {
      var r = null;
      b.addEventListener('pointerenter', function () { r = b.getBoundingClientRect(); });
      b.addEventListener('pointermove', function (e) {
        if (!r) r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.classList.add('magnet'); b.style.translate = (dx * 0.18).toFixed(1) + 'px ' + (dy * 0.3).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { r = null; b.classList.remove('magnet'); b.style.translate = ''; });
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

  /* Стиль «Табло»: сегодняшний день, прошедшие занятия, ближайшее занятие; на телефоне — вкладки по дням */
  var board = document.querySelector('[data-board]');
  if (board) {
    var days = board.querySelectorAll('.t-day'), tabs = document.querySelectorAll('.t-tabs button');
    var now = new Date(), today = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
    var toMin = function (t) { var m = String(t).match(/(\d{1,2})[:.](\d{2})/); return m ? +m[1] * 60 + +m[2] : 0; };
    var show = function (d) {
      days.forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-d') === String(d)); });
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-d') === String(d) ? 'true' : 'false'); });
    };
    tabs.forEach(function (t) {
      if (t.getAttribute('data-d') === String(today)) t.classList.add('today');
      t.addEventListener('click', function () { show(t.getAttribute('data-d')); });
    });
    var todayCol = board.querySelector('.t-day[data-d="' + today + '"]');
    if (todayCol) todayCol.classList.add('today');
    show(today);
    /* ближайшее занятие: сегодня позже текущего времени, иначе первое в следующие дни */
    var names = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу'];
    var next = null, when = '';
    for (var k = 0; k < 7 && !next; k++) {
      var d = (today + k) % 7, col = board.querySelector('.t-day[data-d="' + d + '"]');
      if (!col) continue;
      var items = col.querySelectorAll('li');
      for (var i = 0; i < items.length; i++) {
        var t = toMin(items[i].getAttribute('data-t'));
        if (k === 0 && t <= mins) { items[i].classList.add('past'); continue; }
        if (!next) { next = items[i]; when = k === 0 ? 'сегодня' : k === 1 ? 'завтра' : 'в ' + names[d]; }
      }
    }
    var label = document.querySelector('[data-next]');
    if (next && label) {
      next.classList.add('next');
      label.textContent = 'Ближайшее: ' + when + ' в ' + next.getAttribute('data-t') + ' — ' + next.querySelector('b').textContent;
      label.hidden = false;
    }
  }

  /* Стиль «Лист»: «Кто у вас?» — оставляет в ценах и среди врачей только подходящее */
  var sw = document.querySelector('[data-pets-switch]');
  if (sw) {
    var lists = document.querySelectorAll('[data-pets-list]'), empty = document.querySelector('.l-empty');
    sw.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-pet]'); if (!btn) return;
      var pet = btn.getAttribute('data-pet');
      sw.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      lists.forEach(function (list) {
        var shown = 0;
        list.querySelectorAll(':scope > li').forEach(function (li) {
          var p = li.getAttribute('data-pets'), ok = !pet || !p || (' ' + p + ' ').indexOf(' ' + pet + ' ') > -1;
          li.hidden = !ok; li.classList.remove('is-in');
          if (ok) { shown++; void li.offsetWidth; li.classList.add('is-in'); }
        });
        if (empty && list.classList.contains('l-menu')) empty.hidden = shown > 0;
      });
    });
  }

  /* Стиль «Афиша»: дверь открывается, табличка «Открыто/Закрыто» по часам, уровни мастера в прайсе,
     снимки на бечёвке качаются от прокрутки, ролик в телефоне играет, только пока виден */
  var door = document.querySelector('[data-door]');
  if (door) {
    var openDoor = function () { door.classList.add('a-open'); };
    if (still) openDoor(); else requestAnimationFrame(function () { setTimeout(openDoor, 380); });
    var sign = door.querySelector('[data-sign]');
    if (sign) {
      var wk = {}; try { wk = JSON.parse(sign.getAttribute('data-hours') || '{}'); } catch (e) { /* без часов */ }
      var toM = function (t) { var m = String(t).match(/(\d{1,2}):(\d{2})/); return m ? +m[1] * 60 + +m[2] : 0; };
      var dn = new Date(), dow = dn.getDay(), nowM = dn.getHours() * 60 + dn.getMinutes(), td = wk[dow];
      var DN = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу'];
      var tt = sign.querySelector('.a-sign-t'), sm = sign.querySelector('small');
      if (Object.keys(wk).length) {
        if (td && nowM >= toM(td[0]) && nowM < toM(td[1])) { tt.textContent = 'Открыто'; sm.textContent = 'до ' + td[1]; }
        else {
          sign.classList.add('a-closed'); tt.textContent = 'Закрыто';
          if (td && nowM < toM(td[0])) sm.textContent = 'откроемся в ' + td[0];
          else for (var k = 1; k < 8; k++) { var nd = (dow + k) % 7; if (wk[nd]) { sm.textContent = (k === 1 ? 'завтра' : DN[nd]) + ' в ' + wk[nd][0]; break; } }
        }
      }
    }
  }
  var tiersBox = document.querySelector('[data-tiers]'), menu = document.querySelector('[data-menu]');
  if (tiersBox && menu) {
    var tierBtns = tiersBox.querySelectorAll('button[data-t]');
    var setTier = function (t, roll) {
      menu.setAttribute('data-cur', t);
      tierBtns.forEach(function (b) { var on = b.getAttribute('data-t') === t; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
      menu.querySelectorAll('.a-p[data-t]').forEach(function (p) {
        var on = p.getAttribute('data-t') === t; p.hidden = !on;
        if (on && roll && !still) { p.classList.remove('a-roll'); void p.offsetWidth; p.classList.add('a-roll'); }
      });
      menu.querySelectorAll('li[data-only]').forEach(function (li) { li.classList.toggle('a-na', (' ' + li.getAttribute('data-only') + ' ').indexOf(' ' + t + ' ') < 0); });
    };
    tiersBox.addEventListener('click', function (e) { var b = e.target.closest('button[data-t]'); if (b && b.getAttribute('aria-checked') !== 'true') setTier(b.getAttribute('data-t'), true); });
    tiersBox.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var list = [].slice.call(tierBtns), i = list.indexOf(document.activeElement); if (i < 0) return;
      var n = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
      e.preventDefault(); n.focus(); setTier(n.getAttribute('data-t'), true);
    });
    setTier(menu.getAttribute('data-cur') || tierBtns[0].getAttribute('data-t'), false);
  }
  /* снимки качаются: скорость прокрутки толкает «маятник», пружина возвращает; работает, только пока стена видна */
  var wall = document.getElementById('wall');
  if (wall && !still && 'IntersectionObserver' in window) {
    var prints = [].slice.call(wall.querySelectorAll('.a-print')), seen = false, lastY = window.scrollY, ang = 0, vel = 0, run = false;
    var ks = prints.map(function (p, i) { return [0.8, 1.15, 0.95, 1.25, 0.7][i % 5] * (i % 2 ? -1 : 1); });
    new IntersectionObserver(function (l) { seen = l[0].isIntersecting; lastY = window.scrollY; }).observe(wall);
    var swing = function () {
      vel += -ang * 0.07; vel *= 0.9; ang += vel;
      if (Math.abs(ang) < 0.02 && Math.abs(vel) < 0.02) { run = false; ang = vel = 0; prints.forEach(function (p) { p.style.transform = ''; }); return; }
      prints.forEach(function (p, i) { p.style.transform = 'rotate(' + (ang * ks[i]).toFixed(2) + 'deg)'; });
      requestAnimationFrame(swing);
    };
    window.addEventListener('scroll', function () {
      var y = window.scrollY, dy = y - lastY; lastY = y;
      if (!seen) return;
      vel += Math.max(-1.2, Math.min(1.2, dy * 0.025));
      if (!run) { run = true; requestAnimationFrame(swing); }
    }, { passive: true });
  }
  var vid = document.querySelector('[data-video]');
  if (vid) {
    var vsrc = vid.querySelector('source[data-src]'), play = vid.parentNode.querySelector('.a-play');
    var cn = navigator.connection || {}, auto = !still && !cn.saveData;
    var vload = function () { if (vsrc && !vsrc.getAttribute('src')) { vsrc.setAttribute('src', vsrc.getAttribute('data-src')); vid.load(); } };
    var vplay = function () { vload(); var p = vid.play(); if (p && p.catch) p.catch(function () { if (play) play.hidden = false; }); };
    if (auto && 'IntersectionObserver' in window) new IntersectionObserver(function (l) { if (l[0].isIntersecting) vplay(); else if (!vid.paused) vid.pause(); }, { threshold: 0.35 }).observe(vid);
    else if (play) play.hidden = false;
    if (play) play.addEventListener('click', function () { play.hidden = true; vid.controls = true; vplay(); });
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
