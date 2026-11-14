/* status-cards.js - per-indicator status cards + overall status panel; also shared badge helpers. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;

  // Status is always color + icon + text.
  SH.ui.statusBadge = function (level) {
    const L = SH.LEVELS[level];
    return el('span', { class: 'badge level-' + level }, [el('span', { 'aria-hidden': 'true', text: L.icon }), el('span', { text: L.label })]);
  };
  SH.ui.hazardBadge = function (hazardId) {
    const h = SH.hazards[hazardId];
    return el('span', { class: 'badge badge-hazard', title: h.description }, [el('span', { 'aria-hidden': 'true', text: '\u25C8' }), el('span', { text: 'Hazard: ' + h.name })]);
  };

  function currentLevel(id) {
    const last = SH.state.latest(id);
    return last ? SH.evaluate(id, last.value).level : 'none';
  }

  function renderOverall() {
    const root = document.getElementById('overall-status');
    const levels = SH.indicatorOrder.map(currentLevel);
    const overall = SH.overallStatus(levels);
    const flagged = SH.indicatorOrder.filter(function (id, i) { return levels[i] === 'yellow' || levels[i] === 'red'; });
    let text;
    if (overall === 'none') text = 'No measurements yet.';
    else if (!flagged.length) text = 'All ' + SH.indicatorOrder.length + ' indicators are inside their normal reference ranges.';
    else text = flagged.length + ' of ' + SH.indicatorOrder.length + ' indicators need a closer look: ' + flagged.map(function (id) {
      return SH.indicators[id].label + ' (' + SH.LEVELS[currentLevel(id)].label + ')';
    }).join(', ') + '.';
    SH.dom.clear(root);
    root.className = 'panel overall level-' + overall;
    root.appendChild(SH.ui.statusBadge(overall));
    root.appendChild(el('div', {}, [
      el('h2', { text: 'Overall status' }),
      el('p', { text: text }),
      el('p', { class: 'muted small', text: 'Based on the latest value of each indicator. General information only, not a diagnosis.' })
    ]));
  }

  function renderTrends() {
    const root = document.getElementById('trend-alerts');
    if (!root) return;
    const alerts = SH.trends.all();
    SH.dom.clear(root);
    root.hidden = !alerts.length;
    if (!alerts.length) return;
    root.appendChild(el('h2', { text: '\u25B2 Watch these trends' }));
    root.appendChild(el('ul', {}, alerts.map(function (a) { return el('li', { text: a.text }); })));
    root.appendChild(el('p', { class: 'muted small', text: 'Simple rule-based check over the most recent readings. General information only, not a diagnosis.' }));
  }

  SH.ui.statusCards = {
    init: function () {},
    render: function () {
      renderOverall();
      renderTrends();
      const root = document.getElementById('status-cards');
      const active = document.activeElement;
      const focusId = active && root.contains(active) ? active.getAttribute('data-id') : null;
      const selected = SH.state.get('selected');
      SH.dom.clear(root);
      SH.indicatorOrder.forEach(function (id) {
        const ind = SH.indicators[id];
        const last = SH.state.latest(id);
        const level = currentLevel(id);
        const valueText = last ? last.value : '\u2013';
        const unit = last && ind.unit !== 'score' ? ind.unit : (last ? '/ 5' : '');
        const card = el('button', {
          type: 'button', class: 'status-card level-' + level, 'data-id': id, 'aria-pressed': String(id === selected),
          'aria-label': ind.label + ': ' + (last ? SH.formatValue(ind, last.value) : 'no data') + ', status ' + SH.LEVELS[level].label + '. Select to see details.'
        }, [
          el('span', { class: 'card-top' }, [el('span', { class: 'card-title', text: ind.label }), SH.ui.hazardBadge(ind.hazard)]),
          el('span', { class: 'card-value' }, [String(valueText) + ' ', el('small', { text: unit })]),
          SH.ui.statusBadge(level),
          el('span', { class: 'card-meta', text: last ? 'Latest: ' + SH.dates.pretty(last.date) + (last.source === 'sample' ? ' \u00B7 sample data' : ' \u00B7 your entry') : 'No data' })
        ]);
        card.addEventListener('click', function () { SH.state.set('selected', id); });
        root.appendChild(card);
      });
      if (focusId) { const again = root.querySelector('[data-id="' + focusId + '"]'); if (again) again.focus(); }
    }
  };
})(window.SpaceHealth);
