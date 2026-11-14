/* evaluate.js - pure functions: value -> green/yellow/red, overall status, "why this result" text. */
(function (SH) {
  'use strict';
  function inRange(v, r) { return v >= r[0] && v <= r[1]; }

  SH.evaluate = function (id, value) {
    const ind = SH.indicators[id];
    if (!ind || typeof value !== 'number' || !isFinite(value)) return { level: 'none' };
    if (inRange(value, ind.ranges.green)) return { level: 'green' };
    if (inRange(value, ind.ranges.yellow)) return { level: 'yellow' };
    return { level: 'red' };
  };

  SH.rangeText = function (ind, r) {
    return r[0] + '\u2013' + r[1] + (ind.unit && ind.unit !== 'score' ? ' ' + ind.unit : '');
  };

  SH.formatValue = function (ind, v) {
    if (ind.inputType === 'scale') return v + ' (' + ind.scaleLabels[v - 1] + ')';
    return v + ' ' + ind.unit;
  };

  // Worst level wins; ignores "none".
  SH.overallStatus = function (levels) {
    let worst = 'none';
    levels.forEach(function (l) { if (SH.LEVELS[l].rank > SH.LEVELS[worst].rank) worst = l; });
    return worst;
  };

  // Plain-language reason for a result, with the illustrative range that was used.
  SH.explain = function (id, value) {
    const ind = SH.indicators[id];
    const level = SH.evaluate(id, value).level;
    const g = SH.rangeText(ind, ind.ranges.green);
    const y = SH.rangeText(ind, ind.ranges.yellow);
    const shown = SH.formatValue(ind, value);
    const side = value < ind.ranges.green[0] ? 'below' : 'above';
    let text;
    if (level === 'green') text = shown + ' is inside the normal reference range (' + g + '), so it is shown as green / Normal.';
    else if (level === 'yellow') text = shown + ' is ' + side + ' the normal range (' + g + ') but inside the wider watch range (' + y + '), so it is shown as yellow / Watch.';
    else if (level === 'red') text = shown + ' is outside the watch range (' + y + '), so it is shown as red / Attention.';
    else text = 'There is no value yet for this indicator.';
    return { level: level, text: text, greenRange: g, yellowRange: y };
  };
})(window.SpaceHealth);
