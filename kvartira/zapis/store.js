/* Хранилище данных. Сейчас — демо-режим: всё лежит в памяти телефона (localStorage).
   Интерфейс (subscribe, createBooking, setStatus...) не зависит от места хранения:
   при запуске для реальных клиентов этот файл заменяется на версию с сервером, остальной код не меняется.
   Шаблон «запись к мастеру»: салоны, барбершопы, маникюр, массаж, клиники. У каждого мастера своё расписание:
   пока один мастер занят, к другому можно записаться на то же время. */
(function () {
  const KEY = 'demo-kvartira.zapis.v1';
  /* hours — часы по дням недели (0 — воскресенье): {"1":["10:00","21:00"]}; день без часов — выходной. Пусто — start/end и days на все дни */
  const DEF_CFG = {"name":"The Квартира","phone":"+7 908 200-57-00","address":"ул. Водопьянова, 9, Красноярск","legal":"Реквизиты оператора персональных данных — после заключения договора (демо)","start":"09:00","end":"21:00","step":30,"days":[0,1,2,3,4,5,6],"hours":{"0":["09:00","21:00"],"1":["09:00","21:00"],"2":["09:00","21:00"],"3":["09:00","21:00"],"4":["09:00","21:00"],"5":["09:00","21:00"],"6":["09:00","21:00"]},"currency":"₽"};
  /* Услуги: название, минуты, цена (0 — «по запросу»), [true — цена «от»] */
  const EXAMPLES = [["Мужская стрижка",60,1400,true,{"b":1400,"s":1500,"br":1700}],["Под машинку с фейдом",60,1200,true,{"b":1200,"s":1300,"br":1500}],["Под машинку, до 3 насадок",30,1100,true,{"b":1100,"s":1200,"br":1400}],["Удлинённая стрижка ножницами",60,1500,true,{"b":1500,"s":1600,"br":1800}],["Под одну насадку",30,500,false,{"b":500,"s":500,"br":500}],["Детская стрижка, 5–7 лет",60,1200,true,{"b":1200,"s":1300,"br":1400}],["Бритьё головы",60,1400,true,{"s":1400,"br":1600}],["Камуфляж седины",30,1200,true,{"b":1200,"s":1400,"br":1500}],["Коррекция бороды",30,1100,true,{"b":1100,"s":1200,"br":1300}],["Королевское бритьё",60,1300,true,{"s":1300,"br":1400}],["Камуфляж бороды",30,1200,true,{"s":1200,"br":1300}],["Борода под одну насадку",30,500,true,{"b":500,"s":500,"br":600}],["Оформление бороды ваксингом",60,1800,false,{"br":1800}],["Стрижка + борода",90,2100,true,{"b":2100,"s":2300,"br":2500}],["Стрижка + королевское бритьё",90,2400,true,{"s":2400,"br":2600}],["Стрижка + борода ваксингом",90,2600,false,{"br":2600}],["Окантовка",30,600,true,{"b":600,"s":600,"br":700}],["Ваксинг: нос, уши, брови",30,200,false,{"b":200,"s":200,"br":200}],["Биозавивка",120,5500,false,{"b":5500,"s":5500,"br":5500}]];
  /* Мастера: имя, специализация, номера услуг из EXAMPLES (с нуля; null — все услуги), рабочие дни (0 — вс … 6 — сб; null — все дни салона).
     Пустой список мастеров — одна общая очередь */
  const MASTERS = [["Али","Бренд-барбер",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],null,"br"],["Алексей","Бренд-барбер",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],null,"br"],["Никита К.","Старший барбер",[0,1,2,3,4,5,6,7,8,9,10,11,13,14,16,17,18],null,"s"],["Игорь","Барбер",[0,1,2,3,4,5,7,8,11,13,16,17,18],null,"b"]];
  const pad = n => String(n).padStart(2, '0');
  const dstr = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  /* Слот — у каждого мастера свой: «m1|2026-10-07_1030»; без мастеров — «_|…» */
  const slotId = (date, m, masterId) => (masterId || '_') + '|' + date + '_' + pad(Math.floor(m / 60)) + pad(m % 60);
  const fromMin = m => pad(Math.floor(m / 60)) + ':' + pad(m % 60);

  function mkBooking(svc, master, date, startMin, step, who, status, own) {
    const n = Math.max(1, Math.ceil(svc.duration / step)), mid = master ? master.id : '';
    const slotIds = Array.from({ length: n }, (_, i) => slotId(date, startMin + i * step, mid));
    return { id: uid(), serviceId: svc.id, serviceName: svc.name, duration: svc.duration, price: (master && svc.tiers && svc.tiers[master.tier]) || svc.price, masterId: mid, masterName: master ? master.name : '', date, time: fromMin(startMin), startMin, slotIds,
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
    /* tiers — цены по уровню мастера ({ "brand": 1700 }), у мастера — tier: какой уровень (барбер, старший, бренд); нет — одна цена */
    const services = EXAMPLES.map(([name, duration, price, from, tiers], i) => ({ id: 's' + (i + 1), name, duration, price, from: !!from, tiers: tiers || null, order: i }));
    const masters = MASTERS.map(([name, role, idx, days, tier], i) => ({ id: 'm' + (i + 1), name, role, services: idx ? idx.filter(j => services[j]).map(j => services[j].id) : null, days: Array.isArray(days) && days.length ? days : null, tier: tier || null, order: i }));
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
