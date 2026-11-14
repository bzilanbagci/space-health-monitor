/* storage.js - safe localStorage wrapper + persistence of the user's entries. Every access is in try/catch; the app works with empty or unavailable storage. */
(function (SH) {
  'use strict';
  SH.storage = {
    get: function (key, fallback) {
      try { const raw = window.localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
      catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); return true; } catch (e) { return false; }
    }
  };

  function validEntries(obj) {
    const out = {};
    if (!obj || typeof obj !== 'object') return out;
    Object.keys(SH.indicators).forEach(function (id) {
      const list = obj[id], ind = SH.indicators[id];
      if (!Array.isArray(list)) return;
      const ok = list.slice(0, 500).filter(function (d) {
        return d && typeof d.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d.date) &&
          typeof d.value === 'number' && isFinite(d.value) && d.value >= ind.min && d.value <= ind.max;
      }).map(function (d) { return { date: d.date, value: d.value, source: 'user' }; });
      if (ok.length) out[id] = ok;
    });
    return out;
  }

  SH.persist = {
    available: true,
    // Load saved data (if any and valid) into state. Call once, before the UI is initialised.
    restore: function () {
      const o = SH.storage.get(SH.STORAGE_KEY, null);
      if (!o || typeof o !== 'object' || o.v !== 1) return false;
      const scenarioOk = (SH.scenarios || []).some(function (s) { return s.id === o.scenario; });
      SH.state.restore({
        scenario: scenarioOk ? o.scenario : null,
        environment: SH.environments[o.environment] ? o.environment : 'iss',
        selected: SH.indicators[o.selected] ? o.selected : 'heartRate',
        userEntries: validEntries(o.userEntries)
      });
      return true;
    },
    save: function () { SH.persist.available = SH.storage.set(SH.STORAGE_KEY, SH.state.snapshot()); },
    clear: function () { SH.storage.remove(SH.STORAGE_KEY); },
    // Quick check whether storage can be written at all.
    check: function () {
      const k = SH.STORAGE_KEY + '.test';
      SH.persist.available = SH.storage.set(k, 1);
      SH.storage.remove(k);
    }
  };
})(window.SpaceHealth);
