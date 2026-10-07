/* Точка записи — живые части сайта: часы Красноярска, график записи на первом экране, сцена «Один день»,
   смена экранов продукта, превью работ, лента телефонов, путь по шагам, финальная точка, курсор-точка,
   калькулятор заявки → готовое сообщение в WhatsApp / Telegram. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const pad = n => String(n).padStart(2, '0');

  /* часы Красноярска в шапке */
  const now = $('#now');
  const tick = () => { try { now.textContent = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Asia/Krasnoyarsk', hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch (e) { now.textContent = ''; } };
  if (now) { tick(); setInterval(tick, 15000); }

  /* ——— график записи (пример) ——— */
  const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const SERV = ['стрижка', 'шиномонтаж', 'маникюр', 'полировка', 'диагностика', 'стрижка + борода', 'химчистка салона', 'окрашивание', 'замена масла'];
  const grid = $('#grid'), toast = $('#toast'), bCount = $('#bCount'), bNight = $('#bNight');
  let count = 0, night = 0, toastT;
  const cells = [];
  if (grid) {
    grid.insertAdjacentHTML('beforeend', '<span></span>' + DAYS.map(d => `<span class="h">${d}</span>`).join(''));
    HOURS.forEach(h => {
      grid.insertAdjacentHTML('beforeend', `<span class="t">${h}:00</span>`);
      DAYS.forEach((d, di) => { const c = document.createElement('span'); c.className = 'cell'; c.dataset.d = di; c.dataset.h = h; grid.appendChild(c); cells.push(c); });
    });
    /* уже занято — неделя наполовину заполнена */
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    cells.forEach(c => { if (rnd() < .34) { c.classList.add('b'); count++; } });
    night = 6; bCount.textContent = count; bNight.textContent = night;
  }
  const say = (html, ms) => { clearTimeout(toastT); toast.innerHTML = html; toast.classList.add('on'); toastT = setTimeout(() => toast.classList.remove('on'), ms || 3200); };
  const label = c => DAYS[c.dataset.d] + ', ' + c.dataset.h + ':00';
  function book(auto) {
    const free = cells.filter(c => !c.classList.contains('b'));
    if (free.length < 22) return false;
    const c = free[Math.floor(Math.random() * free.length)];
    c.classList.add('b', 'n', 'flash', 'rip'); setTimeout(() => c.classList.remove('flash', 'rip'), 1350);
    count++; bCount.textContent = count;
    const h = [23, 0, 1, 6, 7, 22, 21, 8][Math.floor(Math.random() * 8)], m = Math.floor(Math.random() * 60);
    const nightly = h >= 21 || h < 9; if (nightly) { night++; bNight.textContent = night; }
    const when = h >= 23 || h < 6 ? ' — пока вы спали' : h < 9 ? ' — до открытия' : h >= 21 ? ' — после закрытия' : ' — без звонка';
    say(`<span>Новая запись · ${label(c)} · ${SERV[Math.floor(Math.random() * SERV.length)]}<small>оформлена в ${pad(h)}:${pad(m)}${when}</small></span>`);
    return true;
  }
  if (grid) {
    grid.addEventListener('click', e => {
      const c = e.target.closest('.cell'); if (!c) return;
      if (c.classList.contains('b')) { say(`<span>${label(c)} уже занято<small>клиент видит только свободные окна</small></span>`, 2400); return; }
      $$('.cell.you', grid).forEach(x => { x.classList.remove('you', 'b'); count--; });
      c.classList.add('you', 'b', 'rip'); setTimeout(() => c.classList.remove('rip'), 1350); count++; bCount.textContent = count;
      say(`<span>Вы записались: ${label(c)}<small>так просто это для вашего клиента — а вам придёт уведомление</small></span>`, 4200);
      autoStop = true;
    });
    let autoStop = false, autoN = 0;
    if (!calm) {
      const io = new IntersectionObserver(es => es.forEach(e => { grid.dataset.vis = e.isIntersecting ? '1' : ''; }));
      io.observe(grid);
      setTimeout(function run() {
        if (autoStop || autoN > 14) return;
        if (grid.dataset.vis && !document.hidden) { if (book(true)) autoN++; }
        setTimeout(run, 2600 + Math.random() * 1400);
      }, 1600);
    }
  }

  /* ——— сцена «Один день» ——— */
  const day = $('#day');
  const EV = [
    [6.0, '', 'Утро. Сервис откроется в&nbsp;9:00&nbsp;— а&nbsp;клиенты уже выбирают, куда ехать.'],
    [7.5, 'bk', '7:30. Запись на&nbsp;10:00&nbsp;— клиент выбрал время по&nbsp;дороге на&nbsp;работу.'],
    [10.33, 'lost', '10:20. Звонок. Мастер под машиной&nbsp;— трубку никто не&nbsp;взял.'],
    [12.75, 'bk', '12:45. Запись на&nbsp;шиномонтаж: клиент сам нашёл свободное окно.'],
    [13.5, 'lost', '13:30. Обед. Звонок в&nbsp;пустоту&nbsp;— клиент набрал соседний сервис.'],
    [16.17, 'lost', '16:10. Администратор на&nbsp;другой линии. Клиент не&nbsp;стал ждать.'],
    [19.67, 'bk', '19:40. Запись на&nbsp;субботу. Напоминание уйдёт накануне само.'],
    [21.25, 'lost', '21:15. Уже закрыто. Звонить некому.'],
    [23.33, 'bk', '23:20. Ночь. Клиент выбрал время и&nbsp;записался&nbsp;— без вас.']
  ];
  const T0 = 6, T1 = 24;
  if (day) {
    const bar = $('#bar'), clock = $('#clock'), ev = $('#dayEv'), lost = $('#cLost'), bk = $('#cBook'), fill = $('#barFill'), dot = $('#barNow'), end = $('#dayEnd'), top = $('#top');
    const x = t => ((t - T0) / (T1 - T0)) * 100;
    [6, 9, 12, 15, 18, 21, 24].forEach(h => bar.insertAdjacentHTML('beforeend', `<span class="tick${h === 6 ? ' s' : h === 24 ? ' e' : ''}" style="left:${x(h)}%">${pad(h % 24)}:00</span>`));
    const marks = EV.filter(e => e[1]).map(e => { const i = document.createElement('i'); i.className = 'ev ' + e[1]; i.style.left = x(e[0]) + '%'; bar.appendChild(i); return [e[0], i]; });
    const P = [243, 243, 239], N = [14, 15, 18];
    let last = -1;
    day.update = function () {
      const r = day.getBoundingClientRect(), span = r.height - innerHeight;
      if (r.bottom < -50 || r.top > innerHeight + 50) { if (top.classList.contains('dark')) top.classList.remove('dark'); return; }
      const p = clamp(-r.top / span, 0, 1), t = T0 + (T1 - T0) * clamp(p / .9, 0, 1);
      const hh = Math.floor(t), mm = Math.floor((t - hh) * 60 / 5) * 5;
      const ct = pad(hh % 24) + ':' + pad(mm); if (clock.textContent !== ct) clock.textContent = ct;
      const bw = bar.clientWidth * x(t) / 100; fill.style.transform = 'scaleX(' + (x(t) / 100).toFixed(4) + ')'; dot.style.transform = 'translate3d(' + bw.toFixed(1) + 'px,0,0)';
      /* небо: день → вечер → ночь */
      const k = clamp((t - 17.5) / 3.5, 0, 1);
      const sky = `rgb(${P.map((v, i) => Math.round(v + (N[i] - v) * k)).join(',')})`; if (sky !== day._sky) { day._sky = sky; day.style.setProperty('--sky', sky); }
      const dark = k > .5; day.classList.toggle('dark', dark);
      const inDay = r.top < 60 && r.bottom > 60; top.classList.toggle('dark', inDay && dark);
      let L = 0, B = 0, idx = 0;
      EV.forEach((e, i) => { if (t >= e[0]) { idx = i; if (e[1] === 'lost') L++; if (e[1] === 'bk') B++; } });
      marks.forEach(([tt, el]) => el.classList.toggle('on', t >= tt));
      lost.textContent = L; bk.textContent = B;
      if (idx !== last) { last = idx; ev.innerHTML = EV[idx][2]; ev.classList.remove('flip'); void ev.offsetWidth; ev.classList.add('flip'); }
      end.classList.toggle('on', p > .86);
    };
  }

  /* ——— продукт: какой экран показать ——— */
  const stage = $('#stage'), figs = stage ? $$('.fig', stage) : [], chs = $$('.ch'), stageN = $('#stageN');
  const setCh = i => { chs.forEach((c, k) => c.classList.toggle('act', k === i)); figs.forEach((f, k) => f.classList.toggle('act', k === i)); if (stageN) stageN.textContent = '0' + (i + 1) + ' / 04'; };
  if (chs.length) {
    setCh(0);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setCh(+e.target.dataset.i); }), { rootMargin: '-45% 0px -45% 0px' });
    chs.forEach(c => io.observe(c));
  }

  /* ——— живые экраны: прокрутка страниц в рамках устройств идёт, только пока блок виден ——— */
  if (!calm && 'IntersectionObserver' in window) {
    const ioL = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('play', e.isIntersecting)), { threshold: .15 });
    $$('.card, #stage').forEach(el => ioL.observe(el));
  }

  /* ——— работы: превью за курсором ——— */
  const prev = $('#preview');
  let px = 0, py = 0, tx = 0, ty = 0;
  if (fine && prev) {
    const img = $('img', prev);
    $$('#works a').forEach(a => {
      a.addEventListener('mouseenter', () => { img.src = a.dataset.img; prev.classList.add('on'); });
      a.addEventListener('mouseleave', () => prev.classList.remove('on'));
    });
  }

  /* ——— курсор-точка ——— */
  const cur = $('.cur');
  let cx = -100, cy = -100, kx = -100, ky = -100;
  if (fine && cur && !calm) {
    addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; tx = e.clientX + 24; ty = e.clientY - 120; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.remove('on'));
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('a, button, label, summary, .cell')));
  }

  /* ——— прокрутка: шапка, лента, шаги, финал, панель на телефоне ——— */
  const topEl = $('#top'), strip = $('#strip'), work = $('#work'), steps = $('#steps'), sdot = $('#stepsDot'), fin = $('#fin'), finDot = $('#finDot'), dock = $('#dock'), start = $('#start'), price = $('#price');
  const vis = r => r.bottom > -100 && r.top < innerHeight + 100;
  const deck = $('#deck'), cards = deck ? $$('.card', deck) : [];
  let stripW = 0, lastS = {};
  const set = (el, k, v) => { if (lastS[k] !== v) { lastS[k] = v; el.style.setProperty(k.split('|')[0], v); } };
  function frame() {
    /* замеры */
    const H = innerHeight, sy = scrollY;
    const rw = work && work.getBoundingClientRect(), rs = steps && steps.getBoundingClientRect(), rf = fin && fin.getBoundingClientRect(), rp = price && price.getBoundingClientRect();
    if (strip && !stripW) stripW = strip.scrollWidth;
    /* изменения */
    topEl.classList.toggle('on', sy > 20);
    if (day && day.update) day.update();
    if (strip && rw && vis(rw)) { const p = clamp((H - rw.top) / (H + rw.height), 0, 1); set(strip, 'transform|s', 'translate3d(' + (-(stripW - innerWidth) * p * .9).toFixed(1) + 'px,0,0)'); }
    if (sdot && rs && vis(rs)) { const p = clamp((H * .75 - rs.top) / (rs.height + H * .2), 0, 1); set(sdot, 'transform|d', 'translate3d(' + (p * rs.width).toFixed(1) + 'px,0,0)'); }
    if (finDot && rf && vis(rf)) {
      const p = clamp(-rf.top / (rf.height - H), 0, 1), need = Math.hypot(innerWidth, H) / 40 * 1.05;
      set(finDot, '--s', (1 + (need - 1) * clamp(p / .55, 0, 1)).toFixed(3));
      set(fin, '--o', clamp((p - .45) / .25, 0, 1).toFixed(3));
    }
    if (dock && rp) dock.classList.toggle('on', sy > H * .8 && !(rp.top < H && rp.bottom > 0));
    /* колода кейса: карточка уходит назад, когда следующая ложится сверху (только на широком экране) */
    if (cards.length && !calm && innerWidth > 1080) {
      const rd = deck.getBoundingClientRect();
      if (vis(rd)) cards.forEach((c, i) => { const n = cards[i + 1]; if (!n) return; const t = n.getBoundingClientRect().top, top0 = 96 + i * 16; set(c, '--k|c' + i, clamp((H - t) / (H - top0 - 16), 0, 1).toFixed(3)); });
    }
  }
  addEventListener('resize', () => { stripW = 0; });
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); frame();
  /* плавное следование курсора и превью */
  let looping = false;
  function loop() {
    kx += (cx - kx) * .25; ky += (cy - ky) * .25; if (cur) cur.style.transform = 'translate3d(' + kx.toFixed(1) + 'px,' + ky.toFixed(1) + 'px,0)';
    px += (tx - px) * .12; py += (ty - py) * .12; if (prev) prev.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)' + (prev.classList.contains('on') ? '' : ' scale(.9)');
    if (Math.abs(cx - kx) + Math.abs(cy - ky) + Math.abs(tx - px) + Math.abs(ty - py) > .5) requestAnimationFrame(loop); else looping = false;
  }
  if (fine && !calm) addEventListener('mousemove', () => { if (!looping) { looping = true; requestAnimationFrame(loop); } }, { passive: true });

  /* заголовки по словам */
  function split(el) {
    const out = []; let i = 0;
    const wrap = n => { const w = document.createElement('span'); w.className = 'w'; const s = document.createElement('span'); s.style.setProperty('--i', i++); s.appendChild(n); w.appendChild(s); return w; };
    [...el.childNodes].forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/( +)/).forEach(p => { if (!p) return; out.push(/^ +$/.test(p) ? document.createTextNode(p) : wrap(document.createTextNode(p))); });
      else out.push(wrap(n));
    });
    el.textContent = ''; out.forEach(n => el.appendChild(n)); el.classList.add('split');
  }
  if (!calm) {
    const hs = $$('.hero h1, .sec-head h2, .day-head h2, .fin h2');
    hs.forEach(split);
    const h1 = $('.hero h1'); requestAnimationFrame(() => setTimeout(() => h1 && h1.classList.add('in'), 100));
    const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    hs.forEach(h => h !== h1 && io2.observe(h));
  }

  /* мышь: кнопки тянутся за курсором, экран продукта наклоняется, свет в ценах — всё в одном кадре */
  if (fine && !calm) {
    let mb = null, mx = 0, my = 0, pending = false;
    const prodEl = $('.prod'), priceEl = $('#price'), glow = $('#glow');
    const apply = () => {
      pending = false;
      if (mb) { const r = mb.getBoundingClientRect(); mb.style.transform = 'translate(' + ((mx - r.left - r.width / 2) * .18).toFixed(1) + 'px,' + ((my - r.top - r.height / 2) * .3).toFixed(1) + 'px)'; }
      if (stage && prodEl && prodEl.matches(':hover')) { const r = stage.getBoundingClientRect(); stage.style.setProperty('--ry', (((mx - r.left) / r.width - .5) * 8).toFixed(2) + 'deg'); stage.style.setProperty('--rx', (-((my - r.top) / r.height - .5) * 6).toFixed(2) + 'deg'); }
      if (glow && priceEl.matches(':hover')) { const r = priceEl.getBoundingClientRect(); glow.style.transform = 'translate(' + (mx - r.left).toFixed(0) + 'px,' + (my - r.top).toFixed(0) + 'px)'; }
    };
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; if (!pending) { pending = true; requestAnimationFrame(apply); } }, { passive: true });
    $$('.btn').forEach(b => { b.addEventListener('mouseenter', () => { mb = b; }); b.addEventListener('mouseleave', () => { if (mb === b) mb = null; b.style.transform = ''; }); });
    if (prodEl) prodEl.addEventListener('mouseleave', () => { stage.style.setProperty('--ry', '0deg'); stage.style.setProperty('--rx', '0deg'); });
  }

  /* график: подсветка дня и часа под курсором */
  if (grid && fine) {
    const heads = $$('.h', grid), times = $$('.t', grid);
    let lastCell = null;
    const clear = () => { heads.forEach(x => x.classList.remove('hl')); times.forEach(x => x.classList.remove('hl')); cells.forEach(x => x.classList.remove('row', 'col')); grid.classList.remove('x'); };
    grid.addEventListener('mouseover', e => {
      const c = e.target.closest('.cell'); if (c === lastCell) return; lastCell = c; clear(); if (!c) return;
      grid.classList.add('x'); heads[+c.dataset.d].classList.add('hl'); times[HOURS.indexOf(+c.dataset.h)].classList.add('hl');
      cells.forEach(x => { if (x.dataset.d === c.dataset.d) x.classList.add('col'); if (x.dataset.h === c.dataset.h) x.classList.add('row'); });
    });
    grid.addEventListener('mouseleave', () => { lastCell = null; clear(); });
  }

  /* появление */
  const els = $$('[data-r]');
  els.forEach(el => { const sib = $$(':scope > [data-r]', el.parentElement); const i = sib.indexOf(el); if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 90 + 'ms'); });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  /* ——— калькулятор заявки ——— */
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
  const niche = () => ($('#niche [aria-pressed="true"]') || {}).textContent || '';
  const lines = $('#lines');
  let prevKeys = '';
  function calc() {
    const plan = $('#plan input:checked'), extras = $$('#extra input:checked');
    const sum = (+plan.dataset.p || 0) + extras.reduce((a, x) => a + (+x.dataset.p || 0), 0);
    $('#sum').textContent = fmt(sum);
    const biz = ($('#biz').value || '').trim();
    const rows = [['Бизнес', niche() + (biz ? ' — ' + biz : '')], ['Пакет «' + plan.value + '»', fmt(+plan.dataset.p)]].concat(extras.map(x => [x.value, +x.dataset.p ? fmt(+x.dataset.p) : 'после демо'])).concat([['Демо', '0 ₽']]);
    const keys = rows.map(r => r[0]).join('|');
    lines.innerHTML = rows.map(r => `<li${keys !== prevKeys && !prevKeys.split('|').includes(r[0]) ? ' class="in"' : ''}><span>${esc(r[0])}</span><span>${esc(r[1])}</span></li>`).join('');
    prevKeys = keys;
    const text = 'Здравствуйте! Хочу бесплатное демо.\nБизнес: ' + niche() + (biz ? ' — ' + biz : '') + '\nНужно: пакет «' + plan.value + '»' + (extras.length ? ', ' + extras.map(x => x.value).join(', ') : '') + '\nОриентир по цене: от ' + fmt(sum);
    $('#sendWa').href = 'https://wa.me/79333399483?text=' + encodeURIComponent(text);
    window.__maxText = text;
    /* бот студии с заполненной заявкой: s-<ниша>-<пакет>-<дополнения> (порядок — как в боте: направления/боты/студия/сценарий.js) */
    const ni = $$('#niche button').findIndex(b => b.getAttribute('aria-pressed') === 'true'), pi = $$('#plan input').indexOf(plan), xm = $$('#extra input').reduce((m, x, i) => m | (x.checked ? 1 << i : 0), 0);
    $('#sendTg').href = 'https://t.me/tochka_zapisi_bot?start=s-' + Math.max(ni, 0) + '-' + Math.max(pi, 0) + '-' + xm;
    return text;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  $('#niche').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#niche button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); calc(); });
  $('#calc').addEventListener('input', calc);
  $('#calc').addEventListener('change', calc);
  $('#sendTg').addEventListener('click', calc);
  calc();
  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();

/* MAX: прямой ссылки на профиль пока нет — окно с номером. Появится ссылка (MAX → профиль → «Поделиться») — вписать в MAX_URL */
(() => {
  const MAX_URL = '', NUM = '+79130364962';
  const dlg = document.getElementById('maxDlg'); if (!dlg) return;
  const t = document.getElementById('maxT'), copyBtn = document.getElementById('maxCopy');
  const copy = async s => { try { await navigator.clipboard.writeText(s); return true; } catch (e) { return false; } };
  document.querySelectorAll('[data-max]').forEach(el => el.addEventListener('click', async e => {
    e.preventDefault();
    const fromCalc = el.id === 'sendMax' && window.__maxText;
    if (MAX_URL) { if (fromCalc) await copy(window.__maxText); window.open(MAX_URL, '_blank', 'noopener'); return; }
    if (fromCalc && await copy(window.__maxText)) t.textContent = 'Текст заявки скопирован. Найдите нас в MAX по номеру и вставьте сообщение.';
    else t.textContent = 'Найдите нас в MAX по этому номеру — Руслан, «Точка записи».';
    copyBtn.textContent = 'Скопировать номер';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else window.open('https://web.max.ru/', '_blank', 'noopener');
  }));
  copyBtn.addEventListener('click', async () => { copyBtn.textContent = (await copy(NUM)) ? 'Номер скопирован' : NUM; });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
})();

/* мини-приложение: чат → нажатие → приложение выезжает → «Записаться»; переключатель Telegram / MAX. Только когда блок на экране */
(() => {
  const sc = document.getElementById('miniScene'); if (!sc) return;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const app = document.getElementById('mcApp');
  sc.querySelectorAll('.mini-sw button').forEach(b => b.addEventListener('click', () => {
    sc.querySelectorAll('.mini-sw button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const max = b.dataset.m === 'MAX'; sc.classList.toggle('max', max);
    app.textContent = 'бот в\u00a0' + b.dataset.m + ' · демо';
  }));
  if (calm) { sc.classList.add('open'); return; }
  const steps = [[900, 'tap1'], [1200, 'open'], [2300, 'tap2'], [600, 'z'], [3200, ''], [900, 'reset']];
  let i = 0, t = 0, vis = false;
  function step() {
    const [wait, cls] = steps[i];
    t = setTimeout(() => {
      if (cls === 'reset') sc.classList.remove('open', 'z', 'tap1', 'tap2');
      else if (cls) { if (cls.startsWith('tap')) { sc.classList.remove(cls); void sc.offsetWidth; } sc.classList.add(cls); }
      i = (i + 1) % steps.length; if (vis) step();
    }, wait);
  }
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; clearTimeout(t); if (vis) step(); }), { threshold: .35 }).observe(sc);
})();

/* окупаемость: чек × клиенты → месяц, когда сумма за месяцы перекроет цену пакета; «Выбрать» ставит пакет в заявку */
(() => {
  const ch = document.getElementById('pChart'); if (!ch) return;
  const $ = id => document.getElementById(id), rub = n => Math.round(n).toLocaleString('ru-RU') + '\u00a0₽';
  const months = k => k % 10 === 1 && k % 100 !== 11 ? 'месяц' : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14) ? 'месяца' : 'месяцев';
  const clients = k => k % 10 === 1 && k % 100 !== 11 ? 'клиент' : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14) ? 'клиента' : 'клиентов';
  ch.insertAdjacentHTML('beforeend', Array.from({ length: 12 }, (_, i) => '<div class="pay-m"><b></b><span>' + (i + 1) + '</span></div>').join(''));
  const cols = [...ch.querySelectorAll('.pay-m')];
  const pk = () => document.querySelector('#pPack [aria-pressed="true"]');
  function fill(r) { r.style.setProperty('--v', (r.value - r.min) / (r.max - r.min) * 100 + '%'); }
  function calc() {
    const c = +$('pCheck').value, n = +$('pNew').value, b = pk(), price = +b.dataset.p, m = c * n;
    fill($('pCheck')); fill($('pNew'));
    $('pCheckV').textContent = rub(c); $('pNewV').textContent = n;
    const w = n / 4.3; $('pWeek').textContent = w < 1 ? '≈ 1 в\u00a0' + (Math.round(4.3 / n) > 1 ? Math.round(4.3 / n) + '\u00a0недели' : 'неделю') : '≈ ' + Math.round(w) + ' в\u00a0неделю';
    const k = Math.ceil(price / m);
    const when = $('pWhen'); when.classList.toggle('bad', k > 12);
    when.textContent = k <= 1 ? 'в\u00a0первый месяц' : k > 12 ? 'больше чем за\u00a0год' : 'за\u00a0' + k + '\u00a0' + months(k);
    $('pSub').textContent = 'Новые клиенты приносят ' + rub(m) + ' в\u00a0месяц\u00a0— ' + rub(m * 12) + ' за\u00a0год.';
    const top = Math.max(price * 1.25, m * 12);
    cols.forEach((col, i) => { const h = m * (i + 1) / top * 100; col.style.setProperty('--h', h + '%'); col.classList.toggle('ok', i + 1 >= k); col.classList.toggle('hit', i + 1 === k); });
    $('pLine').style.setProperty('--y', price / top);
    const one = Math.ceil(price / c);
    $('pNeed').innerHTML = k <= 1 ? 'Пакет окупается уже в&nbsp;первый месяц.' : 'Чтобы окупить за&nbsp;первый месяц, нужно <b>' + one + '&nbsp;' + clients(one) + '</b> со&nbsp;средним чеком ' + rub(c) + '.' + (k > 12 ? (b.dataset.n === 'Старт' ? ' Или возьмите сайт по&nbsp;подписке: 0&nbsp;₽ на&nbsp;старте.' : ' Начните со&nbsp;«Старт» или сайта по&nbsp;подписке.') : '');
    $('pGo').lastChild.textContent = 'Выбрать «' + b.dataset.n + '»';
  }
  $('pPack').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $('pPack').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); calc(); });
  $('payForm').addEventListener('input', calc);
  $('pGo').addEventListener('click', () => { const r = document.querySelector('#plan input[value="' + pk().dataset.n + '"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } });
  calc();
})();
