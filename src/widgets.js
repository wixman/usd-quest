// ============================================================
//  INTERACTIVE WIDGETS  (used in lessons AND the Lab)
//  signature: (el, done, free) -> void
//  call done() once the learner has interacted enough
// ============================================================

function H(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    const v = attrs[k];
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') { for (const sk in v) { if (sk.startsWith('--')) e.style.setProperty(sk, v[sk]); else e.style[sk] = v[sk]; } }
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
const once = (fn) => { let d = false; return () => { if (!d) { d = true; fn(); } }; };
function counter(n, done) { const seen = new Set(); return (k) => { seen.add(k); if (seen.size >= n) done(); }; }
const PAL = { red: '#ff4b4b', blue: '#1cb0f6', green: '#58cc02', gold: '#ffc800', purple: '#ce82ff', pink: '#ff86d0', teal: '#2bd9c4', orange: '#ff9600', grey: '#8b95a7' };

function vpFrame(w, h, inner) {
  // dark viewport with a grid floor
  let grid = '';
  for (let x = 0; x <= w; x += 20) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" />`;
  for (let y = 0; y <= h; y += 20) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" />`;
  return `<svg viewBox="0 0 ${w} ${h}" class="vp"><defs>
    <radialGradient id="shine" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs><g class="grid">${grid}</g>${inner}</svg>`;
}
function ballSVG(cx, cy, r, color, extra = '') {
  return `<g ${extra}><ellipse cx="${cx}" cy="${cy + r + 4}" rx="${r * 0.9}" ry="${r * 0.22}" fill="#000" opacity=".35"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#shine)"/></g>`;
}

const W = {};

// ---------------------------------------------------------- stageTree
W.stageTree = (el, done) => {
  const prims = [
    { p: '/World', t: 'Xform', d: 0, props: ['xformOpOrder'] },
    { p: '/World/Car', t: 'Xform', d: 1, props: ['kind = "component"', 'xformOp:translate'] },
    { p: '/World/Car/Body', t: 'Mesh', d: 2, props: ['point3f[] points', 'int[] faceVertexCounts', 'rel material:binding → </Mats/Red>'], id: 'body' },
    { p: '/World/Car/Wheel_L', t: 'Cylinder', d: 2, props: ['double radius = 0.4', 'double height = 0.3'], id: 'wl' },
    { p: '/World/Car/Wheel_R', t: 'Cylinder', d: 2, props: ['double radius = 0.4', 'double height = 0.3'], id: 'wr' },
    { p: '/World/Ground', t: 'Mesh', d: 1, props: ['point3f[] points', 'color3f[] primvars:displayColor'], id: 'ground' },
    { p: '/World/Sun', t: 'DistantLight', d: 1, props: ['float inputs:intensity = 3', 'float inputs:angle = 0.53'], id: 'sun' },
    { p: '/Mats', t: 'Scope', d: 0, props: [] },
    { p: '/Mats/Red', t: 'Material', d: 1, props: ['token outputs:surface.connect'] },
  ];
  const tick = counter(3, done);
  const vp = H('div', { class: 'vpwrap' });
  const info = H('div', { class: 'treeinfo', html: '<span class="muted">Tap a prim ↓</span>' });
  const list = H('div', { class: 'tree' });
  let sel = null;
  const drawVP = () => {
    const hl = (id) => sel && sel.id === id ? 'stroke="#ffc800" stroke-width="4"' : '';
    vp.innerHTML = vpFrame(320, 150, `
      <rect x="0" y="118" width="320" height="32" fill="#2a3a2a" ${hl('ground')}/>
      <circle cx="270" cy="30" r="14" fill="#ffd84d" ${hl('sun')}/>
      <rect x="95" y="62" width="130" height="38" rx="10" fill="${PAL.red}" ${hl('body')}/>
      <rect x="120" y="44" width="70" height="24" rx="8" fill="#ff7a7a" ${hl('body')}/>
      <circle cx="125" cy="104" r="15" fill="#222" ${hl('wl')}/>
      <circle cx="195" cy="104" r="15" fill="#222" ${hl('wr')}/>`);
  };
  prims.forEach(pr => {
    const name = pr.p.split('/').pop();
    const row = H('button', { class: 'trow', style: { paddingLeft: (10 + pr.d * 18) + 'px' }, onclick: () => {
      sel = pr; tick(pr.p); sfx('tap');
      list.querySelectorAll('.trow').forEach(r => r.classList.remove('on')); row.classList.add('on');
      info.innerHTML = `<div class="bigpath">${pr.p}</div><span class="pill b">${pr.t}</span>` +
        (pr.props.length ? `<div class="props">${pr.props.map(x => `<div>• <code>${esc(x)}</code></div>`).join('')}</div>` : '<div class="muted small">No properties: just organises.</div>');
      drawVP();
    }}, H('span', { class: 'tico' }, pr.d === 0 ? '▾' : '└'), name, H('span', { class: 'ttype' }, pr.t));
    list.append(row);
  });
  drawVP();
  el.append(vp, list, info);
};

// ---------------------------------------------------------- specifiers
W.specifiers = (el, done) => {
  const prims = [{ n: 'Ball', s: 'def', c: PAL.red }, { n: 'Box', s: 'over', c: PAL.blue }, { n: '_class_Cone', s: 'class', c: PAL.gold }];
  const tick = counter(3, done);
  const vp = H('div', { class: 'vpwrap' }), code = H('pre', { class: 'code sm' }), ctr = H('div', { class: 'specrows' });
  const render = () => {
    let inner = '';
    prims.forEach((p, i) => {
      const x = 60 + i * 100, y = 75;
      const shape = i === 0 ? `<circle cx="${x}" cy="${y}" r="30" fill="${p.c}"/>` : i === 1 ? `<rect x="${x - 28}" y="${y - 28}" width="56" height="56" rx="6" fill="${p.c}"/>` : `<path d="M${x} ${y - 32} L${x + 30} ${y + 28} L${x - 30} ${y + 28}Z" fill="${p.c}"/>`;
      if (p.s === 'def') inner += `<g class="popin">${shape}</g>`;
      else inner += `<g opacity=".28" stroke="#fff" stroke-dasharray="5 5" fill="none">${shape.replace(/fill="[^"]+"/, 'fill="none" stroke="#fff"')}</g><text x="${x}" y="${y + 52}" class="vlabel">${p.s === 'over' ? 'undefined' : 'abstract'}</text>`;
    });
    vp.innerHTML = vpFrame(320, 150, inner);
    code.innerHTML = hl(prims.map(p => `${p.s} ${p.n === 'Box' ? 'Cube' : p.n === 'Ball' ? 'Sphere' : 'Cone'} "${p.n}" {}`).join('\n'), 'usda');
  };
  prims.forEach((p, i) => {
    const chips = ['def', 'over', 'class'].map(s => H('button', { class: 'chip' + (p.s === s ? ' on' : ''), onclick: (e) => {
      p.s = s; tick(i + s); sfx('tap');
      e.target.parentNode.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.textContent === s)); render();
    }}, s));
    ctr.append(H('div', { class: 'specrow' }, H('b', { style: { color: p.c } }, p.n), H('div', { class: 'chips' }, chips)));
  });
  render(); el.append(vp, ctr, code);
};

// ---------------------------------------------------------- xformOrder
W.xformOrder = (el, done, free) => {
  let order = ['translate', 'rotate', 'scale'];
  const v = { tx: 70, rot: 40, sx: 2 };
  const fin = once(done);
  const vp = H('div', { class: 'vpwrap' }), list = H('div', { class: 'oplist' }), note = H('div', { class: 'muted small center' });
  const apply = (pts, ops) => {
    for (const op of [...ops].reverse()) pts = pts.map(([x, y]) => {
      if (op === 'translate') return [x + v.tx, y];
      if (op === 'scale') return [x * v.sx, y];
      const a = v.rot * Math.PI / 180; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
    });
    return pts;
  };
  const sq = [[-15, -15], [15, -15], [15, 15], [-15, 15]];
  const toSvg = (pts) => pts.map(([x, y]) => `${160 + x},${90 - y}`).join(' ');
  const render = () => {
    const ghost = apply(sq, ['translate', 'rotate', 'scale']);
    const cur = apply(sq, order);
    const c = cur[2];
    vp.innerHTML = vpFrame(320, 180, `
      <line x1="160" y1="0" x2="160" y2="180" stroke="#ffffff22"/><line x1="0" y1="90" x2="320" y2="90" stroke="#ffffff22"/>
      <polygon points="${toSvg(ghost)}" fill="none" stroke="#ffffff55" stroke-dasharray="4 4"/>
      <polygon points="${toSvg(cur)}" fill="${PAL.gold}" stroke="#fff" stroke-width="2" class="morph"/>
      <circle cx="${160 + c[0]}" cy="${90 - c[1]}" r="5" fill="${PAL.red}"/>
      <text x="8" y="172" class="vlabel" text-anchor="start">dashed = standard TRS</text>`);
    list.innerHTML = '';
    order.forEach((op, i) => {
      list.append(H('div', { class: 'oprow' },
        H('span', { class: 'opi' }, i + 1),
        H('code', {}, `xformOp:${op === 'rotate' ? 'rotateZ' : op}`),
        H('div', { class: 'opbtns' },
          H('button', { class: 'mini', disabled: i === 0, onclick: () => { [order[i - 1], order[i]] = [order[i], order[i - 1]]; sfx('tap'); fin(); render(); } }, '▲'),
          H('button', { class: 'mini', disabled: i === order.length - 1, onclick: () => { [order[i + 1], order[i]] = [order[i], order[i + 1]]; sfx('tap'); fin(); render(); } }, '▼'))));
    });
    note.innerHTML = `Points get: <b>${[...order].reverse().join(' → ')}</b>`;
  };
  const slider = (label, key, min, max) => H('label', { class: 'sl' }, H('span', {}, label),
    H('input', { type: 'range', min, max, step: key === 'sx' ? 0.1 : 1, value: v[key], oninput: (e) => { v[key] = +e.target.value; render(); } }));
  render();
  el.append(vp, note, list, H('div', { class: 'sliders' }, slider('translate X', 'tx', -100, 120), slider('rotate', 'rot', -180, 180), slider('scale X', 'sx', 0.3, 3)));
};

// ---------------------------------------------------------- timeSamples
W.timeSamples = (el, done) => {
  const samples = [[1, 0], [12, 5], [24, 0]];
  let f = 1, held = false, playing = null;
  const tick = counter(6, done);
  const vp = H('div', { class: 'vpwrap' }), readout = H('div', { class: 'readout' });
  const val = (t) => {
    if (t <= samples[0][0]) return samples[0][1];
    if (t >= samples[samples.length - 1][0]) return samples[samples.length - 1][1];
    for (let i = 0; i < samples.length - 1; i++) {
      const [a, va] = samples[i], [b, vb] = samples[i + 1];
      if (t >= a && t <= b) return held ? va : va + (vb - va) * (t - a) / (b - a);
    }
  };
  const X = (t) => 20 + (t - 1) * (280 / 29), Y = (v) => 150 - v * 22;
  const render = () => {
    let path = '';
    for (let t = 1; t <= 30; t += held ? 0.05 : 1) path += (path ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(val(t)).toFixed(1);
    const dots = samples.map(([t, v]) => `<circle cx="${X(t)}" cy="${Y(v)}" r="6" fill="${PAL.gold}" stroke="#000" stroke-width="2"/>`).join('');
    vp.innerHTML = vpFrame(320, 175, `
      <path d="${path}" fill="none" stroke="${PAL.teal}" stroke-width="3"/>${dots}
      <line x1="${X(f)}" y1="0" x2="${X(f)}" y2="175" stroke="${PAL.red}" stroke-width="2"/>
      ${ballSVG(X(f), Y(val(f)) - 14, 12, PAL.red)}`);
    const exact = samples.find(s => s[0] === f);
    readout.innerHTML = `frame <b>${f}</b> → translate.y = <b>${val(f).toFixed(2)}</b> <span class="pill ${exact ? 'y' : 'b'}">${exact ? 'sample' : (f > 24 || f < 1 ? 'held' : held ? 'held' : 'interpolated')}</span>`;
  };
  const slider = H('input', { type: 'range', min: 1, max: 30, value: 1, class: 'big', oninput: (e) => { f = +e.target.value; tick(f); render(); } });
  const playBtn = H('button', { class: 'btn sm blue', onclick: () => {
    if (playing) { clearInterval(playing); playing = null; playBtn.textContent = '▶ PLAY'; return; }
    playBtn.textContent = '⏸ PAUSE';
    playing = setInterval(() => { if (!el.isConnected) { clearInterval(playing); return; } f = f >= 30 ? 1 : f + 1; slider.value = f; tick(f); render(); }, 90);
  }}, '▶ PLAY');
  const modeBtns = H('div', { class: 'chips' }, ['linear', 'held'].map(m => H('button', { class: 'chip' + (m === 'linear' ? ' on' : ''), onclick: (e) => {
    held = m === 'held'; sfx('tap'); e.target.parentNode.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === e.target)); render();
  }}, m)));
  render();
  el.append(vp, readout, slider, H('div', { class: 'row' }, playBtn, modeBtns));
};

// ---------------------------------------------------------- primvarInterp
W.primvarInterp = (el, done) => {
  const modes = { constant: 1, uniform: 2, vertex: 6, faceVarying: 8 };
  let mode = 'constant';
  const tick = counter(3, done);
  const vp = H('div', { class: 'vpwrap' }), info = H('div', { class: 'readout' });
  const P = [[40, 30], [160, 30], [280, 30], [40, 140], [160, 140], [280, 140]];
  const render = () => {
    let fills = ['', ''], defs = '', dots = '';
    const grad = (id, a, b) => { defs += `<linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`; return `url(#${id})`; };
    if (mode === 'constant') fills = [PAL.purple, PAL.purple];
    if (mode === 'uniform') fills = [PAL.red, PAL.blue];
    if (mode === 'vertex') {
      fills = [grad('g0', PAL.red, PAL.gold), grad('g1', PAL.gold, PAL.blue)];
      const vc = [PAL.red, PAL.gold, PAL.blue, PAL.red, PAL.gold, PAL.blue];
      dots = P.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="${vc[i]}" stroke="#000" stroke-width="2"/>`).join('');
    }
    if (mode === 'faceVarying') {
      fills = [grad('g0', PAL.red, PAL.gold), grad('g1', PAL.green, PAL.blue)];
      const c0 = [[40, 30, PAL.red], [160, 30, PAL.gold], [160, 140, PAL.gold], [40, 140, PAL.red]];
      const c1 = [[160, 30, PAL.green], [280, 30, PAL.blue], [280, 140, PAL.blue], [160, 140, PAL.green]];
      dots = [...c0.map(([x, y, c]) => [x + (x < 100 ? 12 : -12), y + (y < 100 ? 12 : -12), c]), ...c1.map(([x, y, c]) => [x + (x < 200 ? 12 : -12), y + (y < 100 ? 12 : -12), c])]
        .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="#000" stroke-width="2"/>`).join('');
    }
    vp.innerHTML = vpFrame(320, 170, `<defs>${defs}</defs>
      <polygon points="40,30 160,30 160,140 40,140" fill="${fills[0]}" stroke="#fff" stroke-width="2"/>
      <polygon points="160,30 280,30 280,140 160,140" fill="${fills[1]}" stroke="#fff" stroke-width="2"/>
      ${mode !== 'faceVarying' ? P.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff"/>`).join('') : ''}${dots}
      <text x="100" y="162" class="vlabel">face 0</text><text x="220" y="162" class="vlabel">face 1</text>`);
    const n = modes[mode];
    info.innerHTML = `<b>${mode}</b> → <b class="big">${n}</b> value${n > 1 ? 's' : ''}<div class="muted small">2 faces · 6 points · 8 face-vertices${mode === 'faceVarying' ? ' · note the seam in the middle!' : ''}</div>`;
  };
  const chips = H('div', { class: 'chips wrap' }, Object.keys(modes).map(m => H('button', { class: 'chip' + (m === mode ? ' on' : ''), onclick: (e) => {
    mode = m; tick(m); sfx('tap'); chips.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === e.target)); render();
  }}, m)));
  render(); el.append(vp, chips, info);
};

// ---------------------------------------------------------- layerStack
W.layerStack = (el, done, free) => {
  const COLORS = [null, 'red', 'blue', 'green', 'gold', 'purple'];
  const RAD = [null, 14, 24, 36], XS = [null, 70, 160, 250];
  const layers = [
    { n: 'session', ops: {}, mute: false },
    { n: 'lighting.usda', ops: { color: 'red' }, mute: false },
    { n: 'anim.usda', ops: { x: 250 }, mute: false },
    { n: 'layout.usda', ops: { color: 'blue', radius: 24, x: 70 }, mute: false },
    { n: 'asset.usda', ops: { color: 'gold', radius: 14, x: 160 }, mute: false },
  ];
  const lcol = ['#ffc800', '#ff4b4b', '#2bd9c4', '#1cb0f6', '#ce82ff'];
  layers.forEach((l, i) => l.c = lcol[i]);
  const fin = once(done);
  const vp = H('div', { class: 'vpwrap' }), stack = H('div', { class: 'stack' }), res = H('div', { class: 'resolved' });
  const resolve = (k) => { for (const l of layers) if (!l.mute && l.ops[k] != null) return [l.ops[k], l]; return [null, null]; };
  const cyc = (arr, cur) => arr[(arr.indexOf(cur ?? null) + 1) % arr.length];
  const render = () => {
    const [c, lc] = resolve('color'), [r, lr] = resolve('radius'), [x, lx] = resolve('x');
    vp.innerHTML = vpFrame(320, 130, c || r || x ? ballSVG(x ?? 160, 110 - (r ?? 20) - 4, r ?? 20, PAL[c] ?? '#888', 'class="morph"') : `<text x="160" y="70" class="vlabel">no opinions → nothing</text>`);
    res.innerHTML = '<div class="rh">RESOLVED /World/Ball</div>' + [['color', c, lc], ['radius', r, lr], ['x', x, lx]].map(([k, v, l]) =>
      `<div class="rrow"><code>${k}</code><b>${v == null ? '—' : (k === 'color' ? `<span class="sw" style="background:${PAL[v]}"></span>${v}` : v)}</b><span class="win" style="color:${l ? l.c : '#666'}">${l ? '← ' + l.n : 'fallback'}</span></div>`).join('');
    stack.innerHTML = '';
    stack.append(H('div', { class: 'stackhead' }, '▲ STRONGEST'));
    layers.forEach((l, i) => {
      const opChip = (k, label, vals) => H('button', { class: 'opchip' + (l.ops[k] == null ? ' none' : ''), disabled: !free && !l.ops.hasOwnProperty(k) && false, onclick: () => {
        if (!free) return; l.ops[k] = cyc(vals, l.ops[k]); if (l.ops[k] == null) delete l.ops[k]; sfx('tap'); render();
      }}, l.ops[k] == null ? (free ? '+' + label : '') : (k === 'color' ? H('span', {}, H('span', { class: 'sw', style: { background: PAL[l.ops[k]] } }), l.ops[k]) : `${label}=${l.ops[k]}`));
      const chips = [['color', 'color', COLORS], ['radius', 'r', RAD], ['x', 'x', XS]].map(([k, lb, v]) => opChip(k, lb, v)).filter(ch => free || ch.textContent);
      stack.append(H('div', { class: 'layer' + (l.mute ? ' muted' : ''), style: { borderLeftColor: l.c } },
        H('div', { class: 'lname' }, H('b', {}, l.n), H('div', { class: 'lchips' }, chips.length ? chips : H('span', { class: 'muted small' }, 'no opinions'))),
        H('div', { class: 'lbtns' },
          H('button', { class: 'mini', title: 'mute', onclick: () => { l.mute = !l.mute; sfx('tap'); fin(); render(); } }, l.mute ? '🙈' : '👁'),
          H('button', { class: 'mini', disabled: i === 0, onclick: () => { [layers[i - 1], layers[i]] = [layers[i], layers[i - 1]]; sfx('tap'); fin(); render(); } }, '▲'),
          H('button', { class: 'mini', disabled: i === layers.length - 1, onclick: () => { [layers[i + 1], layers[i]] = [layers[i], layers[i + 1]]; sfx('tap'); fin(); render(); } }, '▼'))));
    });
    stack.append(H('div', { class: 'stackhead' }, '▼ WEAKEST'));
  };
  render();
  el.append(vp, res, stack);
  if (free) el.append(H('div', { class: 'muted small center' }, 'Tap opinion chips to cycle values (or add one with +).'));
};

// ---------------------------------------------------------- variantSwitch
W.variantSwitch = (el, done) => {
  const sets = { paint: ['red', 'blue', 'green'], fins: ['none', 'small', 'big'], window: ['round', 'square'] };
  const sel = { paint: 'red', fins: 'small', window: 'round' };
  let shotOverride = false;
  const tick = counter(3, done);
  const vp = H('div', { class: 'vpwrap' }), code = H('pre', { class: 'code sm' }), ctr = H('div', {});
  const render = () => {
    const paint = shotOverride ? 'gold' : sel.paint, c = PAL[paint];
    const fin = sel.fins === 'none' ? '' : sel.fins === 'small'
      ? `<path d="M140 120 L120 140 L140 135Z M180 120 L200 140 L180 135Z" fill="${c}" stroke="#fff" stroke-width="2"/>`
      : `<path d="M140 100 L100 150 L140 138Z M180 100 L220 150 L180 138Z" fill="${c}" stroke="#fff" stroke-width="2"/>`;
    const win = sel.window === 'round' ? `<circle cx="160" cy="75" r="11" fill="#9be7ff" stroke="#fff" stroke-width="3"/>` : `<rect x="149" y="64" width="22" height="22" rx="3" fill="#9be7ff" stroke="#fff" stroke-width="3"/>`;
    vp.innerHTML = vpFrame(320, 170, `<g class="morph">${fin}
      <path d="M160 18 C185 45 185 100 180 138 L140 138 C135 100 135 45 160 18Z" fill="${c}" stroke="#fff" stroke-width="2"/>${win}
      <path d="M148 140 L160 162 L172 140Z" fill="${PAL.orange}"/></g>`);
    code.innerHTML = hl(`def Xform "Rocket" (\n    variants = {\n        string fins = "${sel.fins}"\n        string paint = "${sel.paint}"\n        string window = "${sel.window}"\n    }\n)` + (shotOverride ? `\n\n# shot.usda (stronger)\nover "Rocket" (\n    variants = { string paint = "gold" }\n)` : ''), 'usda');
  };
  for (const s in sets) {
    ctr.append(H('div', { class: 'specrow' }, H('code', {}, s), H('div', { class: 'chips' }, sets[s].map(v => H('button', { class: 'chip' + (sel[s] === v ? ' on' : ''), onclick: (e) => {
      sel[s] = v; tick(s + v); sfx('tap'); e.target.parentNode.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === e.target)); render();
    }}, v)))));
  }
  ctr.append(H('label', { class: 'toggle' }, H('input', { type: 'checkbox', onchange: (e) => { shotOverride = e.target.checked; tick('ov'); sfx('tap'); render(); } }), H('span', {}, 'shot.usda overrides paint → gold')));
  render(); el.append(vp, ctr, code);
};

// ---------------------------------------------------------- liverps
W.liverps = (el, done) => {
  const arcs = [
    { k: 'L', n: 'Local', c: 'red', on: true }, { k: 'I', n: 'Inherits', c: 'purple', on: true },
    { k: 'V', n: 'VariantSets', c: 'teal', on: true }, { k: 'E', n: 'rElocates', c: null, on: false, na: true },
    { k: 'R', n: 'References', c: 'blue', on: true }, { k: 'P', n: 'Payloads', c: 'orange', on: true },
    { k: 'S', n: 'Specializes', c: 'green', on: true },
  ];
  const tick = counter(3, done);
  const big = H('div', { class: 'bigswatch' }), list = H('div', {});
  const render = () => {
    const w = arcs.find(a => a.on && !a.na);
    big.style.background = w ? PAL[w.c] : '#333';
    big.innerHTML = w ? `<span>${w.n} wins</span>` : '<span>fallback</span>';
    list.innerHTML = '';
    arcs.forEach((a, i) => list.append(H('button', { class: 'arc' + (a.on ? ' on' : '') + (a.na ? ' na' : '') + (a === w ? ' win' : ''), onclick: () => {
      if (a.na) { toast('Relocates remap paths. They don\'t hold a colour.'); return; }
      a.on = !a.on; tick(a.k + a.on); sfx('tap'); render();
    }}, H('span', { class: 'arck' }, a.k), H('span', { class: 'arcn' }, a.n), a.na ? H('span', { class: 'muted small' }, 'namespace') : H('span', { class: 'sw lg', style: { background: PAL[a.c], opacity: a.on ? 1 : .2 } }))));
  };
  render(); el.append(big, list);
};

// ---------------------------------------------------------- refVsPayload
W.refVsPayload = (el, done) => {
  const items = [
    { n: 'Street', arc: 'ref', mb: 12, on: true }, { n: 'Lamp', arc: 'ref', mb: 4, on: true },
    { n: 'Block_A', arc: 'payload', mb: 900, on: false }, { n: 'Block_B', arc: 'payload', mb: 1200, on: false },
    { n: 'Block_C', arc: 'payload', mb: 700, on: false }, { n: 'Block_D', arc: 'payload', mb: 1500, on: false },
  ];
  const tick = counter(3, done);
  const vp = H('div', { class: 'vpwrap' }), bar = H('div', { class: 'mem' }), grid = H('div', { class: 'pgrid' });
  const render = () => {
    const blocks = items.filter(i => i.arc === 'payload');
    let inner = `<rect x="0" y="140" width="320" height="30" fill="#333"/><rect x="0" y="150" width="320" height="4" fill="#ffc80066"/>`;
    blocks.forEach((b, i) => {
      const x = 15 + i * 77, h = 50 + (b.mb / 1500) * 70;
      inner += b.on ? `<g class="popin"><rect x="${x}" y="${140 - h}" width="62" height="${h}" rx="4" fill="${PAL.blue}"/>${[...Array(Math.floor(h / 18))].map((_, r) => `<rect x="${x + 10}" y="${148 - h + r * 18}" width="12" height="8" fill="#9be7ff"/><rect x="${x + 38}" y="${148 - h + r * 18}" width="12" height="8" fill="#9be7ff"/>`).join('')}</g>`
        : `<rect x="${x}" y="${140 - h}" width="62" height="${h}" rx="4" fill="none" stroke="#fff6" stroke-dasharray="5 5"/><text x="${x + 31}" y="${135 - h / 2}" class="vlabel">unloaded</text>`;
    });
    inner += `<rect x="150" y="105" width="4" height="35" fill="#999"/><circle cx="152" cy="103" r="6" fill="#ffd84d"/>`;
    vp.innerHTML = vpFrame(320, 170, inner);
    const tot = items.filter(i => i.on).reduce((a, b) => a + b.mb, 0);
    bar.innerHTML = `<div class="memfill" style="width:${Math.min(100, tot / 43)}%"></div><span>${tot.toLocaleString()} MB in memory</span>`;
    grid.innerHTML = '';
    items.forEach(it => grid.append(H('button', { class: 'pbtn' + (it.on ? ' on' : '') + (it.arc === 'ref' ? ' ref' : ''), onclick: () => {
      if (it.arc === 'ref') { toast('References are always composed. You can\'t unload them.'); sfx('wrong'); return; }
      it.on = !it.on; tick(it.n); sfx('tap'); render();
    }}, H('b', {}, it.n), H('span', {}, it.arc === 'ref' ? 'reference' : (it.on ? 'payload · loaded' : 'payload · unloaded')))));
  };
  render(); el.append(vp, bar, grid);
};

// ---------------------------------------------------------- instancing
W.instancing = (el, done) => {
  let inst = false; const tints = {};
  let toggled = false, tapped = false;
  const check = () => { if (toggled && tapped) done(); };
  const vp = H('div', { class: 'vpwrap' }), bar = H('div', { class: 'mem' }), stat = H('div', { class: 'readout' });
  const render = () => {
    let inner = '';
    for (let i = 0; i < 24; i++) {
      const x = 22 + (i % 8) * 39, y = 40 + Math.floor(i / 8) * 48, c = tints[i] || PAL.green;
      inner += `<g data-i="${i}" class="tree"><rect x="${x - 3}" y="${y + 14}" width="6" height="14" fill="#8b5a2b"/><path data-i="${i}" d="M${x} ${y - 16} L${x + 15} ${y + 16} L${x - 15} ${y + 16}Z" fill="${c}" ${inst ? 'stroke="#ffc800" stroke-width="1.5"' : ''}/></g>`;
    }
    vp.innerHTML = vpFrame(320, 175, inner);
    const mb = inst ? 40 + 24 * 0.2 : 24 * 40;
    bar.innerHTML = `<div class="memfill" style="width:${mb / 9.6}%;background:${inst ? PAL.green : PAL.red}"></div><span>${mb.toFixed(0)} MB · ${inst ? '1 prototype' : '24 unique copies'}</span>`;
    stat.innerHTML = inst ? '🔒 Descendants are <b>instance proxies</b>. Tap a tree to try editing.' : 'Tap a tree to recolour its leaves.';
  };
  vp.addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-i'); if (i == null) return;
    tapped = true; check();
    if (inst) { sfx('wrong'); vp.classList.remove('shake'); void vp.offsetWidth; vp.classList.add('shake'); toast('Instance proxy: read-only! Turn instancing off to edit.'); return; }
    tints[i] = [PAL.gold, PAL.orange, PAL.red, PAL.pink][Math.floor(Math.random() * 4)]; sfx('tap'); render();
  });
  const tg = H('label', { class: 'toggle big' }, H('input', { type: 'checkbox', onchange: (e) => { inst = e.target.checked; if (inst) Object.keys(tints).forEach(k => delete tints[k]); toggled = true; check(); sfx(inst ? 'correct' : 'tap'); render(); } }), H('span', {}, 'instanceable = true'));
  render(); el.append(vp, bar, tg, stat);
};

// ---------------------------------------------------------- materialBind
W.materialBind = (el, done) => {
  const mats = { none: null, Red: PAL.red, Rubber: '#333', Chrome: '#cfd8e3', Blue: PAL.blue };
  const prims = [{ p: '/Car', b: 'Red' }, { p: '/Car/Body', b: 'none' }, { p: '/Car/Wheels', b: 'Rubber' }, { p: '/Car/Bumper', b: 'none' }];
  let strong = false, cur = 1;
  const tick = counter(2, done);
  const vp = H('div', { class: 'vpwrap' }), rows = H('div', {}), matRow = H('div', { class: 'chips wrap' });
  const resolve = (pr) => {
    if (pr.p === '/Car') return [pr.b, 'direct'];
    const parent = prims[0];
    if (strong && parent.b !== 'none') return [parent.b, 'parent wins (stronger)'];
    if (pr.b !== 'none') return [pr.b, 'direct'];
    if (parent.b !== 'none') return [parent.b, 'inherited from /Car'];
    return ['none', 'unbound'];
  };
  const render = () => {
    const col = (i) => mats[resolve(prims[i])[0]] || '#555';
    vp.innerHTML = vpFrame(320, 140, `<g class="morph">
      <rect x="70" y="55" width="180" height="42" rx="12" fill="${col(1)}" stroke="#fff3"/>
      <rect x="110" y="32" width="90" height="30" rx="10" fill="${col(1)}" stroke="#fff3"/>
      <rect x="55" y="82" width="22" height="14" rx="4" fill="${col(3)}"/><rect x="243" y="82" width="22" height="14" rx="4" fill="${col(3)}"/>
      <circle cx="110" cy="102" r="17" fill="${col(2)}" stroke="#fff4" stroke-width="3"/><circle cx="210" cy="102" r="17" fill="${col(2)}" stroke="#fff4" stroke-width="3"/></g>`);
    rows.innerHTML = '';
    prims.forEach((pr, i) => {
      const [m, why] = resolve(pr);
      rows.append(H('button', { class: 'brow' + (i === cur ? ' on' : ''), style: { paddingLeft: (i ? 28 : 12) + 'px' }, onclick: () => { cur = i; sfx('tap'); render(); } },
        H('code', {}, pr.p), H('span', { class: 'bmat' }, H('span', { class: 'sw', style: { background: mats[m] || 'transparent', border: '1px solid #fff4' } }), m), H('span', { class: 'muted small' }, why)));
    });
    matRow.innerHTML = '';
    Object.keys(mats).forEach(k => matRow.append(H('button', { class: 'chip' + (prims[cur].b === k ? ' on' : ''), onclick: () => { prims[cur].b = k; tick(prims[cur].p + k); sfx('tap'); render(); } },
      k !== 'none' ? H('span', { class: 'sw', style: { background: mats[k] } }) : '', k)));
  };
  render();
  el.append(vp, H('div', { class: 'muted small' }, 'Tap a prim, then a material to bind:'), rows, matRow,
    H('label', { class: 'toggle' }, H('input', { type: 'checkbox', onchange: (e) => { strong = e.target.checked; tick('strong'); sfx('tap'); render(); } }), H('span', {}, '/Car binding: strongerThanDescendants')));
};

const LAB_TABS = [
  ['layerStack', '📚 Layers'], ['liverps', '🧬 LIVERPS'], ['variantSwitch', '🚀 Variants'], ['xformOrder', '🔄 Xform'],
  ['timeSamples', '⏱ Time'], ['primvarInterp', '🎨 Primvars'], ['refVsPayload', '🏙 Payloads'], ['instancing', '🌲 Instancing'],
  ['materialBind', '🧪 Binding'], ['specifiers', '🧱 Specifiers'], ['stageTree', '🌳 Stage'],
];
