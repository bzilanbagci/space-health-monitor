/* trends.js - simple rule-based trend detection over the last few readings. General information only. */
(function (SH) {
  'use strict';
  const WINDOW = 5;          // number of recent readings examined
  const FRACTION = 0.2;      // change must be at least 20% of the normal-range width
  const WORRY = { heartRate: 'up', systolic: 'up', glucose: 'both', sleep: 'down', mood: 'down' };

  SH.trends = {
    detect: function (id, history) {
      const list = (history || SH.state.get('history'))[id] || [];
      if (list.length < WINDOW) return null;
      const w = list.slice(-WINDOW).map(function (d) { return d.value; });
      const ind = SH.indicators[id];
      const width = ind.ranges.green[1] - ind.ranges.green[0];
      const delta = w[w.length - 1] - w[0];
      const dir = delta < 0 ? 'down' : 'up';
      if (WORRY[id] !== 'both' && WORRY[id] !== dir) return null;
      if (Math.abs(delta) < FRACTION * width) return null;
      let against = 0;
      for (let i = 1; i < w.length; i++) if ((w[i] - w[i - 1]) * delta < 0) against++;
      if (against > 1) return null; // mostly steady movement in one direction
      const unit = ind.unit === 'score' ? '' : ' ' + ind.unit;
      return { id: id, direction: dir, from: w[0], to: w[w.length - 1],
        text: ind.label + ' has ' + (dir === 'down' ? 'decreased' : 'increased') + ' over the last ' + WINDOW + ' readings (' + w[0] + ' \u2192 ' + w[w.length - 1] + unit + '). Watch this trend.' };
    },
    all: function () {
      return SH.indicatorOrder.map(function (id) { return SH.trends.detect(id); }).filter(Boolean);
    }
  };
})(window.SpaceHealth);
