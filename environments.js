/* environments.js - mission environments with APPROXIMATE, illustrative communication delays. */
(function (SH) {
  'use strict';
  SH.environments = {
    iss: { id: 'iss', name: 'ISS (low Earth orbit)', delayText: 'Near real-time (about 1 second, approximate).', longDelay: false,
      context: 'Ground flight surgeons can be reached quickly, so guidance can usually be confirmed by the ground team in near real time.',
      alertWording: 'Contact the ground flight surgeons; a reply should arrive quickly.',
      actionWording: 'Try these simple actions and confirm with the ground team.' },
    moon: { id: 'moon', name: 'Moon base', delayText: 'A few seconds each way (approximate).', longDelay: false,
      context: 'Communication is slightly delayed. Help from Earth is still fast, but a return home takes days.',
      alertWording: 'Message the ground team; expect a short delay before they reply.',
      actionWording: 'Try these simple actions while you wait for the ground team.' },
    mars: { id: 'mars', name: 'Mars transit', delayText: 'About 20 minutes each way (approximate; it changes with planet positions).', longDelay: true,
      context: 'Messages take a long time, so crews must act on guidance first and message the ground team in parallel.',
      alertWording: 'A reply can take 40 minutes or more (approximate), so message the ground team right away and keep going with safe actions in parallel.',
      actionWording: 'Act on these simple actions first and message the ground team in parallel. Do not wait for a reply.' }
  };
})(window.SpaceHealth);
