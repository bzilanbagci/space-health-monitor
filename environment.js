/* environment.js - ISS / Moon base / Mars transit selector with an approximate communication-delay message. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  const radios = {};
  let ctxEl, delayEl, adviceEl;

  SH.ui.environment = {
    init: function () {
      const root = document.getElementById('environment-panel');
      if (!root) return;
      const group = el('fieldset', { class: 'seg' }, [el('legend', { text: 'Mission environment' })]);
      Object.keys(SH.environments).forEach(function (id) {
        const radio = el('input', { type: 'radio', name: 'environment', value: id });
        radio.addEventListener('change', function () {
          SH.state.set('environment', id);
          const env = SH.environments[id];
          if (SH.ui.a11y && SH.ui.a11y.announce) SH.ui.a11y.announce('Environment set to ' + env.name + '. ' + env.delayText);
        });
        radios[id] = radio;
        group.appendChild(el('label', { class: 'chip' }, [radio, el('span', { text: SH.environments[id].name })]));
      });
      ctxEl = el('p', { class: 'small' });
      delayEl = el('p', { class: 'small' });
      adviceEl = el('p', { class: 'small advice' });
      root.appendChild(group);
      [ctxEl, delayEl, adviceEl].forEach(function (n) { root.appendChild(n); });
    },
    render: function () {
      if (!ctxEl) return;
      const cur = SH.state.get('environment');
      const env = SH.environments[cur];
      Object.keys(radios).forEach(function (id) { radios[id].checked = (id === cur); });
      ctxEl.textContent = env.context;
      delayEl.textContent = 'Illustrative communication delay (approximate): ' + env.delayText;
      adviceEl.hidden = !env.longDelay;
      adviceEl.textContent = '\u25B2 Long delay: act on the general guidance first and message the ground team in parallel. Do not wait for a reply.';
    }
  };
})(window.SpaceHealth);
