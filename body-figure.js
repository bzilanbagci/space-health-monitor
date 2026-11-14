/* body-figure.js - clickable, keyboard-usable human body SVG with per-part info and current status. */
(function (SH) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const el = SH.dom.el;

  function s(tag, attrs, kids) {
    const n = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (c) { n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  // General, simplified descriptions in our own words (not medical advice).
  const PARTS = {
    brain: { name: 'Brain and behavioral health', short: 'Brain', indicators: ['sleep', 'mood'],
      fn: 'Controls thinking, mood, alertness, sleep rhythms and coordination.',
      effect: 'Isolation, confinement, disrupted sleep and stress can affect mood and behavioral health. Changes in gravity can also affect balance and coordination.' },
    heart: { name: 'Heart and circulation', short: 'Heart', indicators: ['heartRate', 'systolic'],
      fn: 'Pumps blood around the body to deliver oxygen and nutrients.',
      effect: 'Without normal gravity, body fluids shift and the cardiovascular system has to adapt. Stress and poor sleep can add strain.' },
    bones: { name: 'Bones and muscles', short: 'Bones', indicators: [],
      fn: 'Support the body, protect organs and allow movement.',
      effect: 'With less load in weightlessness, bone density loss and muscle changes can occur, which is why regular exercise is part of crew routines.' },
    immune: { name: 'Immune system and overall body', short: 'Immune', indicators: SH.indicatorOrder, overall: true,
      fn: 'Defends the body against illness and supports recovery.',
      effect: 'Stress, disrupted sleep, a closed environment, radiation and changes in nutrition can all influence the immune system during spaceflight.' }
  };
  const ORDER = ['immune', 'bones', 'heart', 'brain']; // draw order: body first, overlays on top
  let selectedPart = 'heart';
  const groups = {}, labels = {};
  let infoEl = null;

  function indicatorLevel(id) {
    const last = SH.state.latest(id);
    return last ? SH.evaluate(id, last.value).level : 'none';
  }
  function partLevel(p) {
    return p.indicators.length ? SH.overallStatus(p.indicators.map(indicatorLevel)) : 'none';
  }

  function buildFigure() {
    const svg = s('svg', { viewBox: '0 0 340 400', class: 'body-svg', role: 'group', 'aria-label': 'Human body map. Select a body part to see details.' });
    const shapes = {
      immune: [s('circle', { cx: 170, cy: 50, r: 28 }), s('rect', { x: 130, y: 85, width: 80, height: 130, rx: 24 }),
        s('rect', { x: 100, y: 95, width: 26, height: 120, rx: 13 }), s('rect', { x: 214, y: 95, width: 26, height: 120, rx: 13 }),
        s('rect', { x: 132, y: 215, width: 34, height: 160, rx: 16 }), s('rect', { x: 174, y: 215, width: 34, height: 160, rx: 16 })],
      brain: [s('ellipse', { cx: 170, cy: 44, rx: 18, ry: 14 })],
      heart: [s('path', { d: 'M170,148 C170,136 154,132 154,144 C154,156 170,166 170,174 C170,166 186,156 186,144 C186,132 170,136 170,148 Z' })],
      bones: [s('rect', { x: 165, y: 90, width: 10, height: 120, rx: 5 }), s('rect', { x: 143, y: 232, width: 12, height: 130, rx: 6 }), s('rect', { x: 185, y: 232, width: 12, height: 130, rx: 6 })]
    };
    const labelPos = { brain: [216, 48, 'start'], heart: [250, 155, 'start'], bones: [96, 300, 'end'], immune: [226, 335, 'start'] };
    ORDER.forEach(function (id) {
      const g = s('g', { class: 'part', tabindex: '0', role: 'button', 'data-part': id });
      shapes[id].forEach(function (n) { n.setAttribute('class', 'shape'); g.appendChild(n); });
      const lp = labelPos[id];
      labels[id] = s('text', { x: lp[0], y: lp[1], 'text-anchor': lp[2], class: 'part-label' });
      g.appendChild(labels[id]);
      g.addEventListener('click', function () { choose(id); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(id); }
      });
      groups[id] = g;
      svg.appendChild(g);
    });
    return svg;
  }

  function choose(id) { selectedPart = id; SH.ui.bodyFigure.render(); }

  function renderInfo() {
    const p = PARTS[selectedPart];
    const level = partLevel(p);
    SH.dom.clear(infoEl);
    infoEl.appendChild(el('div', { class: 'panel-head' }, [el('h3', { text: p.name, style: 'margin:0' }), SH.ui.statusBadge(level)]));
    infoEl.appendChild(el('p', { class: 'small', text: p.indicators.length ? (p.overall ? 'Status shows the worst of all indicators.' : 'Status shows the worst of its related indicators.') : 'Not tracked by an indicator in this demo, so no status is shown.' }));
    infoEl.appendChild(el('h3', { text: 'What it does' }));
    infoEl.appendChild(el('p', { text: p.fn }));
    infoEl.appendChild(el('h3', { text: 'How spaceflight can affect it' }));
    infoEl.appendChild(el('p', { text: p.effect }));
    if (p.indicators.length) {
      infoEl.appendChild(el('h3', { text: 'Related indicators' }));
      infoEl.appendChild(el('ul', { class: 'chip-list' }, p.indicators.map(function (id) {
        const b = el('button', { type: 'button', class: 'link-btn', text: SH.indicators[id].label });
        b.addEventListener('click', function () { SH.state.set('selected', id); });
        return el('li', {}, [b, ' ', SH.ui.statusBadge(indicatorLevel(id))]);
      })));
    }
    infoEl.appendChild(el('p', { class: 'muted small', text: 'General information only. Not medical advice.' }));
  }

  SH.ui.bodyFigure = {
    init: function () {
      const root = document.getElementById('body-figure');
      if (!root) return;
      infoEl = document.getElementById('body-info');
      root.appendChild(buildFigure());
    },
    render: function () {
      if (!infoEl) return;
      ORDER.forEach(function (id) {
        const p = PARTS[id], level = partLevel(p), L = SH.LEVELS[level];
        groups[id].setAttribute('class', 'part lv-' + level + (id === selectedPart ? ' selected' : ''));
        groups[id].setAttribute('aria-pressed', String(id === selectedPart));
        groups[id].setAttribute('aria-label', p.name + ', status ' + L.label + '. Press Enter to show details.');
        labels[id].textContent = L.icon + ' ' + p.short;
      });
      renderInfo();
    }
  };
})(window.SpaceHealth);
