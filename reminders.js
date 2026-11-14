/* reminders.js - in-page measurement reminder banner (no notification permission needed). */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  let banner = null, dismissedOn = null, lastKey = null;

  SH.ui.reminders = {
    init: function () {
      banner = document.getElementById('reminder-banner');
      setInterval(function () { SH.ui.reminders.render(); }, 60000); // also catches the day changing
    },
    render: function () {
      if (!banner) return;
      const today = SH.dates.todayISO();
      const history = SH.state.get('history');
      const missing = SH.indicatorOrder.filter(function (id) {
        return !(history[id] || []).some(function (d) { return d.source === 'user' && d.date === today; });
      });
      const hide = !missing.length || dismissedOn === today;
      const key = hide ? 'hidden' : missing.join(',');
      if (key === lastKey) return;
      lastKey = key;
      banner.hidden = hide;
      SH.dom.clear(banner);
      if (hide) return;
      const done = SH.indicatorOrder.length - missing.length;
      const text = done === 0 ? 'No check-in yet today. Take your measurements and add them below.'
        : done + ' of ' + SH.indicatorOrder.length + ' indicators measured today.';
      const start = el('button', { type: 'button', class: 'btn', text: 'Start check-in' });
      start.addEventListener('click', function () {
        SH.state.set('selected', missing[0]);
        const sel = document.getElementById('indicator-select');
        if (sel) sel.focus();
      });
      const dismiss = el('button', { type: 'button', class: 'btn btn-ghost', text: 'Dismiss for today' });
      dismiss.addEventListener('click', function () { dismissedOn = SH.dates.todayISO(); lastKey = null; SH.ui.reminders.render(); });
      banner.appendChild(el('p', {}, [el('strong', { text: '\u25B2 Reminder: ' }), text + ' Still to measure: ' +
        missing.map(function (id) { return SH.indicators[id].label; }).join(', ') + '.']));
      banner.appendChild(el('div', { class: 'demo-buttons' }, [start, dismiss]));
    }
  };
})(window.SpaceHealth);
