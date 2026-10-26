/* Tochka, английская страница: шапка при прокрутке, появление блоков, журнал записей на первом экране,
   прокрутка экранов в рамках устройств, нижняя панель на телефоне, заявка → письмо в почтовой программе. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* переходы по ссылкам внутри страницы: сначала снять «ленивую раскладку» (общие стили site.css), иначе переход промахивается */
  const cvAll = () => document.documentElement.classList.add('cv-all');
  if (location.hash) { cvAll(); addEventListener('load', () => { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }, { once: true }); }
  document.addEventListener('pointerdown', e => { if (e.target.closest && e.target.closest('a[href^="#"]')) cvAll(); }, { capture: true, passive: true });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest && e.target.closest('a[href^="#"]')) cvAll(); }, true);
  addEventListener('hashchange', () => { if (document.documentElement.classList.contains('cv-all')) return; cvAll(); const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); });
  // заявка уходит в WhatsApp (текст подставляется сам) или Telegram (текст копируем, чат открываем) — почты у студии пока нет
  const WA = '79130364962', TG = 'opiumxxxxl';

  const top = $('#top'), dock = $('#dock');
  const onScroll = () => { const y = scrollY; top.classList.toggle('on', y > 20); if (dock) dock.classList.toggle('on', y > innerHeight * .8); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('[data-r]').forEach(el => io.observe(el));

  const play = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('play', e.isIntersecting)), { threshold: .25 });
  $$('.card, .get-stage').forEach(el => play.observe(el));

  // живые экраны: длинный снимок прокручивается в рамке, пока экран виден (тот же механизм, что на русской главной: .dv-roll в site.css)
  const lives = $$('.dv-live');
  if (!calm && lives.length && 'IntersectionObserver' in window) {
    lives.forEach(el => {
      const img = $('img', el); if (!img || el.querySelector('.dv-roll')) return;
      const r = document.createElement('div'); r.className = 'dv-roll'; img.replaceWith(r); r.appendChild(img);
      const go = () => {
        const s = el.getBoundingClientRect(), k = img.naturalHeight / img.naturalWidth * (s.width || 1) / (s.height || 1);
        el.style.setProperty('--dur', Math.min(22, Math.max(8, k * 2.4)).toFixed(1) + 's'); el.classList.add('on');
      };
      if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
    });
    const ioL = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('run', e.isIntersecting)), { threshold: .2 });
    lives.forEach(el => ioL.observe(el));
  }

  // журнал записей: пример недели, записи после закрытия помечены
  const BOOK = [
    ['Mon 11:42 PM', 'Fade + beard trim', 'with Danny · Thu 10:30 AM', true],
    ['Tue 6:05 AM', 'New patient visit', 'with Maya · Fri 7:30 AM', true],
    ['Tue 12:18 PM', 'Signature facial', 'with Joanna · Sat 9:00 AM', false],
    ['Tue 9:51 PM', 'Kids\' cut', 'with Theo · Sat 11:00 AM', true],
    ['Wed 2:37 PM', 'Cleaning and exam', 'with Dr. Ferreira · Wed 6:00 PM', false],
    ['Wed 10:26 PM', 'Consultation', 'with Elena · Tue 11:30 AM', true],
    ['Thu 7:14 AM', 'Hot towel shave', 'with Marcus · Thu 5:15 PM', true],
    ['Thu 1:03 PM', 'Whitening', 'with Dr. Ashby · Mon 8:00 AM', false],
    ['Fri 11:58 PM', 'Classic cut', 'any barber · Sat 10:00 AM', true],
    ['Sat 8:20 AM', 'Microneedling', 'with Joanna · Tue 2:00 PM', true]
  ];
  const list = $('#lgList'), cnt = $('#lgCount'), night = $('#lgNight');
  if (list) {
    let i = 0, n = 0, k = 0;
    const add = first => {
      const b = BOOK[i % BOOK.length]; i++; n++; if (b[3]) k++;
      const li = document.createElement('li'); if (first) li.className = 'pre';
      li.innerHTML = `<span class="lg-t">${b[0]}</span><span class="lg-s">${b[1]}<small>${b[2]}</small></span><span class="lg-f${b[3] ? ' n' : ''}">${b[3] ? 'after hours' : 'booked'}</span>`;
      list.appendChild(li);
      while (list.children.length > 6) list.removeChild(list.firstChild);
      cnt.textContent = n; night.textContent = k;
    };
    for (let j = 0; j < 4; j++) add(true);
    if (!calm) setInterval(() => { if (!document.hidden) add(false); }, 2600);
  }

  // заявка → готовое сообщение в WhatsApp или Telegram
  const form = $('#startForm'), note = $('#startNote');
  let to = 'wa';
  if (form) {
    form.querySelectorAll('button[data-to]').forEach(b => b.addEventListener('click', () => { to = b.dataset.to; }));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const f = new FormData(form);
      const text = `Hi! I'd like a free demo.\nBusiness: ${f.get('biz') || ''}\nCity: ${f.get('city') || ''}\nLink: ${f.get('link') || ''}\nPackage: ${f.get('pk') || ''}`;
      note.classList.remove('warn');
      if (to === 'wa') { window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener'); note.textContent = 'WhatsApp opened with your request. Just tap Send.'; return; }
      let ok = false; try { await navigator.clipboard.writeText(text); ok = true; } catch (err) { /* без доступа к буферу — подскажем */ }
      window.open(`https://t.me/${TG}`, '_blank', 'noopener');
      note.textContent = ok ? 'Request copied. Paste it into the Telegram chat and send.' : 'Telegram opened. Tell us your business name and city, and we take it from there.';
    });
  }

  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
