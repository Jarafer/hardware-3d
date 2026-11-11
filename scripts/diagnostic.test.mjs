import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DiagnosticJourney, DIAGNOSTIC_STORAGE_KEY } from '../src/education/DiagnosticJourney.js';
import { diagnosticCase, hypotheses } from '../src/education/diagnosticContent.js';

function storage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
function reachAction(journey, hypothesis = 'ram', tests = ['memoria', 'inicio']) {
  journey.update('read', true); assert.equal(journey.next(), true);
  journey.update('hypothesis', hypothesis); journey.update('why', 'Es una posibilidad inicial que necesita contrastarse con varias evidencias.'); assert.equal(journey.next(), true);
  journey.chooseTests(tests); journey.update('informationPlan', 'Quiero distinguir presión de recursos de una falla física antes de decidir.'); assert.equal(journey.next(), true);
  for (const id of tests) journey.reveal(id);
  assert.equal(journey.next(), true);
  for (const id of tests) {
    journey.relate(id, 'type', 'ambiguo'); journey.relate(id, 'hypotheses', ['ram', 'inicio']); journey.relate(id, 'note', 'Esta señal admite más de una explicación y requiere contrastar las condiciones de carga.');
  }
  journey.update('finalHypotheses', ['inicio', 'ram']);
  journey.update('reasoning', 'La carga de inicio puede contribuir a la presión de recursos; los valores no permiten declarar un módulo defectuoso.');
  journey.update('uncertainty', 'Falta comprobar si la lentitud restante corresponde a otra carga o a la unidad.');
  assert.equal(journey.next(), true);
}
function finish(journey) {
  journey.update('action', 'mas-evidencias'); journey.update('plan', 'Pediría otra comparación controlada y registraría los tiempos bajo las mismas condiciones.'); journey.update('supervised', true);
  assert.equal(journey.next(), true);
}

test('no se puede finalizar ni saltar etapas sin hipótesis, evidencias y fundamentación', () => {
  const journey = new DiagnosticJourney();
  assert.equal(journey.next(), false);
  assert.equal(journey.go(5), false);
  assert.equal(journey.go(6), false);
  assert.equal(journey.result, null);
});

test('las cinco hipótesis iniciales admiten un razonamiento completo sin una respuesta premiada', () => {
  const feedback = [];
  for (const hypothesis of hypotheses) {
    const journey = new DiagnosticJourney(); reachAction(journey, hypothesis.id); finish(journey);
    assert.equal(journey.result.initialHypothesis, hypothesis.name);
    feedback.push(journey.result.feedback);
  }
  for (const result of feedback) assert.deepEqual(result, feedback[0]);
});

test('elegir pruebas no acredita observarlas y no se revelan pruebas no solicitadas', () => {
  const journey = new DiagnosticJourney();
  assert.equal(journey.reveal('inicio'), false);
  journey.update('read', true); journey.next(); journey.update('hypothesis', 'inicio'); journey.update('why', 'Quiero investigar el impacto de las aplicaciones de inicio.'); journey.next();
  journey.chooseTests(['memoria', 'inicio']); journey.update('informationPlan', 'Comparar carga y memoria durante el mismo inicio.'); journey.next();
  assert.equal(journey.next(), false);
  assert.equal(journey.reveal('termica'), false);
  journey.reveal('memoria'); assert.equal(journey.next(), false);
  journey.reveal('inicio'); assert.equal(journey.next(), true);
});

test('una señal admite varias hipótesis y borrar su interpretación vuelve a bloquear el avance', () => {
  const journey = new DiagnosticJourney(); reachAction(journey);
  journey.go(4); journey.relate('inicio', 'type', '');
  assert.equal(journey.next(), false);
  journey.relate('inicio', 'type', 'compatible');
  assert.equal(journey.next(), true);
  assert.deepEqual(journey.state.relations.inicio.hypotheses, ['ram', 'inicio']);
});

test('reemplazos por suposición y formateo siguen bloqueados aunque haya evidencias', () => {
  const journey = new DiagnosticJourney(); reachAction(journey);
  journey.update('plan', 'Cambiaría una pieza sin otra evidencia que mi primera impresión.'); journey.update('supervised', true);
  for (const action of ['reemplazar', 'formatear']) { journey.update('action', action); assert.equal(journey.next(), false); assert.ok(journey.actionProblem.length > 40); }
});

test('una propuesta específica exige haber observado su comprobación correspondiente', () => {
  const journey = new DiagnosticJourney(); reachAction(journey, 'almacenamiento', ['memoria', 'disco']);
  journey.update('action', 'inicio-controlado'); assert.ok(journey.actionProblem);
  journey.update('action', 'revision-unidad'); assert.equal(journey.actionProblem, '');
});

test('el resultado y su fecha se recuperan después de crear otra instancia sin cuenta', () => {
  const local = storage(); const journey = new DiagnosticJourney(local); reachAction(journey); finish(journey);
  const restored = new DiagnosticJourney(local);
  assert.deepEqual(restored.result, journey.result);
  assert.equal(restored.state.index, 6);
  assert.equal(restored.persistent, true);
  assert.equal(restored.result.simulated, true);
  assert.equal(JSON.parse(local.getItem(DIAGNOSTIC_STORAGE_KEY)).result.caseId, diagnosticCase.id);
});

test('el borrador conserva textos y resultados observados aunque el recorrido esté incompleto', () => {
  const local = storage(); const journey = new DiagnosticJourney(local); reachAction(journey); journey.go(4); journey.update('uncertainty', '');
  const restored = new DiagnosticJourney(local);
  assert.equal(restored.state.index, 4);
  assert.equal(restored.result, null);
  assert.equal(restored.state.relations.inicio.note, journey.state.relations.inicio.note);
  assert.deepEqual(restored.state.observed, ['memoria', 'inicio']);
});

test('el fallo de almacenamiento no impide completar la actividad en memoria', () => {
  const broken = { getItem() { throw new Error('Bloqueado'); }, setItem() { throw new Error('Sin cuota'); } };
  const journey = new DiagnosticJourney(broken); reachAction(journey); finish(journey);
  assert.ok(journey.result);
  assert.equal(journey.persistent, false);
});

test('un guardado corrupto, ajeno o con IDs inventados no habilita la devolución final', () => {
  const local = storage(); local.setItem(DIAGNOSTIC_STORAGE_KEY, '{');
  assert.equal(new DiagnosticJourney(local).result, null);
  local.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify({ version: 1, caseId: 'otro', state: { index: 6 } }));
  assert.equal(new DiagnosticJourney(local).state.index, 0);
  local.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify({ version: 1, caseId: diagnosticCase.id, state: { index: 6, hypothesis: 'inexistente', observed: ['inventado'], selected: ['inventado'], submittedAt: new Date().toISOString() }, result: { aprobado: true } }));
  const restored = new DiagnosticJourney(local);
  assert.equal(restored.state.index, 0);
  assert.equal(restored.result, null);
  assert.deepEqual(restored.state.observed, []);
});

test('quitar información invalida el resultado y reiniciar elimina el caso guardado', () => {
  const local = storage(); const journey = new DiagnosticJourney(local); reachAction(journey); finish(journey);
  journey.go(2); journey.chooseTests(['memoria']);
  assert.equal(journey.result, null);
  assert.equal(journey.go(6), false);
  assert.deepEqual(journey.state.observed, ['memoria']);
  journey.reset();
  const restored = new DiagnosticJourney(local);
  assert.equal(restored.result, null);
  assert.equal(restored.state.index, 0);
  assert.equal(restored.state.hypothesis, '');
});
