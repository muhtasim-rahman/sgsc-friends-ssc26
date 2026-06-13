/* ═══════════════════════════════════════════════════════════
   SGSC Banner Studio — script.js
   Author: Muhtasim Rahman | mdturzo.web.app
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════
   1. STATE
   ══════════════════════════════════════════════ */
const state = {
  mainIdx: 9,
  secondary: Array.from({ length: 61 }, (_, i) => i + 1).filter(n => n !== 9),

  layout:   'two-col',   // 'two-col' | 'two-row' | 'center'
  mainPos:  'right',     // 'left'|'right' for two-col ; 'top'|'bottom' for two-row

  pageW:    1640,
  pageH:    624,
  lockAspect: false,
  aspectRatio: 1640 / 624,

  splitRatio: 0.73,      // secondary column fraction

  gridCols: 10,
  gapSize:  4,
  colGap:   8,
  margin:   16,

  showSig:  true,
  zoom:     80,          // percent

  center: { topH: 90, botH: 90, leftW: 90, rightW: 90 },

  dlFmt:   'png',
  dlScale: 1,
};

/* ══════════════════════════════════════════════
   2. SECURITY — block devtools, right-click, img save
   ══════════════════════════════════════════════ */
(function setupSecurity() {
  document.addEventListener('contextmenu', e => e.preventDefault());

  document.addEventListener('keydown', e => {
    const k = e.key;
    if (k === 'F12') { e.preventDefault(); return; }
    if (e.ctrlKey && e.shiftKey && /^[IJCK]$/i.test(k)) { e.preventDefault(); return; }
    if (e.ctrlKey && /^[US]$/i.test(k)) { e.preventDefault(); return; }
  }, true);

  document.addEventListener('dragstart', e => {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  document.addEventListener('selectstart', e => {
    if (e.target.closest('.page')) e.preventDefault();
  });
})();

/* ══════════════════════════════════════════════
   3. DOM REFS
   ══════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const page        = $('page');
const pageInner   = $('pageInner');
const scaler      = $('scaler');
const canvasWrap  = $('canvasWrap');
const sidebar     = $('sidebar');
const overlay     = $('sidebarOverlay');

/* ══════════════════════════════════════════════
   4. UTILS
   ══════════════════════════════════════════════ */
function pad(n) { return String(n).padStart(2, '0'); }

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function setSliderFill(el) {
  const pct = (el.value - el.min) / (el.max - el.min) * 100;
  el.style.setProperty('--pct', pct.toFixed(1));
}

function syncSlider(id, valId, suffix, stateKey, subKey) {
  const slider = $(id);
  const valEl  = $(valId);
  if (!slider) return;
  setSliderFill(slider);
  slider.addEventListener('input', () => {
    const v = Number(slider.value);
    if (subKey) state[stateKey][subKey] = v;
    else state[stateKey] = v;
    if (valEl) valEl.textContent = v + suffix;
    setSliderFill(slider);
    applyPageCSS();
    if (id === 'gapSlider' || id === 'colGapSlider' || id === 'marginSlider') {
      applyGapCSS();
    }
    if (id === 'centerHSlider') {
      state.center.topH = v; state.center.botH = v;
      applyCenterCSS();
    }
    if (id === 'centerVSlider') {
      state.center.leftW = v; state.center.rightW = v;
      applyCenterCSS();
    }
  });
}

/* ══════════════════════════════════════════════
   5. PAGE DIMENSIONS & CSS
   ══════════════════════════════════════════════ */
function applyPageCSS() {
  page.style.width  = state.pageW + 'px';
  page.style.height = state.pageH + 'px';
  page.style.setProperty('--page-margin', state.margin + 'px');
}

function applyGapCSS() {
  const grid = pageInner.querySelector('.images-grid');
  if (grid) {
    grid.style.gap = state.gapSize + 'px';
    grid.style.setProperty('--col-gap', state.colGap + 'px');
  }
}

function applyCenterCSS() {
  const lc = pageInner.querySelector('.layout-container.center-layout');
  if (!lc) return;
  lc.style.setProperty('--c-top-h',  state.center.topH  + 'px');
  lc.style.setProperty('--c-bot-h',  state.center.botH  + 'px');
  lc.style.setProperty('--c-left-w', state.center.leftW + 'px');
  lc.style.setProperty('--c-right-w',state.center.rightW+ 'px');
  lc.style.gap = state.gapSize + 'px';
}

/* ══════════════════════════════════════════════
   6. CANVAS ZOOM
   ══════════════════════════════════════════════ */
function applyZoom() {
  const z = state.zoom / 100;
  page.style.transform = `scale(${z})`;
  scaler.style.width  = (state.pageW * z) + 'px';
  scaler.style.height = (state.pageH * z) + 'px';
  $('zoomVal').textContent = state.zoom + '%';
  setSliderFill($('zoomSlider'));
}

function autoFit() {
  const avW = Math.max(canvasWrap.clientWidth  - 56, 100);
  const avH = Math.max(canvasWrap.clientHeight - 56, 100);
  const z = Math.min(avW / state.pageW, avH / state.pageH);
  state.zoom = clamp(Math.round(z * 100), 10, 200);
  $('zoomSlider').value = state.zoom;
  applyZoom();
}

/* ══════════════════════════════════════════════
   7. IMAGE CELL FACTORY
   ══════════════════════════════════════════════ */
function createCell(imgNum) {
  const cell = document.createElement('div');
  cell.className = 'grid-cell';
  cell.dataset.num = imgNum;

  const img = document.createElement('img');
  img.src = `images/${pad(imgNum)}.jpg`;
  img.alt = '';
  img.loading = 'eager';
  img.draggable = false;

  img.onerror = () => {
    cell.classList.add('empty-cell');
    cell.innerHTML = `<span class="cell-num">${pad(imgNum)}</span>`;
  };

  cell.appendChild(img);
  cell.addEventListener('click', () => swapMainImage(imgNum));
  return cell;
}

function swapMainImage(clickedNum) {
  const oldMain = state.mainIdx;

  // Remove clicked from secondary
  const idx = state.secondary.indexOf(clickedNum);
  if (idx === -1) return;
  state.secondary.splice(idx, 1);

  // Insert old main back in sorted order
  let ins = state.secondary.findIndex(n => n > oldMain);
  if (ins === -1) ins = state.secondary.length;
  state.secondary.splice(ins, 0, oldMain);

  state.mainIdx = clickedNum;
  renderLayout();
}

/* ══════════════════════════════════════════════
   8. IMAGES GRID BUILDER
   ══════════════════════════════════════════════ */
function buildGrid(images, cols, container) {
  const rows = Math.ceil(images.length / cols);
  const grid = document.createElement('div');
  grid.className = 'images-grid';
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.style.gridTemplateRows    = `repeat(${rows}, 1fr)`;
  grid.style.gap = state.gapSize + 'px';
  grid.style.width  = '100%';
  grid.style.height = '100%';

  const total = rows * cols;
  for (let i = 0; i < total; i++) {
    if (i < images.length) {
      grid.appendChild(createCell(images[i]));
    } else {
      const e = document.createElement('div');
      e.className = 'grid-cell empty-cell';
      grid.appendChild(e);
    }
  }
  container.appendChild(grid);
}

/* ══════════════════════════════════════════════
   9. MAIN IMAGE BUILDER
   ══════════════════════════════════════════════ */
function buildMainArea(container) {
  const img = document.createElement('img');
  img.className = 'main-img';
  img.src = `images/${pad(state.mainIdx)}.jpg`;
  img.alt = 'Main Image';
  img.draggable = false;

  img.onerror = () => {
    img.remove();
    const ph = document.createElement('div');
    ph.className = 'main-placeholder';
    ph.textContent = `Image ${pad(state.mainIdx)}`;
    container.appendChild(ph);
  };

  container.appendChild(img);

  if (state.showSig) {
    const sig = document.createElement('div');
    sig.className = 'signature';
    sig.textContent = 'Muhtasim Rahman';
    container.appendChild(sig);
  }
}

/* ══════════════════════════════════════════════
   10. LAYOUT BUILDERS
   ══════════════════════════════════════════════ */
function buildTwoCol() {
  const lc = document.createElement('div');
  lc.className = 'layout-container two-col';

  const secondary = document.createElement('div');
  secondary.className = 'col-secondary';
  secondary.id = 'colSecondary';

  const divider = document.createElement('div');
  divider.className = 'col-divider';
  divider.id = 'colDivider';
  divider.style.width = state.colGap + 'px';

  const main = document.createElement('div');
  main.className = 'col-main';

  // Position: right (default) → secondary left, main right
  // Position: left → main left, secondary right
  if (state.mainPos === 'right') {
    lc.appendChild(secondary);
    lc.appendChild(divider);
    lc.appendChild(main);
  } else {
    lc.appendChild(main);
    lc.appendChild(divider);
    lc.appendChild(secondary);
  }

  const cols = state.gridCols;
  buildGrid(state.secondary, cols, secondary);
  buildMainArea(main);
  pageInner.appendChild(lc);

  // Apply initial split
  secondary.style.flexBasis = calcSecondaryBasis();

  // Drag handler
  setupColDivider(divider, lc, secondary);
}

function buildTwoRow() {
  const lc = document.createElement('div');
  lc.className = 'layout-container two-row';

  const secondary = document.createElement('div');
  secondary.className = 'row-secondary';
  secondary.id = 'rowSecondary';

  const divider = document.createElement('div');
  divider.className = 'row-divider';
  divider.id = 'rowDivider';
  divider.style.height = state.colGap + 'px';

  const main = document.createElement('div');
  main.className = 'row-main';

  if (state.mainPos === 'bottom') {
    lc.appendChild(secondary);
    lc.appendChild(divider);
    lc.appendChild(main);
  } else {
    lc.appendChild(main);
    lc.appendChild(divider);
    lc.appendChild(secondary);
  }

  // In two-row, prefer more columns to fill wide space
  const cols = Math.max(state.gridCols, 10);
  buildGrid(state.secondary, cols, secondary);
  buildMainArea(main);
  pageInner.appendChild(lc);

  secondary.style.flexBasis = calcSecondaryBasis();
  setupRowDivider(divider, lc, secondary);
}

function buildCenter() {
  const lc = document.createElement('div');
  lc.className = 'layout-container center-layout';
  lc.style.setProperty('--c-top-h',  state.center.topH  + 'px');
  lc.style.setProperty('--c-bot-h',  state.center.botH  + 'px');
  lc.style.setProperty('--c-left-w', state.center.leftW + 'px');
  lc.style.setProperty('--c-right-w',state.center.rightW+ 'px');
  lc.style.gap = state.gapSize + 'px';

  // Distribute 60 images: top=15, right=15, bottom=15, left=15
  const top    = state.secondary.slice(0,  15);
  const right  = state.secondary.slice(15, 30);
  const bottom = state.secondary.slice(30, 45);
  const left   = state.secondary.slice(45, 60);

  // Top zone
  const zTop = document.createElement('div');
  zTop.className = 'zone-top';
  buildGrid(top, 15, zTop);
  zTop.querySelector('.images-grid').style.gridTemplateRows = '1fr';

  // Right zone
  const zRight = document.createElement('div');
  zRight.className = 'zone-right';
  buildGrid(right, 1, zRight);
  zRight.querySelector('.images-grid').style.gridTemplateColumns = '1fr';

  // Main zone
  const zMain = document.createElement('div');
  zMain.className = 'zone-main';
  buildMainArea(zMain);

  // Left zone
  const zLeft = document.createElement('div');
  zLeft.className = 'zone-left';
  buildGrid(left, 1, zLeft);
  zLeft.querySelector('.images-grid').style.gridTemplateColumns = '1fr';

  // Bottom zone
  const zBot = document.createElement('div');
  zBot.className = 'zone-bottom';
  buildGrid(bottom, 15, zBot);
  zBot.querySelector('.images-grid').style.gridTemplateRows = '1fr';

  lc.appendChild(zTop);
  lc.appendChild(zLeft);
  lc.appendChild(zMain);
  lc.appendChild(zRight);
  lc.appendChild(zBot);

  pageInner.appendChild(lc);
}

function calcSecondaryBasis() {
  return `calc(${(state.splitRatio * 100).toFixed(2)}% - ${(state.colGap * 0.5).toFixed(1)}px)`;
}

/* ══════════════════════════════════════════════
   11. RENDER LAYOUT
   ══════════════════════════════════════════════ */
function renderLayout() {
  pageInner.innerHTML = '';
  applyPageCSS();

  if (state.layout === 'two-col')   buildTwoCol();
  else if (state.layout === 'two-row') buildTwoRow();
  else if (state.layout === 'center')  buildCenter();

  updatePreviewSize();
}

/* ══════════════════════════════════════════════
   12. DRAG DIVIDERS
   ══════════════════════════════════════════════ */
function setupColDivider(divEl, containerEl, secondaryEl) {
  let active = false;

  function start(clientX) {
    active = true;
    divEl.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
  }

  function move(clientX) {
    if (!active) return;
    const rect = containerEl.getBoundingClientRect();
    const rel  = clientX - rect.left;
    state.splitRatio = clamp(rel / rect.width, 0.2, 0.87);
    secondaryEl.style.flexBasis = calcSecondaryBasis();
  }

  function end() {
    if (!active) return;
    active = false;
    divEl.classList.remove('dragging');
    document.body.style.cursor = '';
  }

  divEl.addEventListener('mousedown', e => { start(e.clientX); e.preventDefault(); });
  document.addEventListener('mousemove', e => move(e.clientX));
  document.addEventListener('mouseup', end);

  divEl.addEventListener('touchstart', e => { start(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (active) { move(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
  document.addEventListener('touchend', end);
}

function setupRowDivider(divEl, containerEl, secondaryEl) {
  let active = false;

  function start() {
    active = true;
    divEl.classList.add('dragging');
    document.body.style.cursor = 'row-resize';
  }

  function move(clientY) {
    if (!active) return;
    const rect = containerEl.getBoundingClientRect();
    const rel  = clientY - rect.top;
    state.splitRatio = clamp(rel / rect.height, 0.2, 0.87);
    secondaryEl.style.flexBasis = calcSecondaryBasis();
  }

  function end() {
    if (!active) return;
    active = false;
    divEl.classList.remove('dragging');
    document.body.style.cursor = '';
  }

  divEl.addEventListener('mousedown', e => { start(); e.preventDefault(); });
  document.addEventListener('mousemove', e => move(e.clientY));
  document.addEventListener('mouseup', end);

  divEl.addEventListener('touchstart', e => { start(); e.preventDefault(); }, { passive: false });
  document.addEventListener('touchmove', e => { if (active) { move(e.touches[0].clientY); e.preventDefault(); } }, { passive: false });
  document.addEventListener('touchend', end);
}

/* ══════════════════════════════════════════════
   13. POSITION CONTROLS (contextual)
   ══════════════════════════════════════════════ */
function updatePositionControls() {
  const grp  = $('posCtrlGroup');
  const wrap = $('positionBtns');
  if (!grp || !wrap) return;

  if (state.layout === 'center') {
    grp.style.display = 'none';
    return;
  }
  grp.style.display = 'block';
  wrap.innerHTML = '';

  const opts = state.layout === 'two-col'
    ? [['left','Left'], ['right','Right']]
    : [['top','Top'], ['bottom','Bottom']];

  opts.forEach(([val, label]) => {
    const btn = document.createElement('button');
    btn.className = 'seg-btn' + (state.mainPos === val ? ' active' : '');
    btn.dataset.pos = val;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      state.mainPos = val;
      wrap.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderLayout();
    });
    wrap.appendChild(btn);
  });
}

function updateCenterControls() {
  const cc = $('centerCtrl');
  if (cc) cc.style.display = state.layout === 'center' ? 'block' : 'none';
}

/* ══════════════════════════════════════════════
   14. DOWNLOAD / EXPORT
   ══════════════════════════════════════════════ */
function updatePreviewSize() {
  const W = Math.round(state.pageW * state.dlScale);
  const H = Math.round(state.pageH * state.dlScale);
  const el = $('epPreviewSize');
  if (el) el.textContent = `Output: ${W} × ${H} px — ${state.dlFmt.toUpperCase()}`;
}

function logConsole(msg, type = 'info') {
  const c = $('epConsole');
  if (!c) return;
  const line = document.createElement('div');
  line.className = `log-line log-${type}`;
  line.textContent = `> ${msg}`;
  c.appendChild(line);
  c.scrollTop = c.scrollHeight;
}

let progressTimer = null;

function startProgressSim() {
  const bar = $('epProgressBar');
  if (!bar) return;
  let p = 0;
  const steps = [
    [5,  'Initializing canvas renderer...'],
    [18, 'Cloning DOM structure...'],
    [34, 'Loading image resources...'],
    [52, 'Rendering canvas bitmap...'],
    [68, 'Applying scale factor...'],
    [82, 'Encoding output format...'],
    [92, 'Preparing download...'],
  ];
  let si = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (si < steps.length) {
      const [target, msg] = steps[si];
      p = target;
      bar.style.width = p + '%';
      logConsole(msg, 'info');
      si++;
    }
  }, 280);
}

function finishProgress(success) {
  clearInterval(progressTimer);
  const bar = $('epProgressBar');
  if (bar) bar.style.width = success ? '100%' : '0%';
  if (success) {
    logConsole('Download complete.', 'ok');
  } else {
    logConsole('Download failed. Check console for details.', 'err');
  }
  setTimeout(() => {
    const pw = $('epProgressWrap');
    if (pw) pw.style.display = 'none';
    const dlBtn = $('downloadBtn');
    if (dlBtn) {
      dlBtn.classList.remove('loading');
      dlBtn.innerHTML = '<i class="fa fa-download"></i> Download Banner';
    }
  }, 2200);
}

async function doDownload() {
  const dlBtn = $('downloadBtn');
  dlBtn.classList.add('loading');
  dlBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Rendering...';

  const pw = $('epProgressWrap');
  pw.style.display = 'flex';
  pw.style.flexDirection = 'column';
  pw.style.gap = '8px';
  $('epConsole').innerHTML = '';
  startProgressSim();

  logConsole(`Format: ${state.dlFmt.toUpperCase()}, Scale: ${state.dlScale}x`, 'info');
  logConsole(`Page size: ${state.pageW} × ${state.pageH} px`, 'info');

  // Temporarily remove transform from page so html2canvas reads real size
  const prevTransform = page.style.transform;
  const prevOrigin    = page.style.transformOrigin;
  page.style.transform = 'none';
  page.style.transformOrigin = 'top left';

  try {
    const canvas = await html2canvas(page, {
      scale: state.dlScale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width:  state.pageW,
      height: state.pageH,
      onclone: (_, el) => {
        el.style.transform = 'none';
        el.style.boxShadow = 'none';
        el.style.position  = 'static';
      }
    });

    const W = Math.round(state.pageW * state.dlScale);
    const H = Math.round(state.pageH * state.dlScale);
    const fname = `sgsc-friends-ssc26-by-turzo(${W}x${H}).${state.dlFmt}`;
    const mime  = state.dlFmt === 'jpg' ? 'image/jpeg'
                : state.dlFmt === 'webp' ? 'image/webp'
                : 'image/png';
    const quality = state.dlFmt === 'png' ? 1 : 0.95;

    logConsole(`Encoding as ${mime}...`, 'info');

    canvas.toBlob(blob => {
      if (!blob) { finishProgress(false); return; }
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      logConsole(`Saved: ${fname}`, 'ok');
      finishProgress(true);
    }, mime, quality);

  } catch (err) {
    console.error('Export error:', err);
    logConsole('Error: ' + err.message, 'err');
    finishProgress(false);
  } finally {
    page.style.transform      = prevTransform;
    page.style.transformOrigin = prevOrigin;
  }
}

/* ══════════════════════════════════════════════
   15. SIDEBAR TOGGLE
   ══════════════════════════════════════════════ */
function initSidebarToggle() {
  const btn = $('sidebarToggle');
  const isMobile = () => window.innerWidth <= 900;

  btn.addEventListener('click', () => {
    if (isMobile()) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
  });
}

/* ══════════════════════════════════════════════
   16. EVENT LISTENERS
   ══════════════════════════════════════════════ */
function setupEvents() {

  // ── Presets
  $('presetGrid').querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $('presetGrid').querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const w = Number(btn.dataset.w), h = Number(btn.dataset.h);
      state.pageW = w;
      state.pageH = h;
      state.aspectRatio = w / h;
      $('inputWidth').value  = w;
      $('inputHeight').value = h;
      renderLayout();
      autoFit();
    });
  });

  // ── Width / Height inputs
  function onDimChange() {
    const w = clamp(Number($('inputWidth').value), 200, 6000);
    const h = clamp(Number($('inputHeight').value), 100, 6000);
    if (state.lockAspect) {
      // figure out which changed
      const dw = Math.abs(w - state.pageW);
      const dh = Math.abs(h - state.pageH);
      if (dw > dh) {
        state.pageW = w;
        state.pageH = Math.round(w / state.aspectRatio);
        $('inputHeight').value = state.pageH;
      } else {
        state.pageH = h;
        state.pageW = Math.round(h * state.aspectRatio);
        $('inputWidth').value = state.pageW;
      }
    } else {
      state.pageW = w; state.pageH = h;
      state.aspectRatio = w / h;
    }
    // deactivate preset buttons
    $('presetGrid').querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    renderLayout();
    autoFit();
  }

  $('inputWidth').addEventListener('change', onDimChange);
  $('inputHeight').addEventListener('change', onDimChange);

  // ── Lock aspect ratio
  $('lockAspectBtn').addEventListener('click', () => {
    state.lockAspect = !state.lockAspect;
    const icon = $('lockIcon');
    $('lockAspectBtn').classList.toggle('locked', state.lockAspect);
    icon.className = state.lockAspect ? 'fa fa-lock' : 'fa fa-lock-open';
    if (state.lockAspect) state.aspectRatio = state.pageW / state.pageH;
  });

  // ── Layout buttons
  $('layoutBtns').querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $('layoutBtns').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.layout = btn.dataset.layout;
      if (state.layout === 'two-col')  state.mainPos = 'right';
      if (state.layout === 'two-row')  state.mainPos = 'bottom';
      updatePositionControls();
      updateCenterControls();
      renderLayout();
    });
  });

  // ── Grid column buttons
  $('gridColBtns').querySelectorAll('.grid-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $('gridColBtns').querySelectorAll('.grid-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.gridCols = Number(btn.dataset.cols);
      renderLayout();
    });
  });

  // ── Sliders (gap, colGap, margin)
  syncSlider('gapSlider',   'gapVal',    'px', 'gapSize');
  syncSlider('colGapSlider','colGapVal', 'px', 'colGap');
  syncSlider('marginSlider','marginVal', 'px', 'margin');
  syncSlider('centerHSlider','centerHVal','px', 'center', 'topH');
  syncSlider('centerVSlider','centerVVal','px', 'center', 'leftW');

  // Override center sliders to do full re-render (grid rows depend on strip sizes)
  $('gapSlider').addEventListener('input', () => {
    if (state.layout === 'center') renderLayout();
    else applyGapCSS();
  });
  $('colGapSlider').addEventListener('input', () => {
    const d = pageInner.querySelector('.col-divider, .row-divider');
    if (d) {
      if (state.layout === 'two-col') d.style.width  = state.colGap + 'px';
      if (state.layout === 'two-row') d.style.height = state.colGap + 'px';
    }
    applyGapCSS();
  });
  $('marginSlider').addEventListener('input', () => {
    page.style.setProperty('--page-margin', state.margin + 'px');
  });
  $('centerHSlider').addEventListener('input', () => {
    state.center.botH = state.center.topH;
    $('centerHVal').textContent = state.center.topH + 'px';
    applyCenterCSS();
  });
  $('centerVSlider').addEventListener('input', () => {
    state.center.rightW = state.center.leftW;
    $('centerVVal').textContent = state.center.leftW + 'px';
    applyCenterCSS();
  });

  // ── Signature toggle
  $('showSigToggle').addEventListener('change', e => {
    state.showSig = e.target.checked;
    const sig = pageInner.querySelector('.signature');
    if (sig) sig.style.display = state.showSig ? '' : 'none';
    else renderLayout();
  });

  // ── Canvas zoom
  $('zoomSlider').addEventListener('input', () => {
    state.zoom = Number($('zoomSlider').value);
    applyZoom();
  });
  $('zoomInBtn').addEventListener('click', () => {
    state.zoom = clamp(state.zoom + 10, 10, 200);
    $('zoomSlider').value = state.zoom;
    applyZoom();
  });
  $('zoomOutBtn').addEventListener('click', () => {
    state.zoom = clamp(state.zoom - 10, 10, 200);
    $('zoomSlider').value = state.zoom;
    applyZoom();
  });
  $('fitBtn').addEventListener('click', autoFit);

  // ── Export: format
  $('fmtOpts').querySelectorAll('.ep-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $('fmtOpts').querySelectorAll('.ep-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.dlFmt = btn.dataset.fmt;
      updatePreviewSize();
    });
  });

  // ── Export: scale
  $('scaleOpts').querySelectorAll('.ep-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      $('scaleOpts').querySelectorAll('.ep-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.dlScale = Number(btn.dataset.scale);
      const warn = $('scaleWarning');
      warn.style.display = state.dlScale >= 4 ? 'flex' : 'none';
      updatePreviewSize();
    });
  });

  // ── Download
  $('downloadBtn').addEventListener('click', doDownload);

  // ── Window resize → re-autofit
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(autoFit, 180);
  });
}

/* ══════════════════════════════════════════════
   17. INIT
   ══════════════════════════════════════════════ */
function init() {
  applyPageCSS();
  updatePositionControls();
  updateCenterControls();
  renderLayout();
  autoFit();
  setupEvents();
  initSidebarToggle();

  // Init slider fills
  ['gapSlider','colGapSlider','marginSlider','zoomSlider','centerHSlider','centerVSlider'].forEach(id => {
    const el = $(id);
    if (el) setSliderFill(el);
  });
}

document.addEventListener('DOMContentLoaded', init);
