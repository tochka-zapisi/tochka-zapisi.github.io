/* Приложение заведения для гостей (демо): главная, меню с предзаказом, бронь, карта гостя с QR, сертификаты и контакты.
   Данные — window.APP (data.js из site.json). Брони — в том же хранилище, что и бронь на сайте (bron:<имя>): администратор видит всё вместе. */
(function () {
  var A = window.APP, d = document, $ = function (s, r) { return (r || d).querySelector(s); };
  if (!A) return;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var rub = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; };
  var toMin = function (s) { var p = String(s).split(':'); return +p[0] * 60 + (+p[1] || 0); };
  var hm = function (m) { m = (m + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  var dur = function (m) { var h = Math.floor(m / 60); return (h ? h + ' ч ' : '') + (m % 60) + ' мин'; };
  var store = function (k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } };
  var KEY = 'bron:' + A.name, ME = 'app:' + A.name;
  var me = store(ME) || { name: '', phone: '', pts: 340, visits: 3 };
  var cart = {};
  var WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], MO = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var rings = function (cls) { return '<svg class="' + (cls || '') + '" viewBox="0 0 220 120" aria-hidden="true"><ellipse class="ring" cx="60" cy="60" rx="46" ry="52" fill="none" stroke="' + A.neon + '"/><ellipse class="ring r2" cx="160" cy="60" rx="46" ry="52" fill="none" stroke="' + A.neon2 + '"/></svg>'; };

  /* открыто ли (часы через полночь) */
  function state() {
    var n = new Date(), t = n.getHours() * 60 + n.getMinutes(), o = toMin(A.open), c = toMin(A.close);
    var open = c > o ? t >= o && t < c : t >= o || t < c;
    return { open: open, t: t, left: open ? (c - t + 1440) % 1440 : (o - t + 1440) % 1440 };
  }
  function status() {
    var s = state(), el = $('[data-st]');
    el.classList.toggle('on', s.open); $('b', el).textContent = s.open ? 'Открыто до ' + A.close : 'Откроемся в ' + A.open;
    return s;
  }

  /* вечера для брони: после полуночи «сегодня» — ещё вчерашний вечер */
  var now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  var base = new Date(now); if (nowMin < toMin(A.close)) base.setDate(base.getDate() - 1);
  var days = []; for (var i = 0; i < 10; i++) { var x = new Date(base); x.setDate(base.getDate() + i); days.push(x); }
  var slots = []; for (var m = toMin(A.slots.from); m <= toMin(A.slots.to) + (toMin(A.slots.to) < toMin(A.slots.from) ? 1440 : 0); m += A.slots.step) slots.push(m);
  var todayFrom = (nowMin < toMin(A.close) ? nowMin + 1440 : nowMin) + 30;
  var B = { day: slots.some(function (m) { return m >= todayFrom; }) ? 0 : 1, time: null, guests: 2, zone: 'sofa' };
  var dayLabel = function (i) { return i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[days[i].getDay()]; };

  /* ---------- экраны ---------- */
  var R = {};
  R.home = function () {
    var s = status(), h = now.getHours(), hi = h >= 5 && h < 12 ? 'Доброе утро' : h >= 12 && h < 17 ? 'Добрый день' : h >= 17 && h < 23 ? 'Добрый вечер' : 'Доброй ночи';
    var toMid = (1440 - s.t) % 1440;
    var clock = s.open ? (toMid && toMid < 360 ? 'Открыто · до полуночи ' + dur(toMid) : 'Открыто · до закрытия ' + dur(s.left)) : 'Откроемся в ' + A.open + ' · через ' + dur(s.left);
    var list = store(KEY) || [], mine = list.filter(function (r) { return r.app; })[0];
    $('#home').innerHTML =
      '<div class="now"><img src="' + A.img.home + '" alt=""><p class="hi">' + hi + (me.name ? ', ' + esc(me.name) : '') + '</p><p class="clock">' + clock + '</p></div>' +
      (mine ? '<div class="card mybook"><span class="num">ВАША БРОНЬ № ' + mine.num + (mine.ok ? ' · ПОДТВЕРЖДЕНА' : ' · ЖДЁТ ПОДТВЕРЖДЕНИЯ') + '</span><b>' + mine.wd + ', ' + mine.day + ' · ' + mine.time + '</b><span>' + mine.guests + ' гост. · ' + esc(mine.zone) + (mine.pre && mine.pre.length ? ' · к приходу: ' + esc(mine.pre.join(', ')) : '') + '</span></div>' : '') +
      '<div class="quick"><button type="button" data-go="book"><b>00</b>Забронировать стол</button><a href="' + A.tel + '"><b>−20%</b>Самовывоз по телефону</a><button type="button" data-go="card"><b>' + me.pts + '</b>баллов на карте</button></div>' +
      (A.host ? '<div class="card host-mini"><span class="ph">' + (A.host.img ? '<img src="' + A.host.img + '" alt="' + esc(A.host.name) + '">' : rings()) + '</span><div><span class="small">' + esc(A.host.role) + '</span><br><b>' + esc(A.host.name) + '</b><p class="small">' + esc(A.host.line) + '</p></div></div>' : '') +
      '<p class="h2">Ближайшие вечера <span class="demo">демо-афиша</span></p><div class="events">' +
      A.events.map(function (e) { return '<div class="ev"><img src="' + e.img + '" alt="" loading="lazy"><div><span>' + esc(e.when) + '</span><b>' + esc(e.title) + '</b></div></div>'; }).join('') + '</div>';
  };

  R.menu = function () {
    var g = R.menu.g || A.groups[0].id;
    var grp = A.groups.filter(function (x) { return x.id === g; })[0];
    var cnt = 0, sum = 0; Object.keys(cart).forEach(function (k) { cnt += cart[k].n; sum += cart[k].n * cart[k].p; });
    $('#menu').innerHTML = '<h1 class="h">Меню</h1><p class="lead small">Отметьте блюда — кухня подготовит их к вашему приходу.</p>' +
      '<div class="chips" role="toolbar" aria-label="Разделы меню">' + A.groups.map(function (x) { return '<button type="button" class="chip" data-g="' + x.id + '" aria-pressed="' + (x.id === g) + '">' + esc(x.name) + '</button>'; }).join('') + '</div>' +
      grp.items.map(function (it, i) {
        var n = cart[it[0]] ? cart[it[0]].n : 0;
        return '<div class="item"><p class="n">' + esc(it[0]) + (it[4] ? ' <span title="шеф рекомендует">★</span>' : '') + '</p><div class="add"><p class="p">' + rub(it[2]) + '</p><span class="qty">' + (n ? '<button type="button" data-q="-1" data-i="' + i + '" aria-label="Убрать">−</button><output>' + n + '</output>' : '') + '<button type="button" class="plus" data-q="1" data-i="' + i + '" aria-label="Добавить: ' + esc(it[0]) + '">+</button></span></div><p class="d">' + esc([it[3], it[1]].filter(Boolean).join(' · ')) + '</p></div>';
      }).join('') + '<p class="small">Цены — по меню бара. Напитки — в баре.</p>' +
      (cnt ? '<div class="basket"><span>К приходу: ' + cnt + ' поз. · ' + rub(sum) + '</span><button type="button" class="btn" data-go="book">К брони</button></div>' : '');
    d.querySelectorAll('#menu [data-g]').forEach(function (b) { b.onclick = function () { R.menu.g = b.dataset.g; R.menu(); }; });
    d.querySelectorAll('#menu [data-q]').forEach(function (b) {
      b.onclick = function () { var it = grp.items[+b.dataset.i], c = cart[it[0]] || { n: 0, p: it[2] }; c.n = Math.max(0, Math.min(20, c.n + +b.dataset.q)); if (c.n) cart[it[0]] = c; else delete cart[it[0]]; R.menu(); };
    });
    bindGo('#menu');
  };

  R.book = function () {
    var minNow = B.day === 0 ? todayFrom : 0;
    if (B.time === null || B.time < minNow) B.time = slots.filter(function (m) { return m >= Math.max(minNow, 20 * 60); })[0] || slots.filter(function (m) { return m >= minNow; })[0] || null;
    var zone = A.zones.filter(function (z) { return z.id === B.zone; })[0];
    if (zone && B.guests > zone.max) { B.zone = (A.zones.filter(function (z) { return z.max >= B.guests; })[0] || zone).id; zone = A.zones.filter(function (z) { return z.id === B.zone; })[0]; }
    var pre = Object.keys(cart).map(function (k) { return k + ' × ' + cart[k].n; });
    $('#book').innerHTML = '<h1 class="h">Бронь стола</h1><p class="lead small">Администратор подтвердит в мессенджере за 15 минут.</p><form class="f" novalidate>' +
      '<fieldset><legend>Вечер</legend><div class="row" role="radiogroup" aria-label="Дата">' + days.map(function (x, i) { return '<button type="button" class="chip" role="radio" data-day="' + i + '" aria-checked="' + (i === B.day) + '">' + dayLabel(i) + '<small>' + x.getDate() + ' ' + MO[x.getMonth()].slice(0, 3) + '</small></button>'; }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Время</legend><div class="row wrapr t" role="radiogroup" aria-label="Время">' + slots.map(function (m) { return '<button type="button" class="chip" role="radio" data-time="' + m + '" aria-checked="' + (m === B.time) + '"' + (m < minNow ? ' disabled' : '') + '>' + hm(m) + '</button>'; }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Гостей</legend><div class="step"><button type="button" data-gs="-1" aria-label="Меньше">−</button><output>' + B.guests + '</output><button type="button" data-gs="1" aria-label="Больше">+</button></div></fieldset>' +
      '<fieldset><legend>Где сесть</legend><div class="zones" role="radiogroup" aria-label="Зона">' + A.zones.map(function (z) { return '<button type="button" class="zone" role="radio" data-zone="' + z.id + '" aria-checked="' + (z.id === B.zone) + '"' + (B.guests > z.max ? ' disabled' : '') + '><b>' + esc(z.name) + '</b><span>' + z.seats + ' гостей</span></button>'; }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Контакты</legend><div class="f" style="gap:10px"><label class="field"><span class="small">Имя</span><input name="name" autocomplete="given-name" value="' + esc(me.name) + '"></label><label class="field"><span class="small">Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7" value="' + esc(me.phone) + '"></label>' +
      '<label class="small" style="display:flex;gap:10px;align-items:flex-start"><input type="checkbox" name="ok" style="width:22px;height:22px;margin:0;accent-color:' + A.neon + '"> <span>Согласен на обработку данных для брони — <a href="../privacy.html">политика</a></span></label></div></fieldset>' +
      '<div class="sum">' + (B.time !== null ? '<b>' + dayLabel(B.day) + ', ' + days[B.day].getDate() + ' ' + MO[days[B.day].getMonth()] + ' · ' + hm(B.time) + '</b> · ' + B.guests + ' гост. · ' + esc(zone.name.toLowerCase()) : 'Выберите время') + (pre.length ? '<br>К приходу: ' + esc(pre.join(', ')) : '<br><button type="button" class="btn btn-ghost" style="min-height:40px;margin-top:8px" data-go="menu">+ Заказать блюда к приходу</button>') + '</div>' +
      '<button class="btn btn-neon btn-wide" type="submit">Забронировать</button><p class="err" role="alert"></p></form>';
    var f = $('#book form');
    d.querySelectorAll('#book [data-day]').forEach(function (b) { b.onclick = function () { B.day = +b.dataset.day; B.time = null; R.book(); }; });
    d.querySelectorAll('#book [data-time]').forEach(function (b) { b.onclick = function () { B.time = +b.dataset.time; R.book(); }; });
    d.querySelectorAll('#book [data-gs]').forEach(function (b) { b.onclick = function () { B.guests = Math.max(1, Math.min(60, B.guests + +b.dataset.gs)); R.book(); }; });
    d.querySelectorAll('#book [data-zone]').forEach(function (b) { b.onclick = function () { B.zone = b.dataset.zone; if (B.zone === 'hall' && B.guests < 15) B.guests = 15; R.book(); }; });
    bindGo('#book');
    f.onsubmit = function (e) {
      e.preventDefault();
      var name = f.name.value.trim(), phone = f.phone.value.replace(/[^\d+]/g, '');
      var miss = B.time === null ? 'Выберите время' : !name ? 'Укажите имя' : phone.replace(/\D/g, '').length < 10 ? 'Проверьте телефон' : !f.ok.checked ? 'Нужно согласие на обработку данных' : '';
      if (miss) { $('.err', f).textContent = miss; return; }
      me.name = name; me.phone = phone; store(ME, me);
      var list = store(KEY) || [], num = String(41 + list.length).padStart(4, '0');
      var rec = { num: num, day: days[B.day].getDate() + ' ' + MO[days[B.day].getMonth()], wd: dayLabel(B.day), time: hm(B.time), guests: B.guests, zone: zone.name, reason: 'Из приложения', pre: pre, name: name, phone: phone, ok: false, app: true };
      list.unshift(rec); store(KEY, list); cart = {};
      sheet('<p class="small" style="font-family:Martian Mono,monospace;letter-spacing:.1em">БРОНЬ № ' + num + '</p><h3>Ждём вас, ' + esc(name) + '!</h3><p>' + rec.wd + ', ' + rec.day + ' · ' + rec.time + ' · ' + rec.guests + ' гост. · ' + esc(rec.zone) + '</p>' + (pre.length ? '<p>К приходу: ' + esc(pre.join(', ')) + '</p>' : '') + '<p class="small" style="color:inherit;opacity:.8">Подтверждение придёт сообщением, напомним за 2 часа. +50 баллов за бронь через приложение.</p>', 'home');
      me.pts += 50; store(ME, me);
    };
  };

  R.card = function () {
    var lv = A.card.levels, cur = lv[0], next = null;
    for (var i = 0; i < lv.length; i++) if (me.visits >= lv[i].from) { cur = lv[i]; next = lv[i + 1] || null; }
    var code = 'W00D-' + String(1000 + (me.phone ? +me.phone.slice(-4) : 2604)).slice(-4) + '-' + String(me.visits).padStart(2, '0');
    $('#card').innerHTML = '<h1 class="h">Карта гостя</h1><p class="lead small">Покажите QR официанту — баллы начислятся сами. <span class="demo">демо: условия ваши</span></p>' +
      '<div class="gcard">' + rings('bg') + '<span class="lv">' + esc(cur.name) + '</span><p class="pts">' + me.pts + '<small>баллов</small></p><p class="nm">' + esc(me.name || 'Гость бара') + ' · визитов: ' + me.visits + '</p></div>' +
      (next ? '<div class="progress" aria-hidden="true"><i style="width:' + Math.round(100 * (me.visits - cur.from) / (next.from - cur.from)) + '%"></i></div><p class="small">До уровня «' + esc(next.name) + '» — ' + (next.from - me.visits) + ' виз.: ' + esc(next.perk) + '</p>' : '') +
      '<div class="qr" data-qr><p>' + code + '</p></div>' +
      '<p class="h2">Как это работает</p><ul class="rules">' + A.card.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
    if (window.qrcode) { var q = qrcode(0, 'M'); q.addData(code); q.make(); var box = $('[data-qr]'); box.insertAdjacentHTML('afterbegin', q.createSvgTag({ cellSize: 6, margin: 0, scalable: true })); }
  };

  R.more = function () {
    var c = R.more.c || A.certs[1];
    $('#more').innerHTML = '<h1 class="h">Ещё</h1>' +
      '<p class="h2">Подарочный сертификат <span class="demo">демо</span></p><div class="certs">' + A.certs.map(function (n) { return '<button type="button" class="cert" data-c="' + n + '" aria-pressed="' + (n === c) + '"><span>' + esc(A.brand) + '</span><b>' + rub(n) + '</b><span>на вечер в баре</span></button>'; }).join('') + '</div>' +
      '<button type="button" class="btn btn-wide" style="margin-top:12px" data-gift>Подарить сертификат на ' + rub(c) + '</button>' +
      '<p class="h2">Бар</p><div class="list"><a href="' + A.tel + '"><span>Телефон</span><span>' + esc(A.phone) + '</span></a><div><span>Адрес</span><span>' + esc(A.city + ', ' + A.address) + '</span></div><div><span>Часы</span><span>' + esc(A.hoursText) + '</span></div>' +
      '<a href="' + A.map + '" target="_blank" rel="noopener"><span>Как добраться</span><span>2ГИС →</span></a><a href="' + A.vk + '" target="_blank" rel="noopener"><span>Афиша и фото</span><span>ВКонтакте →</span></a><a href="../"><span>Сайт бара</span><span>→</span></a></div>' +
      '<p class="small" style="margin-top:24px">Демо-версия приложения для владельца бара. Установить на телефон: «Поделиться» → «На экран „Домой“».</p>';
    d.querySelectorAll('#more [data-c]').forEach(function (b) { b.onclick = function () { R.more.c = +b.dataset.c; R.more(); }; });
    $('#more [data-gift]').onclick = function () { sheet('<h3>Сертификат на ' + rub(c) + '</h3><p>В рабочей версии — оплата картой или СБП, сертификат с QR приходит в мессенджер, его можно переслать другу. Бар видит продажу сразу.</p>'); };
  };

  /* ---------- навигация ---------- */
  function bindGo(scope) { d.querySelectorAll(scope + ' [data-go]').forEach(function (b) { b.onclick = function () { go(b.dataset.go); }; }); }
  function go(id) {
    d.querySelectorAll('[data-scr]').forEach(function (s) { s.hidden = s.id !== id; });
    d.querySelectorAll('[data-tab]').forEach(function (t) { if (t.dataset.tab === id) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
    R[id](); if (id === 'home') bindGo('#home');
    scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }
  function sheet(html, after) {
    var s = $('[data-sheet]'), inn = $('.sheet-in', s);
    inn.innerHTML = html + '<button type="button" class="btn btn-wide" data-close>Хорошо</button>'; s.hidden = false; inn.focus();
    var close = function () { s.hidden = true; if (after) go(after); };
    $('[data-close]', inn).onclick = close; s.onclick = function (e) { if (e.target === s) close(); };
  }
  d.querySelectorAll('[data-tab]').forEach(function (t) { t.onclick = function () { go(t.dataset.tab); }; });
  go(['home', 'menu', 'book', 'card', 'more'].indexOf(location.hash.slice(1)) >= 0 ? location.hash.slice(1) : 'home');
  setInterval(status, 30000);
  setTimeout(function () { var sp = $('[data-splash]'); if (sp) sp.classList.add('off'); }, 900);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(function () {});
})();
