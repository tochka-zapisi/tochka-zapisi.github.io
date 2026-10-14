/* Хранилище данных. Сейчас — демо-режим: всё лежит в памяти телефона (localStorage).
   Интерфейс (subscribe, createBooking, setStatus...) не зависит от места хранения:
   при запуске для реальных клиентов этот файл заменяется на версию для Supabase, остальной код не меняется. */
(function () {
  const KEY = 'demo-siberianpro.zapis.v1';
  const DEF_CFG = {"name":"Siberianpro","phone":"+7 391 203-89-99","address":"ул. Мате Залки, 3а, Красноярск","legal":"ИП Бондарев Сергей Михайлович","start":"08:00","end":"21:00","step":30,"days":[0,1,2,3,4,5,6],"hours":{"0":["08:00","21:00"],"1":["08:00","21:00"],"2":["08:00","21:00"],"3":["08:00","21:00"],"4":["08:00","21:00"],"5":["08:00","21:00"],"6":["08:00","21:00"]},"currency":"₽"};
  const EXAMPLES = [["Бронирование кузова",60,8000,true,null,"срок — после осмотра"],["Бронирование фар",60,6000,true,null,"от 1 часа"],["Бронирование лобового стекла",120,25000,true,null,"от 2 часов"],["Бронирование салона",60,4000,true,null,"от 1 часа"],["Оклейка цветным и матовым полиуретаном",60,170000,true,null,"от 1 дня"],["Полировка кузова",300,10000,true,null,"от 5 часов"],["Керамическое покрытие",720,10000,true,null,"от 12 часов"],["Полировка фар",30,1000,true,null,"от 30 минут"],["Реставрация оптики",60,8000,true,null,"срок — после осмотра"],["Регулировка фар",60,1000,true,null,"от 1 часа"],["Ремонт кожи",60,3000,true,null,"срок — после осмотра"],["Восстановление пластика салона",60,3000,true,null,"срок — после осмотра"],["Шумоизоляция",180,3000,true,null,"от 3 часов"],["Антихром",60,1000,true,null,"от 1 часа"],["Порошковая покраска дисков",60,18000,true,null,"от 2 дней"],["Покраска суппортов",60,25000,true,null,"срок — после осмотра"],["Выпрямление вмятин без покраски (PDR)",60,1000,true,null,"от 1 часа"]];
  const pad = n => String(n).padStart(2, '0');
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slotId = (date, m) => date + '_' + pad(Math.floor(m / 60)) + pad(m % 60);
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);

  function mkBooking(svc, date, startMin, step, who, status, own) {
    const n = Math.max(1, Math.ceil(svc.duration / step));
    const slotIds = Array.from({ length: n }, (_, i) => slotId(date, startMin + i * step));
    return { id: uid(), serviceId: svc.id, serviceName: svc.name, duration: svc.duration, price: svc.price, date, time: fromMin(startMin), startMin, slotIds,
      name: who.name, phone: who.phone, car: who.car, plate: who.plate || '', comment: who.comment || '', status, own: !!own, createdAt: Date.now() - Math.floor(Math.random() * 3e6) };
  }
  const PEOPLE = [
    { name: 'Алексей', phone: '+7 916 555-01-22', car: 'Toyota Camry', plate: 'А 777 МР 77', comment: 'Плёнка на капот и фары' },
    { name: 'Марина', phone: '+7 925 311-48-90', car: 'Kia Rio', plate: 'К 215 ОН 50', comment: '' },
    { name: 'Дмитрий', phone: '+7 903 700-12-34', car: 'BMW 320d', plate: 'Е 094 КХ 77', comment: 'Керамика после полировки' },
    { name: 'Ольга', phone: '+7 999 210-67-45', car: 'Skoda Octavia', plate: 'Т 480 АВ 99', comment: 'Сколы на лобовом, нужна бронь' },
    { name: 'Игорь', phone: '+7 977 404-55-10', car: 'Hyundai Solaris', plate: 'С 123 УК 77', comment: '' }
  ];

  function seed() {
    /* [название, минуты, цена, «от»?, —, срок словами?] — «от» и срок словами («от 1 дня») ставит tools/booking.mjs из прайса сайта */
    const services = EXAMPLES.map(([name, duration, price, from, , term], i) => ({ id: 's' + (i + 1), name, duration, price, from: !!from, term: term || '', order: i }));
    const d = { v: 1, cfg: { ...DEF_CFG }, services, bookings: [] };
    const t0 = new Date(), today = dstr(t0), tm = dstr(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + 1));
    const add = (svcI, date, time, p, st) => d.bookings.push(mkBooking(services[svcI], date, time * 60, 30, PEOPLE[p], st, false));
    add(1, tm, 10, 0, 'confirmed'); add(2, tm, 13, 2, 'confirmed'); add(0, tm, 16, 1, 'new');
    add(3, today, 17, 3, 'new'); add(4, today, 15, 4, 'confirmed');
    return d;
  }

  let data = load();
  const listeners = new Set();
  let bc = null;
  try { bc = new BroadcastChannel('autoservice-demo'); bc.onmessage = () => { data = load(); emit(); }; } catch (e) { /* не везде есть */ }
  window.addEventListener('storage', e => { if (e.key === KEY) { data = load(); emit(); } });

  function load() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 1) return d; } catch (e) { /* пусто */ } return seed(); }
  function emit() { listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* память переполнена */ } try { bc && bc.postMessage(1); } catch (e) { /* ok */ } emit(); }

  window.Store = {
    mode: 'demo',
    subscribe(f) { listeners.add(f); return () => listeners.delete(f); },
    get cfg() { return { ...DEF_CFG, ...data.cfg }; },
    get services() { return data.services.slice().sort((a, b) => (a.order || 0) - (b.order || 0)); },
    get bookings() { return data.bookings.slice(); },
    get mine() { return data.bookings.filter(b => b.own); },
    /* занятые слоты: slotId -> статус записи */
    occupied() { const m = new Map(); data.bookings.forEach(b => { if (b.status === 'new' || b.status === 'confirmed') (b.slotIds || []).forEach(s => m.set(s, b.status)); }); return m; },
    async createBooking(b) {
      const occ = this.occupied();
      if ((b.slotIds || []).some(s => occ.has(s))) throw new Error('busy');
      data.bookings.push({ ...b, id: b.id || uid(), own: true, status: 'new', createdAt: Date.now() });
      save();
      return data.bookings[data.bookings.length - 1];
    },
    async setStatus(id, status) { const b = data.bookings.find(x => x.id === id); if (b) { b.status = status; b.updatedAt = Date.now(); save(); } },
    async saveConfig(cfg) { data.cfg = { ...cfg }; save(); },
    async addService(s) { const v = { id: uid(), name: 'Новая услуга', duration: 60, price: 0, order: Date.now(), ...s }; data.services.push(v); save(); return v; },
    async updateService(id, patch) { const s = data.services.find(x => x.id === id); if (s) { Object.assign(s, patch); save(); } },
    async deleteService(id) { data.services = data.services.filter(x => x.id !== id); save(); },
    /* демо: «клиент записался» — чтобы владелец увидел уведомление */
    async simulateIncoming(slotPick) {
      const svcs = this.services; if (!svcs.length) return null;
      const svc = svcs[Math.floor(Math.random() * svcs.length)], p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      const pick = slotPick && slotPick(svc); if (!pick) return null;
      const b = mkBooking(svc, pick.date, pick.m, this.cfg.step, p, 'new', false); b.createdAt = Date.now();
      data.bookings.push(b); save(); return b;
    },
    async resetDemo() { data = seed(); save(); },
    helpers: { slotId, fromMin, dstr }
  };
})();
