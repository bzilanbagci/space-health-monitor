/* indicators.js - the 5 tracked indicators: ranges are ILLUSTRATIVE team-chosen reference ranges, not clinical or NASA thresholds. */
(function (SH) {
  'use strict';
  SH.indicatorOrder = ['heartRate', 'systolic', 'glucose', 'sleep', 'mood'];
  SH.indicators = {
    heartRate: {
      id: 'heartRate', label: 'Heart rate (resting)', unit: 'bpm', min: 30, max: 220, decimals: 0, example: '72',
      ranges: { green: [50, 90], yellow: [40, 110] }, hazard: 'gravity', bodyPart: 'heart',
      what: 'The number of heartbeats per minute, measured while resting.',
      whyInSpace: 'It is a quick, simple signal of how the heart, circulation and stress response are coping.',
      hazardEffect: 'Weightlessness shifts body fluids toward the head and changes how the heart and blood vessels work. Stress, poor sleep and a confined environment can also raise resting heart rate.',
      howToMeasure: 'A wearable heart-rate sensor, or count your pulse at the wrist for 30 seconds and double it. Actual equipment depends on the mission.',
      alertWhen: 'Tell the crew medical officer and ground flight surgeons if your resting rate stays in the Attention range, or if a high or low rate comes with dizziness, chest discomfort or fainting.',
      actions: ['Rest quietly for 5 minutes and measure again.', 'Keep up the planned exercise routine and stay hydrated.', 'Note stress, sleep and caffeine so the care team has context.']
    },
    systolic: {
      id: 'systolic', label: 'Blood pressure (systolic)', unit: 'mmHg', min: 60, max: 240, decimals: 0, example: '120',
      ranges: { green: [100, 129], yellow: [90, 139] }, hazard: 'gravity', bodyPart: 'heart',
      what: 'The pressure in the arteries when the heart beats (the top number). This demo tracks the systolic value only.',
      whyInSpace: 'Blood pressure shows how the circulation is adapting to life without normal gravity.',
      hazardEffect: 'Changes in gravity move blood and fluids around the body, and the cardiovascular system must adapt. Stress and disrupted routines can also play a role.',
      howToMeasure: 'A compact automatic cuff or a wearable, taken while seated or relaxed and at about the same time each day.',
      alertWhen: 'Contact the crew medical officer and ground flight surgeons if readings stay in the Attention range, or come with headache, dizziness, vision changes or chest discomfort.',
      actions: ['Rest for 5 minutes, then repeat the measurement.', 'Follow the planned exercise, hydration and meal routine.', 'Record the time and what you were doing.']
    },
    glucose: {
      id: 'glucose', label: 'Blood sugar (glucose)', unit: 'mg/dL', min: 30, max: 600, decimals: 0, example: '95',
      ranges: { green: [70, 110], yellow: [60, 140] }, hazard: 'closed', bodyPart: 'overall',
      what: 'The amount of sugar in the blood, a main energy source for the body.',
      whyInSpace: 'Diet, stress and activity changes during a mission can shift blood sugar, so it is a simple indicator of nutrition and metabolic balance.',
      hazardEffect: 'A closed environment limits food variety, and stress, disrupted routines and changed activity levels can all influence blood sugar.',
      howToMeasure: 'A small fingerstick glucose meter with a test strip.',
      alertWhen: 'Alert the crew medical officer and ground flight surgeons if readings stay in the Attention range, or come with strong thirst, confusion, shakiness or unusual tiredness.',
      actions: ['Follow the planned meal schedule and balanced menu.', 'Stay hydrated.', 'Note when you last ate so the reading can be interpreted.']
    },
    sleep: {
      id: 'sleep', label: 'Daily sleep', unit: 'hours', min: 0, max: 24, decimals: 1, example: '7.5',
      ranges: { green: [7, 9.5], yellow: [5.5, 11] }, hazard: 'isolation', bodyPart: 'brain',
      what: 'The total hours of sleep in the last 24 hours.',
      whyInSpace: 'Good sleep supports alertness, mood, decision-making and recovery, which matter for safe operations.',
      hazardEffect: 'Unusual light cycles, noise, busy schedules and the stress of isolation and confinement can shorten or disturb sleep.',
      howToMeasure: 'A simple sleep log, or a wearable that estimates sleep time.',
      alertWhen: 'Tell the crew and flight surgeons if sleep stays in the Attention range for several days, or if poor sleep affects your work or mood.',
      actions: ['Keep regular sleep and wake times.', 'Dim lights and limit screens before bed.', 'Keep the sleep area quiet and comfortable.']
    },
    mood: {
      id: 'mood', label: 'Mood (1-5 self-rating)', unit: 'score', min: 1, max: 5, decimals: 0, example: '4', inputType: 'scale',
      scaleLabels: ['Very low', 'Low', 'Okay', 'Good', 'Very good'],
      ranges: { green: [4, 5], yellow: [3, 5] }, hazard: 'isolation', bodyPart: 'brain',
      what: 'A quick daily self-rating of how you feel, from 1 (very low) to 5 (very good).',
      whyInSpace: 'Behavioral health is part of mission readiness. Mood changes can be an early sign that support is needed.',
      hazardEffect: 'Isolation, confinement, distance from family and delayed communication can affect mood and behavioral health.',
      howToMeasure: 'A short self-rating each day, optionally with a few notes.',
      alertWhen: 'Reach out to a crewmate or the flight surgeons if low mood lasts for several days, affects sleep or work, or you feel unable to cope.',
      actions: ['Talk with a crewmate or schedule a call with family or support staff.', 'Keep a daily routine with time for rest and hobbies.', 'Add some light exercise.']
    }
  };
})(window.SpaceHealth);
