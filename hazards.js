/* hazards.js - the five hazards of human spaceflight (NASA Human Research Program), summarized in our own words.
   Hazard names checked against nasa.gov/hrp/hazards on 2026-11-14. */
(function (SH) {
  'use strict';
  SH.hazards = {
    radiation: { id: 'radiation', name: 'Space radiation', description: 'Energetic particles from the Sun and deep space that can pass through spacecraft and the body.' },
    isolation: { id: 'isolation', name: 'Isolation and confinement', description: 'Living and working in a small group in a small space, far from home, which can affect sleep, mood and teamwork.' },
    distance:  { id: 'distance',  name: 'Distance from Earth', description: 'Remote missions mean delayed communication and no quick return, so crews must rely more on themselves.' },
    gravity:   { id: 'gravity',   name: 'Gravity fields', description: 'Moving between weightlessness and partial or full gravity affects bones, muscles, body fluids and the heart.' },
    closed:    { id: 'closed',    name: 'Hostile closed environments', description: 'Air, water, food, noise, temperature and spacecraft design all shape health inside a sealed vehicle.' }
  };
})(window.SpaceHealth);
