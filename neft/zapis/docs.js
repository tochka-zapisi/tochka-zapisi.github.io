/* Подставляет данные бизнеса из настроек (window.Store.cfg) в страницы документов.
   Пустое поле показывается красным плейсхолдером «[ЗАПОЛНИТЬ: …]» — его ловит tools/audit.mjs. */
(function () {
  function fill() {
    var c = window.Store ? window.Store.cfg : {};
    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var val = String(c[el.getAttribute('data-cfg')] || '').trim();
      el.textContent = val || '[ЗАПОЛНИТЬ: ' + el.getAttribute('data-what') + ']';
      el.classList.toggle('todo', !val);
    });
  }
  fill();
  if (window.Store) window.Store.subscribe(fill);
})();
