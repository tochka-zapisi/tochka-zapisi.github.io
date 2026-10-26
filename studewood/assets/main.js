
(() => {
  const C = JSON.parse(document.getElementById('cfg').textContent);
  const root = document.documentElement;
  const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const SHORT = { sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' };
  if (root.classList.contains('intro')) {
    const done = () => { root.classList.add('door-done'); root.classList.remove('intro'); try { sessionStorage.setItem('door', '1'); } catch (e) {} };
    const door = document.querySelector('.door');
    if (door) door.addEventListener('click', done);
    setTimeout(done, 3300);
  }
  const nowLocal = () => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: C.tz, weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
    return { day: p.weekday.toLowerCase().slice(0, 3), min: +p.hour * 60 + +p.minute, y: +p.year, m: +p.month, d: +p.day };
  };
  const toMin = hm => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const t12 = min => { let h = Math.floor(min / 60), m = min % 60; const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return m ? `${h}:${String(m).padStart(2, '0')} ${ap}` : `${h} ${ap}`; };
  const status = () => {
    const n = nowLocal(), h = C.hours[n.day];
    if (h && n.min >= toMin(h[0]) && n.min < toMin(h[1])) {
      const left = toMin(h[1]) - n.min;
      return { open: true, text: left <= 60 ? `Open now · closes in ${left} min` : `Open now · until ${t12(toMin(h[1]))}` };
    }
    if (h && n.min < toMin(h[0])) return { open: false, text: `Closed · opens today at ${t12(toMin(h[0]))}` };
    let i = DAYS.indexOf(n.day);
    for (let k = 1; k <= 7; k++) {
      const d = DAYS[(i + k) % 7], hh = C.hours[d];
      if (hh) return { open: false, text: `Closed · opens ${k === 1 ? 'tomorrow' : SHORT[d]} at ${t12(toMin(hh[0]))}` };
    }
    return { open: false, text: 'Closed' };
  };
  const paint = () => {
    const s = status();
    document.querySelectorAll('[data-live]').forEach(el => { el.classList.toggle('is-open', s.open); el.querySelector('.live-txt').textContent = s.text; });
    document.querySelectorAll('[data-live-text]').forEach(el => { el.classList.toggle('is-open', s.open); el.textContent = s.text; });
    const today = document.querySelector(`.hours tr[data-day="${nowLocal().day}"]`);
    document.querySelectorAll('.hours tr').forEach(tr => tr.classList.toggle('today', tr === today));
  };
  paint();
  setInterval(paint, 60000);
  const clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    const fmt = new Intl.DateTimeFormat('en-US', { timeZone: C.tz, hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
    const tick = () => clocks.forEach(el => { el.textContent = fmt.format(new Date()); });
    tick(); setInterval(tick, 20000);
  }
  const rv = document.querySelectorAll('.sec-head, .svc, .chair, .rev, .fact, .phone-sec, .hours, .visit address, details');
  rv.forEach(el => el.classList.add('rv'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));
  const dlg = document.getElementById('bookDlg');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (!b) return;
    e.preventDefault();
    if (C.external) { window.open(C.external, '_blank', 'noopener'); return; }
    if (!dlg || !dlg.showModal) { location.href = 'tel:' + C.phone.replace(/\D/g, ''); return; }
    openBook({ svc: b.dataset.svc, staff: b.dataset.staff });
  });
  if (!dlg) return;
  const body = document.getElementById('bookBody'), stepEl = document.getElementById('bookStep'), title = document.getElementById('bookTitle');
  const next = document.getElementById('bookNext'), back = document.getElementById('bookBack');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let st, step;
  function openBook(pre) {
    st = { svc: pre.svc || '', staff: pre.staff || '', date: null, time: null, name: '', phone: '', email: '', note: '', texts: false };
    step = st.svc ? (st.staff ? 3 : 2) : 1;
    render();
    dlg.showModal();
  }
  const daysList = () => {
    const n = nowLocal(), out = [];
    const base = new Date(Date.UTC(n.y, n.m - 1, n.d));
    for (let i = 0; i < C.days; i++) {
      const dt = new Date(base.getTime() + i * 864e5);
      const key = DAYS[dt.getUTCDay()];
      out.push({ i, key, iso: dt.toISOString().slice(0, 10), num: dt.getUTCDate(), mon: dt.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }), label: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : SHORT[key], hours: C.hours[key] });
    }
    return out;
  };
  const busy = (iso, min) => { if (!C.demo) return false; let h = 2166136261; for (const ch of iso + ':' + min + st.staff) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) % 4 === 0; };
  const slotsFor = d => {
    if (!d.hours) return [];
    const svc = C.services.find(s => s.name === st.svc), dur = svc ? svc.min : 30;
    const from = toMin(d.hours[0]), to = toMin(d.hours[1]) - dur, n = nowLocal(), out = [];
    for (let m = from; m <= to; m += C.step) out.push({ m, off: (d.i === 0 && m < n.min + 30) || busy(d.iso, m) });
    return out;
  };
  function render() {
    stepEl.textContent = step <= 4 ? `Step ${step} of 4` : 'Confirmed';
    back.hidden = step === 1 || step === 5;
    next.textContent = step === 4 ? 'Request booking' : step === 5 ? 'Done' : 'Next';
    let h = '';
    if (step === 1) {
      title.textContent = 'Choose a service';
      let g = '';
      h = '<fieldset class="opt-list"><legend class="sr">Service</legend>' + C.services.map(s => {
        const head = s.group !== g ? `<p class="opt-group">${esc(g = s.group)}</p>` : '';
        return head + `<label class="opt"><input type="radio" name="svc" value="${esc(s.name)}"${s.name === st.svc ? ' checked' : ''}><span>${esc(s.name)}<br><small>${s.min} min</small></span><b>${s.priceText ? esc(s.priceText) : (s.from ? 'from ' : '') + '$' + s.price + (s.unit ? '/' + esc(s.unit) : '')}</b></label>`;
      }).join('') + '</fieldset>';
    } else if (step === 2) {
      title.textContent = C.words.staffQ;
      h = `<fieldset class="opt-list"><legend class="sr">${esc(C.words.staff)}</legend>` + [C.any, ...C.staff].map((p, i) => `<label class="opt"><input type="radio" name="staff" value="${i ? esc(p) : ''}"${(i ? p : '') === st.staff ? ' checked' : ''}><span>${esc(p)}</span>${i ? '' : '<small>First available</small>'}</label>`).join('') + '</fieldset>';
    } else if (step === 3) {
      title.textContent = 'Pick a time';
      const ds = daysList();
      if (!st.date) st.date = (ds.find(d => slotsFor(d).some(s => !s.off)) || ds[0]).iso;
      const cur = ds.find(d => d.iso === st.date);
      const sl = slotsFor(cur);
      h = `<div class="days" role="group" aria-label="Day">${ds.map(d => `<button type="button" class="day" data-date="${d.iso}" aria-pressed="${d.iso === st.date}"${d.hours ? '' : ' disabled'} aria-label="${d.label} ${d.mon} ${d.num}${d.hours ? '' : ', closed'}"><small>${d.label}</small><b>${d.num}</b><small>${d.mon}</small></button>`).join('')}</div>`
        + (sl.length ? `<div class="slots" role="group" aria-label="Time">${sl.map(s => `<button type="button" class="slot" data-time="${s.m}" aria-pressed="${st.time === s.m}"${s.off ? ' disabled' : ''}>${t12(s.m)}</button>`).join('')}</div>` : '<p>Closed this day. Pick another one.</p>');
    } else if (step === 4) {
      title.textContent = 'Your details';
      h = `<div class="fld"><label for="bk-name">Name</label><input id="bk-name" name="name" autocomplete="name" required value="${esc(st.name)}"></div>
        <div class="fld"><label for="bk-phone">Mobile number</label><input id="bk-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(${(C.phone.match(/\d{3}/) || ['555'])[0]}) 000-0000" required value="${esc(st.phone)}"></div>
        <div class="fld"><label for="bk-email">Email <span class="hint">optional</span></label><input id="bk-email" name="email" type="email" autocomplete="email" value="${esc(st.email)}"></div>
        <div class="fld"><label for="bk-note">Anything we should know? <span class="hint">optional</span></label><textarea id="bk-note" name="note" rows="2">${esc(st.note)}</textarea></div>
        <label class="chk"><input type="checkbox" name="texts"${st.texts ? ' checked' : ''}><span>Text me a confirmation and a reminder the day before. Msg &amp; data rates may apply. Reply STOP to opt out.</span></label>
        <p class="err" role="alert"></p>`;
    } else {
      title.textContent = 'You’re on the books';
      const d = daysList().find(x => x.iso === st.date);
      h = `<p class="done-mark">See you soon.</p>
        <dl class="sum"><div><dt>Service</dt><dd>${esc(st.svc)}</dd></div><div><dt>${esc(C.words.staff)}</dt><dd>${esc(st.staff || C.any)}</dd></div><div><dt>When</dt><dd>${d.label === 'Today' || d.label === 'Tmrw' ? (d.label === 'Tmrw' ? 'Tomorrow' : 'Today') : SHORT[d.key]}, ${d.mon} ${d.num} · ${t12(st.time)}</dd></div><div><dt>Where</dt><dd>${esc(C.address)}</dd></div></dl>
        <p>${C.demo ? 'This is a design demo, so no request was sent.' : `We’ll confirm by ${st.texts ? 'text' : 'phone'} shortly. Need to change something? Call ${esc(C.phone)}.`}</p>
        <button type="button" class="link-btn" id="bk-ics">Add to calendar</button>`;
    }
    body.innerHTML = h;
    body.scrollTop = 0;
    const first = body.querySelector('input:checked, input, .slot[aria-pressed="true"]');
    if (first && step !== 3) first.focus({ preventScroll: true });
  }
  body.addEventListener('click', e => {
    const d = e.target.closest('.day'), s = e.target.closest('.slot');
    if (d && !d.disabled) { st.date = d.dataset.date; st.time = null; render(); body.querySelector(`.day[data-date="${st.date}"]`).focus(); }
    if (s && !s.disabled) { st.time = +s.dataset.time; body.querySelectorAll('.slot').forEach(x => x.setAttribute('aria-pressed', x === s)); }
    if (e.target.id === 'bk-ics') ics();
  });
  body.addEventListener('change', e => {
    if (e.target.name === 'svc') { st.svc = e.target.value; st.time = null; }
    if (e.target.name === 'staff') st.staff = e.target.value;
  });
  const shake = msg => { const p = body.querySelector('.err'); if (p) p.textContent = msg; else alert(msg); };
  next.addEventListener('click', async () => {
    if (step === 1 && !st.svc) return shake('Pick a service first.');
    if (step === 3 && st.time == null) { const sl = body.querySelector('.slots'); if (sl) sl.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 240 }); return; }
    if (step === 4) {
      const f = k => body.querySelector(`[name="${k}"]`);
      st.name = f('name').value.trim(); st.phone = f('phone').value.trim(); st.email = f('email').value.trim(); st.note = f('note').value.trim(); st.texts = f('texts').checked;
      if (!st.name) { f('name').focus(); return shake('Please add your name.'); }
      if (st.phone.replace(/\D/g, '').length < 10) { f('phone').focus(); return shake('Please add a 10-digit mobile number.'); }
      if (!C.demo) {
        const payload = { service: st.svc, staff: st.staff || 'any', date: st.date, time: t12(st.time), name: st.name, phone: st.phone, email: st.email, note: st.note, textReminders: st.texts };
        if (C.endpoint) {
          next.disabled = true;
          try { const r = await fetch(C.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!r.ok) throw 0; }
          catch (err) { next.disabled = false; return shake(`Couldn’t send. Please call ${C.phone}.`); }
          next.disabled = false;
        } else if (C.sms) {
          location.href = `sms:+1${C.sms.replace(/\D/g, '').slice(-10)}?&body=${encodeURIComponent(`Booking request: ${payload.service}, ${payload.date} ${payload.time}, ${payload.staff}. ${payload.name}, ${payload.phone}`)}`;
        }
      }
    }
    if (step === 5) { dlg.close(); return; }
    step = step === 1 && st.staff ? 3 : step + 1;
    render();
  });
  back.addEventListener('click', () => { step = Math.max(1, step - 1); render(); });
  function ics() {
    const svc = C.services.find(s => s.name === st.svc), dur = svc ? svc.min : 30;
    const p = n => String(n).padStart(2, '0'), d = st.date.replace(/-/g, '');
    const t = m => `${d}T${p(Math.floor(m / 60))}${p(m % 60)}00`;
    const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//' + C.name + '//Booking//EN', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@booking', `DTSTART;TZID=${C.tz}:${t(st.time)}`, `DTEND;TZID=${C.tz}:${t(st.time + dur)}`, `SUMMARY:${st.svc} at ${C.name}`, `LOCATION:${C.address.replace(/,/g, '\\,')}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar' }));
    a.download = 'appointment.ics';
    a.click();
  }
})();
