/* form.js - input form: pick an indicator, enter a value, validate, add the measurement. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  let selectEl, fieldWrap, unitEl, hintEl, msgEl, inputEl, currentId = null;

  function buildField(id) {
    const ind = SH.indicators[id];
    SH.dom.clear(fieldWrap);
    if (ind.inputType === 'scale') {
      inputEl = el('select', { id: 'value-input', 'aria-describedby': 'value-hint' },
        ind.scaleLabels.map(function (l, i) { return el('option', { value: String(i + 1), text: (i + 1) + ' \u2013 ' + l }); }));
      inputEl.value = '4';
      hintEl.textContent = 'Choose 1 (very low) to 5 (very good).';
    } else {
      inputEl = el('input', { id: 'value-input', type: 'number', inputmode: 'decimal', step: 'any', autocomplete: 'off',
        placeholder: 'e.g. ' + ind.example, 'aria-describedby': 'value-hint' });
      hintEl.textContent = 'Allowed: ' + ind.min + ' to ' + ind.max + ' ' + ind.unit + '.';
    }
    fieldWrap.appendChild(inputEl);
    unitEl.textContent = ind.unit === 'score' ? '' : ind.unit;
    currentId = id;
  }

  function showMsg(text, isError) {
    msgEl.textContent = text;
    msgEl.className = 'form-msg ' + (isError ? 'error' : 'ok');
  }

  function onSubmit(e) {
    e.preventDefault();
    const ind = SH.indicators[currentId];
    const raw = String(inputEl.value).trim().replace(',', '.');
    const num = Number(raw);
    if (raw === '' || !isFinite(num)) return showMsg('Please enter a number.', true);
    if (num < ind.min || num > ind.max) {
      return showMsg('\u2716 Value must be between ' + ind.min + ' and ' + ind.max + ' ' + ind.unit + '.', true);
    }
    const value = Number(num.toFixed(ind.decimals));
    const id = currentId;
    SH.state.addEntry(id, value);
    showMsg('Saved: ' + ind.label + ' ' + SH.formatValue(ind, value) + ' \u2192 ' + SH.LEVELS[SH.evaluate(id, value).level].label + '.', false);
    if (ind.inputType !== 'scale') { inputEl.value = ''; }
    inputEl.focus();
  }

  SH.ui.form = {
    init: function () {
      const root = document.getElementById('entry-form');
      selectEl = el('select', { id: 'indicator-select' }, SH.indicatorOrder.map(function (id) {
        return el('option', { value: id, text: SH.indicators[id].label });
      }));
      selectEl.addEventListener('change', function () { SH.state.set('selected', selectEl.value); });
      fieldWrap = el('div', { class: 'field-grow', style: 'flex:1' });
      unitEl = el('span', { class: 'unit' });
      hintEl = el('p', { class: 'hint', id: 'value-hint' });
      msgEl = el('div', { class: 'form-msg', role: 'status', 'aria-live': 'polite' });
      const form = el('form', { novalidate: true }, [
        el('div', { class: 'form-row' }, [el('label', { for: 'indicator-select', text: 'Indicator' }), selectEl]),
        el('div', { class: 'form-row' }, [
          el('label', { for: 'value-input', text: 'Value' }),
          el('div', { class: 'field-row' }, [fieldWrap, unitEl]), hintEl]),
        el('button', { type: 'submit', class: 'btn', text: 'Add measurement' }), msgEl
      ]);
      form.addEventListener('submit', onSubmit);
      root.appendChild(form);
      buildField(SH.state.get('selected'));
    },
    render: function () {
      const id = SH.state.get('selected');
      if (selectEl.value !== id) selectEl.value = id;
      if (currentId !== id) { buildField(id); showMsg('', false); }
    }
  };
})(window.SpaceHealth);
