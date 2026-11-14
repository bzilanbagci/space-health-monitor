/* demo-mode.js - loads synthetic demo scenarios (and restores the default sample) for demos and screenshots. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  let msgEl;

  function say(text) {
    msgEl.textContent = text;
    if (SH.ui.a11y && SH.ui.a11y.announce) SH.ui.a11y.announce(text);
  }
  function load(sc) {
    SH.state.set('environment', sc.environment);
    SH.state.set('selected', sc.focus);
    SH.state.setScenario(sc.id);
    say('Loaded demo scenario: ' + sc.label + '.');
  }
  function restore() {
    SH.state.set('environment', 'iss');
    SH.state.set('selected', 'heartRate');
    SH.state.setScenario(null);
    say('Restored the default synthetic sample data (your own entries are kept).');
  }

  SH.ui.demoMode = {
    init: function () {
      const root = document.getElementById('demo-panel');
      if (!root) return;
      msgEl = el('p', { class: 'small form-msg ok', role: 'status' });
      const buttons = SH.scenarios.map(function (sc) {
        const b = el('button', { type: 'button', class: 'btn btn-secondary', text: sc.label });
        b.addEventListener('click', function () { load(sc); });
        return b;
      });
      const reset = el('button', { type: 'button', class: 'btn btn-ghost', text: 'Restore default sample' });
      reset.addEventListener('click', restore);
      root.appendChild(el('h2', { text: 'Demo mode' }));
      root.appendChild(el('p', { class: 'muted small', text: 'Load a scenario to see how the tool reacts.' }));
      root.appendChild(el('div', { class: 'demo-buttons' }, buttons.concat([reset])));
      root.appendChild(msgEl);
    },
    render: function () {}
  };
})(window.SpaceHealth);
