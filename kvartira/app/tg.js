/* Приложение клиента внутри Telegram (Telegram Mini App) — общий файл шаблонов приложений, копирует tools/clientapp.mjs.
   Вне Telegram ничего не делает и ничего не загружает. Внутри (бот открывает ссылку кнопкой web_app; Telegram добавляет в адрес #tgWebAppData…,
   для проверки в браузере — ?tg=1) подключает telegram-web-app.js и:
   — разворачивает приложение на весь экран, красит шапку и фон Telegram в цвета приложения;
   — главная кнопка Telegram внизу «Записаться» (на вкладке записи прячется — там свой шаг «Далее»);
   — кнопка «Назад» в шапке: закрывает окно или возвращает на главную;
   — лёгкая вибрация на нажатиях; имя клиента — из Telegram (в демо — вместо «Андрея»);
   — заставка не показывается (Telegram показывает свою).
   MAX (07.10.2026; бот MAX открывает адрес приложения с ?max=1): подключает st.max.ru/js/max-web-app.js (window.WebApp) — «Назад», вибрация, имя;
   своей главной кнопки у MAX нет — «Записаться» рисуется внизу страницы. Запасной путь на случай замедления или блокировки Telegram в России. */
(function () {
  const demo = /[?&]tg=demo\b/.test(location.search);
  const inMax = /[?&]max=1\b/.test(location.search) || (/WebAppData/.test(location.hash) && !/tgWebApp/.test(location.hash));
  const inTg = demo || inMax || /tgWebApp/.test(location.hash) || /[?&]tg=1\b/.test(location.search);
  if (!inTg) return;
  document.documentElement.classList.add('in-tg');
  const sp = document.getElementById('splash'); if (sp) sp.remove();
  if (demo) { window.Telegram = { WebApp: mock() }; start(); return; }
  const s = document.createElement('script');
  s.src = inMax ? 'https://st.max.ru/js/max-web-app.js' : 'https://telegram.org/js/telegram-web-app.js';
  s.onload = start;
  document.head.appendChild(s);

  /* главная кнопка внизу страницы — там, где у мессенджера своей нет (MAX) */
  function pageMain() {
    const app = document.getElementById('app');
    const c = document.createElement('style');
    c.textContent = '.tg-main{flex:none;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));background:var(--bg)}.tg-main button{width:100%;min-height:48px;border:0;border-radius:12px;font:600 16px system-ui,sans-serif;background:var(--accent);color:var(--accent-ink)}.tg-main[hidden]{display:none}';
    document.head.appendChild(c);
    const main = document.createElement('div'); main.className = 'tg-main'; main.hidden = true; main.innerHTML = '<button type="button">Записаться</button>';
    app.appendChild(main);
    const btn = main.querySelector('button');
    return { setParams(p) { if (p.text) btn.textContent = p.text; if (p.color) btn.style.background = p.color; if (p.text_color) btn.style.color = p.text_color; }, onClick(f) { btn.onclick = f; }, show() { main.hidden = false; }, hide() { main.hidden = true; } };
  }

  /* ?tg=demo — показать в обычном браузере, как приложение выглядит в Telegram: шапка с «Назад» и главная кнопка внизу ведут себя как настоящие */
  function mock() {
    const app = document.getElementById('app'), A = window.APP || {};
    const st = document.createElement('style');
    st.textContent = '.tg-head{display:flex;align-items:center;gap:10px;min-height:52px;padding:0 12px;background:#17212b;color:#fff;font:600 16px/1.2 system-ui,sans-serif;flex:none}' +
      '.tg-head button{border:0;background:none;color:#fff;font:500 15px system-ui,sans-serif;padding:8px 4px;visibility:hidden}.tg-head b{flex:1;text-align:center;margin-right:58px}.tg-head small{display:block;font-weight:400;font-size:12px;opacity:.6}' +
      '.tg-main{flex:none;padding:8px 12px calc(8px + env(safe-area-inset-bottom,0px));background:#17212b}.tg-main button{width:100%;min-height:48px;border:0;border-radius:12px;font:600 16px system-ui,sans-serif;background:#2ea6ff;color:#fff}.tg-main[hidden]{display:none}';
    document.head.appendChild(st);
    const head = document.createElement('div'); head.className = 'tg-head';
    head.innerHTML = '<button type="button">‹ Назад</button><b>' + String(A.name || 'Приложение').replace(/</g, '&lt;') + '<small>мини-приложение</small></b>';
    const main = document.createElement('div'); main.className = 'tg-main'; main.hidden = true; main.innerHTML = '<button type="button">Записаться</button>';
    app.insertBefore(head, app.firstChild); app.appendChild(main);
    const back = head.querySelector('button'), btn = main.querySelector('button');
    return {
      ready() {}, expand() {}, setBackgroundColor() {}, setBottomBarColor(c) { main.style.background = c; },
      setHeaderColor(c) {
        head.style.background = c;
        /* как Telegram: текст шапки тёмный на светлом фоне и светлый на тёмном */
        const m = /^#([0-9a-f]{6})$/i.exec(c), n = m ? parseInt(m[1], 16) : 0;
        const light = m && ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) > 150;
        head.style.color = light ? '#111' : '#fff'; back.style.color = light ? '#111' : '#fff';
        head.style.borderBottom = '1px solid ' + (light ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.08)');
      },
      initDataUnsafe: { user: { id: 1, first_name: 'Ирина' } },
      MainButton: { setParams(p) { if (p.text) btn.textContent = p.text; if (p.color) btn.style.background = p.color; if (p.text_color) btn.style.color = p.text_color; }, onClick(f) { btn.onclick = f; }, show() { main.hidden = false; }, hide() { main.hidden = true; } },
      BackButton: { onClick(f) { back.onclick = f; }, show() { back.style.visibility = 'visible'; }, hide() { back.style.visibility = 'hidden'; } },
      HapticFeedback: { impactOccurred() {} }
    };
  }

  function start() {
    const tg = (window.Telegram && window.Telegram.WebApp) || (inMax && window.WebApp), app = window.__app;
    if (!tg || !app) return;
    const css = getComputedStyle(document.documentElement);
    const bg = (css.getPropertyValue('--bg') || '').trim() || '#0d0d0f';
    const accent = (css.getPropertyValue('--accent') || '').trim();
    const accentInk = (css.getPropertyValue('--accent-ink') || '').trim() || '#ffffff';
    try { if (tg.ready) tg.ready(); if (tg.expand) tg.expand(); } catch (e) { /* старый Telegram */ }
    try { if (tg.setHeaderColor) tg.setHeaderColor(bg); if (tg.setBackgroundColor) tg.setBackgroundColor(bg); if (tg.setBottomBarColor) tg.setBottomBarColor(bg); } catch (e) { /* старый Telegram, MAX */ }
    try { if (tg.disableVerticalSwipes) tg.disableVerticalSwipes(); } catch (e) { /* нет */ }

    /* имя клиента из Telegram — только если в профиле ещё демо-имя */
    const u = tg.initDataUnsafe && tg.initDataUnsafe.user;
    const D = app.D && app.D();
    if (u && u.first_name && D && D.profile && (!D.profile.tg || D.profile.tg !== u.id)) {
      D.profile.name = u.first_name; D.profile.tg = u.id; app.go(app.st.tab);
    }

    const MB = tg.MainButton || pageMain(), BB = tg.BackButton || { onClick() {}, show() {}, hide() {} };
    const sheet = document.getElementById('sheet');
    const hex6 = c => /^#[0-9a-f]{3}$/i.test(c) ? '#' + c.slice(1).split('').map(x => x + x).join('') : c;
    const p = { text: 'Записаться' };
    if (/^#[0-9a-f]{6}$/i.test(hex6(accent))) p.color = hex6(accent);
    if (/^#[0-9a-f]{6}$/i.test(hex6(accentInk))) p.text_color = hex6(accentInk);
    MB.setParams(p);
    MB.onClick(() => { haptic('medium'); app.go('book'); sync(); });
    BB.onClick(() => {
      haptic('light');
      if (sheet && !sheet.hidden) { sheet.hidden = true; sheet.innerHTML = ''; } else app.go('home');
      sync();
    });
    function sync() {
      const open = sheet && !sheet.hidden, tab = app.st.tab;
      if (tab === 'book' || open) MB.hide(); else MB.show();
      if (open || tab !== 'home') BB.show(); else BB.hide();
    }
    function haptic(kind) { try { tg.HapticFeedback.impactOccurred(kind); } catch (e) { /* нет */ } }
    /* вкладки и окна меняет app.js — следим за ними без правок шаблона */
    const mo = new MutationObserver(() => sync());
    if (sheet) mo.observe(sheet, { attributes: true, attributeFilter: ['hidden'] });
    const view = document.getElementById('view'); if (view) mo.observe(view, { childList: true });
    document.addEventListener('click', e => { if (e.target.closest('button, a')) haptic('light'); }, true);
    sync();
  }
})();
