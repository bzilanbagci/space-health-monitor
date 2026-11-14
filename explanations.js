/* explanations.js - explanation panel for the selected indicator + "Why this result?" panel + hazard tag. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;

  function section(title, body) { return [el('h3', { text: title }), body]; }

  function renderWhy(ind, last) {
    const root = document.getElementById('why-result');
    SH.dom.clear(root);
    root.appendChild(el('h2', { text: 'Why this result?' }));
    if (!last) { root.appendChild(el('p', { text: 'No value yet for ' + ind.label + '.' })); return; }
    const r = SH.explain(ind.id, last.value);
    root.appendChild(el('div', { class: 'panel-head' }, [el('strong', { text: ind.label }), SH.ui.statusBadge(r.level)]));
    root.appendChild(el('p', { text: r.text }));
    root.appendChild(el('ul', { class: 'range-list' }, [
      el('li', { text: '\u2713 Normal range: ' + r.greenRange }),
      el('li', { text: '\u25B2 Watch range: ' + r.yellowRange }),
      el('li', { text: '\u2716 Attention: anything outside the watch range' })
    ]));
    root.appendChild(el('p', { class: 'muted small', text: 'These ranges are illustrative general reference ranges chosen by our team. They are not official clinical or NASA thresholds.' }));
  }

  function renderExplanation(ind) {
    const root = document.getElementById('explanation');
    SH.dom.clear(root);
    root.appendChild(el('div', { class: 'panel-head' }, [el('h2', { text: ind.label }), SH.ui.hazardBadge(ind.hazard)]));
    const env = SH.environments[SH.state.get('environment')];
    const parts = [].concat(
      section('What it is', el('p', { text: ind.what })),
      section('Why it matters in space', el('p', { text: ind.whyInSpace })),
      section('How spaceflight hazards can affect it', el('p', { text: ind.hazardEffect })),
      section('How it can be measured in space', el('p', { text: ind.howToMeasure })),
      section('When to alert the crew or ground flight surgeons', el('div', {}, [el('p', { text: ind.alertWhen }), el('p', { class: 'env-note', text: env.name + ': ' + env.alertWording })])),
      section('Simple general actions that can help', el('div', {}, [el('ul', {}, ind.actions.map(function (a) { return el('li', { text: a }); })), el('p', { class: 'env-note', text: env.actionWording })]))
    );
    parts.forEach(function (n) { root.appendChild(n); });
    root.appendChild(el('p', { class: 'muted small', text: 'General information only. Hazard tag is a simplified mapping by our team. Not medical advice.' }));
  }

  SH.ui.explanations = {
    init: function () {},
    render: function () {
      const ind = SH.indicators[SH.state.get('selected')];
      renderWhy(ind, SH.state.latest(ind.id));
      renderExplanation(ind);
    }
  };
})(window.SpaceHealth);
