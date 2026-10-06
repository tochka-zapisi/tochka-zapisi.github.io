/* Сайт студии: шапка при прокрутке, появление блоков, кнопка «Демо» на телефоне, калькулятор заявки → готовое сообщение в WhatsApp / Telegram. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const top = $('#top'), fab = $('.fab'), start = $('#start');
  const onScroll = () => {
    top.classList.toggle('on', scrollY > 20);
    if (fab) { const r = start.getBoundingClientRect(); fab.classList.toggle('on', scrollY > 600 && (r.top > innerHeight || r.bottom < 0)); }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* появление: соседние блоки — с небольшой задержкой друг за другом */
  const els = $$('[data-r]');
  els.forEach(el => { const sib = el.parentElement ? $$(':scope > [data-r]', el.parentElement) : []; const i = sib.indexOf(el); if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 90 + 'ms'); });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('in'));

  /* калькулятор заявки */
  const fmt = n => n.toLocaleString('ru-RU') + ' ₽';
  const niche = () => ($('#niche [aria-pressed="true"]') || {}).textContent || '';
  function calc() {
    const plan = $('#plan input:checked'), extras = $$('#extra input:checked');
    const sum = (+plan.dataset.p || 0) + extras.reduce((a, x) => a + (+x.dataset.p || 0), 0);
    $('#sum').textContent = fmt(sum);
    const biz = ($('#biz').value || '').trim();
    const text = 'Здравствуйте! Хочу бесплатное демо.\nБизнес: ' + niche() + (biz ? ' — ' + biz : '') + '\nНужно: ' + plan.value + (extras.length ? ', ' + extras.map(x => x.value).join(', ') : '') + '\nОриентир по цене: от ' + fmt(sum);
    $('#sendWa').href = 'https://wa.me/79333399483?text=' + encodeURIComponent(text);
    return text;
  }
  $('#niche').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('#niche button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); calc(); });
  $('#calc').addEventListener('input', calc);
  $('#calc').addEventListener('change', calc);
  $('#sendTg').addEventListener('click', () => { const t = calc(); try { navigator.clipboard.writeText(t); } catch (e) { /* нет доступа */ } });
  /* «Выбрать» у пакета — отмечает его в калькуляторе */
  $$('[data-plan]').forEach(a => a.addEventListener('click', () => { const r = $('#plan input[value="' + a.dataset.plan + '"]'); if (r) { r.checked = true; calc(); } }));
  calc();
  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();
})();
