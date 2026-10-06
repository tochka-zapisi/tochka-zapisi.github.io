(function () {
  'use strict';
  const S = window.Store;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const TITLE = 'Онлайн-запись — Нефть';
  const HORIZON = 14;
  const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const WD_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  /* Значки услуг — по словам в названии: стрижка, окрашивание, ногти, брови, борода, уход, приём врача, зубы */
  const IC = {
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12"/>',
    drop: '<path d="M12 3c3.2 4.2 6 7.2 6 11a6 6 0 0 1-12 0c0-3.8 2.8-6.8 6-11z"/><path d="M9.5 14.5a2.7 2.7 0 0 0 2.5 2.5"/>',
    nail: '<path d="M8.5 21V9.5a3.5 3.5 0 0 1 7 0V21"/><path d="M10.2 10a1.8 1.8 0 0 1 3.6 0v2.6h-3.6z"/>',
    eye: '<path d="M2.5 13s3.5-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.5 5.5-9.5 5.5-9.5-5.5-9.5-5.5z"/><circle cx="12" cy="13" r="2.5"/><path d="M5 5.5c2-1.2 4.4-1.8 7-1.8s5 .6 7 1.8"/>',
    beard: '<path d="M12 11.5c-1.4-2.3-4.3-3-6.3-1.4C4.3 11.3 3.8 13.4 2.3 13.4c1 2.4 4.8 2.9 7.2 1.2.9-.6 1.8-1.3 2.5-2.1.7.8 1.6 1.5 2.5 2.1 2.4 1.7 6.2 1.2 7.2-1.2-1.5 0-2-2.1-3.4-3.3-2-1.6-4.9-.9-6.3 1.4z"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19c3-4 6-7 10-10"/>',
    cross: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
    tooth: '<path d="M7 3.5c-2.4 0-3.8 1.9-3.8 4.3 0 2.9 1.4 4.3 1.9 6.7.4 1.9.8 6 2.4 6s1.5-4.6 4.5-4.6 2.9 4.6 4.5 4.6 2-4.1 2.4-6c.5-2.4 1.9-3.8 1.9-6.7 0-2.4-1.4-4.3-3.8-4.3-1.9 0-2.9 1-5 1s-3.1-1-5-1z"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>'
  };
  const iconFor = n => {
    n = String(n).toLowerCase();
    return /бород|брить|бритьё|усы|бакенб/.test(n) ? 'beard' : /бров|ресниц|взгляд/.test(n) ? 'eye' : /маник|педик|ногт|гель|шеллак|наращив/.test(n) ? 'nail'
      : /окраш|тонир|колор|мелир|балаяж|шатуш|блонд/.test(n) ? 'drop' : /стриж|стрич|уклад|причёс|причес|чёлк|челк|волос/.test(n) ? 'scissors'
      : /зуб|стомат|имплант|пломб/.test(n) ? 'tooth' : /при[её]м|врач|консульт|осмотр|узи|анализ|терап|диагност/.test(n) ? 'cross'
      : /массаж|спа|уход|пилинг|чистк|маск|лиц|кож|эпил|депил|шугар|обёрт|оберт/.test(n) ? 'leaf' : 'sparkle';
  };
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

  /* ---------- состояние ---------- */
  const st = { ctab: 'book', otab: 'bookings', step: 1, filter: 'new', mfilter: 'all', only: null, sel: { svc: null, master: 'any', date: null, time: null }, err: '', busy: false, sound: true, known: new Set(), first: true, deferred: null };
  const cfg = () => S.cfg;
  const toMin = t => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtD = s => { const d = parseD(s); return WD[d.getDay()] + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; };
  const todayS = () => dstr(new Date());
  const money = (v, from) => (Number(v) > 0 ? (from ? 'от ' : '') + Number(v).toLocaleString('ru-RU') + ' ' + cfg().currency : 'по запросу');
  const priceOf = s => money(s.price, s.from || s.priceFrom);
  const svcById = id => S.services.find(s => s.id === id);
  const selSvc = () => (st.sel.svc ? svcById(st.sel.svc) : null);
  const masterById = id => S.masters.find(m => m.id === id);
  const hasMasters = () => S.masters.length > 0;
  const mastersFor = svc => (svc ? S.masters.filter(m => !m.services || m.services.includes(svc.id)) : []);
  /* У мастера свои рабочие дни (null — все дни салона) */
  const worksOn = (m, dow) => !m || !m.days || m.days.includes(dow);
  /* Ссылка «запись к мастеру»: ?m=<id> — мастер ставит её у себя в соцсетях */
  const linkFor = id => location.origin + location.pathname + '?m=' + encodeURIComponent(id);
  const onlyMaster = () => (st.only ? masterById(st.only) : null);
  const initial = n => (String(n).trim()[0] || '•').toUpperCase();
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
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
  /* Часы дня недели: [начало, конец] или null — выходной */
  function hoursOf(dow) {
    const c = cfg(), byDay = c.hours && Object.keys(c.hours).length;
    const h = byDay ? c.hours[dow] : (c.days.includes(dow) ? [c.start, c.end] : null);
    return h && h[0] && h[1] && toMin(h[1]) > toMin(h[0]) ? h : null;
  }
  function coveringMins(svc, m) { const n = Math.max(1, Math.ceil((Number(svc.duration) || cfg().step) / cfg().step)); return Array.from({ length: n }, (_, i) => m + i * cfg().step); }
  /* Кто может принять: выбранный мастер, или все мастера услуги — сначала менее загруженные в этот день. Без мастеров — общая очередь (id '') */
  function poolFor(svc, date, who) {
    if (!hasMasters()) return [''];
    const load = id => S.bookings.filter(b => b.masterId === id && b.date === date && (b.status === 'new' || b.status === 'confirmed')).length;
    const dow = parseD(date).getDay();
    const list = mastersFor(svc).filter(m => (!who || who === 'any' || m.id === who) && worksOn(m, dow));
    return list.map(m => [m.id, load(m.id), m.order || 0]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map(x => x[0]);
  }
  /* Занято ли время у мастера. Общая очередь ('') занята, если в это время есть любая запись — и к мастерам, которых уже убрали */
  function busy(occ, date, x, mid) {
    const k = S.helpers.slotId(date, x, mid);
    if (occ.has(k)) return true;
    if (mid === '') { const tail = k.slice(k.indexOf('|')); for (const key of occ.keys()) if (key.endsWith(tail)) return true; }
    return false;
  }
  function freeIn(pool, svc, date, m, occ) {
    const cov = coveringMins(svc, m);
    const id = pool.find(mid => cov.every(x => !busy(occ, date, x, mid)));
    return id === undefined ? null : id;
  }
  function timesFor(svc, date, who) {
    const h = hoursOf(parseD(date).getDay()); if (!h) return [];
    const c = cfg(), s = toMin(h[0]), e = toMin(h[1]), now = new Date(), occ = S.occupied(), pool = poolFor(svc, date, who);
    if (!pool.length) return [];
    const isToday = date === dstr(now), lead = now.getHours() * 60 + now.getMinutes() + 60, out = [];
    for (let m = s; ; m += c.step) {
      const cov = coveringMins(svc, m);
      if (cov[cov.length - 1] + c.step > e) break;
      if (isToday && m < lead) continue;
      const mid = freeIn(pool, svc, date, m, occ);
      out.push({ m, ok: mid !== null, mid });
    }
    return out;
  }
  function firstFree(svc, who) {
    if (!svc) return null;
    const base = new Date();
    for (let i = 0; i < HORIZON; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      if (!hoursOf(d.getDay())) continue;
      const hit = timesFor(svc, dstr(d), who || 'any').find(t => t.ok);
      if (hit) return { date: dstr(d), m: hit.m, mid: hit.mid };
    }
    return null;
  }
  function openState() {
    const now = new Date(), m = now.getHours() * 60 + now.getMinutes(), h = hoursOf(now.getDay());
    if (h && m >= toMin(h[0]) && m < toMin(h[1])) return { open: true, t: 'Открыто до ' + h[1] };
    for (let i = 0; i < 8; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), hd = hoursOf(d.getDay());
      if (!hd) continue;
      if (i === 0 && m >= toMin(hd[0])) continue;
      return { open: false, t: 'Закрыто, откроемся ' + (i === 0 ? 'сегодня' : i === 1 ? 'завтра' : WD[d.getDay()]) + ' в ' + hd[0] };
    }
    return { open: false, t: 'Закрыто' };
  }

  /* ---------- шапка, вкладки, общий каркас ---------- */
  const newCount = () => S.bookings.filter(b => b.status === 'new').length;
  const activeMine = () => S.mine.filter(b => b.status === 'new' || b.status === 'confirmed').length;
  function renderTabbar() {
    const items = [['book', 'Запись', 0], ['mine', 'Мои записи', activeMine()], ['owner', 'Владелец', newCount()]];
    $('#tabbar').innerHTML = items.map(([k, label, n]) => '<button type="button" class="tab" data-tab="' + k + '"' + (st.ctab === k ? ' aria-current="page"' : '') + '>' + svg(TAB[k]) + '<span>' + label + '</span>' + (n ? '<span class="dot">' + n + '</span>' : '') + '</button>').join('');
    document.title = (newCount() ? '(' + newCount() + ') ' : '') + TITLE;
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
  function go(step) {
    st.step = step; st.err = ''; renderShell(); $('#scroll').scrollTop = 0;
    if (step === 2) { $('#p2h').textContent = hasMasters() ? 'Мастер и время' : 'Когда вам удобно?'; renderMasters(); renderDays(); renderTimes(); }
    if (step === 3) renderRecap();
  }

  /* ---------- клиент: герой, услуги, мастера, дни, время ---------- */
  function renderHero() {
    const c = cfg(), os = openState();
    $('#shopName').textContent = c.name;
    const live = $('#liveNow'); live.classList.toggle('closed', !os.open); live.lastElementChild.textContent = os.t;
    const om = onlyMaster();
    $('#heroSub').innerHTML = om ? 'Запись к мастеру <b>' + esc(om.name) + '</b>' + (om.role ? ' · ' + esc(om.role) : '') + '. <button type="button" class="linkish" id="allMasters">Все мастера</button>'
      : hasMasters() ? 'Выберите услугу, мастера и время. Мы увидим запись сразу.' : 'Выберите услугу и время. Мы увидим запись сразу.';
    const a = [];
    if (c.phone) a.push('<a class="ha" href="tel:' + esc(c.phone.replace(/[^\d+]/g, '')) + '">' + svg(TAB.phone) + '<span>Позвонить</span></a>');
    if (c.address) a.push('<a class="ha" target="_blank" rel="noopener" href="https://yandex.ru/maps/?text=' + encodeURIComponent(c.address) + '">' + svg(TAB.pin) + '<span>' + esc(c.address) + '</span></a>');
    $('#heroActions').innerHTML = a.join('');
    const ms = S.masters, team = $('#team');
    team.hidden = !ms.length;
    team.innerHTML = ms.length ? '<div class="avs">' + ms.slice(0, 5).map(m => '<span class="av">' + esc(initial(m.name)) + '</span>').join('') + (ms.length > 5 ? '<span class="av more">+' + (ms.length - 5) + '</span>' : '') + '</div>' +
      '<div class="team-t"><b>' + ms.length + ' ' + plural(ms.length, 'мастер', 'мастера', 'мастеров') + '</b><span>' + esc(ms.map(m => m.name).join(', ')) + '</span></div>' : '';
  }
  function renderSoon() {
    const om = onlyMaster(), svcs = S.services.filter(s => !om || !om.services || om.services.includes(s.id)), btn = $('#soonBtn');
    const svc = selSvc() || svcs.slice().sort((a, b) => a.duration - b.duration)[0];
    const f = firstFree(svc, om ? om.id : 'any');
    btn.innerHTML = f ? '<span class="ic">' + svg(TAB.clock) + '</span><span><small>Ближайшее свободное время</small><b>' + (f.date === todayS() ? 'Сегодня' : fmtD(f.date)) + ', ' + fromMin(f.m) + '</b></span>' : '';
    btn.dataset.date = f ? f.date : ''; btn.dataset.m = f ? f.m : '';
    btn.hidden = !f || !(st.ctab === 'book' && st.step === 1);
  }
  function renderServices() {
    const box = $('#svcList'), om = onlyMaster(), list = S.services.filter(s => !om || !om.services || om.services.includes(s.id));
    if (!list.length) { box.innerHTML = '<div class="hint">Услуги пока не добавлены. Владелец добавляет их в разделе «Владелец».</div>'; return; }
    box.innerHTML = list.map(s => '<button type="button" class="svc" data-id="' + esc(s.id) + '" aria-pressed="' + (st.sel.svc === s.id) + '"><span class="ic">' + svg(IC[iconFor(s.name)]) + '</span><b>' + esc(s.name) + '</b><span class="price">' + esc(priceOf(s)) + '</span><span class="dur">около ' + esc(s.duration) + ' мин</span></button>').join('');
  }
  function renderMasters() {
    const box = $('#masterStrip'), svc = selSvc();
    if (!hasMasters() || !svc) { box.hidden = true; box.innerHTML = ''; return; }
    const list = mastersFor(svc);
    if (st.sel.master !== 'any' && !list.some(m => m.id === st.sel.master)) st.sel.master = 'any';
    box.hidden = false;
    const btn = (id, av, name, role) => '<button type="button" class="mst" data-m="' + esc(id) + '" aria-pressed="' + (st.sel.master === id) + '"><span class="av">' + av + '</span><b>' + esc(name) + '</b><small>' + esc(role) + '</small></button>';
    box.innerHTML = '<div class="part first">Мастер</div><div class="masters">' + btn('any', svg(IC.sparkle), 'Любой', 'кто свободен') + list.map(m => btn(m.id, esc(initial(m.name)), m.name, m.role || 'Мастер')).join('') + '</div><div class="part">День и время</div>';
  }
  /* День открыт, если работает салон и хотя бы один подходящий мастер (или выбранный мастер) */
  function dayOpen(dow) {
    if (!hoursOf(dow)) return false;
    if (!hasMasters()) return true;
    const svc = selSvc(), who = st.sel.master;
    if (who && who !== 'any') return worksOn(masterById(who), dow);
    return svc ? mastersFor(svc).some(m => worksOn(m, dow)) : true;
  }
  function renderDays() {
    const base = new Date(); let h = '';
    for (let i = 0; i < HORIZON; i++) {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i), s = dstr(d), open = dayOpen(d.getDay());
      h += '<button type="button" class="day" data-d="' + s + '" ' + (open ? '' : 'disabled') + ' aria-pressed="' + (st.sel.date === s) + '"><small>' + (i === 0 ? 'Сегодня' : WD[d.getDay()]) + '</small><strong>' + d.getDate() + '</strong><small>' + MON[d.getMonth()] + '</small></button>';
    }
    $('#dayStrip').innerHTML = h;
  }
  function renderTimes() {
    const box = $('#timeGrid'), svc = selSvc();
    if (!svc) { box.innerHTML = '<div class="hint">Сначала выберите услугу на первом шаге.</div>'; return; }
    if (hasMasters() && !mastersFor(svc).length) { box.innerHTML = '<div class="hint">Эту услугу сейчас не выполняет ни один мастер. Позвоните нам' + (cfg().phone ? ': <a href="tel:' + esc(cfg().phone.replace(/[^\d+]/g, '')) + '">' + esc(cfg().phone) + '</a>' : '') + '.</div>'; return; }
    if (st.sel.date && !dayOpen(parseD(st.sel.date).getDay())) st.sel.date = null;
    if (!st.sel.date) { box.innerHTML = '<div class="hint">Выберите день, и здесь появится свободное время.</div>'; return; }
    const list = timesFor(svc, st.sel.date, st.sel.master);
    if (!list.length || !list.some(t => t.ok)) { box.innerHTML = '<div class="hint">' + (st.sel.master !== 'any' && hasMasters() ? 'У этого мастера в этот день свободного времени нет. Выберите другой день или «Любой».' : 'На этот день свободного времени нет. Выберите другой день.') + '</div>'; if (st.sel.time != null) st.sel.time = null; return; }
    if (st.sel.time != null && !list.some(t => t.m === st.sel.time && t.ok)) st.sel.time = null;
    const part = (t, from, to) => { const arr = list.filter(x => x.m >= from * 60 && x.m < to * 60); return arr.length ? '<div class="part">' + t + '</div><div class="times">' + arr.map(x => '<button type="button" class="time" data-m="' + x.m + '" ' + (x.ok ? '' : 'disabled') + ' aria-pressed="' + (st.sel.time === x.m) + '">' + fromMin(x.m) + '</button>').join('') + '</div>' : ''; };
    box.innerHTML = part('Утро', 0, 12) + part('День', 12, 17) + part('Вечер', 17, 24);
  }
  /* Кто примет в выбранное время (при «Любой» — менее загруженный свободный мастер) */
  function chosenMaster() {
    const svc = selSvc(); if (!svc || !st.sel.date || st.sel.time == null) return null;
    const id = freeIn(poolFor(svc, st.sel.date, st.sel.master), svc, st.sel.date, st.sel.time, S.occupied());
    return id === null ? null : { id, m: masterById(id) || null };
  }
  function renderRecap() {
    const svc = selSvc(); if (!svc) return;
    const who = chosenMaster(), mName = who && who.m ? who.m.name : '';
    $('#recap').innerHTML = '<span class="ic">' + svg(IC[iconFor(svc.name)]) + '</span><div><b>' + esc(svc.name) + ' · ' + esc(priceOf(svc)) + '</b><span>' + esc(fmtD(st.sel.date)) + ', ' + fromMin(st.sel.time) + (mName ? ' · мастер ' + esc(mName) : '') + '</span></div>';
  }
  function formProblem() {
    if (!$('#fName').value.trim()) return 'Укажите имя.';
    if ($('#fPhone').value.replace(/\D/g, '').length < 6) return 'Укажите телефон, чтобы мы могли связаться.';
    if (!$('#fConsent').checked) return 'Отметьте согласие на обработку персональных данных.';
    return '';
  }
  function renderCta() {
    if (st.ctab !== 'book' || typeof st.step !== 'number') return;
    const svc = selSvc(), s = st.sel, n = st.step, lab = $('#ctaLabel'), val = $('#ctaVal'), next = $('#ctaNext');
    if (st.err) { lab.innerHTML = '<span class="err">' + esc(st.err) + '</span>'; val.textContent = ''; }
    else if (n === 1) { lab.textContent = svc ? svc.name : 'Услуга не выбрана'; val.textContent = svc ? priceOf(svc) : ''; }
    else if (n === 2) { lab.textContent = s.date && s.time != null ? fmtD(s.date) : 'Выберите день и время'; val.textContent = s.date && s.time != null ? fromMin(s.time) : ''; }
    else { lab.textContent = svc ? svc.name : ''; val.textContent = svc ? priceOf(svc) : ''; }
    next.textContent = n === 3 ? (st.busy ? 'Отправляю…' : 'Записаться') : 'Далее';
    next.disabled = st.busy || (n === 1 && !svc) || (n === 2 && !(s.date && s.time != null));
  }

  /* ---------- запись ---------- */
  async function submitBooking() {
    const why = formProblem();
    if (why) { st.err = why; renderCta(); return; }
    st.err = ''; st.busy = true; renderCta();
    const svc = selSvc(), date = st.sel.date, m = st.sel.time, who = chosenMaster();
    if (!who) { st.busy = false; st.err = 'Это время только что заняли. Выберите другое.'; st.sel.time = null; go(2); return; }
    const slotIds = coveringMins(svc, m).map(x => S.helpers.slotId(date, x, who.id));
    const b = { serviceId: svc.id, serviceName: svc.name, duration: Number(svc.duration) || 0, price: Number(svc.price) || 0, priceFrom: !!svc.from, masterId: who.id, masterName: who.m ? who.m.name : '',
      date, time: fromMin(m), startMin: m, slotIds, name: $('#fName').value.trim(), phone: $('#fPhone').value.trim(), comment: $('#fComment').value.trim() };
    try { b.created = await S.createBooking(b); }
    catch (e) {
      st.busy = false;
      if (e && e.message === 'busy') { st.err = 'Это время только что заняли. Выберите другое.'; st.sel.time = null; go(2); } else { st.err = 'Не удалось отправить запись. Проверьте соединение и повторите.'; renderCta(); }
      return;
    }
    lsSet('profile', { name: b.name, phone: b.phone });
    st.busy = false; buzz(); showDone(b);
  }
  const icsEsc = s => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  function icsFor(b) {
    const d = b.date.replace(/-/g, ''), t = x => pad(Math.floor(x / 60)) + pad(x % 60) + '00';
    const end = b.startMin + (b.duration || 60);
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Studio//Zapis//RU', 'BEGIN:VEVENT', 'UID:' + (b.id || Date.now()) + '@zapis', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
      'DTSTART:' + d + 'T' + t(b.startMin), 'DTEND:' + d + 'T' + t(end), 'SUMMARY:' + icsEsc(b.serviceName + ' — ' + cfg().name), 'LOCATION:' + icsEsc(cfg().address),
      'DESCRIPTION:' + icsEsc((b.masterName ? 'Мастер: ' + b.masterName + '. ' : '') + 'Телефон: ' + (cfg().phone || '')), 'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEsc('Запись: ' + cfg().name), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'];
    return L.join('\r\n');
  }
  function downloadIcs(b) {
    const blob = new Blob([icsFor(b)], { type: 'text/calendar;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'zapis.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  let lastBooking = null;
  function showDone(b) {
    lastBooking = b.created || b;
    $('#p4').innerHTML = '<div class="check">' + svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="2.6"') + '</div><h2>Запись отправлена</h2><p class="note">' + esc(cfg().name) + ' получит заявку и подтвердит её. Статус будет во вкладке «Мои записи».</p>' +
      '<dl class="ticket"><div class="kv"><dt>Когда</dt><dd class="big">' + esc(fmtD(b.date)) + ', ' + esc(b.time) + '</dd></div><div class="perf"></div>' +
      '<div class="kv"><dt>Услуга</dt><dd>' + esc(b.serviceName) + ' · ' + esc(money(b.price, b.priceFrom)) + '</dd></div>' +
      (b.masterName ? '<div class="kv"><dt>Мастер</dt><dd>' + esc(b.masterName) + '</dd></div>' : '') +
      (cfg().address ? '<div class="kv"><dt>Адрес</dt><dd>' + esc(cfg().address) + '</dd></div>' : '') + '</dl>' +
      '<div class="stack-btns"><button class="btn primary" id="doneIcs" type="button">' + svg(TAB.cal) + 'Добавить в календарь</button><button class="btn ghost" id="doneMine" type="button">Мои записи</button><button class="btn" id="doneAgain" type="button">Записаться ещё</button></div>';
    st.step = 'done'; renderShell(); $('#scroll').scrollTop = 0;
  }
  function resetBooking() { st.sel = { svc: null, master: 'any', date: null, time: null }; $('#fComment').value = ''; renderServices(); go(1); }
  function prefill() {
    const p = lsGet('profile', null); if (!p) return;
    $('#fName').value = p.name || ''; $('#fPhone').value = p.phone || '';
  }

  /* ---------- мои записи ---------- */
  const STATUS = { new: 'Ждёт подтверждения', confirmed: 'Подтверждена', cancelled: 'Отменена', done: 'Выполнена' };
  function renderMine() {
    const list = S.mine.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 20), box = $('#mineList');
    if (!list.length) box.innerHTML = '<div class="empty-state">' + svg(TAB.book) + '<b>Записей пока нет</b>Когда вы запишетесь, она появится здесь вместе со статусом.</div>';
    else box.innerHTML = list.map(b => {
      const live = b.status === 'new' || b.status === 'confirmed';
      return '<article class="card mine-item" data-id="' + esc(b.id) + '"><div class="top"><b>' + esc(b.serviceName) + '</b><span class="pill ' + esc(b.status) + '">' + esc(STATUS[b.status] || b.status) + '</span></div>' +
        '<div class="when">' + esc(fmtD(b.date)) + ', ' + esc(b.time) + '</div><div class="note">' + (b.masterName ? 'Мастер ' + esc(b.masterName) + ' · ' : '') + esc(money(b.price, b.priceFrom)) + '</div>' +
        '<div class="row-btns">' + (live ? '<button class="btn small" data-ics type="button">' + svg(TAB.cal) + 'В календарь</button><button class="btn small danger" data-cancel type="button">Отменить</button>' : '') +
        '<button class="btn small' + (live ? ' ghost' : '') + '" data-again type="button">Записаться снова</button></div></article>';
    }).join('');
    renderTabbar();
  }

  /* ---------- владелец ---------- */
  function renderOwner() {
    const bks = S.bookings, n = newCount(), today = todayS();
    const todayN = bks.filter(b => b.date === today && (b.status === 'new' || b.status === 'confirmed')).length;
    const actN = bks.filter(b => b.status === 'new' || b.status === 'confirmed').length;
    $('#stats').innerHTML = '<div class="stat ' + (n ? 'hot' : '') + '"><small>Новые</small><b>' + n + '</b></div><div class="stat"><small>Сегодня</small><b>' + todayN + '</b></div><div class="stat"><small>Активные</small><b>' + actN + '</b></div>';
    $('#oseg').innerHTML = [['bookings', 'Записи'], ['clients', 'Клиенты'], ['services', 'Услуги'], ['masters', 'Мастера'], ['settings', 'Настройки']].map(([k, t]) => '<button type="button" role="tab" data-ot="' + k + '" aria-selected="' + (st.otab === k) + '">' + t + '</button>').join('');
    $('#oBookings').hidden = st.otab !== 'bookings'; $('#oClients').hidden = st.otab !== 'clients'; $('#oServices').hidden = st.otab !== 'services'; $('#oMasters').hidden = st.otab !== 'masters'; $('#oSettings').hidden = st.otab !== 'settings';
    if (st.otab === 'bookings') renderBookings();
    else if (st.otab === 'clients') renderClients();
    else if (st.otab === 'services') { if (!$('#svcEditor') || !$('#oServices').contains(document.activeElement)) renderServicesAdmin(); }
    else if (st.otab === 'masters') { if (!$('#mEditor') || !$('#oMasters').contains(document.activeElement)) renderMastersAdmin(); }
    else if (!$('#cfgForm')) renderSettings();
  }
  function renderBookings() {
    const defs = [['new', 'Новые'], ['confirmed', 'Подтверждённые'], ['all', 'Все']], ms = S.masters;
    if (st.mfilter !== 'all' && !ms.some(m => m.id === st.mfilter)) st.mfilter = 'all';
    $('#chips').innerHTML = defs.map(([k, t]) => '<button type="button" class="chip" data-f="' + k + '" aria-pressed="' + (st.filter === k) + '">' + t + '</button>').join('') + '<span class="sp"></span><button type="button" class="chip" id="soundBtn" aria-pressed="' + st.sound + '">Звук ' + (st.sound ? 'вкл' : 'выкл') + '</button>' +
      (ms.length ? '<label class="f mfilter" for="mFilter">Мастер<select id="mFilter"><option value="all">Все мастера</option>' + ms.map(m => '<option value="' + esc(m.id) + '"' + (st.mfilter === m.id ? ' selected' : '') + '>' + esc(m.name) + '</option>').join('') + '</select></label>' : '');
    let list = S.bookings;
    if (st.filter === 'new') list = list.filter(b => b.status === 'new'); else if (st.filter === 'confirmed') list = list.filter(b => b.status === 'confirmed');
    if (st.mfilter !== 'all') list = list.filter(b => b.masterId === st.mfilter);
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
        '<div class="line">' + (b.masterName ? '<span class="mtag">' + esc(b.masterName) + '</span> · ' : '') + esc(money(b.price, b.priceFrom)) + '</div>' + (b.comment ? '<div class="com">' + esc(b.comment) + '</div>' : '') + '</div>' +
        '<div class="act">' + (b.status === 'new' ? '<button class="btn primary small" data-a="confirmed" type="button">Подтвердить</button>' : '') + (b.status === 'confirmed' ? '<button class="btn ok small" data-a="done" type="button">Выполнено</button>' : '') +
        (b.status === 'new' || b.status === 'confirmed' ? '<button class="btn danger small" data-a="cancelled" type="button">Отклонить</button>' : '') + '</div></article>';
    }
    box.innerHTML = html;
  }
  /* Клиенты — из записей: по телефону. Визиты — все, кроме отменённых; сумма — по выполненным */
  function clients() {
    const map = new Map();
    for (const b of S.bookings) {
      const key = String(b.phone || '').replace(/\D/g, '') || b.name; if (!key) continue;
      const c = map.get(key) || { name: b.name, phone: b.phone, visits: 0, last: '', sum: 0, masters: {} };
      if (b.status !== 'cancelled') { c.visits++; if (b.date > c.last) { c.last = b.date; c.name = b.name || c.name; } if (b.masterName) c.masters[b.masterName] = (c.masters[b.masterName] || 0) + 1; }
      if (b.status === 'done') c.sum += Number(b.price) || 0;
      map.set(key, c);
    }
    return [...map.values()].filter(c => c.visits).map(c => ({ ...c, master: Object.entries(c.masters).sort((a, b) => b[1] - a[1])[0]?.[0] || '' })).sort((a, b) => b.last.localeCompare(a.last));
  }
  function renderClients() {
    const list = clients();
    $('#oClients').innerHTML = '<div class="cl-head"><p class="note">Клиенты собираются из записей сами. Выгрузка открывается в Excel.</p><button class="btn small" id="csvBtn" type="button">Скачать для Excel</button></div>' +
      (list.length ? '<div class="cl-list">' + list.map(c => '<article class="cl"><div><b>' + esc(c.name) + '</b><a href="tel:' + esc(String(c.phone).replace(/[^\d+]/g, '')) + '">' + esc(c.phone) + '</a></div>' +
        '<dl><div><dt>Визитов</dt><dd>' + c.visits + '</dd></div><div><dt>Последний</dt><dd>' + esc(fmtD(c.last)) + '</dd></div>' + (c.master ? '<div><dt>Мастер</dt><dd>' + esc(c.master) + '</dd></div>' : '') + '<div><dt>Оплачено</dt><dd>' + (c.sum ? esc(money(c.sum)) : '—') + '</dd></div></dl></article>').join('') + '</div>'
        : '<div class="empty-state">' + svg(IC.user) + '<b>Клиентов пока нет</b>Они появятся здесь после первых записей.</div>');
  }
  function downloadClients() {
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const rows = [['Имя', 'Телефон', 'Визитов', 'Последний визит', 'Мастер', 'Оплачено, ₽']].concat(clients().map(c => [c.name, c.phone, c.visits, c.last, c.master, c.sum]));
    const blob = new Blob(['\ufeff' + rows.map(r => r.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'klienty.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function renderServicesAdmin() {
    const list = S.services;
    $('#oServices').innerHTML = '<p class="note" style="margin-bottom:10px">Длительность определяет, сколько времени в расписании мастера занимает запись.</p><div id="svcEditor">' +
      (list.length ? list.map(s => '<div class="svc-row" data-id="' + esc(s.id) + '">' +
        '<label class="f name-f" for="sn-' + esc(s.id) + '">Название<input id="sn-' + esc(s.id) + '" data-k="name" maxlength="80" value="' + esc(s.name) + '"></label>' +
        '<label class="f" for="sd-' + esc(s.id) + '">Минут<input id="sd-' + esc(s.id) + '" data-k="duration" type="number" inputmode="numeric" min="15" step="15" value="' + esc(s.duration) + '"></label>' +
        '<label class="f" for="sp-' + esc(s.id) + '">Цена' + (s.from ? ', от' : '') + '<input id="sp-' + esc(s.id) + '" data-k="price" type="number" inputmode="numeric" min="0" step="50" value="' + esc(s.price) + '"></label>' +
        '<button class="btn danger small" data-del type="button">Удалить услугу</button></div>').join('')
        : '<div class="empty-state">' + svg(IC.sparkle) + '<b>Услуг пока нет</b>Добавьте первую, и клиенты смогут её выбрать.</div>') +
      '</div><button class="btn block" id="addSvc" type="button" style="margin-top:6px">Добавить услугу</button>';
  }
  function renderMastersAdmin() {
    const list = S.masters, svcs = S.services;
    $('#oMasters').innerHTML = '<p class="note" style="margin-bottom:10px">У каждого мастера своё расписание: пока один занят, к другому можно записаться на то же время. Отметьте услуги, которые делает мастер.</p><div id="mEditor">' +
      (list.length ? list.map(m => '<div class="m-row" data-id="' + esc(m.id) + '">' +
        '<label class="f" for="mn-' + esc(m.id) + '">Имя<input id="mn-' + esc(m.id) + '" data-mk="name" maxlength="40" value="' + esc(m.name) + '"></label>' +
        '<label class="f" for="mr-' + esc(m.id) + '">Специализация<input id="mr-' + esc(m.id) + '" data-mk="role" maxlength="60" placeholder="Например: стилист" value="' + esc(m.role || '') + '"></label>' +
        '<div class="full"><div class="note" style="margin-bottom:8px">Услуги мастера</div><div class="days-set">' +
        (svcs.length ? svcs.map(s => '<label><input type="checkbox" data-ms value="' + esc(s.id) + '" ' + (!m.services || m.services.includes(s.id) ? 'checked' : '') + '>' + esc(s.name) + '</label>').join('') : '<span class="note">Сначала добавьте услуги.</span>') + '</div></div>' +
        '<div class="full"><div class="note" style="margin-bottom:8px">Рабочие дни мастера</div><div class="days-set">' +
        [1, 2, 3, 4, 5, 6, 0].map(d => '<label><input type="checkbox" data-md value="' + d + '" ' + (worksOn(m, d) ? 'checked' : '') + '>' + WD[d] + '</label>').join('') + '</div></div>' +
        '<div class="full mlink"><div class="note">Ссылка для записи к мастеру — для его соцсетей и визитки</div><code>' + esc(linkFor(m.id)) + '</code><button class="btn small" data-copy="' + esc(linkFor(m.id)) + '" type="button">Скопировать</button></div>' +
        '<button class="btn danger small full" data-mdel type="button">Удалить мастера</button></div>').join('')
        : '<div class="empty-state">' + svg(IC.user) + '<b>Мастеров нет</b>Все записи идут в одну общую очередь. Добавьте мастеров, чтобы клиенты выбирали, к кому идти, и записывались к разным мастерам на одно время.</div>') +
      '</div><button class="btn block" id="addMaster" type="button" style="margin-top:6px">Добавить мастера</button>';
  }
  function renderSettings() {
    const c = cfg(), rows = [1, 2, 3, 4, 5, 6, 0].map(d => {
      const h = hoursOf(d);
      return '<div class="hrow"><label class="dchk"><input type="checkbox" name="wd" value="' + d + '" ' + (h ? 'checked' : '') + '>' + WD[d] + '</label>' +
        '<input type="time" data-hs="' + d + '" aria-label="' + WD_FULL[d] + ': открываемся" value="' + esc(h ? h[0] : c.start) + '"><span class="dash">—</span>' +
        '<input type="time" data-he="' + d + '" aria-label="' + WD_FULL[d] + ': закрываемся" value="' + esc(h ? h[1] : c.end) + '"></div>';
    }).join('');
    $('#oSettings').innerHTML = '<div class="settings"><section><h2>О компании</h2><form id="cfgForm" class="fields" novalidate>' +
      '<label class="f full" for="cName">Название<input id="cName" maxlength="60" value="' + esc(c.name) + '"></label>' +
      '<label class="f" for="cPhone">Телефон<input id="cPhone" type="tel" maxlength="30" value="' + esc(c.phone) + '"></label>' +
      '<label class="f" for="cAddr">Адрес<input id="cAddr" maxlength="80" value="' + esc(c.address) + '"></label>' +
      '<label class="f full" for="cLegal">Для документов: ИП или ООО и ИНН<input id="cLegal" maxlength="120" placeholder="ИП Иванов Иван Иванович, ИНН 123456789012" value="' + esc(c.legal || '') + '"></label>' +
      '<label class="f" for="cStep">Шаг записи<select id="cStep"><option value="15" ' + (c.step === 15 ? 'selected' : '') + '>15 минут</option><option value="30" ' + (c.step === 30 ? 'selected' : '') + '>30 минут</option><option value="60" ' + (c.step === 60 ? 'selected' : '') + '>60 минут</option></select></label>' +
      '<label class="f" for="cCur">Валюта<input id="cCur" maxlength="4" value="' + esc(c.currency) + '"></label>' +
      '<div class="full"><div class="note" style="margin-bottom:8px">Часы работы по дням (снимите галочку — выходной)</div><div class="hours">' + rows + '</div></div>' +
      '<div class="full" style="display:flex;gap:12px;align-items:center"><button class="btn primary" id="cfgSave" type="button">Сохранить</button><span class="note" id="cfgMsg"></span></div></form></section>' +
      '<section><h2>Уведомления</h2><div class="card tg"><span class="ic">' + svg(TAB.send) + '</span><div><b>Telegram-бот</b><span class="note">Заявка приходит вам в Telegram мгновенно, подтвердить можно одной кнопкой. Подключается при запуске для реальных клиентов.</span></div></div></section>' +
      '<section><h2>Демо</h2><div class="demo-note">Сейчас данные хранятся только на этом телефоне. Нажмите «Входящая запись», чтобы увидеть, как заявка приходит владельцу.</div>' +
      '<div class="stack-btns"><button class="btn primary" id="simBtn" type="button">Входящая запись от клиента</button><button class="btn danger" id="resetBtn" type="button">Сбросить демо-данные</button></div></section></div>';
  }
  async function saveCfg() {
    const g = id => $(id).value.trim(), msg = $('#cfgMsg'), step = Number($('#cStep').value) || 30, hours = {};
    const days = Array.from(document.querySelectorAll('input[name="wd"]:checked')).map(x => Number(x.value));
    if (!days.length) { msg.textContent = 'Отметьте хотя бы один рабочий день.'; return; }
    for (const d of days) {
      const s = $('[data-hs="' + d + '"]').value, e = $('[data-he="' + d + '"]').value;
      if (!s || !e || toMin(e) - toMin(s) < step) { msg.textContent = WD[d] + ': закрытие должно быть позже открытия.'; return; }
      hours[d] = [s, e];
    }
    const all = Object.values(hours);
    const c = { name: g('#cName') || 'Запись', phone: g('#cPhone'), address: g('#cAddr'), legal: g('#cLegal'), step, currency: g('#cCur') || '₽', days, hours,
      start: all.map(h => h[0]).sort()[0], end: all.map(h => h[1]).sort().pop() };
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

  /* Двойное нажатие для необратимых кнопок: первое — «Точно …?», второе — действие */
  function armed(t, ask, label) {
    if (t.classList.contains('armed')) return true;
    t.classList.add('armed'); t.textContent = ask;
    setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = label; } }, 4000);
    return false;
  }

  /* ---------- события ---------- */
  document.addEventListener('click', async e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.classList.contains('svc')) {
      buzz(); st.sel.svc = t.dataset.id; st.sel.time = null;
      if (st.only) st.sel.master = mastersFor(svcById(t.dataset.id)).some(m => m.id === st.only) ? st.only : 'any';
      renderServices(); renderSoon(); renderCta();
    }
    else if (t.id === 'soonBtn') {
      const om = onlyMaster();
      if (!selSvc()) { const s = S.services.filter(x => !om || !om.services || om.services.includes(x.id)).sort((a, b) => a.duration - b.duration)[0]; st.sel.svc = s && s.id; }
      st.sel.master = om ? om.id : 'any'; st.sel.date = t.dataset.date; st.sel.time = Number(t.dataset.m); renderServices(); go(2);
    }
    else if (t.id === 'allMasters') { st.only = null; st.sel.master = 'any'; try { history.replaceState(null, '', location.pathname); } catch (x) { /* не страшно */ } renderHero(); renderServices(); renderSoon(); }
    else if (t.hasAttribute('data-again')) {
      const b = S.mine.find(x => x.id === t.closest('.mine-item').dataset.id); if (!b) return;
      st.ctab = 'book'; st.sel = { svc: svcById(b.serviceId) ? b.serviceId : null, master: b.masterId && masterById(b.masterId) ? b.masterId : 'any', date: null, time: null };
      renderServices(); go(st.sel.svc ? 2 : 1);
    }
    else if (t.hasAttribute('data-copy')) {
      const v = t.dataset.copy, ok = () => { t.textContent = 'Скопировано'; setTimeout(() => { if (t.isConnected) t.textContent = 'Скопировать'; }, 2000); };
      try { navigator.clipboard.writeText(v).then(ok, () => { window.prompt('Скопируйте ссылку:', v); }); } catch (x) { window.prompt('Скопируйте ссылку:', v); }
    }
    else if (t.id === 'csvBtn') downloadClients();
    else if (t.classList.contains('mst')) { buzz(); st.sel.master = t.dataset.m; renderMasters(); renderTimes(); renderCta(); }
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
      if (st.ctab === 'book' && st.step === 'done') { st.sel = { svc: null, master: 'any', date: null, time: null }; $('#fComment').value = ''; renderServices(); st.step = 1; }
      renderShell(); $('#scroll').scrollTop = 0;
    }
    else if (t.dataset.ot) { st.otab = t.dataset.ot; if (st.otab === 'settings') renderSettings(); if (st.otab === 'services') renderServicesAdmin(); if (st.otab === 'masters') renderMastersAdmin(); renderOwner(); }
    else if (t.classList.contains('chip') && t.dataset.f) { st.filter = t.dataset.f; renderBookings(); }
    else if (t.id === 'soundBtn') { st.sound = !st.sound; if (st.sound) beep(); renderBookings(); }
    else if (t.dataset.a) {
      const id = t.closest('.bk').dataset.id;
      if (t.dataset.a === 'cancelled' && !armed(t, 'Точно отклонить?', 'Отклонить')) return;
      S.setStatus(id, t.dataset.a);
    }
    else if (t.hasAttribute('data-ics')) { const b = S.mine.find(x => x.id === t.closest('.mine-item').dataset.id); if (b) downloadIcs(b); }
    else if (t.hasAttribute('data-cancel')) { if (!armed(t, 'Точно отменить?', 'Отменить')) return; S.setStatus(t.closest('.mine-item').dataset.id, 'cancelled'); }
    else if (t.id === 'cfgSave') saveCfg();
    else if (t.id === 'addSvc') { await S.addService({}); renderServicesAdmin(); }
    else if (t.hasAttribute('data-del')) { if (!armed(t, 'Точно удалить?', 'Удалить услугу')) return; await S.deleteService(t.closest('.svc-row').dataset.id); renderServicesAdmin(); }
    else if (t.id === 'addMaster') { await S.addMaster({}); renderMastersAdmin(); }
    else if (t.hasAttribute('data-mdel')) { if (!armed(t, 'Точно удалить?', 'Удалить мастера')) return; await S.deleteMaster(t.closest('.m-row').dataset.id); renderMastersAdmin(); }
    else if (t.id === 'simBtn') {
      const b = await S.simulateIncoming(svc => { const f = firstFree(svc, 'any'); return f && { date: f.date, m: f.m, masterId: f.mid }; });
      if (!b) toast('Нет свободного времени или нет услуг.');
    }
    else if (t.id === 'resetBtn') { if (!armed(t, 'Точно сбросить?', 'Сбросить демо-данные')) return; st.known.clear(); st.first = true; localStorage.removeItem('profile'); await S.resetDemo(); renderSettings(); }
  });
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') $('#sheet').hidden = true; });
  document.addEventListener('change', async e => {
    const el = e.target, row = el.closest && el.closest('.svc-row'), mrow = el.closest && el.closest('.m-row');
    if (el.id === 'mFilter') { st.mfilter = el.value; renderBookings(); return; }
    if (row && el.dataset.k) {
      let v = el.value; if (el.dataset.k !== 'name') v = Math.max(el.dataset.k === 'duration' ? 15 : 0, Number(v) || 0); else v = v.trim() || 'Услуга';
      await S.updateService(row.dataset.id, { [el.dataset.k]: v });
    }
    if (mrow && el.dataset.mk) await S.updateMaster(mrow.dataset.id, { [el.dataset.mk]: el.dataset.mk === 'name' ? (el.value.trim() || 'Мастер') : el.value.trim() });
    if (mrow && el.hasAttribute('data-md')) {
      const on = Array.from(mrow.querySelectorAll('input[data-md]:checked')).map(x => Number(x.value));
      await S.updateMaster(mrow.dataset.id, { days: on.length === 7 ? null : on });
    }
    if (mrow && el.hasAttribute('data-ms')) {
      const on = Array.from(mrow.querySelectorAll('input[data-ms]:checked')).map(x => x.value);
      await S.updateMaster(mrow.dataset.id, { services: on.length === S.services.length ? null : on });
    }
  });
  $('#form').addEventListener('input', () => { if (st.err) { st.err = ''; renderCta(); } });

  /* ---------- изменения данных ---------- */
  function onData() {
    renderHero(); renderServices(); renderSoon(); renderMine();
    if (st.sel.svc && !svcById(st.sel.svc)) st.sel.svc = null;
    if (st.ctab === 'book' && st.step === 2) { renderMasters(); renderDays(); renderTimes(); }
    S.bookings.forEach(b => {
      if (!st.known.has(b.id)) {
        st.known.add(b.id);
        if (!st.first && !b.own && b.status === 'new') { toast('Новая запись: <b>' + esc(b.time) + '</b>, ' + esc(fmtD(b.date)) + '<br>' + esc(b.serviceName) + (b.masterName ? ' · к ' + esc(b.masterName) : '') + ' · ' + esc(b.name)); beep(); buzz(); }
      }
    });
    st.first = false;
    renderShell();
  }

  /* ---------- запуск ---------- */
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* офлайн необязателен */ });
  try { const m = new URLSearchParams(location.search).get('m'); if (m && masterById(m)) st.only = m; } catch (e) { /* без ссылки на мастера */ }
  prefill();
  S.subscribe(onData);
  onData();
  setInterval(() => { renderHero(); }, 60000);
  window.__app = { st, go, S };
})();
