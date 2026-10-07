/* Бюро «ОСЬ» — главная: плавная прокрутка, смена «день → вечер» в первом экране, проявление блоков,
   подсказка-картинка у списка проектов, калькулятор. Без JS всё читается: день, список, калькулятор не нужен. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && hasGsap) root.classList.add('anim');

  // ---- плавная прокрутка
  if (!reduce && window.Lenis && hasGsap) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href'); if (id.length < 2) return;
      const t = $(id); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: -10, duration: 1.4 });
    }));
  }

  // ---- герой: день -> вечер по прокрутке
  const night = $('.hero .night'), clock = $('#clock'), track = $('#track');
  const setClock = (p) => {
    const m0 = 12 * 60 + 40, m1 = 21 * 60 + 15, m = Math.round(m0 + (m1 - m0) * p);
    if (clock) clock.textContent = String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };
  if (night && track && hasGsap && !reduce) {
    ScrollTrigger.create({
      trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        night.style.clipPath = `inset(0 0 0 ${(100 - p * 100).toFixed(2)}%)`;
        setClock(p);
      },
    });
    gsap.from('.hero h1, .hero .sub, .hero-row', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15 });
  }

  // ---- колода проектов (компьютер): при прокрутке верхняя карточка уходит вверх, следующие выходят вперёд; на телефоне — карточки списком
  const dk = $('#dk');
  if (dk && hasGsap && !reduce && matchMedia('(min-width: 900px)').matches) {
    const cards = $$('.dk-card', dk), n = cards.length;
    dk.classList.add('dk-on');
    const lay = (p) => {
      const k = Math.min(1, Math.max(0, (p - 0.06) / 0.86)) * (n - 1);
      cards.forEach((c, i) => {
        const t = Math.min(1, Math.max(0, k - i)), d = Math.max(0, i - k);
        c.style.transform = `translate(-50%, calc(-50% + ${(d * 78).toFixed(1)}px)) translate3d(0, ${(-t * 120).toFixed(2)}vh, ${(-d * 110).toFixed(1)}px) rotateX(${(t * 12).toFixed(2)}deg)`;
        c.style.zIndex = String(n - i);
        c.style.setProperty('--dim', (Math.min(d, 2) * 0.22).toFixed(3));
        c.style.setProperty('--txt', (1 - Math.min(d, 1)).toFixed(3));
      });
    };
    ScrollTrigger.create({ trigger: dk, start: 'top top', end: 'bottom bottom', onUpdate: (st) => lay(st.progress) });
    lay(0);
  }

  // ---- проявление блоков
  if (hasGsap && !reduce) {
    $$('.rv').forEach((el) => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    // цифры в блоке фактов
    $$('.facts b[data-n]').forEach((b) => {
      const to = +b.dataset.n; const o = { v: 0 };
      ScrollTrigger.create({ trigger: b, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => (b.textContent = Math.round(o.v)) }) });
    });
  } else {
    $$('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
  }

  // ---- картинка-подсказка у списка проектов
  const peek = $('#peek');
  if (peek && matchMedia('(hover: hover)').matches) {
    const img = $('img', peek);
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => { x += (tx - x) * 0.18; y += (ty - y) * 0.18; peek.style.left = x + 'px'; peek.style.top = y + 'px'; raf = peek.classList.contains('on') ? requestAnimationFrame(loop) : 0; };
    $$('.prow.open').forEach((row) => {
      row.addEventListener('mouseenter', (e) => { img.src = row.dataset.peek; tx = x = e.clientX + 120; ty = y = e.clientY; peek.classList.add('on'); if (!raf) raf = requestAnimationFrame(loop); });
      row.addEventListener('mousemove', (e) => { tx = e.clientX + 140; ty = e.clientY - 20; });
      row.addEventListener('mouseleave', () => peek.classList.remove('on'));
    });
  }

  // ---- калькулятор
  const form = $('#calc');
  if (form) {
    const RATE = { bar: 1800, rest: 2000, cafe: 1500, club: 2200 };
    const NAME = { bar: 'бар', rest: 'ресторан', cafe: 'кофейня', club: 'клуб' };
    const fmt = (n) => Math.round(n / 1000) * 1000;
    const rub = (n) => fmt(n).toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
    const area = $('#area'), out = $('#areaOut'), sum = $('#sum'), dl = $('#dl');
    let message = '';
    function calc() {
      const kind = $('input[name=kind]:checked').value, a = +area.value;
      const picked = $$('input[type=checkbox]:checked', form).map((i) => i.value);
      out.textContent = a + ' м²';
      const rows = []; let total = 0, wMin = 0, wMax = 0;
      const rate = RATE[kind];
      if (picked.includes('concept')) { const v = rate * a; total += v; wMin += 3; wMax += 4; rows.push(['Концепция', rub(v)]); }
      if (picked.includes('docs')) { const v = rate * 0.9 * a; total += v; wMin += 4; wMax += 6; rows.push(['Рабочая документация', rub(v)]); }
      if (picked.includes('kit')) { const v = a * 30000 * 0.08; total += v; rows.push(['Комплектация (8% от закупки ~' + rub(a * 30000) + ')', rub(v)]); }
      if (picked.includes('sup')) { const months = Math.max(2, Math.ceil(a / 45) + 1); const v = months * 25000; total += v; rows.push(['Надзор, ' + months + ' мес.', rub(v)]); }
      sum.textContent = total ? 'от ' + rub(total) : '—';
      const wk = wMax ? `проектирование ${wMin}–${wMax} нед.` : 'срок — после брифа';
      dl.innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('') + `<dt>Срок</dt><dd>${wk}</dd>`;
      const what = $$('input[type=checkbox]:checked + label', form).map((l) => l.textContent.toLowerCase()).join(', ') || 'уточнить состав';
      message = `Здравствуйте! Хочу рассчитать проект: ${NAME[kind]}, ${a} м². Нужно: ${what}. Ориентир с сайта: ${total ? 'от ' + rub(total) : '—'}, ${wk}.`;
    }
    form.addEventListener('input', calc); calc();
    const note = $('#copied');
    $('#copy').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(message); note.textContent = 'Заявка скопирована — вставьте её в любой мессенджер.'; }
      catch { note.textContent = message; }
    });
    $('#send').addEventListener('click', () => {
      window.open('https://t.me/share/url?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(message), '_blank', 'noopener');
      note.textContent = 'Демо: в рабочем сайте кнопка отправит заявку в Telegram или MAX студии.';
    });
  }
})();
