import { DiagnosticJourney } from '../education/DiagnosticJourney.js';
import { diagnosticCase, hypotheses, diagnosticTests, relationTypes, diagnosticActions, diagnosticStages } from '../education/diagnosticContent.js';

export function bindDiagnosticChapter({ navigate }) {
  let storage;
  try { storage = window.localStorage; } catch { storage = null; }
  const journey = new DiagnosticJourney(storage);
  const get = (id) => document.getElementById(id);
  const removers = [];
  const on = (id, event, action) => { const el = get(id); el.addEventListener(event, action); removers.push(() => el.removeEventListener(event, action)); };
  function node(tag, text = '', className = '') { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; }
  function field(name, label, value, minimum, testId = '') {
    const wrapper = node('label', label, 'diagnostic-field');
    const input = document.createElement('textarea');
    input.id = testId ? `diag-rel-${testId}-note` : `diag-field-${name}`;
    input.dataset.field = name;
    if (testId) input.dataset.testId = testId;
    if (testId) input.setAttribute('aria-label', `${label} Evidencia: ${diagnosticTests.find((item) => item.id === testId).name}`);
    input.value = value ?? ''; input.rows = 3; input.maxLength = 1800; input.minLength = minimum;
    wrapper.append(input, node('small', `Explicación breve: al menos ${minimum} caracteres. No se evalúa automáticamente la exactitud del texto.`));
    return wrapper;
  }
  function check(id, label, checked, attributes = {}) {
    const wrapper = node('label', '', 'diagnostic-check');
    const input = document.createElement('input'); input.type = 'checkbox'; input.id = id; input.checked = checked;
    Object.assign(input.dataset, attributes);
    wrapper.append(input, node('span', label)); return wrapper;
  }
  function options(items, fieldName, selected) {
    const group = node('fieldset', '', 'diagnostic-options'); group.append(node('legend', fieldName === 'hypothesis' ? 'Tu hipótesis inicial' : 'Tu decisión propuesta'));
    for (const item of items) {
      const label = node('label', '', 'diagnostic-option');
      const radio = document.createElement('input'); radio.type = 'radio'; radio.name = `diag-${fieldName}`; radio.id = `diag-${fieldName}-${item.id}`; radio.dataset.field = fieldName; radio.value = item.id; radio.checked = selected === item.id;
      const text = node('span'); text.append(node('strong', item.name)); if (item.hint) text.append(node('small', item.hint));
      label.append(radio, text); group.append(label);
    }
    return group;
  }
  function resultCard(test) {
    const card = node('article', '', 'diagnostic-result-card');
    card.append(node('span', 'RESULTADOS SIMULADOS · NO SON MEDICIONES DE TU EQUIPO', 'eyebrow'), node('h4', test.name));
    const dl = document.createElement('dl');
    for (const [name, value] of test.values) dl.append(node('dt', name), node('dd', value));
    card.append(dl, node('p', test.observation), node('p', test.limit, 'diagnostic-limit'));
    return card;
  }
  function requirement() {
    const index = journey.state.index;
    if (journey.canNext) return index === 5 ? 'Podés registrar la propuesta y recibir la devolución formativa.' : 'Paso preparado. Podés continuar o revisar lo escrito.';
    return [
      'Leé la situación y confirmá que los datos serán ficticios.',
      'Elegí una hipótesis y explicá brevemente por qué es una posibilidad (20 caracteres o más). No hay una elección premiada de antemano.',
      'Elegí al menos dos comprobaciones y explicá qué necesitás distinguir (20 caracteres o más).',
      'Revelá y leé los resultados de todas las comprobaciones que seleccionaste. Elegir información no equivale a observarla.',
      'Completá una interpretación, hipótesis y nota de al menos 20 caracteres para cada evidencia; registrá tu conclusión provisional (40 caracteres) y sus límites (20 caracteres).',
      journey.actionProblem || 'Escribí cómo verificarías tu propuesta (30 caracteres o más) y confirmá el alcance simulado y supervisado.',
      'Resultado registrado. Podés revisar la fundamentación o descargar el resumen.',
    ][index];
  }
  function updateFooter() {
    const s = journey.state;
    get('diag-count').textContent = `PASO ${s.index + 1} DE 7 · CASO D-01`;
    get('diag-progress').value = s.index + 1;
    get('diag-progress').setAttribute('aria-valuetext', `Paso ${s.index + 1} de 7: ${diagnosticStages[s.index]}`);
    get('diag-next').disabled = !journey.canNext;
    get('diag-next').hidden = s.index === 6;
    get('diag-next').textContent = s.index === 5 ? 'Recibir retroalimentación y guardar' : 'Siguiente paso';
    get('diag-previous').disabled = s.index === 0;
    get('diag-requirement').textContent = requirement();
    for (const button of get('diag-steps').querySelectorAll('button')) {
      const index = Number(button.dataset.step);
      button.disabled = index > journey.unlocked || (index === 6 && !journey.result);
      if (index === s.index) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    }
    const saveText = journey.persistent ? journey.result ? 'Resultado guardado en este navegador, sin cuenta. Podés volver a abrirlo después de recargar.' : 'Guardado local activo: el borrador se conserva en este navegador, sin cuenta.' : 'El guardado local no está disponible. El progreso se mantiene solo en esta pestaña; descargá el resumen al finalizar.';
    if (get('diag-save-status').textContent !== saveText) get('diag-save-status').textContent = saveText;
    const actionFeedback = get('diag-action-feedback');
    if (actionFeedback) {
      const selected = diagnosticActions.find((action) => action.id === s.action);
      actionFeedback.textContent = journey.actionProblem || selected?.feedback || '';
      actionFeedback.dataset.blocked = Boolean(journey.actionProblem);
    }
  }
  function renderSummary(body) {
    const result = journey.result;
    body.append(node('p', 'Recorrido registrado. La devolución valora cómo organizaste la investigación; no premia adivinar una única causa.', 'diagnostic-limit'));
    body.append(node('h4', 'Hipótesis inicial'), node('p', result.initialHypothesis), node('p', result.initialReason));
    body.append(node('h4', 'Información que buscabas'), node('p', result.informationPlan));
    body.append(node('h4', 'Evidencias e interpretaciones'));
    for (const evidence of result.evidence) {
      const article = node('article', '', 'diagnostic-summary-evidence');
      article.append(node('h5', evidence.name), node('p', relationTypes.find((type) => type.id === evidence.interpretation.type).name), node('p', evidence.interpretation.hypothesisNames.join(' · ')), node('p', evidence.interpretation.note));
      const details = document.createElement('details'); details.append(node('summary', 'Volver a leer estos resultados simulados'), resultCard(evidence)); article.append(details); body.append(article);
    }
    body.append(node('h4', 'Hipótesis que siguen en consideración'), node('p', result.finalHypotheses.join(' · ')), node('p', result.reasoning));
    body.append(node('h4', 'Incertidumbres'), node('p', result.uncertainty));
    body.append(node('h4', 'Acción y verificación propuestas'), node('p', result.action), node('p', result.verificationPlan));
    const feedback = node('section', '', 'diagnostic-rubric'); feedback.setAttribute('aria-label', 'Devolución formativa'); feedback.append(node('h4', 'Retroalimentación sobre el razonamiento'));
    for (const item of result.feedback) { const article = node('article'); article.append(node('strong', `${item.title} · ${item.status}`), node('p', item.text)); feedback.append(article); }
    feedback.append(node('p', result.reviewNotice, 'diagnostic-limit')); body.append(feedback);
    body.append(node('p', 'Para conversar: ¿qué nueva evidencia podría cambiar tu propuesta y cómo la obtendrías de forma segura?'));
    const download = node('button', 'Descargar resumen (.json)'); download.type = 'button'; download.dataset.download = 'true'; body.append(download);
  }
  function render() {
    const s = journey.state;
    const body = get('diag-body'); body.replaceChildren();
    get('diag-title').textContent = diagnosticStages[s.index];
    get('diag-steps').replaceChildren(...diagnosticStages.map((title, index) => {
      const item = document.createElement('li'); const button = node('button'); button.type = 'button'; button.dataset.step = index;
      button.append(node('span', `${index + 1}`), node('strong', title)); item.append(button); return item;
    }));
    if (s.index === 0) {
      body.append(node('h4', diagnosticCase.title), node('p', diagnosticCase.problem), node('p', diagnosticCase.context, 'diagnostic-limit'), check('diag-read', 'Leí la situación y entiendo que los resultados serán simulados.', s.read, { field: 'read' }));
    } else if (s.index === 1) {
      body.append(node('p', 'Elegí un punto de partida. Podés modificar tu hipótesis después de observar resultados; cambiar de idea con evidencia es parte de investigar.'), options(hypotheses, 'hypothesis', s.hypothesis), field('why', '¿Por qué esta hipótesis merece investigarse?', s.why, 20));
    } else if (s.index === 2) {
      body.append(node('p', 'Seleccioná al menos dos fuentes de información. Explicá su propósito antes de ver los resultados.'));
      for (const test of diagnosticTests) { const wrapper = node('div', '', 'diagnostic-test-choice'); wrapper.append(check(`diag-test-${test.id}`, test.name, s.selected.includes(test.id), { group: 'selected', value: test.id }), node('p', test.purpose)); body.append(wrapper); }
      body.append(field('informationPlan', '¿Qué querés distinguir con estas comprobaciones?', s.informationPlan, 20));
    } else if (s.index === 3) {
      body.append(node('p', 'Observá todas las comprobaciones que elegiste. No se ejecuta ninguna prueba real.'));
      for (const id of s.selected) {
        const test = diagnosticTests.find((item) => item.id === id);
        const article = node('article', '', 'diagnostic-test-reveal');
        const button = node('button', s.observed.includes(id) ? `${test.name}: resultados observados` : `Revelar resultados simulados: ${test.name}`); button.type = 'button'; button.dataset.reveal = id; button.id = `diag-reveal-${id}`;
        article.append(button); if (s.observed.includes(id)) article.append(resultCard(test)); body.append(article);
      }
    } else if (s.index === 4) {
      body.append(node('p', 'Relacioná cada evidencia con una o varias hipótesis. Registrá qué sostiene, qué no permite afirmar y qué alternativa sigue abierta.'));
      for (const id of s.observed) {
        const test = diagnosticTests.find((item) => item.id === id);
        const relation = s.relations[id] ?? { type: '', hypotheses: [], note: '' };
        const article = node('article', '', 'diagnostic-relation');
        const details = document.createElement('details'); details.append(node('summary', `Consultar evidencia: ${test.name}`), resultCard(test)); article.append(node('h4', test.name), details);
        const label = node('label', 'Esta señal…', 'diagnostic-field');
        const select = document.createElement('select'); select.id = `diag-rel-${id}-type`; select.dataset.testId = id; select.dataset.relation = 'type';
        select.setAttribute('aria-label', `Interpretación de ${test.name}`);
        const placeholder = node('option', 'Elegí una interpretación'); placeholder.value = ''; select.append(placeholder);
        for (const type of relationTypes) { const option = node('option', type.name); option.value = type.id; select.append(option); } select.value = relation.type;
        label.append(select); article.append(label);
        const group = node('fieldset'); group.append(node('legend', `Hipótesis relacionadas con ${test.name}`));
        for (const hypothesis of hypotheses) group.append(check(`diag-rel-${id}-hyp-${hypothesis.id}`, hypothesis.name, relation.hypotheses.includes(hypothesis.id), { group: 'relation', testId: id, value: hypothesis.id }));
        article.append(group, field('note', 'Explicá la relación sin convertir una señal en una certeza.', relation.note, 20, id)); body.append(article);
      }
      const finalGroup = node('fieldset'); finalGroup.append(node('legend', '¿Qué hipótesis mantenés provisionalmente?'));
      for (const item of hypotheses) finalGroup.append(check(`diag-final-${item.id}`, item.name, s.finalHypotheses.includes(item.id), { group: 'final', value: item.id }));
      body.append(finalGroup, field('reasoning', '¿Cómo cambió tu explicación inicial al contrastar las evidencias?', s.reasoning, 40), field('uncertainty', '¿Qué no podés concluir todavía y qué falta distinguir?', s.uncertainty, 20));
    } else if (s.index === 5) {
      body.append(node('p', 'La propuesta debe apoyarse en lo observado. Este caso no demuestra una pieza defectuosa y no habilita reemplazos.'), options(diagnosticActions, 'action', s.action));
      const actionFeedback = node('p', '', 'diagnostic-action-feedback'); actionFeedback.id = 'diag-action-feedback'; actionFeedback.setAttribute('role', 'status'); body.append(actionFeedback);
      body.append(field('plan', '¿Cómo verificarías si tu propuesta ayuda y qué compararías?', s.plan, 30), check('diag-supervised', 'Entiendo que es una propuesta simulada. Una actuación real requiere autorización docente y el procedimiento adecuado; no voy a reemplazar piezas por suposición.', s.supervised, { field: 'supervised' }));
    } else renderSummary(body);
    updateFooter();
  }
  on('diag-body', 'input', (event) => {
    const input = event.target;
    if (input.tagName !== 'TEXTAREA') return;
    if (input.dataset.testId) journey.relate(input.dataset.testId, 'note', input.value); else journey.update(input.dataset.field, input.value);
    updateFooter();
  });
  on('diag-body', 'change', (event) => {
    const input = event.target;
    if (input.tagName === 'TEXTAREA') return;
    if (input.dataset.relation) journey.relate(input.dataset.testId, 'type', input.value);
    else if (input.dataset.group) {
      const group = input.dataset.group;
      const values = [...get('diag-body').querySelectorAll('input[type="checkbox"]')].filter((item) => item.checked && item.dataset.group === group && (group !== 'relation' || item.dataset.testId === input.dataset.testId)).map((item) => item.dataset.value);
      if (group === 'selected') journey.chooseTests(values); else if (group === 'final') journey.update('finalHypotheses', values); else journey.relate(input.dataset.testId, 'hypotheses', values);
    } else if (input.dataset.field) journey.update(input.dataset.field, input.type === 'checkbox' ? input.checked : input.value);
    updateFooter();
  });
  on('diag-body', 'click', (event) => {
    const button = event.target.closest('button'); if (!button) return;
    if (button.dataset.reveal && journey.reveal(button.dataset.reveal)) { const id = button.id; render(); get(id).focus({ preventScroll: true }); }
    if (button.dataset.download && journey.result) {
      const url = URL.createObjectURL(new Blob([JSON.stringify(journey.result, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = 'detectives-hardware-resumen.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
  const move = (action) => { if (action()) { render(); get('diag-title').focus(); } };
  on('diag-next', 'click', () => move(() => journey.next()));
  on('diag-previous', 'click', () => move(() => journey.go(journey.state.index - 1)));
  on('diag-steps', 'click', (event) => { const button = event.target.closest('button[data-step]'); if (button) move(() => journey.go(Number(button.dataset.step))); });
  on('diag-reset', 'click', () => { journey.reset(); render(); get('diag-title').focus(); });
  on('diag-return-safety', 'click', () => navigate('safety', true));
  on('diag-return-exploration', 'click', () => navigate('exploration', true));
  get('diag-simulation-notice').textContent = diagnosticCase.notice;
  render();
  return () => { removers.forEach((remove) => remove()); };
}
