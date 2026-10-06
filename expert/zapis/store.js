/* Хранилище данных. Сейчас — демо-режим: всё лежит в памяти телефона (localStorage).
   Интерфейс (subscribe, createBooking, setStatus...) не зависит от места хранения:
   при запуске для реальных клиентов этот файл заменяется на версию с сервером, остальной код не меняется.
   Шаблон «запись к мастеру»: салоны, барбершопы, маникюр, массаж, клиники. У каждого мастера своё расписание:
   пока один мастер занят, к другому можно записаться на то же время. */
(function () {
  const KEY = 'demo-expert.zapis.v1';
  /* hours — часы по дням недели (0 — воскресенье): {"1":["10:00","21:00"]}; день без часов — выходной. Пусто — start/end и days на все дни */
  const DEF_CFG = {"name":"Эксперт","phone":"+7 391 214-87-97","address":"ул. Карамзина, 18, Красноярск","legal":"Реквизиты оператора персональных данных — после заключения договора (демо)","start":"10:00","end":"21:00","step":30,"days":[0,1,2,3,4,5,6],"hours":{"0":["10:00","21:00"],"1":["10:00","21:00"],"2":["10:00","21:00"],"3":["10:00","21:00"],"4":["10:00","21:00"],"5":["10:00","21:00"],"6":["10:00","21:00"]},"currency":"₽"};
  /* Услуги: название, минуты, цена (0 — «по запросу»), [true — цена «от»] */
  const EXAMPLES = [["Стрижка",60,1000,true],["Фейд",60,800,true],["Удлинённая стрижка",60,1700,true],["Стрижка машинкой",30,600,true],["Моделирование бороды",60,1100,true],["Комплекс: стрижка и борода",90,1800,true],["Бритьё лица или головы",60,1400,true],["Детская стрижка",60,1300,true],["Отец и сын",90,1800,true],["Окантовка триммером",30,500,true]];
  /* Мастера: имя, специализация, номера услуг из EXAMPLES (с нуля; null — все услуги), рабочие дни (0 — вс … 6 — сб; null — все дни салона).
     Пустой список мастеров — одна общая очередь */
  const MASTERS = [["Старший барбер","Высший уровень",[2,1,3,4,5,6,7,8,9],null],["Барбер","Основной уровень",null,null],["Младший барбер","Доступные цены",[0,1,3,5,8,9],null]];
  const pad = n => String(n).padStart(2, '0');
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  /* Слот — у каждого мастера свой: «m1|2026-10-07_1030»; без мастеров — «_|…» */
  const slotId = (date, m, masterId) => (masterId || '_') + '|' + date + '_' + pad(Math.floor(m / 60)) + pad(m % 60);
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);

  function mkBooking(svc, master, date, startMin, step, who, status, own) {
    const n = Math.max(1, Math.ceil(svc.duration / step)), mid = master ? master.id : '';
    const slotIds = Array.from({ length: n }, (_, i) => slotId(date, startMin + i * step, mid));
    return { id: uid(), serviceId: svc.id, serviceName: svc.name, duration: svc.duration, price: svc.price, masterId: mid, masterName: master ? master.name : '', date, time: fromMin(startMin), startMin, slotIds,
      name: who.name, phone: who.phone, comment: who.comment || '', status, own: !!own, createdAt: Date.now() - Math.floor(Math.random() * 3e6) };
  }
  const PEOPLE = [
    { name: 'Екатерина', phone: '+7 916 555-01-22', comment: 'Первый раз у вас' },
    { name: 'Мария', phone: '+7 925 311-48-90', comment: '' },
    { name: 'Светлана', phone: '+7 903 700-12-34', comment: 'Хочу как в прошлый раз' },
    { name: 'Алина', phone: '+7 999 210-67-45', comment: 'Подойду минут на 5 раньше' },
    { name: 'Наталья', phone: '+7 977 404-55-10', comment: '' }
  ];

  function seed() {
    const services = EXAMPLES.map(([name, duration, price, from], i) => ({ id: 's' + (i + 1), name, duration, price, from: !!from, order: i }));
    const masters = MASTERS.map(([name, role, idx, days], i) => ({ id: 'm' + (i + 1), name, role, services: idx ? idx.filter(j => services[j]).map(j => services[j].id) : null, days: Array.isArray(days) && days.length ? days : null, order: i }));
    const d = { v: 2, cfg: { ...DEF_CFG }, services, masters, bookings: [] };
    const t0 = new Date(), today = dstr(t0), tm = dstr(new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + 1));
    /* демо-записи: услуга, день, час, человек, статус. Мастер — первый свободный из тех, кто делает услугу;
       все заняты — запись сдвигается на полчаса позже, чтобы у мастера не было двух клиентов сразу */
    const taken = new Set();
    const add = (svcI, date, hour, p, st) => {
      const svc = services[svcI]; if (!svc) return;
      const dow = new Date(date + 'T12:00').getDay();
      const ms = masters.filter(m => (!m.services || m.services.includes(svc.id)) && (!m.days || m.days.includes(dow)));
      if (masters.length && !ms.length) return; /* в этот день мастера этой услуги не работают */
      for (let m = hour * 60; m < hour * 60 + 480; m += 30) {
        for (const master of (ms.length ? ms : [null])) {
          const b = mkBooking(svc, master, date, m, 30, PEOPLE[p], st, false);
          if (b.slotIds.some(s => taken.has(s))) continue;
          b.slotIds.forEach(s => taken.add(s)); d.bookings.push(b); return;
        }
      }
    };
    add(0, tm, 11, 0, 'confirmed'); add(2, tm, 11, 1, 'confirmed'); add(4, tm, 15, 2, 'new');
    add(3, today, 17, 3, 'new'); add(1, today, 15, 4, 'confirmed');
    return d;
  }

  let data = load();
  const listeners = new Set();
  let bc = null;
  try { bc = new BroadcastChannel(KEY); bc.onmessage = () => { data = load(); emit(); }; } catch (e) { /* не везде есть */ }
  window.addEventListener('storage', e => { if (e.key === KEY) { data = load(); emit(); } });

  function load() { try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && d.v === 2) return d; } catch (e) { /* пусто */ } return seed(); }
  function emit() { listeners.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* память переполнена */ } try { bc && bc.postMessage(1); } catch (e) { /* ok */ } emit(); }

  window.Store = {
    mode: 'demo',
    subscribe(f) { listeners.add(f); return () => listeners.delete(f); },
    get cfg() { return { ...DEF_CFG, ...data.cfg }; },
    get services() { return data.services.slice().sort((a, b) => (a.order || 0) - (b.order || 0)); },
    get masters() { return (data.masters || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)); },
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
    async addMaster(m) { const v = { id: uid(), name: 'Новый мастер', role: '', services: null, order: Date.now(), ...m }; (data.masters = data.masters || []).push(v); save(); return v; },
    async updateMaster(id, patch) { const m = (data.masters || []).find(x => x.id === id); if (m) { Object.assign(m, patch); save(); } },
    async deleteMaster(id) { data.masters = (data.masters || []).filter(x => x.id !== id); save(); },
    /* демо: «клиент записался» — чтобы владелец увидел уведомление */
    async simulateIncoming(slotPick) {
      const svcs = this.services; if (!svcs.length) return null;
      const svc = svcs[Math.floor(Math.random() * svcs.length)], p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
      const pick = slotPick && slotPick(svc); if (!pick) return null;
      const master = (data.masters || []).find(m => m.id === pick.masterId) || null;
      const b = mkBooking(svc, master, pick.date, pick.m, this.cfg.step, p, 'new', false); b.createdAt = Date.now();
      data.bookings.push(b); save(); return b;
    },
    async resetDemo() { data = seed(); save(); },
    helpers: { slotId, fromMin, dstr }
  };
})();
