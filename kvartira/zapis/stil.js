/* Основа «стиля записи» (подключает tools/booking.mjs, если для theme.style сайта есть стили/<стиль>.css): запись — продолжение сайта, а не приложение.
   Делает: шапку как у сайта (логотип, разделы записи, телефон, «На сайт») вместо шапки приложения; кнопку «Назад» и вкладки переносит в неё;
   на <html> ставит data-step (1, 2, 3, done) и data-tab — по ним стиль меняет подачу; после каждого изменения записи зовёт хуки стиля (Z.use).
   Механику записи (store.js, app.js) не трогает: только читает window.__app и украшает то, что app.js уже нарисовал. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let data = {};
  try { data = JSON.parse(($('#zSite') || {}).textContent || '{}'); } catch (e) { /* без данных сайта — только название */ }
  const app = $('#app'), A = () => window.__app;
  if (!app || !A()) return;
  const pad = n => String(n).padStart(2, '0');
  const WD = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const parseD = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
  /* «*курсив*» из текстов сайта → <em> (как в заголовках сайта) */
  const ital = s => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
  /* записывает html, только если он изменился: наблюдатель не зацикливается */
  const put = (el, html) => { if (el && el.innerHTML !== html) el.innerHTML = html; };

  /* состояние записи — то, что выбрал клиент */
  function state() {
    const { st, S } = A(), s = st.sel || {};
    const svc = s.svc ? S.services.find(x => x.id === s.svc) : null;
    const master = s.master && s.master !== 'any' && S.masters ? S.masters.find(m => m.id === s.master) : null;
    const dur = svc ? Number(svc.duration) || 0 : 0;
    return {
      step: st.step, tab: st.ctab, svc, master, anyMaster: !!(S.masters && S.masters.length) && !master, date: s.date || null, time: s.time == null ? null : s.time, dur,
      dateText: s.date ? (d => d.getDate() + ' ' + MON[d.getMonth()] + ', ' + WD[d.getDay()])(parseD(s.date)) : '',
      timeText: s.time == null ? '' : pad(Math.floor(s.time / 60)) + ':' + pad(s.time % 60),
      endText: s.time == null || !dur ? '' : (e => pad(Math.floor(e / 60) % 24) + ':' + pad(e % 60))(s.time + dur),
      cfg: S.cfg
    };
  }

  /* шапка как у сайта: booking.mjs кладёт её в разметку; если её нет (старая сборка) — строим здесь */
  let head = $('.z-head');
  if (!head) {
    head = document.createElement('header');
    head.className = 'z-head';
    const tel = data.phone ? '<a class="z-tel" href="tel:' + esc(String(data.phone).replace(/[^\d+]/g, '')) + '">' + esc(data.phone) + '</a>' : '';
    head.innerHTML = '<div class="z-head-in"><span class="z-back-slot"></span><a class="z-logo" href="' + esc(data.home || '../') + '" aria-label="' + esc(data.name) + ' — на сайт"><span>' + esc(data.name) + '</span></a>' +
      '<span class="z-now" aria-hidden="true"></span><span class="z-nav-slot"></span>' + tel + '<a class="z-home" href="' + esc(data.home || '../') + '"><span>На сайт</span></a></div>';
    app.insertBefore(head, app.firstChild);
    if ($('#backBtn')) $('.z-back-slot', head).replaceWith($('#backBtn'));
    if ($('#tabbar')) $('.z-nav-slot', head).replaceWith($('#tabbar'));
  }
  document.documentElement.classList.add('z-on');

  const hooks = [];
  let queued = false;
  function sync() {
    queued = false;
    const s = state(), root = document.documentElement;
    if (root.dataset.step !== String(s.step)) root.dataset.step = s.step;
    if (root.dataset.tab !== s.tab) root.dataset.tab = s.tab;
    root.classList.toggle('z-picked', !!s.svc);
    for (const h of hooks) { try { h(s); } catch (e) { console.warn('стиль записи:', e); } }
    root.classList.remove('z-wait');
  }
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(sync); } };
  new MutationObserver(later).observe(app, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'aria-pressed', 'aria-current'] });
  document.addEventListener('input', later);

  /* now() — первая подача сразу, в том же проходе (до отрисовки): booking.mjs зовёт её в конце stil.js, после стиля */
  window.Z = { data, $, esc, ital, put, state, use(h) { hooks.push(h); later(); }, now: sync };
})();

/* Стиль записи «Квартирник»: «Сейчас играет» в шапке, пластинка с выбранным треком, стороны А/Б/бис, итог — билет с номером. Поверх base.js (window.Z). */
(function () {
  'use strict';
  const Z = window.Z; if (!Z) return;
  const { $, esc, put, data } = Z;
  const hero = $('#hero');
  const top = document.createElement('div');
  top.className = 'z-hero';
  top.innerHTML = '<div class="z-lp" aria-hidden="true"><b></b><small>LP · ' + esc(data.name) + '</small></div><h2 class="z-title">' + esc((data.title || data.name).replace(/\*/g, '')) + '</h2>' +
    (data.script ? '<p class="z-script">' + esc(data.script) + '</p>' : '') + (data.plate ? '<p class="z-plate">' + esc(data.plate) + '</p>' : '') + '<dl class="z-play"></dl>';
  if (hero) hero.insertBefore(top, $('.team', hero) || $('.hero-actions', hero) || null);
  const now = ['Сторона А', 'Сторона Б', 'Бис', 'Билет на руках'];
  const steps = ['А · Трек', 'Б · Мастер и время', 'Бис · Билет'];
  const H = { p1: 'Трек-лист<em>что делаем</em>', p2: 'Состав<em>кто и когда</em>', p3: 'Билет<em>на ваше имя</em>' };
  Z.use(s => {
    const i = s.step === 'done' ? 3 : Math.max(0, (Number(s.step) || 1) - 1);
    put($('.z-now'), '<i></i><span>Сейчас играет:</span> <b>' + now[i] + '</b>');
    document.querySelectorAll('#prog span').forEach((el, k) => put(el, steps[k]));
    for (const id in H) put($('#' + id + ' .step-h h2'), H[id]);
    put($('.z-lp b'), s.svc ? esc(s.svc.name) : esc(data.name));
    const row = (on, k, v) => '<div class="' + (on ? 'on' : '') + '"><dt>' + k + '</dt><dd>' + v + '</dd></div>';
    const who = s.master ? esc(s.master.name) + (s.master.role ? '<small>' + esc(s.master.role) + '</small>' : '') : s.time != null && s.anyMaster ? 'Кто свободен' : '';
    put($('.z-play'),
      row(!!s.svc, 'Трек', s.svc ? esc(s.svc.name) + '<small>' + esc(s.dur) + ' мин</small>' : 'не выбран') +
      row(!!who, 'Мастер', who || 'любой из состава') +
      row(s.time != null, 'Время', s.time != null ? esc(s.timeText) + '<small>' + esc(s.dateText) + '</small>' : 'день и время'));
    if (s.step === 'done') {
      put($('#p4 h2'), 'Вход<em>по записи</em>');
      const t = $('#p4 .ticket'), mine = (window.__app.S.mine || []).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
      const no = mine && mine.id ? String(mine.id).replace(/\D/g, '').slice(-4).padStart(4, '0') : '';
      const label = 'Билет · ' + data.name + (no ? ' · № ' + no : '');
      if (t && t.dataset.pass !== label) t.dataset.pass = label;
    }
  });
})();

window.Z && window.Z.now();
