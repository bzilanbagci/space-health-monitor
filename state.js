/* state.js - single state object with small get/set/subscribe helpers.
   History = sample/scenario base + the user's own entries (source: 'user'). */
(function (SH) {
  'use strict';
  const data = { history: SH.buildSampleHistory(), selected: 'heartRate', environment: 'iss', scenario: null };
  const listeners = [];

  function notify(key) {
    listeners.slice().forEach(function (fn) { try { fn(key); } catch (e) { console.error(e); } });
  }
  function userEntries() {
    const out = {};
    Object.keys(data.history).forEach(function (id) {
      const u = data.history[id].filter(function (d) { return d.source === 'user'; });
      if (u.length) out[id] = u;
    });
    return out;
  }
  function build(scenarioId, ue) {
    const sc = (SH.scenarios || []).filter(function (s) { return s.id === scenarioId; })[0];
    const base = sc ? SH.historyFromValues(sc.values) : SH.buildSampleHistory();
    Object.keys(ue || {}).forEach(function (id) { base[id] = (base[id] || []).concat(ue[id]); });
    return base;
  }

  SH.state = {
    get: function (key) { return data[key]; },
    set: function (key, value) { data[key] = value; notify(key); },
    subscribe: function (fn) {
      listeners.push(fn);
      return function () { const i = listeners.indexOf(fn); if (i > -1) listeners.splice(i, 1); };
    },
    addEntry: function (id, value) {
      const list = (data.history[id] || []).slice();
      list.push({ date: SH.dates.todayISO(), value: value, source: 'user' });
      data.history[id] = list;
      notify('history');
    },
    latest: function (id) { const l = data.history[id]; return l && l.length ? l[l.length - 1] : null; },
    // Switch the synthetic base data (null = default sample); the user's own entries are kept.
    setScenario: function (id) { data.scenario = id; data.history = build(id, userEntries()); notify('history'); },
    // Back to the default synthetic sample and no user entries.
    resetAll: function () {
      data.scenario = null; data.history = SH.buildSampleHistory(); data.environment = 'iss'; data.selected = 'heartRate';
      notify('history'); notify('environment'); notify('selected');
    },
    snapshot: function () {
      return { v: 1, scenario: data.scenario, environment: data.environment, selected: data.selected, userEntries: userEntries() };
    },
    // Used once at start-up with already-validated data; does not notify.
    restore: function (o) {
      data.scenario = o.scenario; data.environment = o.environment; data.selected = o.selected;
      data.history = build(o.scenario, o.userEntries);
    }
  };
})(window.SpaceHealth);
