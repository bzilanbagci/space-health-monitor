/* cell-counter.js - educational image-processing demo (no camera, no libraries): Otsu threshold + connected components counts blobs in a microscopy-style image.
   Runs fully in the browser; images never leave the device. NOT a clinical measurement. */
(function (SH) {
  'use strict';
  const el = SH.dom.el;
  // To use a real NASA OSDR image: put it at img/osdr-sample.jpg (small, no faces/logos) and fill in the credit below.
  const SAMPLE_SRC = 'img/osdr-sample.jpg';
  const SAMPLE_CREDIT = 'NASA Open Science Data Repository (OSDR) image: [study name and accession here]';
  const W = 400;
  let envNote, root, canvas, out, minSize, polarity, current = null, note;

  function synthetic() { // deterministic synthetic "cells" so the demo is repeatable
    const c = document.createElement('canvas'); c.width = W; c.height = 300;
    const g = c.getContext('2d'); g.fillStyle = '#1a2038'; g.fillRect(0, 0, W, 300);
    let seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    const cells = [];
    while (cells.length < 36) {
      const r = 9 + rnd() * 7, x = r + 4 + rnd() * (W - 2 * r - 8), y = r + 4 + rnd() * (300 - 2 * r - 8);
      if (cells.every(function (o) { return Math.hypot(o.x - x, o.y - y) > o.r + r + 6; })) cells.push({ x: x, y: y, r: r });
    }
    cells.forEach(function (o) {
      const gr = g.createRadialGradient(o.x, o.y, 1, o.x, o.y, o.r); gr.addColorStop(0, '#e9d6ff'); gr.addColorStop(1, '#a58bd6');
      g.fillStyle = gr; g.beginPath(); g.arc(o.x, o.y, o.r, 0, 6.2832); g.fill();
    });
    const d = g.getImageData(0, 0, W, 300);
    for (let i = 0; i < d.data.length; i += 4) { const n = (rnd() - .5) * 24; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
    g.putImageData(d, 0, 0);
    return c;
  }

  function analyze(src, label) {
    const w = W, h = Math.max(1, Math.round(src.height * W / src.width));
    canvas.width = w; canvas.height = h;
    const g = canvas.getContext('2d', { willReadFrequently: true });
    g.drawImage(src, 0, 0, w, h);
    let img;
    try { img = g.getImageData(0, 0, w, h); } catch (e) { out.textContent = 'This browser blocked reading the image (open the site over http/https, or use "Choose image").'; return; }
    const n = w * h, gray = new Float32Array(n), d = img.data;
    for (let i = 0; i < n; i++) gray[i] = .299 * d[4 * i] + .587 * d[4 * i + 1] + .114 * d[4 * i + 2];
    const bl = new Uint8Array(n); // 3x3 box blur, then 8-bit
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let s = 0, c = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < w && yy < h) { s += gray[yy * w + xx]; c++; } }
      bl[y * w + x] = s / c;
    }
    const hist = new Array(256).fill(0); for (let i = 0; i < n; i++) hist[bl[i]]++;
    let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
    let sB = 0, wB = 0, best = -1, thr = 128;
    for (let t = 0; t < 256; t++) { wB += hist[t]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += t * hist[t];
      const v = wB * wF * Math.pow(sB / wB - (sum - sB) / wF, 2); if (v > best) { best = v; thr = t; } }
    let bright = 0; for (let i = 0; i < n; i++) if (bl[i] > thr) bright++;
    const mode = polarity.value; // auto: the smaller group is "cells"
    const cellsBright = mode === 'bright' ? true : mode === 'dark' ? false : bright <= n - bright;
    const mask = new Uint8Array(n); for (let i = 0; i < n; i++) mask[i] = (bl[i] > thr) === cellsBright ? 1 : 0;
    const min = parseInt(minSize.value, 10) || 20, lab = new Int32Array(n), stack = new Int32Array(n);
    const found = []; let id = 0;
    for (let i = 0; i < n; i++) {
      if (!mask[i] || lab[i]) continue;
      id++; let sp = 0, area = 0, x0 = w, y0 = h, x1 = 0, y1 = 0; stack[sp++] = i; lab[i] = id;
      while (sp) {
        const p = stack[--sp], px = p % w, py = (p - px) / w; area++;
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
        if (px > 0 && mask[p - 1] && !lab[p - 1]) { lab[p - 1] = id; stack[sp++] = p - 1; }
        if (px < w - 1 && mask[p + 1] && !lab[p + 1]) { lab[p + 1] = id; stack[sp++] = p + 1; }
        if (py > 0 && mask[p - w] && !lab[p - w]) { lab[p - w] = id; stack[sp++] = p - w; }
        if (py < h - 1 && mask[p + w] && !lab[p + w]) { lab[p + w] = id; stack[sp++] = p + w; }
      }
      if (area >= min && x0 > 0 && y0 > 0 && x1 < w - 1 && y1 < h - 1) found.push({ area: area, x0: x0, y0: y0, x1: x1, y1: y1 });
    }
    g.lineWidth = 2; g.strokeStyle = '#3ddc97'; g.fillStyle = '#3ddc97'; g.font = 'bold 11px sans-serif';
    found.forEach(function (c, k) { g.strokeRect(c.x0 - 1, c.y0 - 1, c.x1 - c.x0 + 3, c.y1 - c.y0 + 3); g.fillText(String(k + 1), c.x0, Math.max(10, c.y0 - 3)); });
    const mean = found.length ? Math.round(found.reduce(function (a, c) { return a + c.area; }, 0) / found.length) : 0;
    out.textContent = '✓ ' + found.length + ' objects counted (mean area ' + mean + ' px, threshold ' + thr + ', cells are ' + (cellsBright ? 'bright' : 'dark') +
      '). Source: ' + label + '. Cells touching the border are skipped; touching cells may merge into one.';
    if (SH.ui.a11y && SH.ui.a11y.announce) SH.ui.a11y.announce(found.length + ' objects counted');
    result = found.length;
  }
  let result = null;

  function useCurrent() { if (current) analyze(current.src, current.label); }
  function sample() {
    const im = new Image();
    im.onload = function () { current = { src: im, label: SAMPLE_CREDIT }; note.textContent = 'Showing a NASA OSDR sample image.'; useCurrent(); };
    im.onerror = function () { current = { src: synthetic(), label: 'synthetic image generated in the browser (not NASA data)' }; note.textContent = 'Showing a SYNTHETIC demo image (no NASA image bundled).'; useCurrent(); };
    im.src = SAMPLE_SRC;
  }

  SH.ui.cellCounter = {
    count: function () { return result; },
    init: function () {
      root = document.getElementById('cell-panel'); if (!root) return;
      envNote = el('p', { class: 'advice' });
      canvas = el('canvas', { class: 'cell-canvas', role: 'img', 'aria-label': 'Image with counted cells outlined' });
      out = el('p', { role: 'status', text: 'Loading sample...' }); note = el('p', { class: 'small muted' });
      minSize = el('input', { type: 'number', id: 'cell-min', value: '20', min: '1', max: '2000' });
      polarity = el('select', { id: 'cell-pol' }, [el('option', { value: 'auto', text: 'Auto' }), el('option', { value: 'bright', text: 'Bright' }), el('option', { value: 'dark', text: 'Dark' })]);
      const file = el('input', { type: 'file', id: 'cell-file', accept: 'image/*' });
      file.addEventListener('change', function () {
        const f = file.files && file.files[0]; if (!f) return;
        const im = new Image(), url = URL.createObjectURL(f);
        im.onload = function () { current = { src: im, label: 'your local image (stays on this device)' }; note.textContent = 'Showing your image.'; useCurrent(); URL.revokeObjectURL(url); };
        im.onerror = function () { out.textContent = 'Could not read that image.'; };
        im.src = url;
      });
      minSize.addEventListener('change', useCurrent); polarity.addEventListener('change', useCurrent);
      root.appendChild(el('details', { open: true }, [
        el('summary', { text: 'Image lab: cell counter (educational demo)' }),
        el('p', { text: 'Educational tool inspired by NASA OSDR data models. It counts cells in a microscopy-style image with a simple threshold method. It is not a clinical measurement.' }), envNote,
        el('div', { class: 'btn-row' }, [el('button', { class: 'btn', type: 'button', text: 'Load sample image', onclick: sample }),
          el('label', { for: 'cell-file', text: 'Choose image:' }), file]),
        el('div', { class: 'btn-row' }, [el('label', { for: 'cell-min', text: 'Min size (px): ' }), minSize, el('label', { for: 'cell-pol', text: ' Cells are: ' }), polarity]),
        canvas, out, note
      ]));
      sample();
    },
    render: function () {
      if (!envNote) return;
      const e = SH.state.get('environment');
      envNote.textContent = e === 'mars' ? 'On a Mars transit, messages take about 20 minutes each way, so the crew needs local, autonomous assessment before ground advice arrives.'
        : e === 'moon' ? 'On the Moon, radiation exposure is higher and crews rely on local checks, so simple cell monitoring helps track immune changes.'
        : 'On the ISS, radiation and microgravity can change immune cells such as lymphocytes, so cell monitoring supports routine health checks.';
    }
  };
})(window.SpaceHealth);
