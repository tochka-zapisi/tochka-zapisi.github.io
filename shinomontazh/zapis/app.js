(function () {
  'use strict';
  const S = window.Store;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const HORIZON = 14;
  const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  const IC = {
    oil: '<path d="M12 3c3.2 4.2 6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 2.8-6.8 6-11z"/><path d="M9.5 14.5a2.7 2.7 0 0 0 2.5 2.5"/>',
    disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="6.8" r=".6"/><circle cx="12" cy="17.2" r=".6"/><circle cx="6.8" cy="12" r=".6"/><circle cx="17.2" cy="12" r=".6"/>',
    tire: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="2"/>',
    pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
    spring: '<path d="M8 4h8M8 20h8M12 4v1.5M12 18.5V20M7.5 7.5l9 1.8-9 1.8 9 1.8-9 1.8 9 1.8"/>',
    battery: '<rect x="3" y="7" width="18" height="11" rx="2.5"/><path d="M7 7V5h3v2M14 7V5h3v2M8 12.5h3M9.5 11v3M14.5 12.5h2.5"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>'
  };
  const iconFor = n => { n = String(n).toLowerCase(); return /масл|жидк|фильтр/.test(n) ? 'oil' : /колод|тормоз|диск/.test(n) ? 'disc' : /шин|колес|развал|схожд/.test(n) ? 'tire' : /диагност|компьют|электр/.test(n) ? 'pulse' : /подвеск|амортиз|рычаг|стойк/.test(n) ? 'spring' : /аккум|батаре/.test(n) ? 'battery' : 'wrench'; };
  const svg = (inner, extra) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '>' + inner + '</svg>';
  const TAB = {
    book: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    mine: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    owner: '<path d="M4 10l1.5-5h13L20 10M4 10v10h16V10M4 10h16M9 20v-5h6v5"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16M12 13v4M10 15h4"/>',
    send: '<path d="M21 3L3 10.5l6.5 2.5L12 20z"/><path d="M9.5 13L21 3"/>',
    inbox: '<path d="M4 13l2.5-8h11L20 13v6H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>'
  };

  /* ---------- автомобиль (SVG) ---------- */
  function carSvg() {
    return '<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4e8ef"/><stop offset=".28" stop-color="#8e95a3"/><stop offset=".6" stop-color="#2b2e37"/><stop offset="1" stop-color="#07080a"/></linearGradient>' +
      '<linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe0f5" stop-opacity=".85"/><stop offset=".55" stop-color="#2c3342" stop-opacity=".95"/><stop offset="1" stop-color="#0b0d12"/></linearGradient>' +
      '<linearGradient id="cs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".3" stop-color="#fff" stop-opacity=".55"/><stop offset=".75" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<radialGradient id="rim" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#dfe5f2"/><stop offset=".55" stop-color="#8d97ad"/><stop offset="1" stop-color="#3b4254"/></radialGradient>' +
      '<radialGradient id="hl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f4f9ff"/><stop offset=".4" stop-color="#cfe3ff" stop-opacity=".6"/><stop offset="1" stop-color="#a9c8ff" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="gr" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<filter id="bl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<clipPath id="bc"><path d="M30 118 C30 106 36 100 50 97 L88 90 C108 70 136 58 170 55 L238 55 C268 56 290 70 312 88 L356 96 C374 100 384 108 384 118 L384 124 L30 124 Z"/></clipPath>' +
      '</defs>' +
      '<ellipse cx="207" cy="146" rx="190" ry="14" fill="url(#gr)"/>' +
      '<g class="car">' +
      /* свет фар по полу */
      '<ellipse class="glow" cx="388" cy="124" rx="34" ry="22" fill="url(#hl)" filter="url(#bl)"/>' +
      /* кузов */
      '<path d="M30 118 C30 106 36 100 50 97 L88 90 C108 70 136 58 170 55 L238 55 C268 56 290 70 312 88 L356 96 C374 100 384 108 384 118 L384 124 L30 124 Z" fill="url(#cb)"/>' +
      '<g clip-path="url(#bc)"><path d="M20 100 L400 92 L400 98 L20 108 Z" fill="url(#cs)" opacity=".8"/><path d="M60 112 L360 112" stroke="#fff" stroke-opacity=".08" stroke-width="2"/><rect x="30" y="116" width="354" height="8" fill="#05070c" opacity=".55"/></g>' +
      /* стёкла */
      '<path d="M110 88 C124 72 144 63 170 61 L196 61 L196 88 Z" fill="url(#cg)"/>' +
      '<path d="M202 61 L236 61 C258 63 276 74 292 88 L202 88 Z" fill="url(#cg)"/>' +
      '<path d="M112 86 C126 73 146 65 168 63" stroke="#fff" stroke-opacity=".5" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      /* линия плеча, ручки */
      '<path d="M52 99 C120 92 260 90 350 99" stroke="#fff" stroke-opacity=".22" stroke-width="1.6" fill="none"/>' +
      '<rect x="168" y="94" width="22" height="3.6" rx="1.8" fill="#9aa6c0" opacity=".7"/><rect x="224" y="94" width="22" height="3.6" rx="1.8" fill="#9aa6c0" opacity=".7"/>' +
      /* фары */
      '<path d="M352 98 C366 100 378 104 382 111 L360 108 Z" fill="#fff4cf"/><path d="M360 100 L382 111" stroke="#fff" stroke-opacity=".8" stroke-width="1"/>' +
      '<path d="M32 104 L46 100 L46 107 L32 111 Z" fill="#ff3b30"/><rect x="30" y="102" width="16" height="2.4" fill="#ff8a80" opacity=".8"/>' +
      /* арки и колёса */
      '<circle cx="98" cy="124" r="29" fill="#05070c"/><circle cx="318" cy="124" r="29" fill="#05070c"/>' +
      wheel(98) + wheel(318) +
      '</g></svg>';
    function wheel(cx) {
      let sp = '';
      for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; sp += '<path d="M' + cx + ' 124 L' + (cx + 15 * Math.sin(a)).toFixed(1) + ' ' + (124 - 15 * Math.cos(a)).toFixed(1) + '" stroke="#6a7389" stroke-width="5" stroke-linecap="round"/>'; }
      return '<circle cx="' + cx + '" cy="124" r="25" fill="#0a0c12"/><circle cx="' + cx + '" cy="124" r="25" fill="none" stroke="#2a2f3d" stroke-width="3"/>' +
        '<circle cx="' + cx + '" cy="124" r="17" fill="url(#rim)"/>' + sp + '<circle cx="' + cx + '" cy="124" r="4.5" fill="#1b2030"/><circle cx="' + cx + '" cy="124" r="17" fill="none" stroke="#fff" stroke-opacity=".25"/>';
    }
  }

  /* ---------- состояние ---------- */
  const st = { ctab: 'book', otab: 'bookings', step: 1, filter: 'new', sel: { svc: null, date: null, time: null }, err: '', busy: false, sound: true, known: new Set(), first: true, deferred: null };
  const cfg = () => S.cfg;
  const toMin = t => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtD = s => { const d = parseD(s); return WD[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; };
  const todayS = () => dstr(new Date());
  const money = v => (Number(v) > 0 ? Number(v).toLocaleString('ru-RU') + ' ' + cfg().currency : 'по осмотру');
  const svcById = id => S.services.find(s => s.id === id);
  const selSvc = () => (st.sel.svc ? svcById(st.sel.svc) : null);
  const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) { /* не везде */ } };
  const lsGet = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* не страшно */ } };

  function toast(html) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 7000); }
  let actx;
  function beep() {
    if (!st.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine'; o.frequency.value = 880; g.gain.value = 0.08; o.connect(g); g.connect(actx.destination);
      o.start(); o.frequency.setValueAtTime(1175, actx.currentTime + 0.12); o.stop(actx.currentTime + 0.28);
    } catch (e) { /* звук необязателен */ }
  }

  /* ---------- расписание ---------- */
  function coveringMins(svc, m) { const n = Math.max(1, Math.ceil((Number(svc.duration) || cfg().step) / cfg().step)); return Array.from({ length: n }, (_, i) => m + i * cfg().step); }
  function timesFor(svc, date) {
    const c = cfg(), s = toMin(c.start), e = toMin(c.end), now = new Date(), occ = S.occupied();
    const isToday = date === dstr(now), lead = now.getHours() * 60 + now.getMinutes() + 60, out = [];
    for (let m = s; ; m += c.step) {
      const cov = coveringMins(svc, m);
      if (cov[cov.length - 1] + c.step > e) break;
      if (isToday && m < lead) continue;
      out.push({ m, ok: cov.every(x => !occ.has(S.helpers.slotId(date, x))) });
    }
    return out;
  }
  function firstFree(svc) {
    if (!svc) return null;
    const base = new Date();
    for (let i = 0; i < HORIZON; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      if (!cfg().days.includes(d.getDay())) continue;
      const hit = timesFor(svc, dstr(d)).find(t => t.ok);
      if (hit) return { date: dstr(d), m: hit.m };
    }
    return null;
  }
  function openState() {
    const c = cfg(), now = new Date(), m = now.getHours() * 60 + now.getMinutes();
    if (c.days.includes(now.getDay()) && m >= toMin(c.start) && m < toMin(c.end)) return { open: true, t: 'Открыто до ' + c.end };
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (!c.days.includes(d.getDay())) continue;
      if (i === 0 && m >= toMin(c.end)) continue;
      return { open: false, t: 'Закрыто, откроемся ' + (i === 0 ? 'сегодня' : i === 1 ? 'завтра' : WD[d.getDay()]) + ' в ' + c.start };
    }
    return { open: false, t: 'Закрыто' };
  }

  /* ---------- шапка, вкладки, общий каркас ---------- */
  const newCount = () => S.bookings.filter(b => b.status === 'new').length;
  const activeMine = () => S.mine.filter(b => b.status === 'new' || b.status === 'confirmed').length;
  function renderTabbar() {
    const items = [['book', 'Запись', 0], ['mine', 'Мои записи', activeMine()], ['owner', 'Владелец', newCount()]];
    $('#tabbar').innerHTML = items.map(([k, label, n]) => '<button type="button" class="tab" data-tab="' + k + '"' + (st.ctab === k ? ' aria-current="page"' : '') + '>' + svg(TAB[k]) + '<span>' + label + '</span>' + (n ? '<span class="dot">' + n + '</span>' : '') + '</button>').join('');
    document.title = (newCount() ? '(' + newCount() + ') ' : '') + 'Онлайн-запись — Колесо';
  }
  function renderShell() {
    const owner = st.ctab === 'owner', book = st.ctab === 'book', mine = st.ctab === 'mine';
    $('#app').classList.toggle('wide', owner);
    $('#vBook').hidden = !book; $('#vMine').hidden = !mine; $('#vOwner').hidden = !owner;
    $('#hero').hidden = !(book && st.step === 1);
    $('#soonBtn').hidden = !(book && st.step === 1) || !$('#soonBtn').innerHTML;
    $('#prog').hidden = !(book && st.step !== 'done');
    ['p1', 'p2', 'p3', 'p4'].forEach((p, i) => { $('#' + p).hidden = !(book && (st.step === i + 1 || (st.step === 'done' && i === 3))); });
    $('#prog').querySelectorAll('span').forEach((s, i) => s.classList.toggle('on', typeof st.step === 'number' && i < st.step));
    $('#backBtn').hidden = !(book && (st.step === 2 || st.step === 3));
    $('#installBtn').hidden = owner;
    $('#topTitle').textContent = owner ? 'Панель владельца' : mine ? 'Мои записи' : cfg().name;
    $('#topTitle').style.visibility = (book && st.step === 1) ? 'hidden' : '';
    $('#cta').hidden = !(book && typeof st.step === 'number');
    renderTabbar(); renderCta();
    if (owner) renderOwner();
  }
  function go(step) { st.step = step; st.err = ''; renderShell(); $('#scroll').scrollTop = 0; if (step === 2) { renderDays(); renderTimes(); } if (step === 3) renderRecap(); }

  /* ---------- клиент: герой, услуги, дни, время ---------- */
  function renderHero() {
    const c = cfg(), os = openState();
    $('#shopName').textContent = c.name;
    const live = $('#liveNow'); live.classList.toggle('closed', !os.open); live.lastElementChild.textContent = os.t;
    const a = [];
    if (c.phone) a.push('<a class="ha" href="tel:' + esc(c.phone.replace(/[^\d+]/g, '')) + '">' + svg(TAB.phone) + '<span>Позвонить</span></a>');
    if (c.address) a.push('<a class="ha" target="_blank" rel="noopener" href="https://maps.google.com/?q=' + encodeURIComponent(c.address) + '">' + svg(TAB.pin) + '<span>' + esc(c.address) + '</span></a>');
    $('#heroActions').innerHTML = a.join('');
    if (!$('#carWrap').firstChild) $('#carWrap').innerHTML = carSvg();
  }
  function renderSoon() {
    const svcs = S.services, btn = $('#soonBtn');
    const svc = selSvc() || svcs.slice().sort((a, b) => a.duration - b.duration)[0];
    const f = firstFree(svc);
    btn.innerHTML = f ? '<span class="ic">' + svg(TAB.clock) + '</span><span><small>Ближайшее свободное время</small><b>' + (f.date === todayS() ? 'Сегодня' : fmtD(f.date)) + ', ' + fromMin(f.m) + '</b></span>' : '';
    btn.dataset.date = f ? f.date : ''; btn.dataset.m = f ? f.m : '';
    btn.hidden = !f || !(st.ctab === 'book' && st.step === 1);
  }
  function renderServices() {
    const box = $('#svcList'), list = S.services;
    if (!list.length) { box.innerHTML = '<div class="hint">Услуги пока не добавлены. Владелец добавляет их в разделе «Владелец».</div>'; return; }
    box.innerHTML = list.map(s => '<button type="button" class="svc" data-id="' + esc(s.id) + '" aria-pressed="' + (st.sel.svc === s.id) + '"><span class="ic">' + svg(IC[iconFor(s.name)]) + '</span><b>' + esc(s.name) + '</b><span class="price">' + esc(money(s.price)) + '</span><span class="dur">около ' + esc(s.duration) + ' мин</span></button>').join('');
  }
  function renderDays() {
    const base = new Date(); let h = '';
    for (let i = 0; i < HORIZON; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i), s = dstr(d), open = cfg().days.includes(d.getDay());
      h += '<button type="button" class="day" data-d="' + s + '" ' + (open ? '' : 'disabled') + ' aria-pressed="' + (st.sel.date === s) + '"><small>' + (i === 0 ? 'Сегодня' : WD[d.getDay()]) + '</small><strong>' + d.getDate() + '</strong><small>' + MON[d.getMonth()] + '</small></button>';
    }
    $('#dayStrip').innerHTML = h;
  }
  function renderTimes() {
    const box = $('#timeGrid'), svc = selSvc();
    if (!svc) { box.innerHTML = '<div class="hint">Сначала выберите услугу на первом шаге.</div>'; return; }
    if (!st.sel.date) { box.innerHTML = '<div class="hint">Выберите день, и здесь появится свободное время.</div>'; return; }
    const list = timesFor(svc, st.sel.date);
    if (!list.length) { box.innerHTML = '<div class="hint">На этот день свободного времени нет. Выберите другой день.</div>'; return; }
    if (st.sel.time != null && !list.some(t => t.m === st.sel.time && t.ok)) st.sel.time = null;
    const part = (t, from, to) => { const arr = list.filter(x => x.m >= from * 60 && x.m < to * 60); return arr.length ? '<div class="part">' + t + '</div><div class="times">' + arr.map(x => '<button type="button" class="time" data-m="' + x.m + '" ' + (x.ok ? '' : 'disabled') + ' aria-pressed="' + (st.sel.time === x.m) + '">' + fromMin(x.m) + '</button>').join('') + '</div>' : ''; };
    box.innerHTML = part('Утро', 0, 12) + part('День', 12, 17) + part('Вечер', 17, 24);
  }
  function renderRecap() {
    const svc = selSvc(); if (!svc) return;
    $('#recap').innerHTML = '<span class="ic">' + svg(IC[iconFor(svc.name)]) + '</span><div><b>' + esc(svc.name) + ' · ' + esc(money(svc.price)) + '</b><span>' + esc(fmtD(st.sel.date)) + ', ' + fromMin(st.sel.time) + '</span></div>';
  }
  function carText() { return { text: [$('#fBrand').value.trim(), $('#fModel').value.trim()].filter(Boolean).join(' '), plate: $('#fPlate').value.trim() }; }
  function formProblem() {
    if (!$('#fBrand').value.trim() || !$('#fModel').value.trim()) return 'Укажите марку и модель автомобиля.';
    if (!$('#fName').value.trim()) return 'Укажите имя.';
    if ($('#fPhone').value.replace(/\D/g, '').length < 6) return 'Укажите телефон, чтобы автосервис мог связаться.';
    if (!$('#fConsent').checked) return 'Отметьте согласие на обработку персональных данных.';
    return '';
  }
  function renderCta() {
    if (st.ctab !== 'book' || typeof st.step !== 'number') return;
    const svc = selSvc(), s = st.sel, n = st.step, lab = $('#ctaLabel'), val = $('#ctaVal'), next = $('#ctaNext');
    if (st.err) { lab.innerHTML = '<span class="err">' + esc(st.err) + '</span>'; val.textContent = ''; }
    else if (n === 1) { lab.textContent = svc ? svc.name : 'Услуга не выбрана'; val.textContent = svc ? money(svc.price) : ''; }
    else if (n === 2) { lab.textContent = s.date && s.time != null ? fmtD(s.date) : 'Выберите день и время'; val.textContent = s.date && s.time != null ? fromMin(s.time) : ''; }
    else { lab.textContent = svc ? svc.name : ''; val.textContent = svc ? money(svc.price) : ''; }
    next.textContent = n === 3 ? (st.busy ? 'Отправляю…' : 'Записаться') : 'Далее';
    next.disabled = st.busy || (n === 1 && !svc) || (n === 2 && !(s.date && s.time != null));
  }

  /* ---------- запись ---------- */
  async function submitBooking() {
    const why = formProblem();
    if (why) { st.err = why; renderCta(); return; }
    st.err = ''; st.busy = true; renderCta();
    const svc = selSvc(), date = st.sel.date, m = st.sel.time, car = carText();
    const slotIds = coveringMins(svc, m).map(x => S.helpers.slotId(date, x));
    const b = { serviceId: svc.id, serviceName: svc.name, duration: Number(svc.duration) || 0, price: Number(svc.price) || 0, date, time: fromMin(m), startMin: m, slotIds,
      name: $('#fName').value.trim(), phone: $('#fPhone').value.trim(), car: car.text, plate: car.plate, comment: $('#fComment').value.trim() };
    try { b.created = await S.createBooking(b); }
    catch (e) {
      st.busy = false;
      if (e && e.message === 'busy') { st.err = 'Это время только что заняли. Выберите другое.'; st.sel.time = null; go(2); } else { st.err = 'Не удалось отправить запись. Проверьте соединение и повторите.'; renderCta(); }
      return;
    }
    lsSet('profile', { brand: $('#fBrand').value.trim(), model: $('#fModel').value.trim(), plate: car.plate, name: b.name, phone: b.phone });
    st.busy = false; buzz(); showDone(b);
  }
  function icsFor(b) {
    const d = b.date.replace(/-/g, ''), t = x => pad(Math.floor(x / 60)) + pad(x % 60) + '00';
    const end = b.startMin + (b.duration || 60);
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Autoservice//RU', 'BEGIN:VEVENT', 'UID:' + (b.id || Date.now()) + '@autoservice', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
      'DTSTART:' + d + 'T' + t(b.startMin), 'DTEND:' + d + 'T' + t(end), 'SUMMARY:' + b.serviceName + ' — ' + cfg().name, 'LOCATION:' + (cfg().address || ''),
      'DESCRIPTION:Автомобиль: ' + (b.car || '') + '. Телефон: ' + (cfg().phone || ''), 'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Запись в автосервис', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
    return L.join('\r\n');
  }
  function downloadIcs(b) {
    const blob = new Blob([icsFor(b)], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'zapis-avtoservis.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  let lastBooking = null;
  function showDone(b) {
    lastBooking = b.created || b;
    $('#p4').innerHTML = '<div class="check">' + svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="2.6"') + '</div><h2>Запись отправлена</h2><p class="note">' + esc(cfg().name) + ' получит заявку и подтвердит её. Статус будет во вкладке «Мои записи».</p>' +
      '<dl class="ticket"><div class="kv"><dt>Когда</dt><dd class="big">' + esc(fmtD(b.date)) + ', ' + esc(b.time) + '</dd></div><div class="perf"></div>' +
      '<div class="kv"><dt>Услуга</dt><dd>' + esc(b.serviceName) + ' · ' + esc(money(b.price)) + '</dd></div>' +
      '<div class="kv"><dt>Автомобиль</dt><dd>' + esc(b.car) + (b.plate ? ' <span class="plate">' + esc(b.plate) + '</span>' : '') + '</dd></div>' +
      (cfg().address ? '<div class="kv"><dt>Адрес</dt><dd>' + esc(cfg().address) + '</dd></div>' : '') + '</dl>' +
      '<div class="stack-btns"><button class="btn primary" id="doneIcs" type="button">' + svg(TAB.cal) + 'Добавить в календарь</button><button class="btn ghost" id="doneMine" type="button">Мои записи</button><button class="btn" id="doneAgain" type="button">Записаться ещё</button></div>';
    st.step = 'done'; renderShell(); $('#scroll').scrollTop = 0;
  }
  function resetBooking() { st.sel = { svc: null, date: null, time: null }; $('#fComment').value = ''; renderServices(); go(1); }
  function prefill() {
    const p = lsGet('profile', null); if (!p) return;
    $('#fBrand').value = p.brand || ''; $('#fModel').value = p.model || ''; $('#fPlate').value = p.plate || ''; $('#fName').value = p.name || ''; $('#fPhone').value = p.phone || '';
  }

  /* ---------- мои записи ---------- */
  const STATUS = { new: 'Ждёт подтверждения', confirmed: 'Подтверждена', cancelled: 'Отменена', done: 'Выполнена' };
  function renderMine() {
    const list = S.mine.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 20), box = $('#mineList');
    if (!list.length) box.innerHTML = '<div class="empty-state">' + svg(TAB.book) + '<b>Записей пока нет</b>Когда вы запишетесь, она появится здесь вместе со статусом.</div>';
    else box.innerHTML = list.map(b => {
      const live = b.status === 'new' || b.status === 'confirmed';
      return '<article class="card mine-item" data-id="' + esc(b.id) + '"><div class="top"><b>' + esc(b.serviceName) + '</b><span class="pill ' + esc(b.status) + '">' + esc(STATUS[b.status] || b.status) + '</span></div>' +
        '<div class="when">' + esc(fmtD(b.date)) + ', ' + esc(b.time) + '</div><div class="note">' + esc(b.car) + (b.plate ? ' · ' + esc(b.plate) : '') + '</div>' +
        (live ? '<div class="row-btns"><button class="btn small" data-ics type="button">' + svg(TAB.cal) + 'В календарь</button><button class="btn small danger" data-cancel type="button">Отменить</button></div>' : '') + '</article>';
    }).join('');
    renderTabbar();
  }

  /* ---------- владелец ---------- */
  function renderOwner() {
    const bks = S.bookings, n = newCount(), today = todayS();
    const todayN = bks.filter(b => b.date === today && (b.status === 'new' || b.status === 'confirmed')).length;
    const actN = bks.filter(b => b.status === 'new' || b.status === 'confirmed').length;
    $('#stats').innerHTML = '<div class="stat ' + (n ? 'hot' : '') + '"><small>Новые</small><b>' + n + '</b></div><div class="stat"><small>Сегодня</small><b>' + todayN + '</b></div><div class="stat"><small>Активные</small><b>' + actN + '</b></div>';
    $('#oseg').innerHTML = [['bookings', 'Записи'], ['services', 'Услуги'], ['settings', 'Настройки']].map(([k, t]) => '<button type="button" role="tab" data-ot="' + k + '" aria-selected="' + (st.otab === k) + '">' + t + '</button>').join('');
    $('#oBookings').hidden = st.otab !== 'bookings'; $('#oServices').hidden = st.otab !== 'services'; $('#oSettings').hidden = st.otab !== 'settings';
    if (st.otab === 'bookings') renderBookings();
    else if (st.otab === 'services') { if (!$('#svcEditor') || !$('#oServices').contains(document.activeElement)) renderServicesAdmin(); }
    else if (!$('#cfgForm')) renderSettings();
  }
  function renderBookings() {
    const defs = [['new', 'Новые'], ['confirmed', 'Подтверждённые'], ['all', 'Все']];
    $('#chips').innerHTML = defs.map(([k, t]) => '<button type="button" class="chip" data-f="' + k + '" aria-pressed="' + (st.filter === k) + '">' + t + '</button>').join('') + '<span class="sp"></span><button type="button" class="chip" id="soundBtn" aria-pressed="' + st.sound + '">Звук ' + (st.sound ? 'вкл' : 'выкл') + '</button>';
    let list = S.bookings;
    if (st.filter === 'new') list = list.filter(b => b.status === 'new'); else if (st.filter === 'confirmed') list = list.filter(b => b.status === 'confirmed');
    const key = b => b.date + fromMin(b.startMin || 0);
    list.sort((a, b) => key(a).localeCompare(key(b)));
    const box = $('#bookingList'), today = todayS();
    if (!list.length) { box.innerHTML = '<div class="empty-state">' + svg(TAB.inbox) + '<b>' + (st.filter === 'new' ? 'Новых записей нет' : 'Записей нет') + '</b>Когда клиент запишется, запись появится здесь, прозвучит сигнал, а на вкладке появится счётчик.</div>'; return; }
    let cur = '', html = '';
    for (const b of list) {
      if (b.date !== cur) { cur = b.date; html += '<div class="day-head">' + esc(fmtD(cur)) + (cur === today ? ' · сегодня' : '') + '<small>записей: ' + list.filter(x => x.date === cur).length + '</small></div>'; }
      const label = { new: 'Новая', confirmed: 'Подтверждена', cancelled: 'Отклонена', done: 'Выполнена' }[b.status] || b.status;
      html += '<article class="bk ' + (b.status === 'new' ? 'is-new' : '') + '" data-id="' + esc(b.id) + '"><div class="t">' + esc(b.time) + '<small>' + esc(b.duration) + ' мин</small></div>' +
        '<div class="who"><div class="head"><b>' + esc(b.serviceName) + '</b><span class="pill ' + esc(b.status) + '">' + label + '</span></div>' +
        '<div class="line">' + esc(b.name) + ' · <a href="tel:' + esc(String(b.phone).replace(/[^\d+]/g, '')) + '">' + esc(b.phone) + '</a></div>' +
        '<div class="line">' + esc(b.car) + (b.plate ? ' <span class="plate">' + esc(b.plate) + '</span>' : '') + ' · ' + esc(money(b.price)) + '</div>' + (b.comment ? '<div class="com">' + esc(b.comment) + '</div>' : '') + '</div>' +
        '<div class="act">' + (b.status === 'new' ? '<button class="btn primary small" data-a="confirmed" type="button">Подтвердить</button>' : '') + (b.status === 'confirmed' ? '<button class="btn ok small" data-a="done" type="button">Выполнено</button>' : '') +
        (b.status === 'new' || b.status === 'confirmed' ? '<button class="btn danger small" data-a="cancelled" type="button">Отклонить</button>' : '') + '</div></article>';
    }
    box.innerHTML = html;
  }
  function renderServicesAdmin() {
    const list = S.services;
    $('#oServices').innerHTML = '<p class="note" style="margin-bottom:10px">Длительность определяет, сколько времени в расписании занимает запись.</p><div id="svcEditor">' +
      (list.length ? list.map(s => '<div class="svc-row" data-id="' + esc(s.id) + '">' +
        '<label class="f name-f" for="sn-' + esc(s.id) + '">Название<input id="sn-' + esc(s.id) + '" data-k="name" maxlength="80" value="' + esc(s.name) + '"></label>' +
        '<label class="f" for="sd-' + esc(s.id) + '">Минут<input id="sd-' + esc(s.id) + '" data-k="duration" type="number" inputmode="numeric" min="15" step="15" value="' + esc(s.duration) + '"></label>' +
        '<label class="f" for="sp-' + esc(s.id) + '">Цена<input id="sp-' + esc(s.id) + '" data-k="price" type="number" inputmode="numeric" min="0" step="50" value="' + esc(s.price) + '"></label>' +
        '<button class="btn danger small" data-del type="button">Удалить услугу</button></div>').join('')
        : '<div class="empty-state">' + svg(IC.wrench) + '<b>Услуг пока нет</b>Добавьте первую, и клиенты смогут её выбрать.</div>') +
      '</div><button class="btn block" id="addSvc" type="button" style="margin-top:6px">Добавить услугу</button>';
  }
  function renderSettings() {
    const c = cfg(), days = [1, 2, 3, 4, 5, 6, 0].map(d => '<label><input type="checkbox" name="wd" value="' + d + '" ' + (c.days.includes(d) ? 'checked' : '') + '>' + WD[d] + '</label>').join('');
    $('#oSettings').innerHTML = '<div class="settings"><section><h2>Об автосервисе</h2><form id="cfgForm" class="fields" novalidate>' +
      '<label class="f full" for="cName">Название<input id="cName" maxlength="60" value="' + esc(c.name) + '"></label>' +
      '<label class="f" for="cPhone">Телефон<input id="cPhone" type="tel" maxlength="30" value="' + esc(c.phone) + '"></label>' +
      '<label class="f" for="cAddr">Адрес<input id="cAddr" maxlength="80" value="' + esc(c.address) + '"></label>' +
      '<label class="f full" for="cLegal">Для документов: ИП или ООО и ИНН<input id="cLegal" maxlength="120" placeholder="ИП Иванов Иван Иванович, ИНН 123456789012" value="' + esc(c.legal || '') + '"></label>' +
      '<label class="f" for="cStart">Открываемся<input id="cStart" type="time" value="' + esc(c.start) + '"></label>' +
      '<label class="f" for="cEnd">Закрываемся<input id="cEnd" type="time" value="' + esc(c.end) + '"></label>' +
      '<label class="f" for="cStep">Шаг записи<select id="cStep"><option value="30" ' + (c.step === 30 ? 'selected' : '') + '>30 минут</option><option value="60" ' + (c.step === 60 ? 'selected' : '') + '>60 минут</option></select></label>' +
      '<label class="f" for="cCur">Валюта<input id="cCur" maxlength="4" value="' + esc(c.currency) + '"></label>' +
      '<div class="full"><div class="note" style="margin-bottom:8px">Рабочие дни</div><div class="days-set">' + days + '</div></div>' +
      '<div class="full" style="display:flex;gap:12px;align-items:center"><button class="btn primary" id="cfgSave" type="button">Сохранить</button><span class="note" id="cfgMsg"></span></div></form></section>' +
      '<section><h2>Уведомления</h2><div class="card tg"><span class="ic">' + svg(TAB.send) + '</span><div><b>Telegram-бот</b><span class="note">Заявка приходит вам в Telegram мгновенно, подтвердить можно одной кнопкой. Подключается при запуске для реальных клиентов.</span></div></div></section>' +
      '<section><h2>Демо</h2><div class="demo-note">Сейчас данные хранятся только на этом телефоне. Нажмите «Входящая запись», чтобы увидеть, как заявка приходит владельцу.</div>' +
      '<div class="stack-btns"><button class="btn primary" id="simBtn" type="button">Входящая запись от клиента</button><button class="btn danger" id="resetBtn" type="button">Сбросить демо-данные</button></div></section></div>';
  }
  async function saveCfg() {
    const g = id => $(id).value.trim(), msg = $('#cfgMsg');
    const days = Array.from(document.querySelectorAll('input[name="wd"]:checked')).map(x => Number(x.value));
    const c = { name: g('#cName') || 'Автосервис', phone: g('#cPhone'), address: g('#cAddr'), legal: g('#cLegal'), start: g('#cStart') || '09:00', end: g('#cEnd') || '19:00', step: Number($('#cStep').value) || 30, currency: g('#cCur') || '₽', days: days.length ? days : [1, 2, 3, 4, 5] };
    if (toMin(c.end) - toMin(c.start) < c.step) { msg.textContent = 'Закрытие должно быть позже открытия.'; return; }
    await S.saveConfig(c); msg.textContent = 'Сохранено'; setTimeout(() => { msg.textContent = ''; }, 2500);
  }

  /* ---------- установка на телефон ---------- */
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); st.deferred = e; });
  function openInstall() {
    let h = '<h2>Приложение на экране телефона</h2>';
    if (standalone()) h += '<p class="note" style="margin-bottom:16px">Приложение уже установлено и открыто как обычное.</p>';
    else if (isIOS) h += '<div class="how"><div class="card"><span class="n">1</span><div><b>Откройте ссылку в Safari</b><span class="note">В других браузерах на iPhone установка недоступна.</span></div></div><div class="card"><span class="n">2</span><div><b>Нажмите «Поделиться»</b><span class="note">Квадрат со стрелкой внизу экрана.</span></div></div><div class="card"><span class="n">3</span><div><b>«На экран “Домой”»</b><span class="note">Затем «Добавить». Значок появится среди приложений.</span></div></div></div>';
    else h += (st.deferred ? '<button class="btn primary block" id="doInstall" type="button" style="margin-bottom:12px">Установить приложение</button>' : '') + '<div class="how"><div class="card"><span class="n">1</span><div><b>Откройте ссылку в Chrome</b></div></div><div class="card"><span class="n">2</span><div><b>Меню с тремя точками</b><span class="note">Справа вверху.</span></div></div><div class="card"><span class="n">3</span><div><b>«Установить приложение»</b><span class="note">Или «Добавить на главный экран».</span></div></div></div>';
    h += '<button class="btn ghost block" id="sheetClose" type="button">Понятно</button>';
    $('#sheetPanel').innerHTML = h; $('#sheet').hidden = false;
  }

  /* ---------- события ---------- */
  document.addEventListener('click', async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.classList.contains('svc')) { buzz(); st.sel.svc = t.dataset.id; st.sel.time = null; renderServices(); renderSoon(); renderCta(); }
    else if (t.id === 'soonBtn') { if (!selSvc()) { const s = S.services.slice().sort((a, b) => a.duration - b.duration)[0]; st.sel.svc = s && s.id; } st.sel.date = t.dataset.date; st.sel.time = Number(t.dataset.m); renderServices(); go(2); }
    else if (t.classList.contains('day')) { buzz(); st.sel.date = t.dataset.d; st.sel.time = null; renderDays(); renderTimes(); renderCta(); }
    else if (t.classList.contains('time')) { buzz(); st.sel.time = Number(t.dataset.m); renderTimes(); renderCta(); }
    else if (t.id === 'ctaNext') { if (st.step === 3) submitBooking(); else go(st.step + 1); }
    else if (t.id === 'backBtn') go(st.step - 1);
    else if (t.id === 'doneMine') { st.ctab = 'mine'; renderShell(); }
    else if (t.id === 'doneAgain') resetBooking();
    else if (t.id === 'doneIcs') { if (lastBooking) downloadIcs(lastBooking); }
    else if (t.id === 'installBtn') openInstall();
    else if (t.id === 'doInstall') { try { st.deferred.prompt(); await st.deferred.userChoice; } catch (x) { /* отмена */ } st.deferred = null; $('#sheet').hidden = true; }
    else if (t.id === 'sheetClose') $('#sheet').hidden = true;
    else if (t.dataset.tab) {
      st.ctab = t.dataset.tab;
      if (st.ctab === 'book' && st.step === 'done') { st.sel = { svc: null, date: null, time: null }; $('#fComment').value = ''; renderServices(); st.step = 1; }
      renderShell(); $('#scroll').scrollTop = 0;
    }
    else if (t.dataset.ot) { st.otab = t.dataset.ot; if (st.otab === 'settings') renderSettings(); if (st.otab === 'services') renderServicesAdmin(); renderOwner(); }
    else if (t.classList.contains('chip') && t.dataset.f) { st.filter = t.dataset.f; renderBookings(); }
    else if (t.id === 'soundBtn') { st.sound = !st.sound; if (st.sound) beep(); renderBookings(); }
    else if (t.dataset.a) {
      const id = t.closest('.bk').dataset.id;
      if (t.dataset.a === 'cancelled' && !t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно отклонить?'; setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = 'Отклонить'; } }, 4000); return; }
      S.setStatus(id, t.dataset.a);
    }
    else if (t.hasAttribute('data-ics')) { const b = S.mine.find(x => x.id === t.closest('.mine-item').dataset.id); if (b) downloadIcs(b); }
    else if (t.hasAttribute('data-cancel')) {
      if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно отменить?'; setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = 'Отменить'; } }, 4000); return; }
      S.setStatus(t.closest('.mine-item').dataset.id, 'cancelled');
    }
    else if (t.id === 'cfgSave') saveCfg();
    else if (t.id === 'addSvc') { await S.addService({}); renderServicesAdmin(); }
    else if (t.hasAttribute('data-del')) { await S.deleteService(t.closest('.svc-row').dataset.id); renderServicesAdmin(); }
    else if (t.id === 'simBtn') {
      const b = await S.simulateIncoming(svc => firstFree(svc));
      if (!b) toast('Нет свободного времени или нет услуг.');
    }
    else if (t.id === 'resetBtn') { if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно сбросить?'; setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = 'Сбросить демо-данные'; } }, 4000); return; } st.known.clear(); st.first = true; localStorage.removeItem('profile'); await S.resetDemo(); renderSettings(); }
  });
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') $('#sheet').hidden = true; });
  document.addEventListener('change', async e => {
    const el = e.target, row = el.closest && el.closest('.svc-row');
    if (row && el.dataset.k) {
      let v = el.value; if (el.dataset.k !== 'name') v = Math.max(el.dataset.k === 'duration' ? 15 : 0, Number(v) || 0); else v = v.trim() || 'Услуга';
      await S.updateService(row.dataset.id, { [el.dataset.k]: v });
    }
  });
  $('#form').addEventListener('input', () => { if (st.err) { st.err = ''; renderCta(); } });
  $('#fPlate').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase(); });

  /* ---------- изменения данных ---------- */
  function onData() {
    renderHero(); renderServices(); renderSoon(); renderMine();
    if (st.sel.svc && !svcById(st.sel.svc)) st.sel.svc = null;
    if (st.ctab === 'book' && st.step === 2) { renderDays(); renderTimes(); }
    S.bookings.forEach(b => {
      if (!st.known.has(b.id)) {
        st.known.add(b.id);
        if (!st.first && !b.own && b.status === 'new') { toast('Новая запись: <b>' + esc(b.time) + '</b>, ' + esc(fmtD(b.date)) + '<br>' + esc(b.serviceName) + ' · ' + esc(b.name)); beep(); buzz(); }
      }
    });
    st.first = false;
    renderShell();
  }

  /* ---------- запуск ---------- */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* офлайн необязателен */ });
  prefill();
  S.subscribe(onData);
  onData();
  setInterval(() => { renderHero(); }, 60000);
  window.__app = { st, go, S };
})();

