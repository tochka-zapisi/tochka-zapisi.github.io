/* Шаблон «Лендинг»: карта по нажатию, цели Яндекс Метрики (звонок, мессенджер, запись, маршрут), уведомление о cookie. Без зависимостей. */
(function () {
  var map = document.querySelector('.map[data-src]');
  if (map) map.addEventListener('click', function (e) {
    if (!e.target.closest('.map-load')) return;
    var f = document.createElement('iframe');
    f.src = map.getAttribute('data-src'); f.title = 'Карта проезда'; f.allowFullscreen = true;
    map.appendChild(f);
  });

  var ym = document.body.getAttribute('data-ym');
  if (ym) document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || typeof window.ym !== 'function') return;
    var h = a.getAttribute('href');
    var goal = /^tel:/.test(h) ? 'call' : a.hasAttribute('data-booking') ? 'booking'
      : /t\.me|wa\.me|max\.ru|vk\.com/.test(h) ? 'messenger' : /rtext=|maps/.test(h) ? 'route' : '';
    if (goal) window.ym(+ym, 'reachGoal', goal);
  });

  var c = document.querySelector('.cookie');
  if (c) {
    var ok = null;
    try { ok = localStorage.getItem('cookie-ok'); } catch (e) { /* хранилище недоступно */ }
    if (!ok) c.hidden = false;
    c.querySelector('button').addEventListener('click', function () {
      c.hidden = true;
      try { localStorage.setItem('cookie-ok', '1'); } catch (e) { /* не страшно */ }
    });
  }
})();
