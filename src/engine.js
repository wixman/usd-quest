// ============================================================
//  ENGINE
// ============================================================
const $app = document.getElementById('app');
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const DAILY_GOAL = 30;
const XP = { lesson: 15, drill: 20, challenge: 30, review: 10 };

// ---------------------------------------------------------- syntax highlight
const KW = new Set('def over class prepend append delete add uniform custom rel variantSet variantSets variants references payload inherits specializes subLayers apiSchemas kind instanceable from import for in if with as return not and or True False None true false'.split(' '));
const TY = new Set('bool int float double string token asset float2 float3 double3 color3f point3f vector3f normal3f texCoord2f matrix4d quatf quath half'.split(' '));
const MODS = new Set('Usd UsdGeom UsdShade UsdLux Sdf Gf Vt Tf Kind Ar'.split(' '));
function hl(src, lang) {
  const re = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(@[^@\n]*@)|(<\/[^>\n]*>)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index)); last = re.lastIndex;
    const [t, cm, st, as, pa, nu, w] = m;
    if (cm) out += lang === 'py' || cm.startsWith('# ') || !cm.startsWith('#usda') ? `<span class="cm">${esc(cm)}</span>` : `<span class="k">${esc(cm)}</span>`;
    else if (st) out += `<span class="st">${esc(st)}</span>`;
    else if (as) out += `<span class="as">${esc(as)}</span>`;
    else if (pa) out += `<span class="pa">${esc(pa)}</span>`;
    else if (nu) out += `<span class="nu">${nu}</span>`;
    else if (KW.has(w)) out += `<span class="k">${w}</span>`;
    else if (TY.has(w)) out += `<span class="ty">${w}</span>`;
    else if (MODS.has(w)) out += `<span class="mod">${w}</span>`;
    else if (/^[A-Z]/.test(w)) out += `<span class="ty2">${w}</span>`;
    else out += esc(w);
  }
  return out + esc(src.slice(last));
}

// ---------------------------------------------------------- sound + haptics
let AC = null;
function sfx(kind) {
  if (!S.settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime;
    const note = (f, start, dur, type = 'sine', vol = .18) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t + start);
      g.gain.setValueAtTime(0, t + start); g.gain.linearRampToValueAtTime(vol, t + start + .01);
      g.gain.exponentialRampToValueAtTime(.001, t + start + dur);
      o.connect(g).connect(AC.destination); o.start(t + start); o.stop(t + start + dur + .02);
    };
    if (kind === 'tap') note(660, 0, .06, 'triangle', .08);
    if (kind === 'correct') { note(784, 0, .12, 'triangle'); note(1175, .09, .22, 'triangle'); }
    if (kind === 'wrong') { note(220, 0, .16, 'sawtooth', .09); note(180, .1, .22, 'sawtooth', .09); }
    if (kind === 'match') note(988, 0, .1, 'triangle', .12);
    if (kind === 'done') [523, 659, 784, 1047, 1319].forEach((f, i) => note(f, i * .09, .3, 'triangle', .15));
  } catch (e) {}
  try { if (navigator.vibrate) navigator.vibrate(kind === 'wrong' ? [30, 40, 30] : kind === 'tap' ? 8 : 15); } catch (e) {}
}

// ---------------------------------------------------------- state & persistence
const LS_KEY = 'usdquest_v1';
const blank = () => ({ done: {}, xp: 0, days: {}, streak: { count: 0, lastDay: null, best: 0 }, miss: {}, settings: { sound: true, unlockAll: false }, updated: 0 });
let S = blank();
try { const raw = localStorage.getItem(LS_KEY); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) {}
let cloud = { db: null, ref: null, status: 'connecting', writing: false, pending: false, timer: null };

function save() {
  S.updated = Date.now();
  try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {}
  if (cloud.ref) { clearTimeout(cloud.timer); cloud.timer = setTimeout(pushCloud, 1200); }
}
async function pushCloud() {
  if (!cloud.ref) return;
  if (cloud.writing) { cloud.pending = true; return; }
  cloud.writing = true;
  try { await cloud.ref.set(JSON.parse(JSON.stringify(S))); cloud.status = 'synced'; }
  catch (e) { cloud.status = e && e.code === 'invalid_argument' ? 'local' : 'error'; if (cloud.status === 'local') cloud.ref = null; }
  cloud.writing = false;
  if (cloud.pending) { cloud.pending = false; pushCloud(); }
}
function mergeState(a, b) {
  const m = blank();
  m.settings = a.settings;
  m.xp = Math.max(a.xp || 0, b.xp || 0);
  for (const src of [a, b]) {
    for (const k in src.done || {}) {
      const x = src.done[k], y = m.done[k];
      m.done[k] = !y ? { ...x } : { stars: Math.max(x.stars || 0, y.stars || 0), best: Math.min(x.best ?? 1e9, y.best ?? 1e9), at: Math.max(x.at || 0, y.at || 0) };
    }
    for (const d in src.days || {}) m.days[d] = Math.max(m.days[d] || 0, src.days[d]);
    for (const q in src.miss || {}) m.miss[q] = Math.max(m.miss[q] || 0, src.miss[q]);
  }
  const sa = a.streak || {}, sb = b.streak || {};
  const ta = sa.lastDay ? new Date(sa.lastDay).getTime() : 0, tb = sb.lastDay ? new Date(sb.lastDay).getTime() : 0;
  const base = tb > ta || (tb === ta && (sb.count || 0) > (sa.count || 0)) ? sb : sa;
  m.streak = { count: base.count || 0, lastDay: base.lastDay || null, best: Math.max(sa.best || 0, sb.best || 0, base.count || 0) };
  return m;
}
async function initCloud() {
  try {
    if (!window.claude || !window.claude.use) { cloud.status = 'local'; return; }
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    const id = user ? await user.id() : null;
    if (!db || !id) { cloud.status = 'local'; return; }
    cloud.db = db; cloud.ref = db.doc('data/users/' + id + '/progress');
    const snap = await Promise.race([cloud.ref.get(), new Promise((_, r) => setTimeout(() => r({ code: 'timeout' }), 10000))]);
    if (snap.exists) { S = mergeState(S, snap.data()); try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} rerender(); }
    cloud.status = 'synced';
    pushCloud();
  } catch (e) { cloud.status = 'local'; }
}

// ---------------------------------------------------------- derived helpers
const ALL = UNITS.flatMap(u => u.items.map(it => ({ ...it, unit: u })));
const isDone = (id) => !!S.done[id];
function unlocked(idx) { return S.settings.unlockAll || idx === 0 || isDone(ALL[idx - 1].id) || isDone(ALL[idx].id); }
const currentIdx = () => { const i = ALL.findIndex(it => !isDone(it.id)); return i === -1 ? ALL.length - 1 : i; };
function streakAlive() {
  if (!S.streak.lastDay) return 0;
  const y = new Date(); y.setDate(y.getDate() - 1);
  return (S.streak.lastDay === todayKey() || S.streak.lastDay === todayKey(y)) ? S.streak.count : 0;
}
function bumpStreak() {
  const t = todayKey(); if (S.streak.lastDay === t) return false;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak.count = S.streak.lastDay === todayKey(y) ? S.streak.count + 1 : 1;
  S.streak.lastDay = t; S.streak.best = Math.max(S.streak.best || 0, S.streak.count); return true;
}

// ---------------------------------------------------------- UI utilities
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = H('div', { class: 'toast' }, msg); $app.append(t); setTimeout(() => t.remove(), 2300);
}
function sheet(build) {
  const sc = H('div', { class: 'scrim', onclick: (e) => { if (e.target === sc) sc.remove(); } });
  const sh = H('div', { class: 'sheet' }); build(sh, () => sc.remove());
  sc.append(sh); $app.append(sc); return sc;
}
function confetti() {
  const c = H('div', { class: 'confetti' }); const cols = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#2bd9c4', '#ff86d0'];
  for (let i = 0; i < 70; i++) c.append(H('i', { style: { left: Math.random() * 100 + '%', background: cols[i % cols.length], animationDuration: (1.6 + Math.random() * 1.6) + 's', animationDelay: Math.random() * .5 + 's', transform: `rotate(${Math.random() * 360}deg)` } }));
  $app.append(c); setTimeout(() => c.remove(), 3800);
}
function starsHTML(n) { return `<span class="on">${'★'.repeat(n)}</span><span class="off">${'★'.repeat(3 - n)}</span>`; }
function goalRing() {
  const v = Math.min(1, (S.days[todayKey()] || 0) / DAILY_GOAL), r = 15, C = 2 * Math.PI * r;
  return `<div class="goal" title="Daily goal"><svg width="38" height="38"><circle cx="19" cy="19" r="${r}" stroke="#2a3052" stroke-width="5" fill="none"/>
  <circle cx="19" cy="19" r="${r}" stroke="${v >= 1 ? '#58cc02' : '#ffc800'}" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - v)}"/></svg><span>${v >= 1 ? '✅' : '🎯'}</span></div>`;
}

// ---------------------------------------------------------- main shell
let tab = 'map', labTab = 'layerStack', scrollMem = {};
function rerender() { if (document.querySelector('.player')) return; renderHome(); }
function renderHome() {
  const prevScroll = document.querySelector('.scroll'); if (prevScroll) scrollMem[tab] = prevScroll.scrollTop;
  $app.innerHTML = '';
  const scr = H('div', { class: 'screen' });
  const st = streakAlive();
  const top = H('div', { class: 'topbar' },
    H('div', { class: 'logo', html: '<span>🧊</span><span>USD<span class="o">quest</span></span>' }),
    H('div', { class: 'stat fire' + (st ? '' : ' dead'), title: 'Streak' }, '🔥', String(st)),
    H('div', { class: 'stat xp', title: 'Total XP' }, '⚡', String(S.xp)),
    H('div', { html: goalRing() }),
    H('button', { class: 'iconbtn', onclick: openSettings }, '⚙️'));
  const body = H('div', { class: 'scroll' });
  if (tab === 'map') body.append(renderMap());
  if (tab === 'review') body.append(renderReview());
  const nav = H('div', { class: 'nav' },
    H('button', { class: tab === 'map' ? 'on' : '', onclick: () => { tab = 'map'; sfx('tap'); renderHome(); } }, H('span', { class: 'ni' }, '🗺️'), 'ROADMAP'),
    H('button', { class: tab === 'review' ? 'on' : '', onclick: () => { tab = 'review'; sfx('tap'); renderHome(); } }, H('span', { class: 'ni' }, '🔥'), 'REVIEW'));
  scr.append(top, body, nav); $app.append(scr);
  requestAnimationFrame(() => {
    if (scrollMem[tab] != null) body.scrollTop = scrollMem[tab];
    else if (tab === 'map') { const c = body.querySelector('.node.current'); if (c) body.scrollTop = c.getBoundingClientRect().top - body.getBoundingClientRect().top - 180; }
  });
}

// ---------------------------------------------------------- roadmap
function renderMap() {
  const wrap = H('div', { style: { paddingBottom: '110px' } });
  const cur = currentIdx();
  let gi = 0;
  UNITS.forEach((u) => {
    const doneN = u.items.filter(i => isDone(i.id)).length;
    const unitEl = H('div', { class: 'unit' });
    unitEl.append(H('div', { class: 'ubanner', style: { background: u.color, '--us': u.shadow } },
      H('span', { class: 'ue' }, u.emoji),
      H('div', {}, H('h2', {}, u.title), H('p', {}, u.sub)),
      H('span', { class: 'uprog' }, `${doneN}/${u.items.length}`)));
    const path = H('div', { class: 'path' });
    u.items.forEach((it, j) => {
      const idx = gi++;
      const done = isDone(it.id), open = unlocked(idx), isCur = idx === cur && !done && open;
      const off = Math.round(Math.sin(j * 1.15) * 72);
      const icon = it.kind === 'lesson' ? (done ? '📖' : '📘') : it.kind === 'drill' ? '⚡' : '👑';
      const cls = 'node ' + (done ? 'done' : open ? (isCur ? 'current' : '') : 'locked');
      const nw = H('div', { class: 'nodewrap' + (isCur && j > 0 ? ' curwrap' : ''), style: { transform: `translateX(${off}px)` } });
      if (isCur) nw.append(H('div', { class: 'bubble', style: { '--nc2': u.shadow } }, isDone(ALL[0].id) || idx > 0 ? 'START' : 'START HERE'));
      nw.append(H('button', { class: cls, style: open && !done ? { '--nc': u.color, '--ns': u.shadow } : {}, onclick: () => openNode(ALL[idx], idx) }, open ? icon : '🔒'));
      nw.append(H('div', { class: 'nlabel' }, it.title));
      if (done) nw.append(H('div', { class: 'nstars', html: starsHTML(S.done[it.id].stars || 0) }));
      path.append(nw);
    });
    unitEl.append(path); wrap.append(unitEl);
  });
  wrap.append(H('div', { class: 'empty' }, H('div', { class: 'big' }, '🏁'), 'More units coming as you level up.'));
  return wrap;
}
function openNode(it, idx) {
  sfx('tap');
  const open = unlocked(idx), d = S.done[it.id];
  sheet((sh, close) => {
    const u = it.unit;
    sh.append(H('div', { class: 'kind', style: { color: u.color } }, `${u.emoji} ${u.title} · ${it.kind.toUpperCase()}`));
    sh.append(H('h2', {}, it.title));
    const qs = it.steps.filter(s => !['info', 'widget'].includes(s.t)).length;
    sh.append(H('p', { class: 'muted' }, it.kind === 'lesson' ? `${it.steps.length} cards · ${qs} checks · +${XP.lesson} XP` : `${qs} questions${it.timed ? ' · ⏱ timed' : ''} · +${XP[it.kind]} XP`));
    if (d) sh.append(H('p', { html: `<span class="nstars" style="font-size:20px">${starsHTML(d.stars || 0)}</span>${d.best && it.timed ? ` &nbsp;<span class="muted">best ${d.best.toFixed(1)}s</span>` : ''}` }));
    if (!open) {
      sh.append(H('p', { class: 'muted' }, 'Finish the previous step to unlock this. Or jump ahead anyway:'));
      sh.append(H('button', { class: 'btn blue', onclick: () => { close(); startSession(it); } }, 'JUMP AHEAD'));
    } else sh.append(H('button', { class: 'btn', style: { '--b': u.color, '--bs': u.shadow }, onclick: () => { close(); startSession(it); } }, d ? 'PRACTISE AGAIN' : 'START'));
  });
}

// ---------------------------------------------------------- review tab
function renderReview() {
  const p = H('div', { class: 'page' });
  const st = streakAlive();
  p.append(H('div', { class: 'h1' }, 'Review'));
  // week strip
  const week = H('div', { class: 'week' });
  const names = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const hit = (S.days[todayKey(d)] || 0) > 0;
    week.append(H('div', { class: 'day' + (hit ? ' hit' : '') + (i === 0 ? ' today' : '') }, H('i', {}, hit ? '🔥' : ''), names[d.getDay()]));
  }
  p.append(H('div', { class: 'card' },
    H('div', { class: 'row' }, H('b', { style: { fontSize: '18px' } }, `🔥 ${st} day streak`), H('span', { class: 'muted small' }, `best ${S.streak.best || 0}`)), week));
  // daily mix
  const pool = reviewPool();
  const todayXP = S.days[todayKey()] || 0;
  p.append(H('div', { class: 'card mix' },
    H('h3', {}, '🎲 Daily Mix'),
    H('p', {}, pool.length ? `10 questions from what you've learned, weighted toward your weak spots. ${todayXP >= DAILY_GOAL ? 'Goal hit today ✅' : `${todayXP}/${DAILY_GOAL} XP today.`}` : 'Finish your first lesson to unlock daily reviews.'),
    H('button', { class: 'btn', style: { '--b': '#fff', '--bs': '#ffd3c4', color: '#ff4b4b' }, disabled: !pool.length, onclick: startReview }, 'START MIX')));
  // stats
  const doneN = Object.keys(S.done).length, stars = Object.values(S.done).reduce((a, b) => a + (b.stars || 0), 0);
  p.append(H('div', { class: 'bigstats' },
    H('div', { class: 'bs' }, H('b', { style: { color: 'var(--gold)' } }, S.xp), H('span', {}, 'TOTAL XP')),
    H('div', { class: 'bs' }, H('b', { style: { color: 'var(--green)' } }, `${doneN}/${ALL.length}`), H('span', {}, 'COMPLETED')),
    H('div', { class: 'bs' }, H('b', { style: { color: 'var(--orange)' } }, stars), H('span', {}, 'STARS'))));
  // weak spots
  const weak = Object.entries(S.miss).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5);
  if (weak.length) {
    const c = H('div', { class: 'card' }, H('b', {}, '🎯 Weak spots'));
    weak.forEach(([k, n]) => { const q = qByKey(k); if (q) c.append(H('div', { class: 'weak' }, H('span', { html: stripTags(q.q).slice(0, 70) }), H('span', { class: 'wn' }, '×' + n))); });
    p.append(c);
  }
  // glossary
  const gc = H('div', { class: 'card' }, H('b', { style: { fontSize: '18px' } }, '📖 Glossary'));
  const list = H('div', {});
  const fill = (f) => { list.innerHTML = ''; GLOSSARY.filter(([t, d]) => !f || (t + d).toLowerCase().includes(f.toLowerCase())).forEach(([t, d]) => list.append(H('div', { class: 'gitem' }, H('b', {}, t), H('div', {}, d)))); };
  gc.append(H('input', { class: 'gsearch', placeholder: 'Search terms…', oninput: (e) => fill(e.target.value), style: { marginTop: '10px' } }), list);
  fill(''); p.append(gc);
  return p;
}
const stripTags = (s) => s.replace(/<[^>]+>/g, '');
function qByKey(k) { const [id, i] = k.split(':'); const it = ALL.find(x => x.id === id); return it && it.steps[+i]; }
function reviewPool() {
  const out = [];
  ALL.forEach(it => { if (!isDone(it.id)) return; it.steps.forEach((s, i) => { if (!['info', 'widget'].includes(s.t)) out.push({ ...s, _key: `${it.id}:${i}` }); }); });
  return out;
}
function startReview() {
  const pool = reviewPool();
  const weighted = shuffle(pool).sort((a, b) => (S.miss[b._key] || 0) - (S.miss[a._key] || 0) + (Math.random() - .5) * 1.5);
  const steps = shuffle(weighted.slice(0, 10));
  startSession({ id: 'review', kind: 'review', title: 'Daily Mix', steps, unit: { color: '#ff9600', shadow: '#d97f00', emoji: '🎲', title: 'REVIEW' } });
}

// ---------------------------------------------------------- lab tab
function renderLab() {
  const p = H('div', { style: { paddingBottom: '110px' } });
  p.append(H('div', { class: 'page', style: { paddingBottom: 0 } }, H('div', { class: 'h1' }, '🧪 Lab'), H('div', { class: 'muted', style: { marginBottom: '10px' } }, 'A free play sandbox. Break things, nothing is graded.')));
  const tabs = H('div', { class: 'labtabs' });
  LAB_TABS.forEach(([k, label]) => tabs.append(H('button', { class: 'chip' + (k === labTab ? ' on' : ''), onclick: () => { labTab = k; sfx('tap'); scrollMem.lab = 0; renderHome(); } }, label)));
  const box = H('div', { class: 'widget', style: { margin: '0 16px' } });
  W[labTab](box, () => {}, true);
  p.append(tabs, box);
  requestAnimationFrame(() => { const on = tabs.querySelector('.on'); if (on) tabs.scrollLeft = on.offsetLeft - 40; });
  return p;
}

// ---------------------------------------------------------- settings
function openSettings() {
  sfx('tap');
  sheet((sh, close) => {
    const tog = (label, key) => {
      const b = H('button', { class: 'sw2' + (S.settings[key] ? ' on' : ''), onclick: () => { S.settings[key] = !S.settings[key]; b.classList.toggle('on'); save(); sfx('tap'); if (key === 'unlockAll') renderHome(); } });
      return H('div', { class: 'setrow' }, H('span', {}, label), b);
    };
    sh.append(H('h2', {}, 'Settings'));
    sh.append(tog('🔊 Sound & haptics', 'sound'));
    sh.append(tog('🔓 Unlock everything', 'unlockAll'));
    sh.append(H('div', { class: 'setrow' }, H('span', {}, '📱 Full screen'), H('button', { class: 'btn sm blue', onclick: async () => {
      try { if (document.fullscreenElement) await document.exitFullscreen(); else await (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement); }
      catch (e) { toast('Full screen isn\'t allowed here. Try "Add to Home Screen".'); }
    }}, 'TOGGLE')));
    const sync = { synced: '☁️ Synced across devices', connecting: '⏳ Connecting…', local: '📱 Saved on this device', error: '⚠️ Sync error: saved locally' }[cloud.status];
    sh.append(H('div', { class: 'setrow' }, H('span', {}, 'Progress'), H('span', { class: 'muted small' }, sync)));
    let armed = false;
    const rb = H('button', { class: 'btn ghost', style: { marginTop: '18px', color: 'var(--red)', borderColor: '#ff4b4b55' }, onclick: () => {
      if (!armed) { armed = true; rb.textContent = 'TAP AGAIN TO WIPE EVERYTHING'; rb.style.background = '#ff4b4b22'; return; }
      const keep = S.settings; S = blank(); S.settings = keep; save(); close(); renderHome(); toast('Progress reset');
    }}, 'RESET ALL PROGRESS');
    sh.append(rb, H('button', { class: 'btn', style: { marginTop: '12px' }, onclick: close }, 'DONE'));
  });
}

// ============================================================
//  SESSION PLAYER (lessons, drills, challenges, review)
// ============================================================
function startSession(item) {
  const queue = item.steps.map((s, i) => ({ ...s, _key: s._key || `${item.id}:${i}` }));
  const total = queue.length;
  const sess = { item, queue, total, doneCount: 0, mistakes: 0, answered: 0, t0: Date.now(), timer: null };
  $app.innerHTML = '';
  const scr = H('div', { class: 'screen player' });
  const bar = H('i', { style: { width: '0%' } });
  const timerEl = H('div', { class: 'timer' });
  const head = H('div', { class: 'lhead' },
    H('button', { class: 'x', onclick: () => confirmQuit(sess) }, '✕'),
    H('div', { class: 'pbar' }, bar), item.timed ? timerEl : null);
  const body = H('div', { class: 'lbody' }), foot = H('div', { class: 'lfoot' });
  scr.append(head, body, foot); $app.append(scr);
  if (item.timed) sess.timer = setInterval(() => { timerEl.textContent = ((Date.now() - sess.t0) / 1000).toFixed(1) + 's'; }, 100);
  sess.ui = { bar, body, foot, scr };
  nextStep(sess);
}
function confirmQuit(sess) {
  sheet((sh, close) => {
    sh.append(H('div', { class: 'center', style: { fontSize: '54px' } }, '🥺'));
    sh.append(H('h2', { class: 'center' }, 'Leave now?'), H('p', { class: 'muted center' }, 'You\'ll lose this session\'s progress.'));
    sh.append(H('button', { class: 'btn blue', onclick: close }, 'KEEP LEARNING'));
    sh.append(H('button', { class: 'linkbtn', style: { width: '100%', marginTop: '8px', color: 'var(--red)' }, onclick: () => { clearInterval(sess.timer); close(); renderHome(); } }, 'END SESSION'));
  });
}
function nextStep(sess) {
  const { body, foot, bar } = sess.ui;
  bar.style.width = (100 * sess.doneCount / sess.total) + '%';
  if (!sess.queue.length) return finishSession(sess);
  const step = sess.queue[0];
  body.innerHTML = ''; foot.className = 'lfoot'; foot.innerHTML = '';
  body.scrollTop = 0;
  const card = H('div', { class: 'pop' });
  body.append(card);
  const advance = () => { sess.queue.shift(); sess.doneCount++; sfx('tap'); nextStep(sess); };

  if (step.t === 'info') {
    card.append(H('div', { class: 'kind' }, '💡 LEARN'), H('div', { class: 'qh' }, step.h));
    if (step.p && !step.code) card.append(H('div', { class: 'ptext', html: step.p }));
    if (step.code) { if (step.p) card.append(H('div', { class: 'ptext', html: step.p })); card.append(H('pre', { class: 'code', html: hl(step.code, step.lang) })); }
    foot.append(H('button', { class: 'btn', onclick: advance }, 'CONTINUE'));
    return;
  }
  if (step.t === 'widget') {
    card.append(H('div', { class: 'kind', style: { color: 'var(--teal)' } }, '🕹 PLAY'), H('div', { class: 'qh' }, step.h), H('div', { class: 'ptext', html: step.p }));
    const box = H('div', { class: 'widget' }); card.append(box);
    const btn = H('button', { class: 'btn', disabled: true, onclick: advance }, 'CONTINUE');
    const skip = H('button', { class: 'linkbtn', style: { width: '100%' }, onclick: advance }, 'skip');
    W[step.w](box, () => { if (btn.disabled) { btn.disabled = false; sfx('match'); skip.remove(); } }, false);
    foot.append(btn, skip);
    return;
  }
  // ---- question
  card.append(H('div', { class: 'kind', style: { color: 'var(--gold)' } }, { mcq: '❓ CHOOSE', tf: '⚖️ TRUE OR FALSE', tap: '👆 TAP THE CODE', order: '🔢 PUT IN ORDER', match: '🔗 MATCH PAIRS', fill: '✏️ FILL THE BLANKS' }[step.t]));
  card.append(H('div', { class: 'qh', html: step.q }));
  const checkBtn = H('button', { class: 'btn', disabled: true }, 'CHECK');
  const ctx = { setReady: (r) => { checkBtn.disabled = !r; }, mistake: () => { sess.mistakes++; S.miss[step._key] = (S.miss[step._key] || 0) + 1; }, autoCheck: () => checkBtn.click() };
  const q = Q[step.t](card, step, ctx);
  foot.append(checkBtn);
  checkBtn.onclick = () => {
    const r = q.check();
    sess.answered++;
    if (r.ok) {
      sfx('correct');
      if (sess.item.kind === 'review' && S.miss[step._key]) S.miss[step._key]--;
      showFeedback(sess, true, step, r, () => { sess.queue.shift(); sess.doneCount++; nextStep(sess); });
    } else {
      sfx('wrong'); ctx.mistake();
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      showFeedback(sess, false, step, r, () => { sess.queue.push(sess.queue.shift()); nextStep(sess); });
    }
  };
}
function showFeedback(sess, ok, step, r, next) {
  const { foot } = sess.ui;
  foot.className = 'lfoot ' + (ok ? 'good' : 'bad'); foot.innerHTML = '';
  const praise = ['Nice!', 'Great job!', 'Correct!', 'Nailed it!', 'Awesome!', 'You got it!'][Math.floor(Math.random() * 6)];
  const fb = H('div', { class: 'fb' }, H('div', { class: 'fi' }, ok ? '✅' : '❌'),
    H('div', {}, H('h3', {}, ok ? praise : 'Not quite'),
      !ok && r.answer ? H('div', { class: 'ans' }, 'Answer: ' + r.answer) : null,
      step.why ? H('p', {}, step.why) : null,
      !ok ? H('p', { class: 'muted small', style: { marginTop: '4px' } }, 'You\'ll see this one again before the end.') : null));
  foot.append(fb, H('button', { class: 'btn ' + (ok ? '' : 'red'), onclick: next }, 'CONTINUE'));
}
function finishSession(sess) {
  clearInterval(sess.timer);
  const it = sess.item, secs = (Date.now() - sess.t0) / 1000;
  const qCount = it.steps.filter(s => !['info', 'widget'].includes(s.t)).length;
  const acc = qCount ? Math.round(100 * qCount / Math.max(qCount, qCount + sess.mistakes)) : 100;
  const stars = sess.mistakes === 0 ? 3 : sess.mistakes <= 2 ? 2 : 1;
  let xp = XP[it.kind] || 10; if (sess.mistakes === 0 && qCount) xp += 5;
  const prev = S.done[it.id];
  const newBest = it.timed && (!prev || !prev.best || secs < prev.best);
  if (it.kind !== 'review') S.done[it.id] = { stars: Math.max(stars, prev?.stars || 0), best: it.timed ? Math.min(secs, prev?.best ?? 1e9) : prev?.best, at: Date.now() };
  S.xp += xp; S.days[todayKey()] = (S.days[todayKey()] || 0) + xp;
  const streakUp = bumpStreak();
  save();
  sfx('done'); confetti();
  $app.innerHTML = '';
  const scr = H('div', { class: 'screen' });
  const r = H('div', { class: 'results' });
  r.append(H('div', { class: 'trophy' }, it.kind === 'challenge' ? '👑' : it.kind === 'review' ? '🎲' : stars === 3 ? '🏆' : '🎉'));
  r.append(H('h1', {}, it.kind === 'lesson' ? 'Lesson complete!' : it.kind === 'review' ? 'Mix complete!' : newBest && prev ? 'New record!' : 'Complete!'));
  const rs = H('div', { class: 'rstars' });
  for (let i = 0; i < 3; i++) rs.append(H('span', { class: i < stars ? 'on' : '', style: { animationDelay: (0.3 + i * 0.2) + 's' } }, '★'));
  r.append(rs);
  const box = (t, v, c) => H('div', { class: 'rbox', style: { '--c': c } }, H('div', { class: 't' }, t), H('div', { class: 'v' }, v));
  r.append(H('div', { class: 'rboxes' }, box('TOTAL XP', '+' + xp, '#ffc800'), box(it.timed ? 'TIME' : 'ACCURACY', it.timed ? secs.toFixed(1) + 's' : acc + '%', '#58cc02'), box('STREAK', '🔥 ' + S.streak.count, '#ff9600')));
  if (streakUp) r.append(H('div', { class: 'muted', style: { marginBottom: '12px' } }, S.streak.count > 1 ? `Streak extended to ${S.streak.count} days!` : 'Streak started! Come back tomorrow.'));
  r.append(H('button', { class: 'btn', onclick: () => { renderHome(); } }, 'CONTINUE'));
  scr.append(r); $app.append(scr);
}

// ============================================================
//  QUESTION RENDERERS
// ============================================================
const Q = {};
Q.mcq = (card, s, ctx) => {
  if (s.code) card.append(H('pre', { class: 'code', html: hl(s.code, s.lang) }));
  let sel = null;
  const order = shuffle(s.o.map((t, i) => i));
  const wrap = H('div', { class: 'opts' });
  const btns = order.map((oi, n) => {
    const b = H('button', { class: 'opt', onclick: () => { sel = oi; sfx('tap'); btns.forEach(x => x.classList.toggle('sel', x === b)); ctx.setReady(true); } }, H('span', { class: 'n' }, n + 1), H('span', { html: s.o[oi] }));
    b._oi = oi; return b;
  });
  wrap.append(...btns); card.append(wrap);
  return { check: () => {
    const ok = sel === s.a;
    btns.forEach(b => { b.disabled = true; if (b._oi === s.a) b.classList.add('right'); else if (b._oi === sel) b.classList.add('wrong'); });
    return { ok, answer: stripTags(s.o[s.a]) };
  }};
};
Q.tf = (card, s, ctx) => {
  let sel = null;
  const wrap = H('div', { class: 'tf' });
  const mk = (v, label) => H('button', { class: 'opt', onclick: (e) => { sel = v; sfx('tap'); wrap.querySelectorAll('.opt').forEach(x => x.classList.toggle('sel', x === e.currentTarget)); ctx.setReady(true); } }, label);
  const t = mk(true, '👍 True'), f = mk(false, '👎 False'); wrap.append(t, f); card.append(wrap);
  return { check: () => { (s.a ? t : f).classList.add('right'); if (sel !== s.a) (sel ? t : f).classList.add('wrong'); return { ok: sel === s.a, answer: s.a ? 'True' : 'False' }; } };
};
Q.tap = (card, s, ctx) => {
  const pre = H('pre', { class: 'code' });
  const parts = s.code.split(/⟦|⟧/); const toks = [];
  let sel = null;
  parts.forEach((p, i) => {
    if (i % 2 === 0) pre.append(H('span', { html: hl(p, 'usda') }));
    else {
      const ti = toks.length;
      const b = H('button', { class: 'tok', html: hl(p, 'usda'), onclick: () => { sel = ti; sfx('tap'); toks.forEach((x, k) => x.classList.toggle('sel', k === ti)); ctx.setReady(true); } });
      b._txt = p; toks.push(b); pre.append(b);
    }
  });
  card.append(pre, H('div', { class: 'muted small center' }, 'Tap a highlighted token'));
  return { check: () => { toks.forEach((b, k) => { b.disabled = true; if (k === s.a) b.classList.add('right'); else if (k === sel) b.classList.add('wrong'); }); return { ok: sel === s.a, answer: toks[s.a]._txt }; } };
};
Q.order = (card, s, ctx) => {
  const mono = s.items.some(x => /[()'=.]/.test(x) && x.length > 18);
  let picked = [];
  let bankOrder = shuffle(s.items.map((_, i) => i));
  if (bankOrder.every((v, i) => v === i) && s.items.length > 1) bankOrder = [...bankOrder.slice(1), bankOrder[0]];
  const line = H('div', { class: 'ansline' + (mono ? ' col' : '') }), bank = H('div', { class: 'bank' + (mono ? ' col' : '') });
  const render = () => {
    line.innerHTML = ''; bank.innerHTML = '';
    picked.forEach((i, n) => line.append(H('button', { class: 'wchip' + (mono ? ' mono' : ''), onclick: () => { picked.splice(n, 1); sfx('tap'); render(); } }, H('span', { class: 'ix' }, n + 1), s.items[i])));
    bankOrder.forEach(i => bank.append(H('button', { class: 'wchip' + (mono ? ' mono' : '') + (picked.includes(i) ? ' used' : ''), onclick: () => { if (picked.includes(i)) return; picked.push(i); sfx('tap'); render(); } }, s.items[i])));
    ctx.setReady(picked.length === s.items.length);
  };
  render(); card.append(H('div', { class: 'muted small', style: { marginBottom: '6px' } }, 'Tap in order. Tap an answer to send it back.'), line, bank);
  return { check: () => { const ok = picked.every((v, i) => v === i); return { ok, answer: s.items.join(' → ') }; } };
};
Q.match = (card, s, ctx) => {
  const L = shuffle(s.pairs.map((p, i) => i)), R = shuffle(s.pairs.map((p, i) => i));
  let sl = null, sr = null, matched = 0, errors = 0;
  const grid = H('div', { class: 'match' });
  const lb = [], rb = [];
  const tryPair = () => {
    if (sl == null || sr == null) return;
    const a = lb.find(b => b._i === sl), b = rb.find(x => x._i === sr);
    if (sl === sr) {
      a.classList.add('ok'); b.classList.add('ok'); a.classList.remove('sel'); b.classList.remove('sel');
      matched++; sfx('match');
      if (matched === s.pairs.length) { ctx.setReady(true); setTimeout(() => ctx.autoCheck(), 350); }
    } else {
      errors++; ctx.mistake(); sfx('wrong');
      [a, b].forEach(x => { x.classList.remove('sel'); x.classList.add('bad'); setTimeout(() => x.classList.remove('bad'), 450); });
    }
    sl = sr = null;
  };
  for (let n = 0; n < s.pairs.length; n++) {
    const l = H('button', { class: 'mcell l', onclick: () => { sl = l._i; sfx('tap'); lb.forEach(x => x.classList.toggle('sel', x === l)); tryPair(); } }, s.pairs[L[n]][0]); l._i = L[n]; lb.push(l);
    const r = H('button', { class: 'mcell', onclick: () => { sr = r._i; sfx('tap'); rb.forEach(x => x.classList.toggle('sel', x === r)); tryPair(); } }, s.pairs[R[n]][1]); r._i = R[n]; rb.push(r);
    grid.append(l, r);
  }
  card.append(grid);
  return { check: () => ({ ok: true, answer: '' , errors }) };
};
Q.fill = (card, s, ctx) => {
  const parts = s.code.split('▢');
  const filled = s.blanks.map(() => null);
  const words = shuffle([...s.blanks, ...(s.extra || [])]);
  const pre = H('pre', { class: 'code' }), bank = H('div', { class: 'bank' });
  const slots = [];
  const render = () => {
    pre.innerHTML = ''; slots.length = 0;
    const nextEmpty = filled.indexOf(null);
    parts.forEach((p, i) => {
      pre.append(H('span', { html: hl(p, s.lang || 'usda') }));
      if (i < parts.length - 1) {
        const sl = H('span', { class: 'slot' + (filled[i] == null ? ' blank' : '') + (i === nextEmpty ? ' next' : ''), onclick: () => { if (filled[i] != null) { filled[i] = null; sfx('tap'); render(); } } }, filled[i] != null ? words[filled[i]] : '____');
        slots.push(sl); pre.append(sl);
      }
    });
    bank.innerHTML = '';
    words.forEach((w, wi) => bank.append(H('button', { class: 'wchip mono' + (filled.includes(wi) ? ' used' : ''), onclick: () => {
      if (filled.includes(wi)) return; const e = filled.indexOf(null); if (e < 0) return; filled[e] = wi; sfx('tap'); render();
    }}, w)));
    ctx.setReady(!filled.includes(null));
  };
  render(); card.append(pre, bank);
  return { check: () => {
    const ok = filled.every((wi, i) => words[wi] === s.blanks[i]);
    slots.forEach((sl, i) => sl.classList.add(words[filled[i]] === s.blanks[i] ? 'right' : 'wrong'));
    return { ok, answer: s.blanks.join(' · ') };
  }};
};

// ---------------------------------------------------------- boot
renderHome();
setTimeout(initCloud, 0);
