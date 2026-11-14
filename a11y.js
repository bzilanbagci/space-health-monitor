/* a11y.js - screen-reader announcements and arrow-key navigation for status cards and the body figure. */
(function (SH) {
  'use strict';
  let live = null;

  function move(list, current, key) {
    const i = list.indexOf(current);
    if (i < 0) return null;
    if (key === 'ArrowRight' || key === 'ArrowDown') return list[(i + 1) % list.length];
    if (key === 'ArrowLeft' || key === 'ArrowUp') return list[(i - 1 + list.length) % list.length];
    if (key === 'Home') return list[0];
    if (key === 'End') return list[list.length - 1];
    return null;
  }

  function onKey(e) {
    const t = e.target;
    if (!t || !t.closest) return;
    const card = t.closest('.status-card');
    const part = t.closest('.part');
    let list = null, current = null;
    if (card) { list = Array.prototype.slice.call(document.querySelectorAll('.status-card')); current = card; }
    else if (part) { list = Array.prototype.slice.call(document.querySelectorAll('.part')); current = part; }
    if (!list) return;
    const next = move(list, current, e.key);
    if (next) { e.preventDefault(); next.focus(); }
  }

  SH.ui.a11y = {
    init: function () {
      live = SH.dom.el('div', { id: 'sr-announcer', class: 'sr-only', role: 'status', 'aria-live': 'polite' });
      document.body.appendChild(live);
      document.addEventListener('keydown', onKey);
    },
    // Politely announce a message to screen readers.
    announce: function (text) {
      if (!live) return;
      live.textContent = '';
      setTimeout(function () { live.textContent = text; }, 50);
    },
    render: function () {}
  };
})(window.SpaceHealth);
