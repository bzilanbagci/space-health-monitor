/* main.js - init: restores saved data, runs each UI module's init() once, renders everything, re-renders and saves on any state change. */
(function (SH) {
  'use strict';
  const modules = ['form', 'statusCards', 'explanations', 'chart', 'bodyFigure', 'environment',
    'gamification', 'shields', 'cellCounter', 'reminders', 'exportSummary', 'demoMode', 'exercise', 'a11y', 'i18n'];

  function each(method) {
    modules.forEach(function (name) {
      const m = SH.ui[name];
      if (m && typeof m[method] === 'function') {
        try { m[method](); } catch (e) { console.error(name + '.' + method, e); }
      }
    });
  }

  SH.rerender = function () { each('render'); };
  // highlight the clicked section link in the top menu
  document.querySelectorAll('.topnav a').forEach(function (a) {
    a.addEventListener('click', function () { document.querySelectorAll('.topnav a').forEach(function (x) { x.classList.remove('active'); }); a.classList.add('active'); });
  });
  SH.persist.check();
  SH.persist.restore();
  each('init');
  each('render');
  SH.state.subscribe(function () { SH.persist.save(); each('render'); });

  // Optional offline support (only on http/https; failures are ignored so the app is never affected).
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener('load', function () {
      try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) { /* ignore */ }
    });
  }
})(window.SpaceHealth);
