/* Приложение автосервиса для клиентов (PWA): машина в работе по этапам и согласование сметы, гараж с пробегом и ТО,
   история обслуживания (заказ-наряды), запись с выбором машины, бонусная карта с QR, подарочные сертификаты, профиль.
   Данные сервиса — data.js (window.APP, собирает tools/clientapp.mjs из site.json). Демо: всё хранится только на этом телефоне (localStorage). */
(function () {
  'use strict';
  const A = window.APP, $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const WD = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const toMin = t => { const [h, m] = String(t).split(':').map(Number); return (h || 0) * 60 + (m || 0); };
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);
  const nice = s => { const d = parseD(s), t = dstr(new Date()), tm = dstr(new Date(Date.now() + 864e5)); return (s === t ? 'Сегодня' : s === tm ? 'Завтра' : WD[d.getDay()]) + ', ' + d.getDate() + ' ' + MON[d.getMonth()]; };
  const longD = s => { const d = parseD(s); return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
  const rub = n => Number(n || 0).toLocaleString('ru-RU') + ' ₽';
  const km = n => Number(n || 0).toLocaleString('ru-RU') + ' км';
  const price = s => (s.price ? (s.from ? 'от ' : '') + rub(s.price) : 'по запросу');
  const dur = m => m >= 60 ? (m % 60 ? Math.floor(m / 60) + ' ч ' + m % 60 + ' мин' : m / 60 + ' ч') : m + ' мин';
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
  const buzz = () => { try { navigator.vibrate && navigator.vibrate(8); } catch (e) { /* нет */ } };

  const I = {
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    car: '<path d="M4 16v-4l2.2-5.2A2 2 0 0 1 8 5.5h8a2 2 0 0 1 1.8 1.3L20 12v4"/><path d="M3 16h18v2.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V18H7v.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M4.5 12h15"/><circle cx="7.5" cy="14.6" r=".6"/><circle cx="16.5" cy="14.6" r=".6"/>',
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
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    gauge: '<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="M12 13l4-4"/><circle cx="12" cy="13" r="1.2"/>',
    dl: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
  };
  const svg = (k, w) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (w || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[k] + '</svg>';

  /* ---------- данные клиента (демо) ---------- */
  const KEY = 'clientapp.' + (A.slug || 'auto') + '.auto1';
  const W = Object.assign({ demoName: 'Андрей', placeTo: 'в сервис', placeBy: 'автосервисом', gift: 'Подарите уход за авто', friendTo: 'другу', friendAcc: 'друга', him: 'Ему', his: 'его' }, A.words || {});
  const hoursOf = dow => { const h = (A.hours || {})[dow]; return h && toMin(h[1]) > toMin(h[0]) ? h : null; };
  const svcById = id => A.services.find(s => s.id === id);
  const DETAIL = /полир|брон|хим|детейл|линз|предпрод|керам|плён|плен|мойк|салон/i;
  const groups = () => { const d = A.services.filter(s => DETAIL.test(s.name)), r = A.services.filter(s => !DETAIL.test(s.name)); return [['Ремонт и обслуживание', r], ['Детейлинг', d]].filter(g => g[1].length); };
  const svcLike = re => A.services.find(s => re.test(s.name)) || A.services[0];
  const STAGES = ['Принята', 'Диагностика', 'Согласование', 'В работе', 'Готова'];

  function seed() {
    const t = new Date(), day = n => dstr(new Date(t.getFullYear(), t.getMonth(), t.getDate() + n));
    const cars = [
      { id: 'c1', make: 'Toyota', model: 'Camry', year: 2018, plate: 'К 777 КК 124', mileage: 86400, toEvery: 10000, lastTo: 78000 },
      { id: 'c2', make: 'BMW', model: 'X5', year: 2020, plate: 'М 001 ММ 124', mileage: 41200, toEvery: 10000, lastTo: 40000 }
    ];
    const susp = svcLike(/подвес/i), oil = svcLike(/масл|ТО/i), pol = svcLike(/полиров.*кузов|полиров/i), lamp = svcLike(/фар/i);
    const visits = [
      { id: 'v1', carId: 'c1', date: day(-46), mileage: 82100, works: [{ t: 'Компьютерная диагностика', v: 1500 }, { t: 'Замена масла и фильтра', v: 1000 }], parts: 4300 },
      { id: 'v2', carId: 'c2', date: day(-75), mileage: 40000, works: [{ t: pol.name, v: pol.price || 10000 }, { t: 'Бронирование фар плёнкой', v: 3000 }], parts: 0 },
      { id: 'v3', carId: 'c1', date: day(-160), mileage: 78000, works: [{ t: oil.name, v: oil.price || 1000 }], parts: 3900 }
    ];
    /* машина сейчас в сервисе — демо этапов и согласования сметы */
    /* смета: есть ремонт подвески — пример про подвеску; иначе — из услуг самого сервиса (шиномонтаж, детейлинг…) */
    const hasSusp = /подвес/i.test(susp.name), s0 = A.services[0], s1 = A.services[1] || A.services[0];
    const live = hasSusp ? { carId: 'c1', serviceName: susp.name, stage: 2, since: dstr(t), note: 'Стук спереди справа на неровностях',
      estimate: [{ t: 'Диагностика ходовой', v: 1000, done: true }, { t: 'Замена стоек стабилизатора (2 шт.)', v: 1800 }, { t: 'Стойки стабилизатора — запчасти', v: 3600, part: true }] }
      : { carId: 'c1', serviceName: s0.name, stage: 2, since: dstr(t), note: '',
        estimate: [{ t: s0.name, v: s0.price || 1500, done: true }, { t: s1.name, v: s1.price || 1000 }, { t: 'Расходные материалы', v: 600, part: true }] };
    let next = null;
    for (let i = 3; i < 10 && !next; i++) { const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i); if (hoursOf(d.getDay())) next = mk(lamp, 'c2', dstr(d), toMin(hoursOf(d.getDay())[0]) + 120, 'confirmed', ''); }
    return {
      v: 1, profile: { name: W.demoName, phone: '+7 900 000-00-00' }, cars, visits, live, bookings: next ? [next] : [],
      count: 6, balance: 1860, certs: [], settings: { remind: true, status: true, news: false },
      history: [{ t: 'Визит: диагностика и масло', d: visits[0].date, v: 340 }, { t: 'Оплата бонусами', d: visits[1].date, v: -900 }, { t: 'За отзыв на Яндекс Картах', d: visits[1].date, v: 300 }, { t: 'Приветственные бонусы', d: day(-200), v: (A.bonus || {}).welcome || 500 }]
    };
  }
  function mk(s, carId, date, startMin, status, note) { return { id: Math.random().toString(36).slice(2, 9), serviceId: s.id, serviceName: s.name, duration: s.duration, price: s.price, from: s.from, carId, date, startMin, status, note: note || '' }; }
  let D = (() => { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 1) return d; } catch (e) { /* нет */ } return seed(); })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(D)); } catch (e) { /* нет места */ } };
  save();
  const carById = id => D.cars.find(c => c.id === id) || D.cars[0];
  const carName = c => c ? c.make + ' ' + c.model : '';
  const toLeft = c => Math.max(0, (c.lastTo || 0) + (c.toEvery || 10000) - c.mileage);
  const toPct = c => Math.min(100, Math.round((c.mileage - (c.lastTo || 0)) / (c.toEvery || 10000) * 100));
  const plate = p => { const m = String(p || '').match(/^(.*?)\s*(\d{2,3})$/); return '<span class="plate"><b>' + esc(m ? m[1] : p || 'без номера') + '</b>' + (m ? '<i><em>' + m[2] + '</em><small>RUS</small></i>' : '') + '</span>'; };

  /* занятость: свои записи + условно занятые окна сервиса (одинаковые при каждом открытии) */
  const hash = s => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  function busy(date, m, len) {
    if (D.bookings.some(b => (b.status === 'new' || b.status === 'confirmed') && b.date === date && b.startMin < m + len && m < b.startMin + b.duration)) return true;
    const h = hash(date + A.name), d0 = toMin((hoursOf(parseD(date).getDay()) || ['10:00'])[0]);
    for (let k = 0; k < 3; k++) { const s = d0 + (((h >> (k * 5)) % 18) * 30), e = s + 60 + ((h >> (k * 3)) % 3) * 30; if (s < m + len && m < e) return true; }
    return false;
  }
  function slots(s, date) {
    const h = hoursOf(parseD(date).getDay()); if (!h) return [];
    const n = new Date(), today = dstr(n) === date, lead = n.getHours() * 60 + n.getMinutes() + 60, out = [];
    const len = Math.min(s.duration, 120); /* долгие работы — машину оставляют: важно только время приёма */
    for (let m = toMin(h[0]); m + len <= toMin(h[1]); m += 30) { if (today && m < lead) continue; if (!busy(date, m, len)) out.push(m); }
    return out;
  }

  /* ---------- бонусы ---------- */
  const B = Object.assign({ welcome: 500, maxPay: 30, referral: 500, levels: [{ name: 'Silver', from: 0, rate: 3 }, { name: 'Gold', from: 5, rate: 5 }, { name: 'Black', from: 12, rate: 7 }] }, A.bonus || {});
  const level = () => B.levels.slice().reverse().find(l => D.count >= l.from) || B.levels[0];
  const nextLevel = () => B.levels.find(l => l.from > D.count) || null;
  const cardNo = () => { const h = String(hash(D.profile.phone + A.name)).padStart(8, '0').slice(0, 8); return h.slice(0, 4) + ' ' + h.slice(4); };
  function qrSvg(text) { try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) { return ''; } }

  /* ---------- каркас ---------- */
  const st = { tab: 'home', bk: { svc: null, car: null, date: null, time: null, note: '' } };
  function go(tab) { st.tab = tab; render(); $('#view').scrollTop = 0; }
  function render() {
    const v = $('#view');
    v.innerHTML = st.tab === 'home' ? home() : st.tab === 'garage' ? garage() : st.tab === 'book' ? book() : st.tab === 'bonus' ? bonus() : profile();
    v.className = 'view'; void v.offsetWidth; v.className = 'view';
    $('#tabs').innerHTML = [['home', 'home', 'Главная'], ['garage', 'car', 'Гараж'], ['book', 'plus', 'Запись'], ['bonus', 'star', 'Бонусы'], ['profile', 'user', 'Профиль']].map(([k, ic, t]) =>
      '<button type="button" data-tab="' + k + '"' + (st.tab === k ? ' aria-current="page"' : '') + (k === 'book' ? ' class="main"' : '') + '><span>' + svg(ic, k === 'book' ? 2.4 : 1.8) + '</span><span>' + t + '</span></button>').join('');
  }
  function sheet(html) { $('#sheet').innerHTML = '<div class="panel" role="dialog" aria-modal="true"><div class="grab"></div>' + html + '</div>'; $('#sheet').hidden = false; }
  function closeSheet() { $('#sheet').hidden = true; $('#sheet').innerHTML = ''; }
  let tT;
  function toast(t) { const el = $('#toast'); el.textContent = t; el.hidden = false; clearTimeout(tT); tT = setTimeout(() => { el.hidden = true; }, 3400); }
  const upcoming = () => D.bookings.filter(b => (b.status === 'new' || b.status === 'confirmed') && (b.date > dstr(new Date()) || (b.date === dstr(new Date()) && b.startMin > new Date().getHours() * 60))).sort((a, b) => (a.date + fromMin(a.startMin)).localeCompare(b.date + fromMin(b.startMin)));
  const greet = () => { const h = new Date().getHours(); return h < 6 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; };
  const route = () => 'https://yandex.ru/maps/?text=' + encodeURIComponent(A.address || '');
  const telHref = () => 'tel:' + String(A.phone || '').replace(/[^\d+]/g, '');
  const brandRow = () => '<div class="brandbar">' + (A.mark ? '<img src="' + esc(A.mark) + '" alt="" width="34" height="28">' : '') + '<span>' + esc(A.name) + '</span>' + (A.demo ? '<span class="demo-tag">демо</span>' : '') +
    '<button class="icon-btn" type="button" data-act="notif" aria-label="Уведомления">' + svg('bell') + (D.live && D.live.stage === 2 && !D.live.approved ? '<span class="badge"></span>' : '') + '</button></div>';

  /* ---------- главная ---------- */
  function liveCard() {
    const L = D.live; if (!L) return '';
    const c = carById(L.carId), sum = L.estimate.reduce((a, x) => a + x.v, 0);
    let h = '<section class="live" aria-label="Машина в сервисе"><div class="live-top"><span class="pulse"></span><small>' + (L.stage >= 4 ? 'Готово — можно забирать' : 'Ваш автомобиль в сервисе') + '</small></div>' +
      '<div class="live-car"><b>' + esc(carName(c)) + '</b>' + plate(c.plate) + '</div><p class="live-t">' + esc(L.serviceName) + (L.note ? ' · ' + esc(L.note) : '') + '</p>' +
      '<ol class="track">' + STAGES.map((s, i) => '<li class="' + (i < L.stage ? 'pass' : i === L.stage ? 'now' : '') + '"><i></i><span>' + s + '</span></li>').join('') + '</ol><p class="track-cap">Этап ' + Math.min(L.stage + 1, 5) + ' из 5 · <b>' + STAGES[L.stage] + '</b></p>';
    if (L.stage === 2 && !L.approved) h += '<div class="est"><p class="est-h">' + svg('doc') + 'Смета от мастера</p>' + L.estimate.map(x => '<div><span>' + esc(x.t) + (x.done ? ' <em>выполнено</em>' : '') + '</span><b>' + rub(x.v) + '</b></div>').join('') +
      '<div class="tot"><span>Итого</span><b>' + rub(sum) + '</b></div><div class="row"><button class="btn primary" type="button" data-act="approve">' + svg('check', 2.4) + 'Согласовать</button><a class="btn ghost" href="' + telHref() + '">' + svg('phone') + 'Обсудить</a></div></div>';
    else if (L.stage === 3) h += '<p class="live-s">' + svg('wrench') + 'Смета согласована — ' + rub(sum) + '. Мастер уже работает, сообщим, когда будет готово.</p>';
    else if (L.stage >= 4) h += '<p class="live-s ok">' + svg('shield') + 'Работы выполнены — ' + rub(sum) + '. Ждём вас до ' + ((hoursOf(new Date().getDay()) || ['', '22:00'])[1]) + '.</p><div class="row"><a class="btn primary" href="' + route() + '" target="_blank" rel="noopener">' + svg('pin') + 'Маршрут</a><button class="btn ghost" type="button" data-act="pickup">Забрал</button></div>';
    return h + '</section>';
  }
  function carCard(c, full) {
    const left = toLeft(c), pct = toPct(c), soon = left <= 1500;
    return '<div class="carc"><div class="carc-h"><span class="carc-ic">' + svg('car', 1.6) + '</span><div><b>' + esc(carName(c)) + '</b><small>' + esc(c.year || '') + (c.year ? ' · ' : '') + km(c.mileage) + '</small></div>' + plate(c.plate) + '</div>' +
      '<div class="to"><div class="to-h"><span>' + svg('gauge') + (left ? 'До ТО ' + km(left) : 'Пора на ТО') + '</span><small>каждые ' + km(c.toEvery) + '</small></div><div class="bar' + (soon ? ' warn' : '') + '"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="row"><button class="btn ' + (soon ? 'primary' : 'light') + ' small" type="button" data-act="book-car" data-id="' + c.id + '" data-svc="' + esc(svcLike(/масл|ТО/i).id) + '">Записать на ТО</button>' +
      (full ? '<button class="btn small" type="button" data-act="mileage" data-id="' + c.id + '">Пробег</button><button class="btn small" type="button" data-act="history" data-id="' + c.id + '">История</button>' : '<button class="btn small" type="button" data-tab="garage">Гараж</button>') + '</div></div>';
  }
  function home() {
    const nx = upcoming()[0], lv = level(), nl = nextLevel(), today = hoursOf(new Date().getDay());
    let h = brandRow();
    h += '<div class="hero"' + (A.hero ? ' style="--img:url(\'' + esc(A.hero) + '\')"' : '') + '><small>' + greet() + ',</small><b>' + esc(D.profile.name) + '</b><p>' + (today ? 'Сегодня работаем ' + today.join('–') : 'Сегодня выходной') + ' · ' + esc(A.address.split(',').slice(0, 2).join(',')) + '</p>' +
      '<button class="btn primary" type="button" data-tab="book">Записаться ' + svg('arrow', 2.2) + '</button></div>';
    h += '<div class="quick">' + [['tab:book', 'cal', 'Запись'], ['tel', 'phone', 'Позвонить'], ['route', 'pin', 'Маршрут'], ['chat', 'chat', 'Написать']].map(([k, ic, t]) =>
      k === 'tel' ? '<a href="' + telHref() + '">' + svg(ic) + '<span>' + t + '</span></a>' : k === 'route' ? '<a href="' + route() + '" target="_blank" rel="noopener">' + svg(ic) + '<span>' + t + '</span></a>' :
        k === 'chat' ? (A.telegram ? '<a href="' + esc(A.telegram) + '" target="_blank" rel="noopener">' : '<a href="' + (A.whatsapp ? 'https://wa.me/' + esc(A.whatsapp) : telHref()) + '" target="_blank" rel="noopener">') + svg(ic) + '<span>' + t + '</span></a>' :
          '<button type="button" data-tab="book">' + svg(ic) + '<span>' + t + '</span></button>').join('') + '</div>';
    h += liveCard();
    if (nx) { const c = carById(nx.carId); h += '<div class="next"><small>' + (nx.status === 'confirmed' ? 'Запись подтверждена' : 'Запись ждёт подтверждения') + '</small><div class="when">' + esc(nice(nx.date)) + ', ' + fromMin(nx.startMin) + '</div><p>' + esc(nx.serviceName) + ' · ' + esc(carName(c)) + '</p>' +
      '<div class="row"><a class="btn white small" href="' + route() + '" target="_blank" rel="noopener">' + svg('pin') + 'Маршрут</a><button class="btn light small" type="button" data-act="ics" data-id="' + nx.id + '">' + svg('cal') + 'В календарь</button></div></div>'; }
    h += '<section class="sec"><div class="sec-h"><h2>Мой автомобиль</h2><button type="button" data-tab="garage">Все ' + D.cars.length + '</button></div>' + carCard(D.cars[0]) + '</section>';
    h += '<button class="card bonus-mini" type="button" data-tab="bonus"><span class="ic">' + svg('star') + '</span><span style="flex:1"><b>' + D.balance.toLocaleString('ru-RU') + ' бонусов</b><small>' + lv.name + ' · ' + lv.rate + '% с каждого визита' + (nl ? ' · до ' + nl.name + ' ' + (nl.from - D.count) + ' ' + plural(nl.from - D.count, 'визит', 'визита', 'визитов') : '') + '</small>' +
      (nl ? '<div class="bar"><i style="width:' + Math.round((D.count - lv.from) / (nl.from - lv.from) * 100) + '%"></i></div>' : '') + '</span></button>';
    if ((A.promos || []).length) h += '<section class="sec"><div class="sec-h"><h2>Для вас</h2></div><div class="hscroll">' + A.promos.map((p, i) =>
      '<button class="promo" type="button" data-act="promo" data-i="' + i + '">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="" loading="lazy">' : '') + '<span class="tag">' + esc(p.tag || 'Акция') + '</span><b>' + esc(p.title) + '</b><small>' + esc(p.text) + '</small></button>').join('') + '</div></section>';
    if ((A.photos || []).length) h += '<section class="sec"><div class="sec-h"><h2>Из нашего бокса</h2></div><div class="works">' + A.photos.slice(0, 5).map(p => '<button type="button" data-act="photo" data-src="' + esc(p) + '"><img src="' + esc(p) + '" alt="Работа ' + esc(A.name) + '" loading="lazy"></button>').join('') + '</div></section>';
    h += '<section class="sec"><button class="gift" type="button" data-act="cert"><span class="g">' + svg('gift') + '</span><span><b>' + esc(W.gift) + '</b><small>Сертификат от ' + rub(2000) + ' — оформим и отправим ' + esc(W.friendTo) + '</small></span></button></section>';
    h += '<section class="sec info"><div class="sec-h"><h2>' + esc(A.name) + '</h2></div><span>' + svg('pin') + ' ' + esc(A.address) + '</span><span>' + svg('clock') + ' Сегодня ' + (today ? today.join('–') : 'выходной') + '</span>' +
      (A.phone ? '<a href="' + telHref() + '">' + svg('phone') + ' ' + esc(A.phone) + '</a>' : '') + '</section>';
    return h;
  }

  /* ---------- гараж ---------- */
  function garage() {
    let h = '<div class="head"><div class="hi"><small>' + D.cars.length + ' ' + plural(D.cars.length, 'автомобиль', 'автомобиля', 'автомобилей') + '</small><b>Гараж</b></div><button class="icon-btn" type="button" data-act="add-car" aria-label="Добавить автомобиль">' + svg('plus', 2.2) + '</button></div>';
    h += '<div style="display:grid;gap:14px">' + D.cars.map(c => carCard(c, true)).join('') + '</div>';
    const vs = D.visits.slice().sort((a, b) => b.date.localeCompare(a.date));
    h += '<section class="sec"><div class="sec-h"><h2>История обслуживания</h2></div><div class="hist">' + (vs.length ? vs.map(v => { const c = carById(v.carId), tot = v.works.reduce((a, x) => a + x.v, 0) + (v.parts || 0);
      return '<button type="button" class="vis" data-act="order" data-id="' + v.id + '"><span>' + esc(v.works.map(x => x.t).join(', ')) + '<small>' + esc(carName(c)) + ' · ' + esc(longD(v.date)) + ' · ' + km(v.mileage) + '</small></span><b>' + rub(tot) + '</b></button>'; }).join('') : '<div class="hint">Пока пусто — после первого визита здесь появится заказ-наряд</div>') + '</div></section>';
    h += '<p class="demo-note" style="margin-top:14px">' + svg('shield') + ' Вся история машины — в одном месте: удобно при продаже автомобиля.</p>';
    return h;
  }
  function orderSheet(id) {
    const v = D.visits.find(x => x.id === id); if (!v) return; const c = carById(v.carId), w = v.works.reduce((a, x) => a + x.v, 0);
    sheet('<p class="kick">Заказ-наряд №' + (1000 + hash(v.id) % 9000) + '</p><h2 class="h1">' + esc(carName(c)) + '</h2><p style="color:var(--muted);margin:-6px 0 14px">' + esc(longD(v.date)) + ' · ' + km(v.mileage) + ' · ' + esc(c.plate) + '</p>' +
      '<div class="est">' + v.works.map(x => '<div><span>' + esc(x.t) + '</span><b>' + rub(x.v) + '</b></div>').join('') + (v.parts ? '<div><span>Запчасти и материалы</span><b>' + rub(v.parts) + '</b></div>' : '') + '<div class="tot"><span>Итого</span><b>' + rub(w + (v.parts || 0)) + '</b></div></div>' +
      '<button class="btn primary block" type="button" data-act="again" data-id="' + v.id + '" style="margin-top:14px">Записаться снова</button><button class="btn block" type="button" data-act="close" style="margin-top:8px">Закрыть</button>');
  }
  function carForm(c) {
    c = c || {};
    sheet('<h2 class="h1">' + (c.id ? 'Автомобиль' : 'Добавить автомобиль') + '</h2><div style="display:grid;gap:10px;grid-template-columns:1fr 1fr">' +
      '<label class="field">Марка<input id="fMake" maxlength="20" value="' + esc(c.make || '') + '" placeholder="Kia"></label><label class="field">Модель<input id="fModel" maxlength="20" value="' + esc(c.model || '') + '" placeholder="Rio"></label>' +
      '<label class="field">Год<input id="fYear" inputmode="numeric" maxlength="4" value="' + esc(c.year || '') + '" placeholder="2019"></label><label class="field">Пробег, км<input id="fMil" inputmode="numeric" maxlength="7" value="' + esc(c.mileage || '') + '" placeholder="60000"></label>' +
      '<label class="field" style="grid-column:1/-1">Госномер (необязательно)<input id="fPlate" maxlength="14" value="' + esc(c.plate || '') + '" placeholder="А 000 АА 124"></label></div>' +
      '<button class="btn primary block" type="button" data-act="save-car" data-id="' + esc(c.id || '') + '" style="margin-top:16px">Сохранить</button>');
  }

  /* ---------- запись ---------- */
  function book() {
    const b = st.bk, s = b.svc ? svcById(b.svc) : null, stepN = !s ? 1 : b.time == null ? 2 : 3;
    let h = '<div class="steps"><i class="on"></i><i class="' + (stepN > 1 ? 'on' : '') + '"></i><i class="' + (stepN > 2 ? 'on' : '') + '"></i></div>';
    if (!s) {
      h += '<h1 class="h1">Что нужно сделать?</h1>' + groups().map(([g, list]) => '<p class="lbl">' + g + '</p><div class="list">' + list.map(x => '<button class="opt" type="button" data-svc="' + x.id + '"><span class="t"><b>' + esc(x.name) + '</b><small>' + (x.desc ? esc(x.desc) + ' · ' : '') + 'около ' + dur(x.duration) + '</small></span><span class="p">' + esc(price(x)) + '</span></button>').join('') + '</div>').join('');
      h += '<p class="demo-note" style="margin-top:14px">Не знаете, что сломалось? Выберите «' + esc(svcLike(/диагн/i).name) + '» — мастер найдёт причину и согласует смету с вами.</p>';
      return h;
    }
    h += '<button class="opt" type="button" data-act="change-svc" aria-pressed="true"><span class="t"><b>' + esc(s.name) + '</b><small>около ' + dur(s.duration) + ' · изменить</small></span><span class="p">' + esc(price(s)) + '</span></button>';
    if (!b.car || !D.cars.find(c => c.id === b.car)) b.car = D.cars[0] ? D.cars[0].id : null;
    h += '<p class="lbl">Автомобиль</p><div class="chips">' + D.cars.map(c => '<button class="chip" type="button" data-car="' + c.id + '" aria-pressed="' + (b.car === c.id) + '"><span class="mini">' + svg('car', 1.7) + '</span>' + esc(carName(c)) + '</button>').join('') + '<button class="chip" type="button" data-act="add-car"><span class="mini">' + svg('plus', 2.2) + '</span>Другой</button></div>';
    const n = new Date(), days = [];
    for (let i = 0; i < 14; i++) { const d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + i), ds = dstr(d); days.push({ ds, d, open: slots(s, ds).length > 0 }); }
    if (!b.date || !days.find(x => x.ds === b.date && x.open)) b.date = (days.find(x => x.open) || {}).ds || null;
    h += '<p class="lbl">День</p><div class="chips">' + days.map(x => '<button class="day" type="button" data-date="' + x.ds + '"' + (x.open ? '' : ' disabled') + ' aria-pressed="' + (b.date === x.ds) + '"><small>' + (x.ds === dstr(n) ? 'Сег' : WD[x.d.getDay()]) + '</small><b>' + x.d.getDate() + '</b></button>').join('') + '</div>';
    const ts = b.date ? slots(s, b.date) : [];
    if (b.time != null && !ts.includes(b.time)) b.time = null;
    h += '<p class="lbl">Время приезда' + (b.date ? ' · ' + esc(nice(b.date).toLowerCase()) : '') + '</p>' + (ts.length ? '<div class="times">' + ts.map(m => '<button class="time" type="button" data-time="' + m + '" aria-pressed="' + (b.time === m) + '">' + fromMin(m) + '</button>').join('') + '</div>' : '<div class="hint">Свободного времени нет — выберите другой день.</div>');
    h += '<p class="lbl">Что беспокоит <span style="text-transform:none;letter-spacing:0;font-weight:400">— необязательно</span></p><label class="field"><textarea id="bNote" maxlength="200" placeholder="Например: стук спереди на неровностях">' + esc(b.note) + '</textarea></label>';
    if (s.duration > 120) h += '<p class="demo-note" style="margin-top:10px">' + svg('clock') + ' Работа занимает около ' + dur(s.duration) + ' — машину можно оставить, сообщим о готовности в приложении.</p>';
    h += '<div class="dock"><button class="btn primary block" type="button" data-act="confirm"' + (b.time == null ? ' disabled' : '') + '>' + (b.time == null ? 'Выберите время' : 'Записаться · ' + esc(nice(b.date)) + ', ' + fromMin(b.time)) + '</button></div>';
    return h;
  }
  function confirmSheet() {
    const b = st.bk, s = svcById(b.svc), c = carById(b.car), lv = level();
    if (busy(b.date, b.time, Math.min(s.duration, 120))) { toast('Это время только что заняли — выберите другое'); b.time = null; render(); return; }
    sheet('<h2 class="h1">Проверьте запись</h2><div class="card" style="display:grid;gap:6px"><b style="font-size:17px">' + esc(s.name) + '</b><span>' + esc(nice(b.date)) + ', ' + fromMin(b.time) + '</span><span>' + esc(carName(c)) + ' · ' + esc(c.plate || '') + '</span>' + (b.note ? '<span style="color:var(--muted)">«' + esc(b.note) + '»</span>' : '') + '<span style="color:var(--muted)">' + esc(A.address) + '</span><b>' + esc(price(s)) + '</b></div>' +
      '<p class="lbl">Ваши данные</p><div class="card" style="display:grid;gap:4px"><b>' + esc(D.profile.name) + '</b><span style="color:var(--muted)">' + esc(D.profile.phone) + '</span></div>' +
      '<p style="color:var(--muted);font-size:13.5px;margin:14px 2px">Окончательную цену мастер согласует с вами до начала работ. После визита начислим ' + lv.rate + '% бонусами. Записываясь, вы соглашаетесь на обработку персональных данных ' + esc(W.placeBy) + '.</p>' +
      '<button class="btn primary block" type="button" data-act="do-book">Подтвердить запись</button><button class="btn block" type="button" data-act="close" style="margin-top:8px">Изменить</button>');
  }
  function doBook() {
    const b = st.bk, s = svcById(b.svc);
    if (busy(b.date, b.time, Math.min(s.duration, 120))) { closeSheet(); toast('Это время только что заняли'); b.time = null; render(); return; }
    const r = mk(s, b.car, b.date, b.time, 'new', b.note); D.bookings.push(r); save(); buzz();
    sheet('<div class="done"><div class="ck">' + svg('check', 2.6) + '</div><h2 class="h1">Запись отправлена</h2><p style="color:var(--muted)">' + esc(nice(r.date)) + ', ' + fromMin(r.startMin) + ' · ' + esc(r.serviceName) + ' · ' + esc(carName(carById(r.carId))) + '</p></div>' +
      '<button class="btn primary block" type="button" data-act="ics" data-id="' + r.id + '">' + svg('dl') + 'Добавить в календарь</button><button class="btn block" type="button" data-act="home" style="margin-top:8px">На главную</button>');
    st.bk = { svc: null, car: b.car, date: null, time: null, note: '' };
    setTimeout(() => { const x = D.bookings.find(y => y.id === r.id); if (x && x.status === 'new') { x.status = 'confirmed'; save(); toast('«' + A.name + '» подтвердил запись ✓'); if ($('#sheet').hidden) render(); } }, 4000);
  }
  function ics(id) {
    const b = D.bookings.find(x => x.id === id); if (!b) return;
    const d = b.date.replace(/-/g, ''), t = x => pad(Math.floor(x / 60)) + pad(x % 60) + '00', e = s => String(s || '').replace(/([,;\\])/g, '\\$1');
    const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Studio//ClientApp//RU', 'BEGIN:VEVENT', 'UID:' + b.id + '@clientapp', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART:' + d + 'T' + t(b.startMin), 'DTEND:' + d + 'T' + t(b.startMin + Math.min(b.duration, 120)),
      'SUMMARY:' + e(b.serviceName + ' — ' + A.name), 'LOCATION:' + e(A.address), 'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + e('Запись: ' + A.name), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' })); a.download = 'zapis.ics'; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ---------- согласование сметы и готовность (демо) ---------- */
  function approve() {
    const L = D.live; if (!L) return; L.approved = true; L.stage = 3; save(); buzz(); render(); toast('Смета согласована — мастер приступил ✓');
    setTimeout(() => { if (D.live && D.live.stage === 3) { D.live.stage = 4; save(); toast('🔔 ' + A.name + ': автомобиль готов, можно забирать'); if ($('#sheet').hidden) render(); } }, 6000);
  }
  function pickup() {
    const L = D.live; if (!L) return; const c = carById(L.carId), sum = L.estimate.filter(x => !x.part).reduce((a, x) => a + x.v, 0), parts = L.estimate.filter(x => x.part).reduce((a, x) => a + x.v, 0);
    const bon = Math.round((sum + parts) * level().rate / 100);
    D.visits.unshift({ id: 'v' + Date.now(), carId: L.carId, date: dstr(new Date()), mileage: c.mileage, works: L.estimate.filter(x => !x.part).map(x => ({ t: x.t, v: x.v })), parts });
    D.count++; D.balance += bon; D.history.unshift({ t: 'Визит: ' + L.serviceName.toLowerCase(), d: dstr(new Date()), v: bon }); D.live = null; save(); buzz(); render();
    sheet('<div class="done"><div class="ck">' + svg('check', 2.6) + '</div><h2 class="h1">Спасибо, что выбрали нас</h2><p style="color:var(--muted)">Заказ-наряд — в гараже, +' + bon + ' бонусов на карте.</p></div>' +
      '<p class="lbl" style="text-align:center">Как всё прошло?</p><div class="rate">' + [1, 2, 3, 4, 5].map(n => '<button type="button" data-rate="' + n + '" aria-label="' + n + ' из 5">' + svg('star', 1.6) + '</button>').join('') + '</div><div id="rateOut"></div>');
  }

  /* ---------- бонусы ---------- */
  function bonus() {
    const lv = level(), nl = nextLevel(), code = String(A.slug || 'AUTO').replace(/-app$/, '').toUpperCase().slice(0, 8) + '-' + (D.profile.phone.replace(/\D/g, '').slice(-4) || '0000');
    let h = '<div class="head"><div class="hi"><small>Клубная карта</small><b>Бонусы</b></div></div>';
    h += '<div class="loyal"><div class="top"><span class="brand">' + (A.mark ? '<img src="' + esc(A.mark) + '" alt="" width="30" height="25">' : '') + esc(A.name) + '</span><span class="lvl">' + lv.name + '</span></div><div class="bal">' + D.balance.toLocaleString('ru-RU') + '</div><small>бонусов · 1 бонус = 1 ₽</small>' +
      '<div class="row" style="margin-top:18px"><div><small>Карта</small><div style="font-weight:800;letter-spacing:.14em;margin-top:2px">' + cardNo() + '</div><small style="display:block;margin-top:8px">Покажите QR на приёмке</small></div><div class="qr">' + qrSvg('CARD:' + cardNo().replace(' ', '') + ';' + A.name) + '</div></div></div>';
    h += '<p style="color:var(--muted);font-size:13.5px;margin:12px 4px 0">' + lv.rate + '% с каждого визита возвращается бонусами. Оплачивайте ими до ' + B.maxPay + '% стоимости работ.</p>';
    h += '<section class="sec"><div class="sec-h"><h2>Уровни</h2></div><div class="levels">' + B.levels.map(l => '<div class="' + (l.name === lv.name ? 'on' : '') + '"><b>' + l.name + '</b><small>' + l.rate + '% · от ' + l.from + ' ' + plural(l.from, 'визита', 'визитов', 'визитов') + '</small></div>').join('') + '</div>' +
      (nl ? '<p style="color:var(--muted);font-size:13.5px;margin:10px 4px 0">До ' + nl.name + ' — ' + (nl.from - D.count) + ' ' + plural(nl.from - D.count, 'визит', 'визита', 'визитов') + '.</p>' : '') + '</section>';
    h += '<section class="sec"><div class="ref"><b style="font-size:17px">Приведите ' + esc(W.friendAcc) + '</b><span style="color:var(--muted);font-size:14px">' + esc(W.him) + ' — ' + B.referral + ' бонусов на первый визит, вам — ' + B.referral + ' после ' + esc(W.his) + ' визита.</span><code>' + esc(code) + '</code><button class="btn primary block" type="button" data-act="share-ref" data-code="' + esc(code) + '">' + svg('share') + 'Поделиться</button></div></section>';
    h += '<section class="sec"><div class="sec-h"><h2>История</h2></div><div class="hist">' + D.history.map(x => '<div><span>' + esc(x.t) + '<small>' + esc(nice(x.d)) + '</small></span><span class="' + (x.v > 0 ? 'plus' : 'minus') + '">' + (x.v > 0 ? '+' : '−') + Math.abs(x.v).toLocaleString('ru-RU') + '</span></div>').join('') + '</div></section>';
    return h;
  }

  /* ---------- сертификат ---------- */
  const cert = { sum: 5000, style: 's2', to: '', msg: '' };
  function certCard(c, code) {
    return '<div class="cert ' + c.style + '"><div style="display:flex;justify-content:space-between;align-items:center"><span class="b">' + esc(A.name) + '</span><span class="code">' + (code ? esc(code) : 'Сертификат') + '</span></div>' +
      '<div><div class="sum">' + rub(c.sum) + '</div><div class="to">' + (c.to ? 'Кому: ' + esc(c.to) : 'Подарочный сертификат') + (c.msg ? ' · «' + esc(c.msg.slice(0, 60)) + '»' : '') + '</div></div></div>';
  }
  function certSheet() {
    sheet('<h2 class="h1">Подарочный сертификат</h2><div id="certPrev">' + certCard(cert) + '</div>' +
      '<p class="lbl">Сумма</p><div class="chips">' + [3000, 5000, 10000, 20000].map(v => '<button class="chip" style="padding:6px 16px" type="button" data-sum="' + v + '" aria-pressed="' + (cert.sum === v) + '">' + rub(v) + '</button>').join('') + '</div>' +
      '<p class="lbl">Оформление</p><div class="styles3">' + [['s1', 'Фирменный'], ['s2', 'Ночь'], ['s3', 'Золото']].map(([k, t]) => '<button type="button" class="cert ' + k + '" style="aspect-ratio:1;padding:0" data-style="' + k + '" aria-pressed="' + (cert.style === k) + '" aria-label="' + t + '"></button>').join('') + '</div>' +
      '<p class="lbl">Кому и пожелание</p><div style="display:grid;gap:10px"><label class="field">Имя получателя<input id="cTo" maxlength="30" value="' + esc(cert.to) + '" placeholder="Например, Саша"></label><label class="field">Пожелание<textarea id="cMsg" maxlength="120" placeholder="Пусть блестит!">' + esc(cert.msg) + '</textarea></label></div>' +
      '<button class="btn primary block" type="button" data-act="buy-cert" style="margin-top:16px">Оформить за ' + rub(cert.sum) + '</button><p style="color:var(--muted);font-size:12.5px;text-align:center;margin-top:8px">Демо: оплата картой или по СБП подключается при запуске</p>');
  }
  function buyCert() {
    const code = 'GIFT-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + String(Date.now()).slice(-4);
    const c = { ...cert, code, date: dstr(new Date()) }; D.certs.unshift(c); save(); buzz();
    sheet('<div class="done"><div class="ck">' + svg('check', 2.6) + '</div><h2 class="h1">Сертификат готов</h2></div>' + certCard(c, code) +
      '<div style="display:flex;justify-content:center;margin:16px 0"><div style="background:#fff;border-radius:14px;padding:8px;width:120px;height:120px">' + qrSvg('GIFT:' + code + ';' + c.sum) + '</div></div>' +
      '<button class="btn primary block" type="button" data-act="share-cert" data-code="' + code + '">' + svg('share') + 'Отправить ' + esc(W.friendTo) + '</button><button class="btn block" type="button" data-act="close" style="margin-top:8px">Готово</button>');
  }

  /* ---------- профиль ---------- */
  function profile() {
    const up = upcoming();
    let h = '<div class="pro" style="margin-bottom:18px"><span class="av">' + esc(D.profile.name[0] || '•') + '</span><div style="flex:1"><b>' + esc(D.profile.name) + '</b><small>' + esc(D.profile.phone) + ' · ' + level().name + '</small></div><button class="btn small" type="button" data-act="edit">Изменить</button></div>';
    h += '<section><div class="sec-h"><h2>Мои записи</h2></div><div style="display:grid;gap:10px">' + (up.length ? up.map(b => '<div class="bk"><span class="w">' + esc(nice(b.date)) + ', ' + fromMin(b.startMin) + '</span><span>' + esc(b.serviceName) + ' · ' + esc(carName(carById(b.carId))) + '</span><small>' + (b.status === 'confirmed' ? 'Подтверждена ✓' : 'Ждёт подтверждения') + '</small><div class="row"><button class="btn small" type="button" data-act="ics" data-id="' + b.id + '">' + svg('cal') + 'В календарь</button><button class="btn small" type="button" data-act="cancel" data-id="' + b.id + '">Отменить</button></div></div>').join('') : '<div class="hint">Записей пока нет</div>') + '</div></section>';
    h += '<section class="sec"><div class="sec-h"><h2>Сертификаты</h2><button type="button" data-act="cert">Подарить</button></div>' + (D.certs.length ? '<div style="display:grid;gap:10px">' + D.certs.map(c => certCard(c, c.code)).join('') + '</div>' : '<div class="hint">Подарочных сертификатов пока нет</div>') + '</section>';
    h += '<section class="sec"><div class="menu">' +
      '<label><span class="t">Статус ремонта<small>Этапы и смета — уведомлением</small></span><input class="sw" type="checkbox" data-set="status"' + (D.settings.status ? ' checked' : '') + '></label>' +
      '<label><span class="t">Напоминать о записи и ТО<small>Накануне и за 2 часа</small></span><input class="sw" type="checkbox" data-set="remind"' + (D.settings.remind ? ' checked' : '') + '></label>' +
      '<label><span class="t">Акции и новости<small>Не чаще раза в неделю</small></span><input class="sw" type="checkbox" data-set="news"' + (D.settings.news ? ' checked' : '') + '></label>' +
      (A.phone ? '<a href="' + telHref() + '">' + svg('phone') + '<span class="t">Позвонить ' + esc(W.placeTo) + '<small>' + esc(A.phone) + '</small></span></a>' : '') +
      (A.telegram ? '<a href="' + esc(A.telegram) + '" target="_blank" rel="noopener">' + svg('chat') + '<span class="t">Написать в Telegram</span></a>' : '') +
      '<a href="' + route() + '" target="_blank" rel="noopener">' + svg('pin') + '<span class="t">Как добраться<small>' + esc(A.address) + '</small></span></a>' +
      (A.site ? '<a href="' + esc(A.site) + '" target="_blank" rel="noopener">' + svg('arrow') + '<span class="t">Сайт и цены</span></a>' : '') +
      '<button type="button" data-act="install">' + svg('dl') + '<span class="t">Приложение на экран телефона<small>Без App Store и Google Play</small></span></button></div></section>';
    if (A.demo) h += '<section class="sec"><p class="demo-note">Это демо-приложение: данные хранятся только на этом телефоне. <button type="button" data-act="reset" style="border:0;background:none;color:var(--accent);font-weight:700;padding:0">Начать демо заново</button></p></section>';
    return h;
  }

  /* ---------- события ---------- */
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) { if (e.target.id === 'sheet') closeSheet(); return; }
    const a = t.dataset.act;
    if (t.dataset.tab) { closeSheet(); if (t.dataset.tab === 'book' && st.tab !== 'book') st.bk = { svc: null, car: st.bk.car, date: null, time: null, note: '' }; go(t.dataset.tab); }
    else if (a === 'book-car') { st.bk = { svc: svcById(t.dataset.svc) ? t.dataset.svc : null, car: t.dataset.id, date: null, time: null, note: '' }; go('book'); }
    else if (t.dataset.svc && !a) { buzz(); st.bk.svc = t.dataset.svc; st.bk.time = null; render(); $('#view').scrollTop = 0; }
    else if (t.dataset.car) { buzz(); st.bk.car = t.dataset.car; render(); }
    else if (t.dataset.date) { buzz(); st.bk.date = t.dataset.date; st.bk.time = null; render(); }
    else if (t.dataset.time) { buzz(); st.bk.time = Number(t.dataset.time); render(); }
    else if (t.dataset.sum) { cert.sum = Number(t.dataset.sum); certSheet(); }
    else if (t.dataset.style) { cert.style = t.dataset.style; certSheet(); }
    else if (t.dataset.rate) { const n = +t.dataset.rate; document.querySelectorAll('.rate button').forEach((x, i) => x.classList.toggle('on', i < n)); const o = $('#rateOut');
      if (o) o.innerHTML = n >= 4 ? '<p style="text-align:center;color:var(--muted);margin:10px 0">Спасибо! Поделитесь на картах — это помогает нам.</p>' + (A.review ? '<a class="btn primary block" href="' + esc(A.review) + '" target="_blank" rel="noopener">' + svg('star') + 'Оставить отзыв</a>' : '') + '<button class="btn block" type="button" data-act="close" style="margin-top:8px">Готово</button>'
        : '<p style="text-align:center;color:var(--muted);margin:10px 0">Нам жаль. Руководитель свяжется с вами и во всём разберётся.</p><button class="btn primary block" type="button" data-act="close">Отправить</button>'; }
    else if (a === 'change-svc') { st.bk.svc = null; st.bk.time = null; render(); }
    else if (a === 'confirm') { st.bk.note = ($('#bNote') || {}).value || ''; confirmSheet(); }
    else if (a === 'do-book') doBook();
    else if (a === 'close') closeSheet();
    else if (a === 'home') { closeSheet(); go('home'); }
    else if (a === 'ics') ics(t.dataset.id);
    else if (a === 'approve') approve();
    else if (a === 'pickup') pickup();
    else if (a === 'order') orderSheet(t.dataset.id);
    else if (a === 'history') { go('garage'); setTimeout(() => { const el = $('.hist'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }
    else if (a === 'add-car') carForm();
    else if (a === 'save-car') {
      const v = id => ($(id) || {}).value || '', make = v('#fMake').trim(), model = v('#fModel').trim();
      if (!make || !model) { toast('Укажите марку и модель'); return; }
      const mil = parseInt(v('#fMil').replace(/\D/g, ''), 10) || 0, id = t.dataset.id;
      const c = id ? D.cars.find(x => x.id === id) : null;
      const data = { make, model, year: parseInt(v('#fYear'), 10) || '', plate: v('#fPlate').trim().toUpperCase(), mileage: mil };
      if (c) Object.assign(c, data); else { const n = { id: 'c' + Date.now().toString(36), toEvery: 10000, lastTo: Math.floor(mil / 10000) * 10000, ...data }; D.cars.push(n); st.bk.car = n.id; }
      save(); closeSheet(); render(); toast('Автомобиль сохранён');
    }
    else if (a === 'mileage') { const c = carById(t.dataset.id); sheet('<h2 class="h1">Пробег</h2><p style="color:var(--muted);margin:-6px 0 14px">' + esc(carName(c)) + ' — подскажем, когда пора на ТО</p><label class="field">Сейчас на одометре, км<input id="fMil2" inputmode="numeric" maxlength="7" value="' + c.mileage + '"></label><button class="btn primary block" type="button" data-act="save-mil" data-id="' + c.id + '" style="margin-top:16px">Сохранить</button>'); }
    else if (a === 'save-mil') { const c = carById(t.dataset.id), m = parseInt((($('#fMil2') || {}).value || '').replace(/\D/g, ''), 10); if (m) { c.mileage = m; save(); } closeSheet(); render(); toast(toLeft(c) ? 'До ТО ' + km(toLeft(c)) : 'Пора на ТО — запишитесь'); }
    else if (a === 'promo') { const p = A.promos[+t.dataset.i]; sheet((p.photo ? '<img class="sheet-img" src="' + esc(p.photo) + '" alt="">' : '') + '<h2 class="h1">' + esc(p.title) + '</h2><p style="margin-bottom:16px">' + esc(p.text) + '</p>' + (p.more ? '<p style="color:var(--muted);margin-bottom:16px">' + esc(p.more) + '</p>' : '') + '<button class="btn primary block" type="button" data-tab="book">Записаться</button>'); }
    else if (a === 'photo') { const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img src="' + esc(t.dataset.src) + '" alt="Работа ' + esc(A.name) + '">'; lb.onclick = () => lb.remove(); $('#app').appendChild(lb); }
    else if (a === 'cert') certSheet();
    else if (a === 'buy-cert') { cert.to = ($('#cTo') || {}).value || ''; cert.msg = ($('#cMsg') || {}).value || ''; buyCert(); }
    else if (a === 'share-cert' || a === 'share-ref') {
      const text = a === 'share-cert' ? 'Дарю тебе сертификат в «' + A.name + '»! Код: ' + t.dataset.code : 'Записывайся в «' + A.name + '» с моим кодом ' + t.dataset.code + ' — получишь ' + B.referral + ' бонусов на первый визит';
      if (navigator.share) navigator.share({ text }).catch(() => {}); else { try { navigator.clipboard.writeText(text); toast('Текст скопирован — вставьте в мессенджер'); } catch (x) { toast(text); } }
    }
    else if (a === 'notif') sheet('<h2 class="h1">Уведомления</h2><div class="menu">' + (D.live ? '<div class="nt"><b>' + (D.live.stage === 2 && !D.live.approved ? 'Смета готова — нужно согласовать' : D.live.stage >= 4 ? 'Автомобиль готов' : 'Статус: ' + STAGES[D.live.stage]) + '</b><small>' + esc(carName(carById(D.live.carId))) + ' · ' + esc(D.live.serviceName) + '</small></div>' : '') +
      '<div class="nt"><b>Скоро ТО</b><small>' + esc(carName(D.cars[0])) + ': до ТО ' + km(toLeft(D.cars[0])) + '</small></div><div class="nt"><b>+' + (D.history[0] || {}).v + ' бонусов</b><small>За визит — спасибо, что выбираете нас</small></div></div>');
    else if (a === 'edit') sheet('<h2 class="h1">Ваши данные</h2><div style="display:grid;gap:10px"><label class="field">Имя<input id="pName" maxlength="40" value="' + esc(D.profile.name) + '"></label><label class="field">Телефон<input id="pPhone" type="tel" maxlength="24" value="' + esc(D.profile.phone) + '"></label></div><button class="btn primary block" type="button" data-act="save-profile" style="margin-top:16px">Сохранить</button>');
    else if (a === 'save-profile') { D.profile.name = ($('#pName').value || '').trim() || D.profile.name; D.profile.phone = ($('#pPhone').value || '').trim() || D.profile.phone; save(); closeSheet(); render(); toast('Сохранено'); }
    else if (a === 'cancel') {
      if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно отменить?'; setTimeout(() => { if (t.isConnected) { t.classList.remove('armed'); t.textContent = 'Отменить'; } }, 4000); return; }
      const b = D.bookings.find(x => x.id === t.dataset.id); if (b) { b.status = 'cancelled'; save(); render(); toast('Запись отменена'); }
    }
    else if (a === 'again') { const v = D.visits.find(x => x.id === t.dataset.id); closeSheet(); if (v) { const s = A.services.find(x => v.works.some(w => w.t === x.name)); st.bk = { svc: s ? s.id : null, car: v.carId, date: null, time: null, note: '' }; go('book'); } }
    else if (a === 'install') sheet('<h2 class="h1">На экран телефона</h2><p style="margin-bottom:12px"><b>iPhone:</b> Safari → «Поделиться» → «На экран „Домой“».</p><p style="margin-bottom:16px"><b>Android:</b> Chrome → меню ⋮ → «Установить приложение».</p><button class="btn primary block" type="button" data-act="close">Понятно</button>');
    else if (a === 'reset') { if (!t.classList.contains('armed')) { t.classList.add('armed'); t.textContent = 'Точно начать заново?'; return; } try { localStorage.removeItem(KEY); } catch (x) { /* нет */ } D = seed(); save(); go('home'); }
  });
  document.addEventListener('change', e => { const k = e.target.dataset && e.target.dataset.set; if (k) { D.settings[k] = e.target.checked; save(); toast(e.target.checked ? 'Включено' : 'Выключено'); } });
  document.addEventListener('input', e => { if (e.target.id === 'cTo' || e.target.id === 'cMsg') { cert.to = $('#cTo').value; cert.msg = $('#cMsg').value; const p = $('#certPrev'); if (p) p.innerHTML = certCard(cert); } if (e.target.id === 'bNote') st.bk.note = e.target.value; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

  /* заставка с логотипом — один раз за сеанс */
  const sp = $('#splash');
  if (sp) { let seen = false; try { seen = sessionStorage.getItem(KEY + '.splash'); sessionStorage.setItem(KEY + '.splash', '1'); } catch (e) { /* нет */ }
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) sp.remove(); else { sp.querySelector('b').textContent = A.name; if (A.mark) sp.querySelector('img').src = A.mark; else sp.querySelector('img').remove(); setTimeout(() => sp.classList.add('out'), 1100); setTimeout(() => sp.remove(), 1700); } }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { /* офлайн необязателен */ });
  render();
  window.__app = { st, go, D: () => D };
})();
