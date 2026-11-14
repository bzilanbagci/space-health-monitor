/* export-summary.js - download a CSV of the history, print a one-page summary, and reset saved data. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  let msgEl = null, noteEl = null, printEl = null;

  function csvCell(v) {
    const s = String(v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  // CSV text of the whole history (sample + user entries), sorted by date.
  function toCSV() {
    const rows = [];
    const history = SH.state.get('history');
    SH.indicatorOrder.forEach(function (id) {
      const ind = SH.indicators[id];
      (history[id] || []).forEach(function (d) {
        rows.push([d.date, ind.label, d.value, ind.unit, SH.LEVELS[SH.evaluate(id, d.value).level].label,
          d.source === 'user' ? 'user entry' : 'synthetic sample']);
      });
    });
    rows.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
    rows.unshift(['date', 'indicator', 'value', 'unit', 'status', 'source']);
    return '\uFEFF' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
  }

  function say(t, err) { msgEl.textContent = t; msgEl.className = 'form-msg ' + (err ? 'error' : 'ok'); }

  function download() {
    try {
      const blob = new Blob([toCSV()], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = el('a', { href: url, download: 'orbit-health-history-' + SH.dates.todayISO() + '.csv' });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      say('CSV downloaded.', false);
    } catch (e) { say('Could not create the CSV file in this browser.', true); }
  }

  // Fills the print-only summary (shown only when printing).
  function buildPrint() {
    if (!printEl) return;
    SH.dom.clear(printEl);
    const env = SH.environments[SH.state.get('environment')];
    const levels = SH.indicatorOrder.map(function (id) { const l = SH.state.latest(id); return l ? SH.evaluate(id, l.value).level : 'none'; });
    const overall = SH.LEVELS[SH.overallStatus(levels)];
    const history = SH.state.get('history');
    printEl.appendChild(el('h1', { text: 'Crew health summary (demonstration)' }));
    printEl.appendChild(el('p', {}, ['Date: ' + SH.dates.todayISO() + '. Environment: ' + env.name + '. Communication delay (approximate): ' + env.delayText]));
    printEl.appendChild(el('p', {}, [el('strong', { text: 'This summary is for demonstration and is not a medical diagnosis. ' }),
      'Values are synthetic or entered in the demo tool. Ranges are illustrative general reference ranges chosen by our team, not official clinical or NASA thresholds.']));
    printEl.appendChild(el('h2', { text: 'Overall status: ' + overall.icon + ' ' + overall.label }));
    const rows = SH.indicatorOrder.map(function (id, i) {
      const ind = SH.indicators[id], last = SH.state.latest(id), L = SH.LEVELS[levels[i]];
      return el('tr', {}, [el('td', { text: ind.label }), el('td', { text: last ? SH.formatValue(ind, last.value) + ' (' + SH.dates.pretty(last.date) + ')' : 'No data' }),
        el('td', { text: L.icon + ' ' + L.label }), el('td', { text: SH.rangeText(ind, ind.ranges.green) }), el('td', { text: SH.hazards[ind.hazard].name })]);
    });
    printEl.appendChild(el('table', {}, [
      el('thead', {}, [el('tr', {}, ['Indicator', 'Latest value', 'Status', 'Illustrative normal range', 'Related hazard'].map(function (t) { return el('th', { text: t }); }))]),
      el('tbody', {}, rows)]));
    const trends = SH.trends.all();
    if (trends.length) {
      printEl.appendChild(el('h2', { text: 'Trends to watch (general, rule-based)' }));
      printEl.appendChild(el('ul', {}, trends.map(function (t) { return el('li', { text: t.text }); })));
    }
    printEl.appendChild(el('h2', { text: 'Recent values (last 7 readings, oldest first)' }));
    printEl.appendChild(el('ul', {}, SH.indicatorOrder.map(function (id) {
      return el('li', { text: SH.indicators[id].label + ': ' + (history[id] || []).slice(-7).map(function (d) { return d.value; }).join(', ') });
    })));
  }

  function print() { buildPrint(); window.print(); }

  function reset() {
    let ok = true;
    try { ok = window.confirm('Reset all data? Your entries will be removed and the default synthetic sample restored.'); } catch (e) { ok = true; }
    if (!ok) return;
    SH.state.resetAll();
    SH.persist.clear();
    say('Data reset. The default synthetic sample is shown.', false);
  }

  SH.ui.exportSummary = {
    toCSV: toCSV,
    init: function () {
      const root = document.getElementById('export-panel');
      if (!root) return;
      printEl = el('section', { id: 'print-summary', class: 'print-only', 'aria-hidden': 'true' });
      document.body.appendChild(printEl);
      window.addEventListener('beforeprint', buildPrint);
      msgEl = el('p', { class: 'form-msg', role: 'status' });
      noteEl = el('p', { class: 'small advice', hidden: true, text: '\u25B2 Browser storage is not available, so entries will be lost when you refresh.' });
      const csv = el('button', { type: 'button', class: 'btn', text: 'Download CSV' });
      const prt = el('button', { type: 'button', class: 'btn btn-secondary', text: 'Print summary' });
      const rst = el('button', { type: 'button', class: 'btn btn-ghost', text: 'Reset data' });
      csv.addEventListener('click', download); prt.addEventListener('click', print); rst.addEventListener('click', reset);
      root.appendChild(el('h2', { text: 'Export and data' }));
      root.appendChild(el('p', { class: 'muted small', text: 'Download the history as CSV or print a one-page summary that could be sent to a ground flight surgeon. Entries are saved in this browser only.' }));
      root.appendChild(el('div', { class: 'demo-buttons' }, [csv, prt, rst]));
      root.appendChild(noteEl);
      root.appendChild(msgEl);
    },
    render: function () { if (noteEl) noteEl.hidden = SH.persist.available; }
  };
})(window.SpaceHealth);
