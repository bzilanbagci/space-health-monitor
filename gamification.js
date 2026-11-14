/* gamification.js - optional daily check-in streak and a few badges. A check-in = a day with at least one of the user's own entries (sample data never counts). */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  let body = null;

  function stats(history) {
    const set = {};
    Object.keys(history).forEach(function (id) {
      history[id].forEach(function (d) { if (d.source === 'user') set[d.date] = true; });
    });
    const today = SH.dates.todayISO();
    const dates = Object.keys(set);
    let current = 0, day = set[today] ? today : SH.dates.addDays(today, -1);
    while (set[day]) { current++; day = SH.dates.addDays(day, -1); }
    let best = 0;
    dates.forEach(function (d) {
      if (set[SH.dates.addDays(d, -1)]) return; // not the start of a run
      let run = 0, x = d;
      while (set[x]) { run++; x = SH.dates.addDays(x, 1); }
      if (run > best) best = run;
    });
    const todays = {};
    SH.indicatorOrder.forEach(function (id) {
      const t = (history[id] || []).filter(function (d) { return d.source === 'user' && d.date === today; });
      if (t.length) todays[id] = t[t.length - 1];
    });
    const missing = SH.indicatorOrder.filter(function (id) { return !todays[id]; });
    const allGreen = !missing.length && SH.indicatorOrder.every(function (id) { return SH.evaluate(id, todays[id].value).level === 'green'; });
    return { current: current, best: best, total: dates.length, doneToday: !!set[today], missing: missing, allGreen: allGreen };
  }

  function badges(st) {
    return [
      { label: 'First check-in', earned: st.total >= 1 },
      { label: 'Full check-in today (all indicators)', earned: !st.missing.length },
      { label: 'All indicators green today', earned: st.allGreen },
      { label: '3-day check-in streak', earned: st.best >= 3 },
      { label: '7-day check-in streak', earned: st.best >= 7 }
    ];
  }

  SH.ui.gamification = {
    stats: stats,
    init: function () {
      const root = document.getElementById('gamification-panel');
      if (!root) return;
      body = el('div', {});
      root.appendChild(el('details', { open: true }, [el('summary', { text: 'Check-in streak and badges (optional)' }), body]));
    },
    render: function () {
      if (!body) return;
      const st = stats(SH.state.get('history'));
      SH.dom.clear(body);
      body.appendChild(el('p', { text: 'Current streak: ' + st.current + (st.current === 1 ? ' day' : ' days') +
        (st.doneToday ? ' (checked in today).' : '. Add a measurement today to keep it going.') }));
      body.appendChild(el('ul', { class: 'badge-list' }, badges(st).map(function (b) {
        return el('li', { class: b.earned ? 'earned' : 'locked' }, [
          el('span', { 'aria-hidden': 'true', text: b.earned ? '\u2605 ' : '\u2606 ' }), b.label + ' \u2013 ' + (b.earned ? 'earned' : 'locked')]);
      })));
      body.appendChild(el('p', { class: 'muted small', text: 'Just for motivation. Only your own entries count.' }));
    }
  };
})(window.SpaceHealth);
