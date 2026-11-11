import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SafetyJourney } from '../src/education/SafetyJourney.js';
import { safetySteps, safetyChecks } from '../src/education/safetyContent.js';

function completeCurrent(journey) {
  const step = safetySteps[journey.index];
  assert.equal(journey.answer(step.options.find((option) => option.outcome === 'pass').id), true);
  for (const id of step.confirmations) assert.equal(journey.confirm(id, true), true);
}
function reach(journey, index) {
  while (journey.index < index) { completeCurrent(journey); assert.equal(journey.next(), true); }
}

test('no se puede saltar al final ni avanzar con condiciones pendientes', () => {
  const journey = new SafetyJourney();
  assert.equal(journey.next(), false);
  assert.equal(journey.go(6), false);
  assert.equal(journey.go(-1), false);
  assert.equal(journey.go(0.5), false);
  assert.equal(journey.answer('supervisada'), false);
  assert.equal(journey.confirm('teacher', true), false);
  assert.equal(journey.finished, false);
});

test('el recorrido correcto completa siete pasos y nueve condiciones', () => {
  const journey = new SafetyJourney();
  reach(journey, 6);
  assert.equal(journey.conditionsMet, true);
  assert.equal(journey.finished, false);
  completeCurrent(journey);
  assert.equal(journey.finished, true);
  assert.equal(safetyChecks.filter(({ id }) => journey.checkSatisfied(id)).length, 9);
  assert.equal(journey.next(), false);
  assert.match(journey.answers[6].feedback, /no indica retirar piezas/);
});

test('todas las decisiones incorrectas bloquean el avance y explican el motivo', () => {
  for (let index = 0; index < safetySteps.length; index++) for (const option of safetySteps[index].options.filter((item) => item.outcome === 'retry')) {
    const journey = new SafetyJourney();
    reach(journey, index);
    journey.answer(option.id);
    assert.equal(journey.isStepComplete(index), false);
    assert.equal(journey.canAdvance, false);
    assert.equal(journey.finished, false);
    assert.ok(journey.answers[index].feedback.length > 40);
  }
});

test('el caso con riesgos no admite una conclusión de ausencia de alarmas', () => {
  const journey = new SafetyJourney();
  journey.reset({ scenario: 'risk' });
  reach(journey, 1);
  journey.answer('sin-alertas');
  assert.equal(journey.answers[1].outcome, 'retry');
  assert.equal(journey.next(), false);
  journey.answer('detener');
  assert.equal(journey.stopped, true);
  assert.equal(journey.next(), false);
  assert.equal(journey.go(2), false);
  assert.equal(journey.finished, false);
  assert.equal(journey.conditionsMet, false);
  assert.equal(journey.checkSatisfied('inspection'), true);
  assert.equal(journey.checkSatisfied('risks'), false);
});

test('consultar y detenerse es una salida segura también en el caso sin señales de alarma', () => {
  const journey = new SafetyJourney();
  reach(journey, 1);
  journey.answer('detener');
  assert.equal(journey.answers[1].outcome, 'stop');
  assert.equal(journey.stopped, true);
  assert.equal(journey.answer('sin-alertas'), false);
});

test('manual, batería, docente, herramientas y puesto requieren confirmaciones explícitas', () => {
  const journey = new SafetyJourney();
  reach(journey, 4);
  journey.answer('manual');
  assert.equal(journey.next(), false);
  journey.confirm('manual', true);
  journey.confirm('battery', true);
  assert.equal(journey.next(), false);
  journey.confirm('teacher', true);
  assert.equal(journey.next(), true);
  journey.answer('adecuadas');
  journey.confirm('tools', true);
  assert.equal(journey.next(), false);
  journey.confirm('workspace', true);
  assert.equal(journey.next(), true);
});

test('revocar una condición invalida la decisión final y los pasos posteriores', () => {
  const journey = new SafetyJourney();
  reach(journey, 6);
  completeCurrent(journey);
  assert.equal(journey.finished, true);
  journey.go(4);
  journey.confirm('battery', false);
  assert.equal(journey.finished, false);
  assert.equal(journey.answers[5], null);
  assert.equal(journey.answers[6], null);
  assert.equal(journey.go(6), false);
  assert.equal(journey.next(), false);
});

test('observar los siete pasos no acredita preparación ni conserva condiciones al cambiar de modo o caso', () => {
  const journey = new SafetyJourney();
  journey.reset({ mode: 'observe' });
  for (let index = 0; index < 6; index++) {
    assert.equal(journey.answer(safetySteps[index].options[0].id), false);
    assert.equal(journey.next(), true);
  }
  assert.equal(journey.index, 6);
  assert.equal(journey.finished, false);
  assert.ok(safetyChecks.every(({ id }) => !journey.checkSatisfied(id)));
  journey.reset({ mode: 'practice' });
  assert.equal(journey.index, 0);
  assert.equal(journey.go(6), false);
  reach(journey, 6);
  completeCurrent(journey);
  journey.reset({ scenario: 'risk' });
  assert.equal(journey.index, 0);
  assert.equal(journey.finished, false);
  assert.ok(safetyChecks.every(({ id }) => !journey.checkSatisfied(id)));
});
