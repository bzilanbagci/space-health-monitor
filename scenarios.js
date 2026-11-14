/* scenarios.js - demo scenarios (SYNTHETIC values, 14 days each). Used by demo mode. */
(function (SH) {
  'use strict';
  SH.scenarios = [
    { id: 'mars-sleep', label: 'Mars transit, day 120: sleep is dropping', environment: 'mars', focus: 'sleep',
      values: {
        heartRate: [70, 71, 70, 72, 71, 73, 72, 74, 73, 75, 74, 76, 75, 77],
        systolic:  [120, 121, 121, 122, 123, 122, 124, 123, 124, 125, 124, 126, 125, 126],
        glucose:   [94, 95, 96, 95, 97, 96, 98, 97, 99, 98, 100, 99, 101, 100],
        sleep:     [7.7, 7.5, 7.4, 7.2, 7.1, 6.9, 6.8, 6.6, 6.4, 6.3, 6.1, 5.9, 5.8, 5.6],
        mood:      [4, 4, 4, 4, 4, 4, 3, 4, 3, 3, 4, 3, 3, 3] } },
    { id: 'iss-normal', label: 'ISS routine day: all normal', environment: 'iss', focus: 'heartRate',
      values: {
        heartRate: [66, 68, 67, 69, 68, 67, 70, 68, 69, 67, 68, 70, 69, 68],
        systolic:  [116, 118, 117, 119, 118, 117, 120, 118, 119, 117, 118, 120, 119, 118],
        glucose:   [90, 92, 91, 93, 92, 91, 94, 92, 93, 91, 92, 94, 93, 92],
        sleep:     [7.6, 7.8, 7.5, 7.7, 7.6, 7.8, 7.5, 7.7, 7.6, 7.8, 7.5, 7.7, 7.6, 7.7],
        mood:      [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5] } },
    { id: 'stress-alert', label: 'Stress alert: elevated heart rate and low mood', environment: 'moon', focus: 'heartRate',
      values: {
        heartRate: [72, 74, 73, 76, 78, 82, 85, 90, 95, 99, 104, 108, 111, 114],
        systolic:  [122, 124, 125, 127, 128, 130, 131, 132, 133, 134, 135, 136, 138, 139],
        glucose:   [96, 98, 97, 99, 101, 100, 103, 102, 105, 104, 106, 105, 107, 108],
        sleep:     [7.2, 7.0, 6.9, 6.7, 6.5, 6.3, 6.2, 6.0, 5.9, 5.8, 5.7, 5.6, 5.6, 5.6],
        mood:      [4, 4, 4, 4, 4, 3, 4, 3, 3, 3, 3, 2, 2, 2] } }
  ];
})(window.SpaceHealth);
