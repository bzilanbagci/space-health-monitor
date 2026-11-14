/* namespace.js - creates window.SpaceHealth, shared constants and tiny DOM/date helpers. Must load first. */
(function (global) {
  'use strict';
  const SH = (global.SpaceHealth = global.SpaceHealth || {});
  SH.VERSION = '0.1.0';
  SH.STORAGE_KEY = 'spacehealth.v1';
  SH.ui = SH.ui || {};

  // Status levels: always shown with color + icon + text.
  SH.LEVELS = {
    green:  { id: 'green',  label: 'Normal',    icon: '\u2713', rank: 0 },
    yellow: { id: 'yellow', label: 'Watch',     icon: '\u25B2', rank: 1 },
    red:    { id: 'red',    label: 'Attention', icon: '\u2716', rank: 2 },
    none:   { id: 'none',   label: 'No data',   icon: '\u2013', rank: -1 }
  };

  // el('div', {class: 'x', text: 'hi'}, [children]) -> DOM node (uses textContent, never innerHTML)
  SH.dom = {
    el: function (tag, attrs, children) {
      const node = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (k) {
        const v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? '' : v);
      });
      (children || []).forEach(function (c) {
        if (c === null || c === undefined) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      return node;
    },
    clear: function (node) { while (node.firstChild) node.removeChild(node.firstChild); }
  };

  SH.dates = {
    iso: function (d) {
      const p = function (n) { return (n < 10 ? '0' : '') + n; };
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    },
    todayISO: function () { return SH.dates.iso(new Date()); },
    addDays: function (iso, n) { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return SH.dates.iso(d); },
    fromOffset: function (n) { const d = new Date(); d.setDate(d.getDate() + n); return SH.dates.iso(d); },
    pretty: function (iso) {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
})(window);
