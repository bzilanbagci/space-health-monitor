/* sample-history.js - 14 days of SYNTHETIC data (oldest first, ending yesterday). Not real astronaut data. */
(function (SH) {
  'use strict';
  const values = {
    heartRate: [68, 70, 69, 72, 71, 70, 73, 72, 74, 71, 72, 75, 73, 74],
    systolic:  [118, 120, 119, 121, 122, 120, 123, 121, 122, 124, 123, 122, 125, 124],
    glucose:   [92, 95, 90, 94, 96, 93, 95, 97, 94, 96, 95, 98, 96, 97],
    sleep:     [7.6, 7.5, 7.4, 7.5, 7.3, 7.2, 7.3, 7.1, 7.0, 7.1, 6.9, 6.8, 6.6, 6.5],
    mood:      [4, 4, 5, 4, 4, 4, 4, 5, 4, 4, 3, 4, 4, 4]
  };
  // Turns {indicatorId: [values oldest..newest]} into history entries dated up to yesterday.
  SH.historyFromValues = function (vals) {
    const out = {};
    Object.keys(vals).forEach(function (id) {
      const n = vals[id].length;
      out[id] = vals[id].map(function (v, i) { return { date: SH.dates.fromOffset(i - n), value: v, source: 'sample' }; });
    });
    return out;
  };
  SH.buildSampleHistory = function () { return SH.historyFromValues(values); };
})(window.SpaceHealth);
