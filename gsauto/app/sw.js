/* Офлайн-оболочка: приложение открывается и без интернета. VER меняет tools/clientapp.mjs при каждой сборке. */
const VER = 'gsauto-app-fdfdc7be';
const SHELL = ['./', './index.html', './styles.css', './auto.css', './app.js', './data.js', './vendor/qrcode.js', './manifest.webmanifest', './assets/fonts/fonts.css'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const copy = res.clone(); caches.open(VER).then(c => c.put(e.request, copy)); return res; })));
});
