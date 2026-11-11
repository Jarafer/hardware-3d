import { ramParts, ramLesson, bookIndex, ramReflectionFeedback } from '../education/ramContent.js';

export function bindRamChapter({ scene, navigate, microChapter, motherboardChapter, storageChapter, connectorsChapter, flexChapter, keyboardChapter, bibliographyChapter }) {
  const readingChapters = new Map([['micro', microChapter], ['motherboard', motherboardChapter], ['storage', storageChapter], ['connectors', connectorsChapter], ['flex', flexChapter], ['keyboard', keyboardChapter], ['bibliography', bibliographyChapter]]);
  const get = id => document.getElementById(id);
  const cleanups = [];
  const on = (id, event, action) => { const el = get(id); el.addEventListener(event, action); cleanups.push(() => el.removeEventListener(event, action)); };
  const node = (tag, text, className = '') => { const el = document.createElement(tag); el.textContent = text; el.className = className; return el; };
  let pending = null;
  let focusRam = false;
  let current = null;
  const canvasContainer = get('scene-container');
  const markerPositions = [[8, 18], [8, 44], [92, 78], [42, 86], [92, 18], [92, 46]];
  const bookMarkerPositions = [[58, 16], [56, 42], [94, 76], [63, 88], [94, 16], [94, 44]];
  const markers = new Map();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
  get('ram-markers').append(svg);
  for (const [index, part] of ramParts.entries()) {
    const marker = node('button', String(index + 1), 'ram-marker'); marker.type = 'button'; marker.dataset.ramPart = part.id;
    marker.setAttribute('aria-label', `Señalar ${index + 1}: ${part.name}`); marker.setAttribute('aria-controls', 'ram-part-text'); marker.title = part.name;
    const [x, y] = markerPositions[index]; marker.style.left = `${x}%`; marker.style.top = `${y}%`;
    const line = document.createElementNS(svg.namespaceURI, 'line'); line.setAttribute('x1', x); line.setAttribute('y1', y);
    svg.append(line); get('ram-markers').append(marker); markers.set(part.id, { marker, line });
  }
  // El visor permanece en la mesa: la guía se dibuja sobre las páginas del libro.
  function showBookGuide(active) {
    get('ram-visual-mount').hidden = !active;
    get('ram-markers').hidden = !active || !get('ram-show-markers').checked;
  }
  function open(target) {
    if (['safety', 'diagnostic'].includes(target)) { pending = null; navigate(target, true); return; }
    navigate('exploration');
    for (const [id, chapter] of readingChapters) {
      if (id !== target) chapter.close();
    }
    const readingChapter = readingChapters.get(target);
    if (readingChapter) {
      pending = null;
      get('book-index').open = false;
      readingChapter.open();
      updateIndex();
      return;
    }
    updateIndex();
    if (!scene) { get('ram-chapter').hidden = target !== 'ram'; get(target === 'ram' ? 'ram-title' : 'book-index-title').focus(); return; }
    pending = target;
    if (!current?.ready) scene.setBookOpen(true);
    else enter();
  }
  function enter() {
    const target = pending; pending = null;
    if (target === 'ram') { get('book-index').open = false; focusRam = true; scene.showRam(); }
    else { scene.returnToBook(); get('scene').focus(); }
  }
  get('book-index-list').replaceChildren(...bookIndex.map((chapter, index) => {
    const item = node('li', '');
    const content = node(chapter.available ? 'button' : 'div', '', 'index-entry');
    content.append(node('span', String(index + 1).padStart(2, '0'), 'index-number'), node('strong', chapter.title), node('small', chapter.note));
    if (chapter.available) { content.type = 'button'; content.dataset.bookChapter = chapter.id; content.setAttribute('aria-controls', chapter.id === 'ram' ? 'ram-chapter' : chapter.id === 'overview' ? 'laboratorio' : `${chapter.id}-chapter`); }
    else content.classList.add('index-future');
    item.append(content); return item;
  }));
  on('book-index-list', 'click', event => { const button = event.target.closest('button[data-book-chapter]'); if (button) open(button.dataset.bookChapter); });
  for (const [id, chapter] of readingChapters) {
    on(`${id}-return-index`, 'click', () => {
      chapter.close();
      updateIndex();
      get('book-index').open = true;
      get('book-index-list').querySelector(`[data-book-chapter="${id}"]`).focus();
    });
  }
  on('ram-previous', 'click', () => open('overview'));
  on('ram-next', 'click', () => open('safety'));
  on('ram-index', 'click', () => { get('book-index').open = true; get('book-index-title').focus(); });
  on('open-ram-from-component', 'click', () => open('ram'));
  get('ram-introduction').textContent = ramLesson.introduction;
  get('ram-format').textContent = ramLesson.format;
  get('ram-compatibility').textContent = ramLesson.compatibility;
  get('ram-portable-notes').replaceChildren(...ramLesson.portableNotes.map(text => node('li', text)));
  get('ram-caution').textContent = ramLesson.caution;
  get('ram-specifications').replaceChildren(...ramLesson.specifications.flatMap(([name, value]) => [node('dt', name), node('dd', value)]));
  get('ram-label-notice').textContent = ramLesson.labelNotice;
  get('ram-evidence').replaceChildren(...ramLesson.evidence.map(([name, text]) => { const item = node('article', ''); item.append(node('h4', name), node('p', text)); return item; }));
  get('ram-question-observation').textContent = ramLesson.questions[0];
  get('ram-question-explanation').textContent = ramLesson.questions[1];
  get('ram-parts').replaceChildren(...ramParts.map((part, i) => { const button = node('button', `${i + 1}. ${part.name}`); button.type = 'button'; button.dataset.ramPart = part.id; button.setAttribute('aria-pressed', 'false'); return button; }));
  function choosePart(event) {
    const button = event.target.closest('[data-ram-part]'); if (!button) return;
    const id = button.dataset.ramPart;
    if (scene && current?.mode === 'ram' && current.available) { if (id === 'etiqueta') scene.rotateRam(0); scene.selectRamPart(id); }
    else showPart(id);
    // En pantallas pequeñas, un clic en la lista debe permitir ver qué se señaló.
    // El teclado conserva el foco en su botón; también puede usar 1–6 sobre el visor.
    if (event.detail > 0 && button.closest('#ram-parts') && scene && current?.available) canvasContainer.scrollIntoView({ block: 'center', behavior: 'auto' });
  }
  on('ram-parts', 'click', choosePart);
  on('ram-markers', 'click', choosePart);
  on('ram-show-markers', 'change', () => { get('ram-markers').hidden = !get('ram-show-markers').checked; });
  on('ram-guide-zoom-in', 'click', () => scene?.zoom(0.88));
  on('ram-guide-zoom-out', 'click', () => scene?.zoom(1.12));
  on('ram-guide-overview', 'click', () => { scene?.reset(); get('scene').focus(); });
  function showPart(id) {
    const part = ramParts.find(part => part.id === id);
    get('ram-part-title').textContent = part?.name ?? 'Explorá las seis partes';
    get('ram-guide-selection').textContent = part ? `${ramParts.indexOf(part) + 1}. ${part.name}` : 'Referencias 1–6 · Elegí una parte';
    get('ram-part-text').textContent = part?.text ?? 'Elegí una parte en el modelo o en esta lista. La cantidad de chips y contactos es ilustrativa; no representa un producto específico.';
    for (const button of get('ram-parts').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.ramPart === id));
    for (const [key, { marker, line }] of markers) { marker.setAttribute('aria-pressed', String(key === id)); line.classList.toggle('selected', key === id); }
  }
  showPart(null);
  on('ram-yaw', 'input', () => scene?.rotateRam(Number(get('ram-yaw').value)));
  on('ram-reset', 'click', () => scene?.reset());
  on('ram-label-focus', 'click', () => { showPart('etiqueta'); if (scene && current?.ready) { scene.rotateRam(0); scene.selectRamPart('etiqueta'); } get('ram-label-title').focus(); });
  on('ram-reflection', 'submit', event => { event.preventDefault(); const result = ramReflectionFeedback(get('ram-observation').value, get('ram-explanation').value); get('ram-feedback').textContent = result.text; get('ram-feedback').dataset.complete = result.complete; });
  function updateIndex() {
    const openReading = [...readingChapters].find(([, chapter]) => chapter.isOpen());
    const page = openReading?.[0] ?? (current ? (current.mode === 'ram' && current.open ? 'ram' : 'overview') : null);
    for (const button of get('book-index-list').querySelectorAll('button')) {
      const id = button.dataset.bookChapter;
      button.disabled = Boolean(current?.moving) && (['ram', 'overview'].includes(id) || readingChapters.has(id));
      if (id === page) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
  }
  const unsubscribe = scene?.subscribeBook(state => {
    current = state;
    if (pending && state.ready) { enter(); return; }
    if (pending && !state.target) pending = null;
    const active = state.mode === 'ram' && state.open;
    if (active) get('ram-chapter').hidden = false;
    showBookGuide(active);
    const positions = state.ramPart ? markerPositions : bookMarkerPositions;
    for (const [index, part] of ramParts.entries()) {
      const { marker, line } = markers.get(part.id); const [x, y] = positions[index];
      marker.style.left = `${x}%`; marker.style.top = `${y}%`; line.setAttribute('x1', x); line.setAttribute('y1', y);
    }
    get('ram-chapter').hidden = !active;
    for (const id of ['ram-yaw', 'ram-reset', 'ram-guide-overview', 'ram-guide-zoom-in', 'ram-guide-zoom-out']) get(id).disabled = !active || !state.ready || !state.available;
    for (const { marker } of markers.values()) marker.disabled = !state.ready || !state.available;
    for (const button of get('ram-parts').querySelectorAll('button')) button.disabled = state.moving;
    get('ram-yaw').value = Math.round(state.ramYaw);
    get('ram-yaw-value').textContent = `${Math.round(state.ramYaw)}°`;
    showPart(state.ramPart);
    get('open-ram-from-component').hidden = state.mode !== 'internal' || state.selectedId !== 'ram';
    get('open-ram-from-component').disabled = !state.ready;
    updateIndex();
    if (focusRam && active && state.ready) { focusRam = false; get('scene').focus(); }
  });
  const unsubscribeMarkers = scene?.subscribeRamMarkers(positions => {
    const visibleIds = new Set();
    for (const position of positions) {
      const entry = markers.get(position.id); if (!entry) continue;
      visibleIds.add(position.id); entry.marker.hidden = !position.visible; entry.line.style.display = position.visible ? '' : 'none';
      entry.line.setAttribute('x2', position.x); entry.line.setAttribute('y2', position.y);
    }
    for (const [id, entry] of markers) if (!visibleIds.has(id)) { entry.marker.hidden = true; entry.line.style.display = 'none'; }
  });
  if (!scene) { get('ram-visual-mount').hidden = true; for (const id of ['ram-yaw', 'ram-reset', 'ram-guide-overview', 'ram-guide-zoom-in', 'ram-guide-zoom-out']) get(id).disabled = true; }
  return () => { unsubscribeMarkers?.(); unsubscribe?.(); showBookGuide(false); cleanups.forEach(cleanup => cleanup()); get('ram-markers').replaceChildren(); };
}
