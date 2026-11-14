/* chart.js - time-series chart drawn as inline SVG (no libraries): 14 sample days + the user's own entries. */
(function (SH) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const el = SH.dom.el;
  const W = 640, H = 280, L = 48, R = 16, T = 14, B = 34;

  function s(tag, attrs, kids) {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  // Marker shape also encodes status (not color alone): circle = Normal, triangle = Watch, diamond = Attention.
  function marker(level, x, y, tip) {
    let n;
    if (level === 'yellow') n = s('path', { d: 'M' + x + ',' + (y - 8) + ' L' + (x + 8) + ',' + (y + 6) + ' L' + (x - 8) + ',' + (y + 6) + ' Z' });
    else if (level === 'red') n = s('path', { d: 'M' + x + ',' + (y - 9) + ' L' + (x + 9) + ',' + y + ' L' + x + ',' + (y + 9) + ' L' + (x - 9) + ',' + y + ' Z' });
    else n = s('circle', { cx: x, cy: y, r: 5 });
    n.setAttribute('class', 'pt lv-' + level);
    n.appendChild(s('title', {}, [tip]));
    return n;
  }

  function buildSvg(ind, data) {
    // Scale to the data and the normal range, so small changes stay visible.
    let lo = ind.ranges.green[0], hi = ind.ranges.green[1];
    data.forEach(function (d) { lo = Math.min(lo, d.value); hi = Math.max(hi, d.value); });
    const pad = (hi - lo) * 0.08 || 1;
    lo -= pad; hi += pad;
    const plotW = W - L - R, plotH = H - T - B;
    const yOf = function (v) { return T + (hi - v) / (hi - lo) * plotH; };
    const xOf = function (i) { return L + (data.length === 1 ? plotW / 2 : i / (data.length - 1) * plotW); };
    const clamp = function (v) { return Math.max(lo, Math.min(hi, v)); };

    const last = data[data.length - 1];
    const lastLevel = SH.evaluate(ind.id, last.value).level;
    const svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart-svg', role: 'img',
      'aria-label': ind.label + ' chart: ' + data.length + ' readings from ' + SH.dates.pretty(data[0].date) + ' to ' + SH.dates.pretty(last.date) +
        '. Latest ' + SH.formatValue(ind, last.value) + ', status ' + SH.LEVELS[lastLevel].label + '. A table of the values is available below the chart.' });

    // Range bands: yellow (watch) behind green (normal).
    const yb = ind.ranges.yellow, gb = ind.ranges.green;
    svg.appendChild(s('rect', { class: 'band-y', x: L, width: plotW, y: yOf(clamp(yb[1])), height: Math.max(0, yOf(clamp(yb[0])) - yOf(clamp(yb[1]))) }));
    svg.appendChild(s('rect', { class: 'band-g', x: L, width: plotW, y: yOf(clamp(gb[1])), height: Math.max(0, yOf(clamp(gb[0])) - yOf(clamp(gb[1]))) }));

    // Y axis ticks
    for (let i = 0; i <= 4; i++) {
      const v = lo + i * (hi - lo) / 4, y = yOf(v);
      svg.appendChild(s('line', { class: 'grid', x1: L, x2: W - R, y1: y, y2: y }));
      svg.appendChild(s('text', { x: L - 6, y: y + 4, 'text-anchor': 'end' }, [String(Number(v.toFixed(hi - lo > 12 ? 0 : 1)))]));
    }
    // X axis labels: first, middle, last
    const idxs = data.length > 2 ? [0, Math.floor((data.length - 1) / 2), data.length - 1] : data.map(function (d, i) { return i; });
    idxs.forEach(function (i, k) {
      svg.appendChild(s('text', { x: xOf(i), y: H - 10, 'text-anchor': k === 0 && idxs.length > 1 ? 'start' : (k === idxs.length - 1 && idxs.length > 1 ? 'end' : 'middle') }, [SH.dates.pretty(data[i].date)]));
    });
    svg.appendChild(s('text', { x: 4, y: 12 }, [ind.unit === 'score' ? 'score' : ind.unit]));

    // Line + markers
    svg.appendChild(s('path', { class: 'line', d: data.map(function (d, i) { return (i ? 'L' : 'M') + xOf(i).toFixed(1) + ',' + yOf(d.value).toFixed(1); }).join(' ') }));
    data.forEach(function (d, i) {
      const level = SH.evaluate(ind.id, d.value).level;
      svg.appendChild(marker(level, xOf(i), yOf(d.value), SH.dates.pretty(d.date) + ': ' + SH.formatValue(ind, d.value) + ' (' + SH.LEVELS[level].label + ')' + (d.source === 'user' ? ', your entry' : ', sample')));
    });
    return svg;
  }

  function buildTable(ind, data) {
    const rows = data.map(function (d) {
      const L2 = SH.LEVELS[SH.evaluate(ind.id, d.value).level];
      return el('tr', {}, [el('td', { text: SH.dates.pretty(d.date) }), el('td', { text: SH.formatValue(ind, d.value) }),
        el('td', { text: L2.icon + ' ' + L2.label }), el('td', { text: d.source === 'user' ? 'Your entry' : 'Sample' })]);
    });
    return el('details', {}, [el('summary', { text: 'Show values as a table' }),
      el('div', { class: 'table-wrap' }, [el('table', { class: 'data-table' }, [
        el('thead', {}, [el('tr', {}, ['Date', 'Value', 'Status', 'Source'].map(function (t) { return el('th', { scope: 'col', text: t }); }))]),
        el('tbody', {}, rows)])])]);
  }

  SH.ui.chart = {
    init: function () {},
    render: function () {
      const root = document.getElementById('chart');
      if (!root) return;
      SH.dom.clear(root);
      const id = SH.state.get('selected');
      const ind = SH.indicators[id];
      const data = SH.state.get('history')[id] || [];
      root.appendChild(el('h3', { text: ind.label + ' \u2013 history', style: 'margin-top:0' }));
      if (!data.length) { root.appendChild(el('p', { text: 'No data yet.' })); return; }
      root.appendChild(buildSvg(ind, data));
      root.appendChild(el('p', { class: 'muted small', text: 'Green band = normal range, yellow band = watch range (illustrative). Markers: \u25CF Normal, \u25B2 Watch, \u25C6 Attention. Sample days are synthetic.' }));
      root.appendChild(buildTable(ind, data));
    }
  };
})(window.SpaceHealth);
