import { SafetyJourney } from '../education/SafetyJourney.js';
import { safetySteps, safetyChecks, safetyScenarios, maintenanceTypes, realWorkNotice } from '../education/safetyContent.js';

export function bindSafetyChapter({ navigate }) {
  const journey = new SafetyJourney();
  const get = (id) => document.getElementById(id);
  const removers = [];
  const listen = (id, event, action) => { const node = get(id); node.addEventListener(event, action); removers.push(() => node.removeEventListener(event, action)); };
  function node(tag, text, className) { const element = document.createElement(tag); element.textContent = text; if (className) element.className = className; return element; }
  function announce(text) { get('safety-announcement').textContent = text; }
  listen('safety-return', 'click', () => navigate('exploration', true));
  get('real-work-notice').textContent = realWorkNotice;
  const currentBadge = node('p', '', 'safety-current-badge');
  get('safety-step-title').before(currentBadge);
  for (const type of maintenanceTypes) {
    const article = document.createElement('article');
    article.append(node('h3', type.name), node('p', type.text));
    get('maintenance-types').append(article);
  }
  for (const [id, scenario] of Object.entries(safetyScenarios)) {
    const option = node('option', scenario.name); option.value = id; get('safety-scenario').append(option);
  }
  function render() {
    const step = safetySteps[journey.index];
    const observation = journey.mode === 'observe';
    const answer = journey.answers[journey.index];
    get('safety-step-count').textContent = `Paso ${journey.index + 1} de 7 · ${observation ? 'Observación' : 'Práctica de decisiones'}`;
    get('safety-progress').value = journey.index + 1;
    get('safety-progress').setAttribute('aria-valuetext', `Paso ${journey.index + 1} de 7. ${observation ? 'Recorrido de observación, sin comprobaciones acreditadas.' : `${journey.answers.filter((_, index) => journey.isStepComplete(index)).length} pasos comprobados.`}`);
    get('safety-step-title').textContent = step.title;
    currentBadge.textContent = `PASO ${journey.index + 1} DE 7`;
    get('safety-instruction').textContent = step.instruction;
    get('safety-case-description').textContent = `Estado al recibir el equipo: ${safetyScenarios[journey.scenario].description}`;
    get('safety-case-label').textContent = safetyScenarios[journey.scenario].name;
    get('safety-observer-notice').hidden = !observation;
    get('safety-observer-risk').hidden = !(observation && safetyScenarios[journey.scenario].risk && journey.index > 1);
    get('safety-mode-practice').setAttribute('aria-pressed', String(!observation));
    get('safety-mode-observe').setAttribute('aria-pressed', String(observation));
    get('safety-steps').replaceChildren(...safetySteps.map((item, index) => {
      const li = document.createElement('li');
      const button = node('button', ''); button.type = 'button'; button.dataset.step = index;
      const complete = journey.isStepComplete(index);
      const status = index === journey.index ? 'Actual' : complete ? 'Comprobado' : index > journey.unlocked ? 'Pendiente' : observation ? 'Visitado' : 'Disponible';
      button.append(node('span', complete ? '✓' : String(index + 1).padStart(2, '0'), 'safety-step-number'), node('strong', item.short), node('small', status));
      button.disabled = index > journey.unlocked || journey.stopped;
      if (index === journey.index) button.setAttribute('aria-current', 'step');
      li.append(button); return li;
    }));
    get('safety-answers').hidden = observation;
    get('safety-answers').replaceChildren(...step.options.map((option) => {
      const button = node('button', option.text); button.type = 'button'; button.dataset.answer = option.id;
      button.setAttribute('aria-pressed', String(answer?.id === option.id));
      button.disabled = journey.stopped;
      return button;
    }));
    const confirmations = !observation && step.confirmations.length > 0 && answer?.outcome === 'pass';
    get('safety-confirmations').hidden = !confirmations;
    get('safety-confirmation-inputs').replaceChildren(...step.confirmations.map((id) => {
      const label = document.createElement('label');
      const input = document.createElement('input'); input.type = 'checkbox'; input.id = `confirm-${id}`; input.dataset.confirm = id; input.checked = Boolean(journey.confirmations[id]);
      label.append(input, document.createTextNode(safetyChecks.find((check) => check.id === id).label)); return label;
    }));
    get('safety-feedback').hidden = !observation && !answer;
    get('safety-feedback').dataset.kind = observation ? 'observe' : answer?.outcome ?? '';
    get('safety-feedback-title').textContent = observation ? 'Ejemplo para observar' : answer?.outcome === 'pass' ? 'Decisión fundamentada' : answer?.outcome === 'stop' ? 'Detenerse también es cuidar' : 'Revisá la decisión';
    get('safety-feedback-text').textContent = observation ? step.observation : answer?.feedback ?? '';
    get('safety-gate').textContent = journey.stopped ? 'Recorrido detenido. No se continúa con este equipo; consultá al docente.' : observation ? 'Podés recorrer los pasos sin responder. Observar no comprueba condiciones ni habilita intervenir.' : journey.index === 6 ? 'La decisión final requiere todas las condiciones previas. No se retirarán piezas en este capítulo.' : journey.canAdvance ? 'Condición de este paso comprobada en la simulación. Podés avanzar.' : confirmations ? 'Confirmá cada condición del caso simulado para habilitar el siguiente paso.' : 'Elegí una decisión fundamentada para habilitar el siguiente paso.';
    get('safety-previous').disabled = journey.index === 0 || journey.stopped;
    get('safety-next').hidden = journey.index === 6;
    get('safety-next').disabled = !journey.canAdvance;
    get('safety-completion').hidden = !journey.finished;
    get('safety-observation-end').hidden = !(observation && journey.index === 6);
    get('safety-checklist').replaceChildren(...safetyChecks.map((check) => {
      const item = node('li', '');
      const confirmed = journey.checkSatisfied(check.id);
      item.dataset.confirmed = confirmed;
      item.append(node('span', confirmed ? '✓' : '○'), node('span', check.label), node('small', confirmed ? 'Comprobado' : 'Pendiente'));
      return item;
    }));
    get('safety-checklist-caption').textContent = observation ? 'Solo lectura: ninguna condición queda comprobada en este modo.' : `${safetyChecks.filter((check) => journey.checkSatisfied(check.id)).length} de ${safetyChecks.length} condiciones comprobadas en la simulación.`;
  }
  function move(action) { if (action()) { render(); get('safety-step-title').focus(); } }
  listen('safety-answers', 'click', (event) => {
    const button = event.target.closest('button[data-answer]');
    if (!button || !journey.answer(button.dataset.answer)) return;
    const id = button.dataset.answer; render();
    const updated = get('safety-answers').querySelector(`[data-answer="${id}"]`);
    if (!updated.disabled) updated.focus({ preventScroll: true });
    else get('safety-step-title').focus();
  });
  listen('safety-confirmation-inputs', 'change', (event) => {
    const input = event.target;
    if (!input.dataset.confirm || !journey.confirm(input.dataset.confirm, input.checked)) return;
    const id = input.id; render(); get(id).focus({ preventScroll: true });
  });
  listen('safety-next', 'click', () => move(() => journey.next()));
  listen('safety-previous', 'click', () => move(() => journey.go(journey.index - 1)));
  listen('safety-steps', 'click', (event) => { const button = event.target.closest('button[data-step]'); if (button) move(() => journey.go(Number(button.dataset.step))); });
  for (const mode of ['practice', 'observe']) listen(`safety-mode-${mode}`, 'click', () => {
    if (journey.mode === mode) return;
    journey.reset({ mode }); render(); announce('Modo cambiado. El recorrido y las comprobaciones se reiniciaron.');
  });
  listen('safety-scenario', 'change', (event) => { journey.reset({ scenario: event.target.value }); render(); announce('Caso cambiado. Se reiniciaron todas las comprobaciones.'); });
  listen('safety-restart', 'click', () => { journey.reset(); render(); announce('Recorrido reiniciado. Todas las condiciones vuelven a estar pendientes.'); get('safety-step-title').focus(); });
  render();
  return () => { removers.forEach((remove) => remove()); currentBadge.remove(); get('maintenance-types').replaceChildren(); get('safety-scenario').replaceChildren(); };
}
