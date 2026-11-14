/* exercise.js - modal for the Gravity "Start exercise" task: pick one of 4 flat vector crew members (inline SVG), watch an environment-specific
   animation (ISS 0 g arm raises, Moon 1/6 g squats, Mars 3/8 g isometric hold) and finish a 10 second timer. Completes the task in Hazard Shields. */
(function (SH) {
  'use strict';
  const el = SH.dom.el, NS = 'http://www.w3.org/2000/svg';
  const CHARS = [
    { id: 'woman', name: 'Woman astronaut', skin: '#f2c6a0', suit: '#e0508c', hair: '#3b2a24', head: 'woman' },
    { id: 'man', name: 'Man astronaut', skin: '#c68c5b', suit: '#3b82f6', hair: '#1f1a17', head: 'man' },
    { id: 'eva', name: 'EVA suit astronaut', skin: '#f1f5ff', suit: '#e6ecf8', hair: '#f1f5ff', head: 'eva' },
    { id: 'alien', name: 'Friendly alien coach', skin: '#a3e635', suit: '#4d7c0f', hair: '#a3e635', head: 'alien' }
  ];
  let modal = null, sel = 'woman', timer = null, last = null;

  function svgHTML(c) {
    const arm = function (side) {
      const x = side === 'l' ? 42 : 78;
      return '<g transform="translate(' + x + ',70)"><g class="arm arm-' + side + '"><rect x="-6" y="-4" width="12" height="38" rx="6" fill="' + c.suit + '" stroke="#0b1325" stroke-width="1.5"/>' +
        '<circle cx="0" cy="36" r="6" fill="' + (c.head === 'eva' ? '#f1f5ff' : c.skin) + '" stroke="#0b1325" stroke-width="1.5"/></g></g>';
    };
    let head = '';
    if (c.head === 'eva') head = '<circle cx="60" cy="42" r="23" fill="#f1f5ff" stroke="#0b1325" stroke-width="2"/><ellipse cx="60" cy="43" rx="15" ry="12" fill="#1e293b"/><ellipse cx="55" cy="39" rx="5" ry="3" fill="#5ad1ff" opacity=".7"/>';
    else if (c.head === 'alien') head = '<path d="M52 20 Q48 8 42 6 M68 20 Q72 8 78 6" stroke="' + c.skin + '" stroke-width="3" fill="none"/><circle cx="42" cy="6" r="3.5" fill="#ffd166"/><circle cx="78" cy="6" r="3.5" fill="#ffd166"/>' +
      '<ellipse cx="60" cy="42" rx="22" ry="25" fill="' + c.skin + '" stroke="#0b1325" stroke-width="2"/><ellipse cx="51" cy="40" rx="5" ry="7" fill="#0b1325"/><ellipse cx="69" cy="40" rx="5" ry="7" fill="#0b1325"/><path d="M52 55 Q60 61 68 55" stroke="#0b1325" stroke-width="2" fill="none"/>';
    else head = (c.head === 'woman' ? '<circle cx="60" cy="14" r="8" fill="' + c.hair + '"/>' : '') + '<circle cx="60" cy="42" r="21" fill="' + c.skin + '" stroke="#0b1325" stroke-width="2"/>' +
      '<path d="M39 40 Q40 20 60 20 Q80 20 81 40 Q70 30 60 31 Q50 30 39 40Z" fill="' + c.hair + '"/><circle cx="53" cy="44" r="2.4" fill="#0b1325"/><circle cx="67" cy="44" r="2.4" fill="#0b1325"/><path d="M54 53 Q60 58 66 53" stroke="#0b1325" stroke-width="2" fill="none"/>';
    return '<svg class="crew-svg" viewBox="0 0 120 170" role="img" aria-label="' + SH.i18n.t(c.name) + '">' +
      '<g class="legs"><rect x="44" y="112" width="13" height="44" rx="6" fill="' + c.suit + '" stroke="#0b1325" stroke-width="1.5"/><rect x="63" y="112" width="13" height="44" rx="6" fill="' + c.suit + '" stroke="#0b1325" stroke-width="1.5"/>' +
      '<rect x="41" y="152" width="19" height="9" rx="4" fill="#243556"/><rect x="60" y="152" width="19" height="9" rx="4" fill="#243556"/></g>' +
      '<g class="torso"><rect x="38" y="64" width="44" height="54" rx="14" fill="' + c.suit + '" stroke="#0b1325" stroke-width="2"/><rect x="52" y="78" width="16" height="12" rx="3" fill="#5ad1ff" opacity=".8"/>' +
      arm('l') + arm('r') + head + '</g></svg>';
  }
  function envKey() { const e = SH.state.get('environment'); return e === 'mars' ? 'mars' : e === 'moon' ? 'moon' : 'iss'; }
  const TXT = { iss: 'ISS (0 g): raise and lower your arms against resistance', moon: 'Moon (1/6 g): slow squats', mars: 'Mars (3/8 g): hold an isometric stance' };

  function close() { if (timer) clearInterval(timer); timer = null; if (modal) { modal.remove(); modal = null; } if (last) last.focus(); document.removeEventListener('keydown', onKey); }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function open() {
    last = document.activeElement; if (modal) close(); last = document.getElementById('btn-ex') || last;
    const stage = el('div', { class: 'crew-stage env-' + envKey() }), msg = el('p', { role: 'status', class: 'advice', text: TXT[envKey()] }), bar = el('progress', { max: '10', value: '0', 'aria-label': '10 s' });
    const count = el('span', { class: 'count', text: '10' }), choices = el('div', { class: 'crew-choices', role: 'radiogroup', 'aria-label': 'Choose your crew member' });
    function draw() { stage.innerHTML = svgHTML(CHARS.filter(function (c) { return c.id === sel; })[0]); }
    CHARS.forEach(function (c) {
      const b = el('button', { type: 'button', class: 'crew-choice', role: 'radio', 'aria-checked': String(c.id === sel), id: 'crew-' + c.id, onclick: function () {
        sel = c.id; Array.prototype.forEach.call(choices.children, function (x) { x.setAttribute('aria-checked', String(x.id === 'crew-' + sel)); }); draw(); } }, [el('span', { text: c.name })]);
      choices.appendChild(b);
    });
    const go = el('button', { type: 'button', class: 'btn', text: 'Start (10 s)' });
    go.addEventListener('click', function () {
      if (timer) return; go.disabled = true; stage.classList.add('running'); let left = 10; count.textContent = String(left); bar.value = 0;
      timer = setInterval(function () {
        left--; count.textContent = String(left); bar.value = 10 - left;
        if (left <= 0) { clearInterval(timer); timer = null; stage.classList.remove('running'); msg.textContent = 'Great job! Exercise done.'; SH.i18n.apply();
          if (SH.ui.a11y && SH.ui.a11y.announce) SH.ui.a11y.announce('Exercise done');
          if (SH.ui.shields) SH.ui.shields.complete('g-ex'); }
      }, 1000);
    });
    const x = el('button', { type: 'button', class: 'btn btn-secondary', text: 'Close', onclick: close });
    modal = el('div', { class: 'modal-back' }, [el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ex-title' }, [
      el('h2', { id: 'ex-title', text: 'Start exercise' }), el('p', { class: 'small muted', text: 'Choose your crew member' }), choices, stage, msg,
      el('div', { class: 'btn-row' }, [go, count, ' s', x]), bar])]);
    document.body.appendChild(modal); draw(); SH.i18n.apply(); document.addEventListener('keydown', onKey); go.focus();
  }
  SH.ui.exercise = { open: open, close: close, render: function () {} };
})(window.SpaceHealth);
