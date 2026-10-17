/* Бронь столика (демо): вечер → время → гости → зона → повод → предзаказ → контакты → билет.
   Данные — window.BRON (из site.json). Брони хранятся в этом браузере (localStorage) — в рабочей версии уходят администратору. */
(function () {
  var C = window.BRON, d = document, $ = function (s) { return d.querySelector(s); };
  if (!C) return;
  var KEY = 'bron:' + C.name;
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } };
  var save = function (l) { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
  var q = new URLSearchParams(location.search);
  var toMin = function (s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; };
  var hm = function (m) { m = (m + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  var rub = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; };
  var WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], MO = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  var S = { day: 0, time: null, guests: 2, zone: q.get('zone') || 'sofa', reason: C.reasons[0], pre: {} };

  /* «вечер» начинается в 18:00 — после полуночи сегодняшний вечер ещё идёт */
  var now = new Date(), nowMin = now.getHours() * 60 + now.getMinutes();
  var base = new Date(now); if (nowMin < toMin(C.close)) base.setDate(base.getDate() - 1);
  var days = []; for (var i = 0; i < 14; i++) { var x = new Date(base); x.setDate(base.getDate() + i); days.push(x); }
  var slots = []; for (var m = toMin(C.slots.from); m <= toMin(C.slots.to) + (toMin(C.slots.to) < toMin(C.slots.from) ? 1440 : 0); m += C.slots.step) slots.push(m);

  function radio(box, items, cur, onPick) {
    box.innerHTML = '';
    items.forEach(function (it) {
      var b = d.createElement('button'); b.type = 'button'; b.className = it.cls || 'chip'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(it.v === cur)); b.innerHTML = it.html; if (it.off) b.disabled = true;
      b.addEventListener('click', function () { onPick(it.v); });
      box.appendChild(b);
    });
  }
  var dayLabel = function (x, i) { return i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : WD[x.getDay()]; };
  var nice = function (x) { return x.getDate() + ' ' + MO[x.getMonth()]; };

  function render() {
    radio($('[data-days]'), days.map(function (x, i) { return { v: i, html: dayLabel(x, i) + '<small>' + x.getDate() + '.' + String(x.getMonth() + 1).padStart(2, '0') + '</small>' }; }), S.day, function (v) { S.day = v; S.time = null; render(); });
    /* сегодня — только время не раньше чем через 30 минут */
    var minNow = S.day === 0 ? (nowMin < toMin(C.close) ? nowMin + 1440 : nowMin) + 30 : 0;
    var free = slots.filter(function (m) { return m >= minNow; });
    if (S.time !== null && free.indexOf(S.time) < 0) S.time = null;
    radio($('[data-slots]'), slots.map(function (m) { return { v: m, html: hm(m), off: m < minNow }; }), S.time, function (v) { S.time = v; render(); });
    $('[data-guests]').textContent = S.guests;
    radio($('[data-zones]'), C.zones.map(function (z) {
      return { v: z.id, cls: 'zone', off: S.guests > z.max, html: '<svg viewBox="0 0 38 22" aria-hidden="true"><ellipse cx="11" cy="11" rx="8" ry="9" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="27" cy="11" rx="8" ry="9" fill="none" stroke="currentColor" stroke-width="2"/></svg><b>' + z.name + '</b><span>' + z.seats + ' гостей</span>' };
    }), S.zone, function (v) { S.zone = v; render(); });
    var zone = C.zones.filter(function (z) { return z.id === S.zone; })[0];
    if (zone && S.guests > zone.max) { var fit = C.zones.filter(function (z) { return z.max >= S.guests; })[0]; if (fit) { S.zone = fit.id; return render(); } }
    radio($('[data-reasons]'), C.reasons.map(function (r) { return { v: r, html: r }; }), S.reason, function (v) { S.reason = v; render(); });
    var pl = $('[data-pre]'); pl.innerHTML = '';
    C.preorder.forEach(function (p) {
      var n = S.pre[p[0]] || 0, row = d.createElement('div'); row.className = 'pre-item';
      row.innerHTML = '<span>' + p[0] + '</span><span class="p">' + rub(p[1]) + '</span><span class="q"><button type="button" aria-label="Убрать: ' + p[0] + '">−</button><output>' + n + '</output><button type="button" aria-label="Добавить: ' + p[0] + '">+</button></span>';
      var bs = row.querySelectorAll('button');
      bs[0].onclick = function () { S.pre[p[0]] = Math.max(0, n - 1); render(); };
      bs[1].onclick = function () { S.pre[p[0]] = Math.min(20, n + 1); render(); };
      pl.appendChild(row);
    });
    var sum = 0, cnt = 0; C.preorder.forEach(function (p) { var k = S.pre[p[0]] || 0; sum += k * p[1]; cnt += k; });
    var shown = S.time === null ? hm(toMin(C.open)) : hm(S.time);
    $('[data-bron-time]').textContent = shown; var ck = $('[data-clock]'); if (ck) ck.textContent = shown;
    $('[data-summary]').innerHTML = S.time === null ? '' : '<b>' + dayLabel(days[S.day], S.day) + ', ' + nice(days[S.day]) + ' · ' + hm(S.time) + '</b> · ' + S.guests + ' ' + (S.guests % 10 === 1 && S.guests !== 11 ? 'гость' : 'гостей') + ' · ' + (zone ? zone.name.toLowerCase() : '') + (cnt ? '<br>Предзаказ: ' + cnt + ' поз. на ' + rub(sum) : '');
  }
  d.querySelectorAll('[data-g]').forEach(function (b) { b.addEventListener('click', function () { S.guests = Math.min(60, Math.max(1, S.guests + +b.dataset.g)); render(); }); });
  if (q.get('pre')) setTimeout(function () { var p = $('.pre'); p && p.scrollIntoView({ block: 'center' }); }, 300);
  if (S.zone === 'hall') S.guests = 15;
  /* сегодня всё время прошло — открываем завтрашний вечер; сразу предлагаем время: первое свободное с 20:00 */
  var todayFrom = (nowMin < toMin(C.close) ? nowMin + 1440 : nowMin) + 30;
  if (!slots.some(function (m) { return m >= todayFrom; })) S.day = 1;
  var minFirst = S.day === 0 ? todayFrom : 0;
  S.time = slots.filter(function (m) { return m >= Math.max(minFirst, 20 * 60); })[0] || slots.filter(function (m) { return m >= minFirst; })[0] || null;
  render();

  var f = $('[data-bron]'), err = $('[data-err]');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = f.name.value.trim(), phone = f.phone.value.replace(/[^\d+]/g, '');
    var miss = S.time === null ? 'Выберите время' : !name ? 'Укажите имя' : phone.replace(/\D/g, '').length < 10 ? 'Проверьте телефон' : !f.ok.checked ? 'Нужно согласие на обработку данных' : '';
    if (miss) { err.textContent = miss; return; }
    err.textContent = '';
    var list = load(), num = String(41 + list.length).padStart(4, '0'), zone = C.zones.filter(function (z) { return z.id === S.zone; })[0];
    var pre = Object.keys(S.pre).filter(function (k) { return S.pre[k]; }).map(function (k) { return k + ' × ' + S.pre[k]; });
    var rec = { num: num, day: nice(days[S.day]), wd: dayLabel(days[S.day], S.day), time: hm(S.time), guests: S.guests, zone: zone.name, reason: S.reason, pre: pre, name: name, phone: phone, ok: false };
    list.unshift(rec); save(list);
    var t = $('[data-ticket]');
    t.innerHTML = '<p class="num">БРОНЬ № ' + num + '</p><h2>Ждём вас, ' + name.replace(/[<>&"]/g, '') + '!</h2>' +
      '<dl><dt>Когда</dt><dd>' + rec.wd + ', ' + rec.day + ' · ' + rec.time + '</dd><dt>Гостей</dt><dd>' + rec.guests + '</dd><dt>Место</dt><dd>' + rec.zone + '</dd><dt>Повод</dt><dd>' + rec.reason + '</dd>' +
      (pre.length ? '<dt>К приходу</dt><dd>' + pre.join(', ') + '</dd>' : '') + '</dl>' +
      '<p class="msg">Администратор подтвердит бронь сообщением в течение 15 минут. Если планы изменятся — позвоните: <a href="' + C.tel + '">' + C.phone + '</a>.</p>' +
      '<a class="btn" href="../">На главную</a>';
    f.hidden = true; t.hidden = false; t.focus(); scrollTo({ top: 0 });
    admin();
  });

  function admin() {
    var box = $('[data-admin-list]'), list = load();
    box.innerHTML = list.length ? '' : '<p class="small">Пока броней нет — сделайте первую выше.</p>';
    list.forEach(function (r, i) {
      var row = d.createElement('div'); row.className = 'adm-row' + (r.ok ? ' ok' : '');
      row.innerHTML = '<b>№ ' + r.num + ' · ' + r.wd + ', ' + r.day + ' · ' + r.time + '</b><span>' + r.guests + ' гост. · ' + r.zone + ' · ' + r.reason + '</span>' + (r.pre.length ? '<span>Кухне к приходу: ' + r.pre.join(', ') + '</span>' : '') +
        '<span class="small">' + r.name.replace(/[<>&"]/g, '') + ' · ' + r.phone.replace(/[<>&"]/g, '') + '</span><span class="acts"><button type="button">Подтвердить</button><a class="btn btn-ghost btn-s" href="tel:' + r.phone.replace(/[^\d+]/g, '') + '">Перезвонить</a></span>';
      row.querySelector('button').onclick = function () { var l = load(); l[i].ok = true; save(l); admin(); };
      box.appendChild(row);
    });
  }
  admin();
})();
