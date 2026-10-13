/* офлайн-кэш приложения: оболочка и данные; версия подставляется при сборке */
const V = 'wood-mv70f9pj', FILES = ['./', 'index.html', 'app.css', 'app.js', 'data.js', 'vendor/qrcode.js', 'manifest.webmanifest'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(V).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
