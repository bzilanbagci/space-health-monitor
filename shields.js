/* shields.js - "Hazard Shields": one 0-100 shield per NASA HRP hazard, filled by small daily tasks. XP and levels are just for motivation.
   Progress is kept in its own localStorage key (try/catch). The 7-day simulation is demo data and is labeled as such. */
(function (SH) {
  'use strict';
  const el = SH.dom.el, KEY = 'spacehealth.shields.v1';
  let root = null, data = { days: {}, demo: false }, focusId = null, quiz = { i: 0, answered: null };

  const HAZ = [
    { id: 'gravity', name: 'Gravity fields' }, { id: 'isolation', name: 'Isolation and confinement' },
    { id: 'closed', name: 'Hostile closed environments' }, { id: 'distance', name: 'Distance from Earth' },
    { id: 'radiation', name: 'Space radiation' }
  ];
  // auto: true = completed by the user's own entries today (not clickable).
  const TASKS = [
    { id: 'g-ex', h: 'gravity', pts: 60, text: 'Exercise session (about 30 min)' },
    { id: 'g-str', h: 'gravity', pts: 40, text: 'Posture and stretch break' },
    { id: 'i-mood', h: 'isolation', pts: 30, auto: 'mood', text: 'Log your mood (auto)' },
    { id: 'i-sleep', h: 'isolation', pts: 30, auto: 'sleep', text: 'Log your sleep (auto)' },
    { id: 'i-talk', h: 'isolation', pts: 40, text: 'Talk with a crewmate' },
    { id: 'c-water', h: 'closed', pts: 50, text: 'Log water intake' },
    { id: 'c-meal', h: 'closed', pts: 50, text: 'Log a balanced meal' },
    { id: 'd-meas', h: 'distance', pts: 100, auto: 'all', text: 'Enter all 5 measurements (auto)' },
    { id: 'r-card', h: 'radiation', pts: 40, text: 'Read the radiation info card' },
    { id: 'r-quiz', h: 'radiation', pts: 60, text: 'Answer a mini quiz question' },
    { id: 'm-iss', h: 'isolation', pts: 30, env: 'iss', text: 'ISS mission: review the day plan' },
    { id: 'm-moon', h: 'closed', pts: 30, env: 'moon', text: 'Moon mission: dust-control check' },
    { id: 'm-mars', h: 'distance', pts: 30, env: 'mars', text: 'Mars mission: send one complete status message' }
  ];
  const LEVELS = [['Cadet', 0], ['Specialist', 200], ['Officer', 500], ['Commander', 1000]];
  // Quiz facts are general (hazard names, what each hazard means); check against the NASA HRP Five Hazards page.
  const QUIZ = [
    { q: 'Which of these is NOT one of the five NASA HRP hazards of human spaceflight?', o: ['Space radiation', 'Distance from Earth', 'Weather storms', 'Gravity fields'], a: 2 },
    { q: 'Which hazard is about communication delay and limited help or resupply?', o: ['Distance from Earth', 'Gravity fields', 'Space radiation', 'Hostile closed environments'], a: 0 },
    { q: 'Isolation and confinement mostly affects which kind of health?', o: ['Eyesight only', 'Sleep, mood and behavior', 'Hair growth', 'Hearing only'], a: 1 },
    { q: 'Why is regular exercise important in altered gravity?', o: ['It cools the cabin', 'It helps protect muscle and bone', 'It replaces sleep', 'It blocks radiation'], a: 1 },
    { q: 'Space radiation is mainly a concern for...', o: ['Long-term health risks', 'Only the first minute of flight', 'Cabin temperature', 'Food taste only'], a: 0 }
  ];
  const CARD = 'Space radiation is one of the five NASA HRP hazards. Outside Earth’s protection, crews are exposed to more radiation, which is mainly a long-term health concern. Missions plan around it, and crews follow guidance from the ground team.';
  const BADGES = [
    ['Shield up (any shield at 100)', function (s) { return s.max >= 100; }],
    ['Full shields (all five at 100)', function (s) { return s.full; }],
    ['3-day mission streak', function (s) { return s.best >= 3; }],
    ['7-day mission streak', function (s) { return s.best >= 7; }],
    ['Level: Specialist', function (s) { return s.xp >= 200; }],
    ['Level: Commander', function (s) { return s.xp >= 1000; }]
  ];

  function load() { const d = SH.storage.get(KEY, null); if (d && typeof d === 'object' && d.days && typeof d.days === 'object') data = { days: d.days, demo: !!d.demo }; }
  function save() { SH.storage.set(KEY, data); }
  function userToday(id) {
    const t = SH.dates.todayISO(), l = (SH.state.get('history') || {})[id] || [];
    return l.some(function (d) { return d.source === 'user' && d.date === t; });
  }
  function doneToday(t) {
    if (t.auto === 'all') return SH.indicatorOrder.every(userToday);
    if (t.auto) return userToday(t.auto);
    return !!(data.days[SH.dates.todayISO()] || {})[t.id];
  }
  function pointsFor(t) { // distance auto task gives 20 per own entry
    if (t.auto === 'all') return SH.indicatorOrder.filter(userToday).length * 20;
    return doneToday(t) ? t.pts : 0;
  }
  function active() { const e = SH.state.get('environment'); return TASKS.filter(function (t) { return !t.env || t.env === e; }); }
  function shieldValues() {
    const v = {}; HAZ.forEach(function (h) { v[h.id] = 0; });
    active().forEach(function (t) { v[t.h] += pointsFor(t); });
    HAZ.forEach(function (h) { v[h.id] = Math.min(100, v[h.id]); });
    return v;
  }
  function summary() {
    const v = shieldValues(), vals = HAZ.map(function (h) { return v[h.id]; });
    let xp = 0;
    Object.keys(data.days).forEach(function (d) {
      TASKS.forEach(function (t) { if (!t.auto && data.days[d][t.id]) xp += t.pts; });
    });
    TASKS.forEach(function (t) { if (t.auto) xp += pointsFor(t); }); // today's auto tasks
    const set = {}; Object.keys(data.days).forEach(function (d) { if (Object.keys(data.days[d]).length) set[d] = true; });
    set[SH.dates.todayISO()] = set[SH.dates.todayISO()] || vals.some(function (x) { return x > 0; });
    let best = 0;
    Object.keys(set).forEach(function (d) {
      if (!set[d] || set[SH.dates.addDays(d, -1)]) return;
      let run = 0, x = d; while (set[x]) { run++; x = SH.dates.addDays(x, 1); } if (run > best) best = run;
    });
    return { vals: vals, xp: xp, best: best, max: Math.max.apply(null, vals), full: vals.every(function (x) { return x >= 100; }) };
  }
  function level(xp) {
    let i = 0; LEVELS.forEach(function (l, k) { if (xp >= l[1]) i = k; });
    return { name: LEVELS[i][0], next: LEVELS[i + 1] || null };
  }
  function mark(id) { const t = SH.dates.todayISO(); data.days[t] = data.days[t] || {}; if (data.days[t][id]) delete data.days[t][id]; else data.days[t][id] = 1; save(); }
  function simulate() {
    TASKS.forEach(function () {});
    for (let k = 6; k >= 0; k--) {
      const d = SH.dates.addDays(SH.dates.todayISO(), -k); data.days[d] = {};
      TASKS.forEach(function (t) { if (!t.auto) data.days[d][t.id] = 1; });
    }
    // also create the user's own check-in entries for the last 6 days so the older check-in streak badges unlock (demo only)
    const hist = SH.state.get('history');
    SH.indicatorOrder.forEach(function (id) {
      for (let k = 6; k >= 1; k--) {
        const d = SH.dates.addDays(SH.dates.todayISO(), -k);
        if (!hist[id].some(function (e) { return e.source === 'user' && e.date === d; })) hist[id].push({ date: d, value: SH.indicators[id].example, source: 'user' });
      }
      hist[id].sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      SH.state.addEntry(id, SH.indicators[id].example);
    });
    data.demo = true; save();
  }

  function draw() {
    if (!root) return;
    const s = summary(), lv = level(s.xp), env = SH.state.get('environment');
    SH.dom.clear(root);
    root.appendChild(el('h2', { text: 'Hazard Shields' }));
    root.appendChild(el('p', { class: 'muted small', text: 'Each shield stands for one NASA HRP hazard. Complete small daily tasks to fill it. Just for motivation, not medical scoring.' }));
    root.appendChild(el('p', {}, [el('strong', { text: 'Rank' }), ': ', el('strong', { text: lv.name }),
      ' – ' + s.xp + ' XP' + (lv.next ? ' (' + SH.i18n.t(lv.next[0]) + ' @ ' + lv.next[1] + ' XP)' : '')]));
    root.appendChild(el('progress', { max: lv.next ? lv.next[1] : s.xp || 1, value: s.xp, 'aria-label': 'XP progress' }));
    if (data.demo) root.appendChild(el('p', { class: 'badge level-yellow', text: '▲ DEMO: 7-day simulated progress is shown' }));
    const grid = el('div', { class: 'shield-grid' });
    HAZ.forEach(function (h, i) {
      const v = s.vals[i];
      grid.appendChild(el('div', { class: 'shield' }, [
        el('div', {}, [el('strong', {}, [(v >= 100 ? '✓ ' : '◆ '), el('span', { text: h.name })]), ' ' + v + '/100']),
        el('div', { class: 'shield-bar', role: 'img', 'aria-label': h.name + ' shield ' + v + ' of 100' }, [el('span', { style: 'width:' + v + '%' })])
      ]));
    });
    root.appendChild(grid);
    root.appendChild(el('h3', { text: 'Today’s tasks' }));
    const ul = el('ul', { class: 'task-list' });
    active().forEach(function (t) {
      const hn = HAZ.filter(function (h) { return h.id === t.h; })[0].name;
      const cb = el('input', { type: 'checkbox', id: 'task-' + t.id, 'data-task': t.id });
      cb.checked = doneToday(t);
      if (t.auto) cb.disabled = true;
      else cb.addEventListener('change', function () { focusId = cb.id; mark(t.id); draw(); SH.ui.a11y && SH.ui.a11y.announce && SH.ui.a11y.announce('Task updated'); });
      ul.appendChild(el('li', {}, [cb, el('label', { for: cb.id }, [' ', el('span', { text: t.text }), ' – ', el('span', { text: hn }), ', +' + t.pts + ' XP'])]
        .concat(t.id === 'g-ex' ? [el('button', { class: 'btn btn-secondary', type: 'button', id: 'btn-ex', text: 'Start exercise', onclick: function () { SH.ui.exercise.open(); } })] : [])));
    });
    root.appendChild(ul);
    // info card + quiz
    const det = el('details', {}, [el('summary', { text: 'Radiation info card and mini quiz' }), el('p', { text: CARD })]);
    const done = !!(data.days[SH.dates.todayISO()] || {})['r-card'];
    det.appendChild(el('button', { class: 'btn', type: 'button', id: 'btn-card', text: done ? '✓ Card read' : 'Mark info card as read',
      onclick: function () { if (!data.days[SH.dates.todayISO()] || !data.days[SH.dates.todayISO()]['r-card']) mark('r-card'); focusId = 'btn-card'; draw(); } }));
    const q = QUIZ[quiz.i % QUIZ.length];
    det.appendChild(el('p', { text: 'Quiz: ' + q.q }));
    q.o.forEach(function (o, k) {
      det.appendChild(el('button', { class: 'btn btn-secondary', type: 'button', id: 'quiz-o' + k, text: o, onclick: function () {
        quiz.answered = k;
        if (k === q.a) { const t = SH.dates.todayISO(); data.days[t] = data.days[t] || {}; data.days[t]['r-quiz'] = 1; save(); }
        focusId = 'quiz-next'; draw(); det.open = true; } }));
    });
    if (quiz.answered !== null) {
      det.appendChild(el('p', { role: 'status', text: quiz.answered === q.a ? '✓ Correct!' : '✖ Not quite. Correct answer: ' + q.o[q.a] }));
      det.appendChild(el('button', { class: 'btn', type: 'button', id: 'quiz-next', text: 'Next question', onclick: function () { quiz.i++; quiz.answered = null; focusId = 'btn-card'; draw(); } }));
      det.open = true;
    }
    root.appendChild(det);
    root.appendChild(el('h3', { text: 'Shield badges' }));
    root.appendChild(el('ul', { class: 'badge-list' }, BADGES.map(function (b) {
      const ok = b[1](s);
      return el('li', { class: ok ? 'earned' : 'locked' }, [el('span', { 'aria-hidden': 'true', text: ok ? '★ ' : '☆ ' }), b[0] + ' – ' + (ok ? 'earned' : 'locked')]);
    })));
    root.appendChild(el('div', { class: 'btn-row' }, [
      el('button', { class: 'btn btn-secondary', type: 'button', id: 'btn-sim', text: 'Run 7-day simulation (demo)', onclick: function () { simulate(); focusId = 'btn-sim'; draw(); } }),
      el('button', { class: 'btn btn-secondary', type: 'button', id: 'btn-simclear', text: 'Clear shield progress', onclick: function () { data = { days: {}, demo: false }; save(); focusId = 'btn-sim'; draw(); } })
    ]));
    if (focusId) { const f = document.getElementById(focusId); if (f) f.focus(); focusId = null; }
  }

  SH.ui.shields = {
    init: function () { root = document.getElementById('shields-panel'); load(); },
    render: draw,
    complete: function (id) { const t = SH.dates.todayISO(); data.days[t] = data.days[t] || {}; data.days[t][id] = 1; save(); focusId = 'btn-ex'; draw(); }
  };
})(window.SpaceHealth);
