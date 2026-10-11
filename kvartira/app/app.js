/* Приложение салона для клиентов (PWA): главная, запись, бонусы, сертификаты, профиль.
   Данные салона — data.js (window.APP, собирается tools/clientapp.mjs из site.json). Демо: всё хранится только на этом телефоне (localStorage). */
(function () {
  'use strict';
  const A = window.APP, $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], WDL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const toMin = t => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const nice = s => { const d = parseD(s), t = dstr(new Date()), tm = dstr(new Date(Date.now() + 864e5)); return (s === t ? 'Сегодня' : s === tm ? 'Завтра' : WD[d.getDay()]) + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; };
  const rub = n => Number(n || 0).toLocaleString('ru-RU') + ' ₽';
  const price = s => (s.price ? (s.from ? 'от ' : '') + rub(s.price) : 'по запросу');
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) { /* нет */ } };

  const I = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s4 1 6 1c2 0 6 2 6-1s-4-3-6 1"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
    dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'
  };
  const svg = (k, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.9) + '" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</svg>';

  /* ---------- данные клиента (демо) ---------- */
  const KEY = 'clientapp.' + (A.slug || 'salon') + '.v1';
  /* слова под нишу: салон (по умолчанию) или барбершоп — из data.js → words */
  const W = Object.assign({ gift: 'Подарите красоту', friendTo: 'подруге', friendAcc: 'подругу', him: 'Ей', his: 'её', placeTo: 'в салон', placeBy: 'салоном', demoName: 'Екатерина', s1: 'Пудра', toLabel: 'Имя получательницы', toExample: 'Маша', master: 'мастер', masters: 'Мастера', masterCap: 'Мастер', works: 'Работы мастеров' }, A.words || {});
  const hoursOf = dow => { const h = (A.hours || {})[dow]; return h && toMin(h[1]) > toMin(h[0]) ? h : null; };
  const svcById = id => A.services.find(s => s.id === id);
  const mById = id => (A.masters || []).find(m => m.id === id);
  const mastersFor = s => (A.masters || []).filter(m => !m.services || m.services.includes(s.id));
  const works = (m, dow) => !m || !m.days || m.days.includes(dow);
  function seed() {
    const t = new Date(), list = [];
    /* ближайшая запись — завтра или в первый рабочий день, к первому подходящему мастеру */
    for (let i = 1; i < 8 && !list.length; i++) {
      const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i), dow = d.getDay(); if (!hoursOf(dow)) continue;
      for (const s of A.services) { const m = mastersFor(s).find(x => works(x, dow)) || null; if ((A.masters || []).length && !m) continue; list.push(mk(s, m, dstr(d), toMin(hoursOf(dow)[0]) + 120, 'confirmed')); break; }
    }
    const past = (days, si) => { const s = A.services[si % A.services.length], m = mastersFor(s)[0] || null, d = new Date(t.getFullYear(), t.getMonth(), t.getDate() - days); return mk(s, m, dstr(d), 15 * 60, 'done'); };
    list.push(past(21, 0), past(48, 3));
    return {
      v: 1, profile: { name: W.demoName, phone: '+7 900 000-00-00' }, visits: 7, balance: 1240, bookings: list, certs: [], settings: { remind: true, news: false },
      history: [{ t: 'Визит: ' + list[1].serviceName, d: list[1].date, v: 152 }, { t: 'Оплата бонусами', d: list[2].date, v: -300 }, { t: 'За отзыв на Яндекс Картах', d: list[2].date, v: 200 }, { t: 'Приветственные бонусы', d: dstr(new Date(t.getFullYear(), t.getMonth() - 3, 5)), v: (A.bonus || {}).welcome || 500 }]
    };
  }
  function mk(s, m, date, startMin, status) { return { id: Math.random().toString(36).slice(2, 9), serviceId: s.id, serviceName: s.name, duration: s.duration, price: s.price, from: s.from, masterId: m ? m.id : '', masterName: m ? m.name : '', date, startMin, status }; }
  let D = (() => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 1) return d; } catch (e) { /* нет */ } return seed(); })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* нет места */ } };
  save();

  /* занятость: свои записи + условно занятые окна салона (одинаковые при каждом открытии) */
  const hash = s => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  function busy(date, mid, m, dur) {
    if (D.bookings.some(b => (b.status === 'new' || b.status === 'confirmed') && b.date === date && (b.masterId || '') === (mid || '') && b.startMin < m + dur && m < b.startMin + b.duration)) return true;
    const h = hash(date + mid), d0 = toMin((hoursOf(parseD(date).getDay()) || ['10:00'])[0]);
    for (let k = 0; k < 3; k++) { const s = d0 + (((h >> (k * 5)) % 18) * 30), e = s + 60 + ((h >> (k * 3)) % 3) * 30; if (s < m + dur && m < e) return true; }
    return false;
  }
  function freeMaster(s, date, m, who) {
    const dow = parseD(date).getDay(), pool = (A.masters || []).length ? mastersFor(s).filter(x => (who === 'any' || x.id === who) && works(x, dow)) : [null];
    return pool.find(x => !busy(date, x ? x.id : '', m, s.duration));
  }
  function slots(s, date, who) {
    const h = hoursOf(parseD(date).getDay()); if (!h) return [];
    const n = new Date(), today = dstr(n) === date, lead = n.getHours() * 60 + n.getMinutes() + 60, out = [];
    for (let m = toMin(h[0]); m + s.duration <= toMin(h[1]); m += 30) { if (today && m < lead) continue; if (freeMaster(s, date, m, who) !== undefined) out.push(m); }
    return out;
  }

  /* ---------- бонусы ---------- */
  const B = Object.assign({ welcome: 500, maxPay: 30, referral: 500, levels: [{ name: 'Silver', from: 0, rate: 5 }, { name: 'Gold', from: 5, rate: 7 }, { name: 'Platinum', from: 12, rate: 10 }] }, A.bonus || {});
  const level = () => B.levels.slice().reverse().find(l => D.visits >= l.from) || B.levels[0];
  const nextLevel = () => B.levels.find(l => l.from > D.visits) || null;
  const cardNo = () => { const h = String(hash(D.profile.phone + A.name)).padStart(8, '0').slice(0, 8); return h.slice(0, 4) + ' ' + h.slice(4); };
  function qrSvg(text) {
    try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) { return ''; }
  }

  /* ---------- каркас ---------- */
  const st = { tab: 'home', bk: { svc: null, who: 'any', date: null, time: null } };
  function go(tab) { const run = () => { st.tab = tab; render(); $('#view').scrollTop = 0; }; if (document.startViewTransition && tab !== st.tab && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(run); else run(); }
  function render() {
    const v = $('#view');
    v.innerHTML = st.tab === 'home' ? home() : st.tab === 'book' ? book() : st.tab === 'bonus' ? bonus() : profile();
    v.className = 'view'; void v.offsetWidth; v.className = 'view';
    $('#tabs').innerHTML = [['home', 'home', 'Главная'], ['book', 'plus', 'Запись'], ['bonus', 'star', 'Бонусы'], ['profile', 'user', 'Профиль']].map(([k, ic, t]) =>
      '<button type="button" data-tab="' + k + '"' + (st.tab === k ? ' aria-current="page"' : '') + (k === 'book' ? ' class="main"' : '') + '><span>' + svg(ic, k === 'book' ? 2.4 : 1.9) + '</span><span>' + t + '</span></button>').join('');
  }
  function sheet(html) { $('#sheet').innerHTML = '<div class="panel" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div>'; $('#sheet').hidden = false; }
  function closeSheet() { $('#sheet').hidden = true; $('#sheet').innerHTML = ''; }
  let tT;
  function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(tT); tT = setTimeout(() => { el.hidden = true; }, 3200); }
  const upcoming = () => D.bookings.filter(b => (b.status === 'new' || b.status === 'confirmed') && (b.date > dstr(new Date()) || (b.date === dstr(new Date()) && b.startMin > new Date().getHours() * 60))).sort((a, b) => (a.date + fromMin(a.startMin)).localeCompare(b.date + fromMin(b.startMin)));
  const greet = () => { const h = new Date().getHours(); return h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; };
  const route = () => 'https://yandex.ru/maps/?text=' + encodeURIComponent(A.address || '');
  /* «через 2 дня» до записи */
  const until = b => { const ms = parseD(b.date).getTime() + b.startMin * 6e4 - Date.now(); if (ms <= 0) return ''; const h = Math.round(ms / 36e5), d = Math.round(ms / 864e5);
    return ms < 36e5 ? 'через ' + Math.max(1, Math.round(ms / 6e4)) + ' мин' : h < 24 ? 'через ' + h + ' ' + plural(h, 'час', 'часа', 'часов') : 'через ' + d + ' ' + plural(d, 'день', 'дня', 'дней'); };
  /* карта лояльности: блик и лёгкий наклон за пальцем или курсором */
  document.addEventListener('pointermove', e => { const c = e.target.closest && e.target.closest('.loyal'); if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return; const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty('--mx', (x * 100).toFixed(1) + '%'); c.style.setProperty('--my', (y * 100).toFixed(1) + '%'); c.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 6).toFixed(2) + 'deg'); }, { passive: true });
  document.addEventListener('pointerout', e => { const c = e.target.closest && e.target.closest('.loyal'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });

  /* ---------- главная ---------- */
  function home() {
    const nx = upcoming()[0], lv = level(), nl = nextLevel(), today = hoursOf(new Date().getDay());
    let h = '<div class="head"><div class="hi"><small>' + greet() + ',</small><b>' + esc(D.profile.name) + '</b></div>' + (A.demo ? '<span class="demo-tag">демо</span>' : '') +
      '<button class="icon-btn" type="button" data-act="notif" aria-label="Уведомления">' + svg('bell') + '<span class="badge"></span></button></div>';
    h += nx ? '<div class="next"><small>' + (nx.status === 'confirmed' ? 'Ваша запись · подтверждена' : 'Ваша запись · ждёт подтверждения') + '</small>' + (until(nx) ? '<span class="in">' + until(nx) + '</span>' : '') + '<div class="when">' + esc(nice(nx.date)) + ', ' + fromMin(nx.startMin) + '</div><p>' + esc(nx.serviceName) + (nx.masterName ? ' · ' + W.master + ' ' + esc(nx.masterName) : '') + '</p>' +
      '<div class="row"><a class="btn white small" href="' + route() + '" target="_blank" rel="noopener">' + svg('pin') + 'Маршрут</a><button class="btn light small" type="button" data-act="ics" data-id="' + nx.id + '">' + svg('cal') + 'В календарь</button></div></div>'
      : '<div class="cta-card"><h2>Запишитесь за&nbsp;минуту</h2><p>Свободное время — прямо здесь, без звонка.</p><button class="btn white" type="button" data-tab="book">Выбрать время</button></div>';
    h += '<button class="card bonus-mini" type="button" data-tab="bonus"><span class="ic">' + svg('star') + '</span><span style="flex:1"><b>' + D.balance.toLocaleString('ru-RU') + ' бонусов</b><small>Уровень ' + lv.name + ' · ' + lv.rate + '% с каждого визита' + (nl ? ' · до ' + nl.name + ' ' + (nl.from - D.visits) + ' ' + plural(nl.from - D.visits, 'визит', 'визита', 'визитов') : '') + '</small>' +
      (nl ? '<div class="bar"><i style="width:' + Math.round((D.visits - lv.from) / (nl.from - lv.from) * 100) + '%"></i></div>' : '') + '</span></button>';
    h += niche();
    if ((A.promos || []).length) h += '<section class="sec"><div class="sec-h"><h2>Для вас</h2></div><div class="hscroll">' + A.promos.map((p, i) =>
      '<button class="promo" type="button" data-act="promo" data-i="' + i + '">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="" loading="lazy">' : '') + '<span class="tag">' + esc(p.tag || 'Акция') + '</span><b>' + esc(p.title) + '</b><small>' + esc(p.text) + '</small></button>').join('') + '</div></section>';
    if ((A.masters || []).length) h += '<section class="sec"><div class="sec-h"><h2>' + esc(W.masters) + '</h2><button type="button" data-tab="book">Записаться</button></div><div class="hscroll">' + A.masters.map(m =>
      '<button class="mst" type="button" data-act="master" data-id="' + m.id + '"><div class="ring"><span>' + esc(m.name[0]) + '</span></div><b>' + esc(m.name) + '</b><small>' + esc(m.role || W.masterCap) + '</small></button>').join('') + '</div></section>';
    if ((A.photos || []).length) h += '<section class="sec"><div class="sec-h"><h2>' + esc(W.works) + '</h2></div><div class="works">' + A.photos.slice(0, 3).map(p => '<button type="button" data-act="photo" data-src="' + esc(p) + '"><img src="' + esc(p) + '" alt="" loading="lazy"></button>').join('') + '</div></section>';
    h += '<section class="sec"><button class="gift" type="button" data-act="cert"><span class="g">' + svg('gift') + '</span><span><b>' + W.gift + '</b><small>Сертификат от ' + rub(2000) + ' — красиво оформим и отправим ' + W.friendTo + '</small></span></button></section>';
    h += '<section class="sec info"><div class="sec-h"><h2>' + esc(A.name) + '</h2></div><span>' + svg('pin') + ' ' + esc(A.address) + '</span><span>' + svg('clock') + ' Сегодня ' + (today ? today.join('–') : 'выходной') + '</span>' +
      (A.phone ? '<a href="tel:' + esc(A.phone.replace(/[^\d+]/g, '')) + '">' + svg('phone') + ' ' + esc(A.phone) + '</a>' : '') + '</section>';
    return h;
  }

  /* ---------- блок ниши: расписание (site.board), питомец (site.pets), статус заказа (app.track) ---------- */
  const PETI = { cat: '<path d="M4 9V3.5l4.2 3h7.6l4.2-3V9c.7 1.1 1 2.3 1 3.6C21 17 17 20.5 12 20.5S3 17 3 12.6C3 11.3 3.3 10.1 4 9z"/><path d="M9 12.5h.01M15 12.5h.01"/>', dog: '<path d="M7.5 5 3.5 6 3 11.5l3 .8M16.5 5l4 1 .5 5.5-3 .8"/><path d="M6 9c.9-2.6 3.3-4.3 6-4.3S17.1 6.4 18 9v5c0 3.6-2.7 6.5-6 6.5S6 17.6 6 14z"/>', rabbit: '<path d="M9.2 9.5C8 6.5 8 2 9.6 2s2.2 4.2 1.9 7.5M14.8 9.5C16 6.5 16 2 14.4 2s-2.2 4.2-1.9 7.5"/><circle cx="12" cy="15.2" r="6"/>', bird: '<path d="M20.5 7.5 18 6.2C17.2 4.3 15.6 3.5 14 3.5a4.5 4.5 0 0 0-4.5 4.5v2L3.5 20H11a7 7 0 0 0 7-7V8.6z"/>' };
  function niche() {
    const demoTag = A.demo ? '<span class="tagd">пример</span>' : '';
    const bd = A.board && A.board.days;
    if (bd) {
      const n = new Date(), now = n.getHours() * 60 + n.getMinutes();
      let k = 0, list = [];
      for (; k < 7; k++) { const d = (n.getDay() + k) % 7; list = (bd[d] || []).filter(x => k > 0 || toMin(x[0]) > now - 75); if (list.length) break; }
      if (!list.length) return '';
      const nxt = list.find(x => k > 0 || toMin(x[0]) > now);
      return '<div class="nich"><div class="nich-h"><b>' + (k === 0 ? 'Сегодня' : k === 1 ? 'Завтра' : WDL[(n.getDay() + k) % 7][0].toUpperCase() + WDL[(n.getDay() + k) % 7].slice(1)) + ' в расписании</b>' + demoTag + '</div><div class="sch">' +
        list.slice(0, 4).map(x => '<div class="' + (x === nxt ? 'nx' : k === 0 && toMin(x[0]) <= now ? 'past' : '') + '"><time>' + esc(x[0]) + '</time><span>' + esc(x[1]) + (x[2] ? '<small>' + esc(x[2]) + '</small>' : '') + '</span>' + (x === nxt ? '<em>скоро</em>' : '<i></i>') + '</div>').join('') +
        '</div><div class="row"><button class="btn primary small" type="button" data-tab="book">Записаться</button></div></div>';
    }
    if ((A.pets || []).length) {
      const p = A.pets[0], name = p.id === 'dog' ? 'Рекс' : p.id === 'cat' ? 'Барсик' : 'Кеша', left = 23;
      return '<div class="nich"><div class="nich-h"><b>Мой питомец</b>' + demoTag + '</div><div class="pet"><span class="av"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (PETI[p.icon || p.id] || PETI.cat) + '</svg></span><span><b>' + name + '</b><small>' + esc(p.name) + ' · 3 года · 4,2 кг</small></span></div>' +
        '<div class="meter"><i style="width:' + Math.round((365 - left) / 365 * 100) + '%"></i></div><p class="note">Прививка через ' + left + ' ' + plural(left, 'день', 'дня', 'дней') + ' — напомним за неделю</p><div class="row"><button class="btn primary small" type="button" data-tab="book">Записаться на прививку</button></div></div>';
    }
    const t = A.track;
    if (t && (t.steps || []).length) {
      return '<div class="nich"><div class="nich-h"><b>' + esc(t.title || 'Ваш заказ') + '</b>' + demoTag + '</div><p style="font-weight:700;margin-bottom:12px">' + esc(t.item || '') + '</p><div class="track" style="--n:' + t.steps.length + '">' +
        t.steps.map((s, i) => '<span class="' + (i < t.now ? 'pass' : i === t.now ? 'now' : '') + '">' + esc(s) + '</span>').join('') + '</div>' + (t.note ? '<p class="note">' + esc(t.note) + '</p>' : '') + '</div>';
    }
    return '';
  }

  /* ---------- запись ---------- */
  function book() {
    const b = st.bk, s = b.svc ? svcById(b.svc) : null, stepN = !s ? 1 : b.time == null ? 2 : 3;
    let h = '<div class="steps"><i class="on"></i><i class="' + (stepN > 1 ? 'on' : '') + '"></i><i class="' + (stepN > 2 ? 'on' : '') + '"></i></div>';
    if (!s) {
      h += '<h1 class="h1">Какая услуга?</h1><div class="list">' + A.services.map(x => '<button class="opt" type="button" data-svc="' + x.id + '"><span class="t"><b>' + esc(x.name) + '</b><small>около ' + x.duration + ' мин</small></span><span class="p">' + esc(price(x)) + '</span></button>').join('') + '</div>';
      return h;
    }
    h += '<button class="opt" type="button" data-act="change-svc" aria-pressed="true"><span class="t"><b>' + esc(s.name) + '</b><small>около ' + s.duration + ' мин · изменить</small></span><span class="p">' + esc(price(s)) + '</span></button>';
    const ms = mastersFor(s);
    if (ms.length) h += '<p class="lbl">' + esc(W.masterCap) + '</p><div class="chips"><button class="chip" type="button" data-who="any" aria-pressed="' + (b.who === 'any') + '"><span class="mini">' + svg('sparkle') + '</span>Любой</button>' +
      ms.map(m => '<button class="chip" type="button" data-who="' + m.id + '" aria-pressed="' + (b.who === m.id) + '"><span class="mini">' + esc(m.name[0]) + '</span>' + esc(m.name) + '</button>').join('') + '</div>';
    const n = new Date(), days = [];
    for (let i = 0; i < 14; i++) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i), ds = dstr(d); days.push({ ds, d, open: slots(s, ds, b.who).length > 0 }); }
    if (!b.date || !days.find(x => x.ds === b.date && x.open)) b.date = (days.find(x => x.open) || {}).ds || null;
    h += '<p class="lbl">День</p><div class="chips">' + days.map(x => '<button class="day" type="button" data-date="' + x.ds + '"' + (x.open ? '' : ' disabled') + ' aria-pressed="' + (b.date === x.ds) + '"><small>' + (x.ds === dstr(n) ? 'Сег' : WD[x.d.getDay()]) + '</small><b>' + x.d.getDate() + '</b></button>').join('') + '</div>';
    const ts = b.date ? slots(s, b.date, b.who) : [];
    if (b.time != null && !ts.includes(b.time)) b.time = null;
    h += '<p class="lbl">Время' + (b.date ? ' · ' + esc(nice(b.date).toLowerCase()) : '') + '</p>' + (ts.length ? '<div class="times">' + ts.map(m => '<button class="time" type="button" data-time="' + m + '" aria-pressed="' + (b.time === m) + '">' + fromMin(m) + '</button>').join('') + '</div>' : '<div class="hint">Свободного времени нет — выберите другой день или «Любой».</div>');
    h += '<div class="dock"><button class="btn primary block" type="button" data-act="confirm"' + (b.time == null ? ' disabled' : '') + '>' + (b.time == null ? 'Выберите время' : 'Записаться · ' + esc(nice(b.date)) + ', ' + fromMin(b.time)) + '</button></div>';
    return h;
  }
  function confirmSheet() {
    const b = st.bk, s = svcById(b.svc), m = freeMaster(s, b.date, b.time, b.who), lv = level();
    if (m === undefined) { toast('Это время только что заняли — выберите другое'); b.time = null; render(); return; }
    sheet('<h2 class="h1">Проверьте запись</h2><div class="card" style="display:grid;gap:6px"><b style="font-size:17px">' + esc(s.name) + '</b><span>' + esc(nice(b.date)) + ', ' + fromMin(b.time) + (m ? ' · ' + W.master + ' ' + esc(m.name) : '') + '</span><span style="color:var(--muted)">' + esc(A.address) + '</span><b>' + esc(price(s)) + '</b></div>' +
      '<p class="lbl">Ваши данные</p><div class="card" style="display:grid;gap:4px"><b>' + esc(D.profile.name) + '</b><span style="color:var(--muted)">' + esc(D.profile.phone) + '</span></div>' +
      '<p style="color:var(--muted);font-size:13.5px;margin:14px 2px">После визита начислим ' + lv.rate + '% бонусами' + (s.price ? ' — около ' + Math.round(s.price * lv.rate / 100) + ' ₽' : '') + '. Записываясь, вы соглашаетесь на обработку персональных данных ' + W.placeBy + '.</p>' +
      '<button class="btn primary block" type="button" data-act="do-book">Подтвердить запись</button><button class="btn block" type="button" data-act="close" style="margin-top:8px">Изменить</button>');
  }
  function doBook() {
    const b = st.bk, s = svcById(b.svc), m = freeMaster(s, b.date, b.time, b.who);
    if (m === undefined) { closeSheet(); toast('Это время только что заняли'); b.time = null; render(); return; }
    const r = mk(s, m || null, b.date, b.time, 'new'); D.bookings.push(r); save(); buzz();
    sheet('<div class="done"><div class="ck">' + svg('check', 2.6) + '</div><h2 class="h1">Запись отправлена</h2><p style="color:var(--muted)">' + esc(nice(r.date)) + ', ' + fromMin(r.startMin) + ' · ' + esc(r.serviceName) + (r.masterName ? ', ' + W.master + ' ' + esc(r.masterName) : '') + '</p></div>' +
      '<button class="btn primary block" type="button" data-act="ics" data-id="' + r.id + '">' + svg('dl') + 'Добавить в календарь</button><button class="btn block" type="button" data-act="home" style="margin-top:8px">На главную</button>');
    st.bk = { svc: null, who: 'any', date: null, time: null };
    setTimeout(() => { const x = D.bookings.find(y => y.id === r.id); if (x && x.status === 'new') { x.status = 'confirmed'; save(); toast('«' + A.name + '» подтвердил запись ✓'); if ($('#sheet').hidden) render(); } }, 4000);
  }
  function ics(id) {
    const b = D.bookings.find(x => x.id === id); if (!b) return;
    const d = b.date.replace(/-/g, ''), t = x => pad(Math.floor(x / 60)) + pad(x % 60) + '00', e = s => String(s || '').replace(/([,;\\])/g, '\\$1');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Studio//ClientApp//RU', 'BEGIN:VEVENT', 'UID:' + b.id + '@clientapp', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + d + 'T' + t(b.startMin), 'DTEND:' + d + 'T' + t(b.startMin + b.duration),
      'SUMMARY:' + e(b.serviceName + ' — ' + A.name), 'LOCATION:' + e(A.address), 'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + e('Запись: ' + A.name), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' })); a.download = 'zapis.ics'; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- бонусы ---------- */
  function bonus() {
    const lv = level(), nl = nextLevel(), code = String(A.slug || 'CLUB').replace(/-app$/, '').toUpperCase().slice(0, 8) + '-' + (D.profile.phone.replace(/\D/g, '').slice(-4) || '0000');
    let h = '<div class="head"><div class="hi"><small>Программа лояльности</small><b>Бонусы</b></div></div>';
    h += '<div class="loyal lv' + (B.levels.indexOf(lv) + 1) + '"><i class="sheen"></i><div class="top"><span class="brand" style="color:#fff">' + esc(A.name) + '</span><span class="lvl">' + lv.name + '</span></div><div class="bal">' + D.balance.toLocaleString('ru-RU') + '</div><small>бонусов · 1 бонус = 1 ₽</small>' +
      '<div class="row" style="margin-top:18px"><div><small>Карта</small><div style="font-weight:800;letter-spacing:.14em;margin-top:2px">' + cardNo() + '</div><small style="display:block;margin-top:8px">Покажите QR администратору</small></div><div class="qr">' + qrSvg('CARD:' + cardNo().replace(' ', '') + ';' + A.name) + '</div></div></div>';
    h += '<p style="color:var(--muted);font-size:13.5px;margin:12px 4px 0">' + lv.rate + '% с каждого визита возвращается бонусами. Оплачивайте ими до ' + B.maxPay + '% стоимости.</p>';
    h += '<section class="sec"><div class="sec-h"><h2>Уровни</h2></div><div class="levels">' + B.levels.map(l => '<div class="' + (l.name === lv.name ? 'on' : '') + '"><b>' + l.name + '</b><small>' + l.rate + '% · от ' + l.from + ' ' + plural(l.from, 'визита', 'визитов', 'визитов') + '</small></div>').join('') + '</div>' +
      (nl ? '<p style="color:var(--muted);font-size:13.5px;margin:10px 4px 0">До ' + nl.name + ' — ' + (nl.from - D.visits) + ' ' + plural(nl.from - D.visits, 'визит', 'визита', 'визитов') + '.</p>' : '') + '</section>';
    h += '<section class="sec"><div class="ref"><b style="font-size:17px">Приведите ' + W.friendAcc + '</b><span style="color:var(--muted);font-size:14px">' + W.him + ' — ' + B.referral + ' бонусов на первый визит, вам — ' + B.referral + ' после ' + W.his + ' визита.</span><code>' + esc(code) + '</code><button class="btn primary block" type="button" data-act="share-ref" data-code="' + esc(code) + '">' + svg('share') + 'Поделиться</button></div></section>';
    h += '<section class="sec"><div class="sec-h"><h2>История</h2></div><div class="hist">' + D.history.map(x => '<div><span>' + esc(x.t) + '<small>' + esc(nice(x.d)) + '</small></span><span class="' + (x.v > 0 ? 'plus' : 'minus') + '">' + (x.v > 0 ? '+' : '−') + Math.abs(x.v).toLocaleString('ru-RU') + '</span></div>').join('') + '</div></section>';
    return h;
  }

  /* ---------- сертификат ---------- */
  const cert = { sum: 3000, style: 's1', to: '', msg: '' };
  function certCard(c, code) {
    return '<div class="cert ' + c.style + '"><div style="display:flex;justify-content:space-between;align-items:center"><span class="b">' + esc(A.name) + '</span><span class="code">' + (code ? esc(code) : 'Сертификат') + '</span></div>' +
      '<div><div class="sum">' + rub(c.sum) + '</div><div class="to">' + (c.to ? 'Кому: ' + esc(c.to) : 'Подарочный сертификат') + (c.msg ? ' · «' + esc(c.msg.slice(0, 60)) + '»' : '') + '</div></div></div>';
  }
  function certSheet() {
    sheet('<h2 class="h1">Подарочный сертификат</h2><div id="certPrev">' + certCard(cert) + '</div>' +
      '<p class="lbl">Сумма</p><div class="chips">' + [2000, 3000, 5000, 10000].map(v => '<button class="chip" style="padding:6px 16px" type="button" data-sum="' + v + '" aria-pressed="' + (cert.sum === v) + '">' + rub(v) + '</button>').join('') + '</div>' +
      '<p class="lbl">Оформление</p><div class="styles3">' + [['s1', W.s1], ['s2', 'Ночь'], ['s3', 'Золото']].map(([k, t]) => '<button type="button" class="cert ' + k + '" style="aspect-ratio:1;padding:0" data-style="' + k + '" aria-pressed="' + (cert.style === k) + '" aria-label="' + t + '"></button>').join('') + '</div>' +
      '<p class="lbl">Кому и пожелание</p><div style="display:grid;gap:10px"><label class="field">' + W.toLabel + '<input id="cTo" maxlength="30" value="' + esc(cert.to) + '" placeholder="Например, ' + W.toExample + '"></label><label class="field">Пожелание<textarea id="cMsg" maxlength="120" placeholder="С днём рождения!">' + esc(cert.msg) + '</textarea></label></div>' +
      '<button class="btn primary block" type="button" data-act="buy-cert" style="margin-top:16px">Оформить за ' + rub(cert.sum) + '</button><p style="color:var(--muted);font-size:12.5px;text-align:center;margin-top:8px">Демо: оплата картой или по СБП подключается при запуске</p>');
  }
  function buyCert() {
    const code = 'GIFT-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + String(Date.now()).slice(-4);
    const c = { ...cert, code, date: dstr(new Date()) }; D.certs.unshift(c); save(); buzz();
    sheet('<div class="done"><div class="ck">' + svg('check', 2.6) + '</div><h2 class="h1">Сертификат готов</h2></div>' + certCard(c, code) +
      '<div style="display:flex;justify-content:center;margin:16px 0"><div style="background:#fff;border-radius:14px;padding:8px;width:120px;height:120px">' + qrSvg('GIFT:' + code + ';' + c.sum) + '</div></div>' +
      '<button class="btn primary block" type="button" data-act="share-cert" data-code="' + code + '">' + svg('share') + 'Отправить ' + W.friendTo + '</button><button class="btn block" type="button" data-act="close" style="margin-top:8px">Готово</button>');
  }

  /* ---------- профиль ---------- */
  function profile() {
    const up = upcoming(), past = D.bookings.filter(b => b.status === 'done').sort((a, b) => b.date.localeCompare(a.date));
    let h = '<div class="pro" style="margin-bottom:18px"><span class="av">' + esc(D.profile.name[0] || '•') + '</span><div style="flex:1"><b>' + esc(D.profile.name) + '</b><small>' + esc(D.profile.phone) + ' · ' + level().name + '</small></div><button class="btn small" type="button" data-act="edit">Изменить</button></div>';
    h += '<section><div class="sec-h"><h2>Мои записи</h2></div><div style="display:grid;gap:10px">' + (up.length ? up.map(b => '<div class="bk"><span class="w">' + esc(nice(b.date)) + ', ' + fromMin(b.startMin) + '</span><span>' + esc(b.serviceName) + (b.masterName ? ' · ' + esc(b.masterName) : '') + '</span><small>' + (b.status === 'confirmed' ? 'Подтверждена ✓' : 'Ждёт подтверждения') + '</small><div class="row"><button class="btn small" type="button" data-act="ics" data-id="' + b.id + '">' + svg('cal') + 'В календарь</button><button class="btn small" type="button" data-act="cancel" data-id="' + b.id + '">Отменить</button></div></div>').join('') : '<div class="hint">Записей пока нет</div>') + '</div></section>';
    if (past.length) h += '<section class="sec"><div class="sec-h"><h2>Были у нас</h2></div><div style="display:grid;gap:10px">' + past.map(b => '<div class="bk"><span>' + esc(b.serviceName) + (b.masterName ? ' · ' + esc(b.masterName) : '') + '</span><small>' + esc(nice(b.date)) + '</small><div class="row"><button class="btn small primary" type="button" data-act="again" data-id="' + b.id + '">Записаться снова</button></div></div>').join('') + '</div></section>';
    h += '<section class="sec"><div class="sec-h"><h2>Сертификаты</h2><button type="button" data-act="cert">Подарить</button></div>' + (D.certs.length ? '<div style="display:grid;gap:10px">' + D.certs.map(c => certCard(c, c.code)).join('') + '</div>' : '<div class="hint">Подарочных сертификатов пока нет</div>') + '</section>';
    h += '<section class="sec"><div class="menu">' +
      '<label><span class="t">Напоминать о записи<small>За 2 часа до визита</small></span><input class="sw" type="checkbox" data-set="remind"' + (D.settings.remind ? ' checked' : '') + '></label>' +
      '<label><span class="t">Акции и новости<small>Не чаще раза в неделю</small></span><input class="sw" type="checkbox" data-set="news"' + (D.settings.news ? ' checked' : '') + '></label>' +
      (A.phone ? '<a href="tel:' + esc(A.phone.replace(/[^\d+]/g, '')) + '">' + svg('phone') + '<span class="t">Позвонить ' + W.placeTo + '<small>' + esc(A.phone) + '</small></span></a>' : '') +
      (A.max ? '<a href="' + esc(A.max) + '" target="_blank" rel="noopener">' + svg('chat') + '<span class="t">Написать в MAX</span></a>' : '') +
      (A.telegram ? '<a href="' + esc(A.telegram) + '" target="_blank" rel="noopener">' + svg('chat') + '<span class="t">Написать в Telegram</span></a>' : '') +
      (A.whatsapp ? '<a href="https://wa.me/' + esc(A.whatsapp) + '" target="_blank" rel="noopener">' + svg('chat') + '<span class="t">Написать в WhatsApp</span></a>' : '') +
      '<a href="' + route() + '" target="_blank" rel="noopener">' + svg('pin') + '<span class="t">Как добраться<small>' + esc(A.address) + '</small></span></a>' +
      '<button type="button" data-act="install">' + svg('dl') + '<span class="t">Приложение на экран телефона<small>Без App Store и Google Play</small></span></button></div></section>';
    if (A.demo) h += '<section class="sec"><p class="demo-note">Это демо-приложение: данные хранятся только на этом телефоне. <button type="button" data-act="reset" style="border:0;background:none;color:var(--accent);font-weight:700;padding:0">Начать демо заново</button></p></section>';
    return h;
  }

  /* ---------- события ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) { if (e.target.id === 'sheet') closeSheet(); return; }
    const a = t.dataset.act;
    if (t.dataset.tab) { closeSheet(); if (t.dataset.tab === 'book' && st.tab !== 'book') st.bk = { svc: null, who: st.bk.who, date: null, time: null }; go(t.dataset.tab); }
    else if (t.dataset.svc) { buzz(); st.bk.svc = t.dataset.svc; if (st.bk.who !== 'any' && !mastersFor(svcById(t.dataset.svc)).some(m => m.id === st.bk.who)) st.bk.who = 'any'; st.bk.time = null; render(); $('#view').scrollTop = 0; }
    else if (t.dataset.who) { buzz(); st.bk.who = t.dataset.who; st.bk.time = null; render(); }
    else if (t.dataset.date) { buzz(); st.bk.date = t.dataset.date; st.bk.time = null; render(); }
    else if (t.dataset.time) { buzz(); st.bk.time = Number(t.dataset.time); render(); }
    else if (t.dataset.sum) { cert.sum = Number(t.dataset.sum); certSheet(); }
    else if (t.dataset.style) { cert.style = t.dataset.style; certSheet(); }
    else if (a === 'change-svc') { st.bk.svc = null; st.bk.time = null; render(); }
    else if (a === 'confirm') confirmSheet();
    else if (a === 'do-book') doBook();
    else if (a === 'close') closeSheet();
    else if (a === 'home') { closeSheet(); go('home'); }
    else if (a === 'ics') ics(t.dataset.id);
    else if (a === 'master') { st.bk = { svc: null, who: t.dataset.id, date: null, time: null }; go('book'); }
    else if (a === 'promo') { const p = A.promos[+t.dataset.i]; sheet('<h2 class="h1">' + esc(p.title) + '</h2><p style="margin-bottom:16px">' + esc(p.text) + '</p>' + (p.more ? '<p style="color:var(--muted);margin-bottom:16px">' + esc(p.more) + '</p>' : '') + '<button class="btn primary block" type="button" data-tab="book">Записаться</button>'); }
    else if (a === 'photo') { const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img src="' + esc(t.dataset.src) + '" alt="">'; lb.onclick = () => lb.remove(); $('#app').appendChild(lb); }
    else if (a === 'cert') certSheet();
    else if (a === 'buy-cert') { cert.to = ($('#cTo') || {}).value || ''; cert.msg = ($('#cMsg') || {}).value || ''; buyCert(); }
    else if (a === 'share-cert' || a === 'share-ref') {
      const text = a === 'share-cert' ? 'Дарю тебе сертификат в «' + A.name + '»! Код: ' + t.dataset.code : 'Записывайся в «' + A.name + '» с моим кодом ' + t.dataset.code + ' — получишь ' + B.referral + ' бонусов на первый визит';
      if (navigator.share) navigator.share({ text }).catch(() => {}); else { try { navigator.clipboard.writeText(text); toast('Текст скопирован — вставьте в мессенджер'); } catch (x) { toast(text); } }
    }
    else if (a === 'notif') sheet('<h2 class="h1">Уведомления</h2><div class="menu"><div style="padding:15px 16px;border-bottom:1px solid var(--line)"><b>Запись подтверждена</b><br><small style="color:var(--muted)">Ждём вас — напомним за 2 часа</small></div><div style="padding:15px 16px"><b>+' + (D.history[0] || {}).v + ' бонусов</b><br><small style="color:var(--muted)">За визит — спасибо, что выбираете нас</small></div></div>');
    else if (a === 'edit') sheet('<h2 class="h1">Ваши данные</h2><div style="display:grid;gap:10px"><label class="field">Имя<input id="pName" maxlength="40" value="' + esc(D.profile.name) + '"></label><label class="field">Телефон<input id="pPhone" type="tel" maxlength="24" value="' + esc(D.profile.phone) + '"></label></div><button class="btn primary block" type="button" data-act="save-profile" style="margin-top:16px">Сохранить</button>');
    else if (a === 'save-profile') { D.profile.name = ($('#pName').value || '').trim() || D.profile.name; D.profile.phone = ($('#pPhone').value || '').trim() || D.profile.phone; save(); closeSheet(); render(); toast('Сохранено'); }
    else if (a === 'cancel') {
      if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно отменить?'; setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = 'Отменить'; } }, 4000); return; }
      const b = D.bookings.find(x => x.id === t.dataset.id); if (b) { b.status = 'cancelled'; save(); render(); toast('Запись отменена'); }
    }
    else if (a === 'again') { const b = D.bookings.find(x => x.id === t.dataset.id); if (b) { st.bk = { svc: svcById(b.serviceId) ? b.serviceId : null, who: b.masterId && mById(b.masterId) ? b.masterId : 'any', date: null, time: null }; go('book'); } }
    else if (a === 'install') sheet('<h2 class="h1">На экран телефона</h2><p style="margin-bottom:12px"><b>iPhone:</b> Safari → «Поделиться» → «На экран „Домой“».</p><p style="margin-bottom:16px"><b>Android:</b> Chrome → меню ⋮ → «Установить приложение».</p><button class="btn primary block" type="button" data-act="close">Понятно</button>');
    else if (a === 'reset') { if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно начать заново?'; return; } try { localStorage.removeItem(KEY); } catch (x) { /* нет */ } D = seed(); save(); go('home'); }
  });
  document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.set; if (k) { D.settings[k] = e.target.checked; save(); toast(e.target.checked ? 'Включено' : 'Выключено'); } });
  document.addEventListener('input', e => { if (e.target.id === 'cTo' || e.target.id === 'cMsg') { cert.to = $('#cTo').value; cert.msg = $('#cMsg').value; const p = $('#certPrev'); if (p) p.innerHTML = certCard(cert); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

  const sp = $('#splash');
  if (sp) { let seen = false; try { seen = sessionStorage.getItem(KEY + '.splash'); sessionStorage.setItem(KEY + '.splash', '1'); } catch (e) { /* нет */ }
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) sp.remove(); else { sp.querySelector('b').textContent = A.name; sp.querySelector('small').textContent = A.kind || ''; setTimeout(() => sp.classList.add('out'), 1100); setTimeout(() => sp.remove(), 1700); } }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* офлайн необязателен */ });
  render();
  window.__app = { st, go, D: () => D };
})();
