import { safetySteps, safetyChecks, safetyScenarios } from './safetyContent.js';

export class SafetyJourney {
  constructor() { this.reset(); }
  reset({ mode = this.mode ?? 'practice', scenario = this.scenario ?? 'regular' } = {}) {
    if (!['practice', 'observe'].includes(mode) || !safetyScenarios[scenario]) return false;
    this.mode = mode;
    this.scenario = scenario;
    this.index = 0;
    this.visited = 0;
    this.answers = Array(safetySteps.length).fill(null);
    this.confirmations = {};
    this.stopped = false;
    return true;
  }
  isStepComplete(index) {
    const step = safetySteps[index];
    return Boolean(step && this.mode === 'practice' && this.answers[index]?.outcome === 'pass' && step.confirmations.every((id) => this.confirmations[id]));
  }
  get unlocked() {
    if (this.mode === 'observe') return this.visited;
    const first = safetySteps.findIndex((_, index) => !this.isStepComplete(index));
    return first < 0 ? safetySteps.length - 1 : first;
  }
  checkSatisfied(id) {
    const check = safetyChecks.find((item) => item.id === id);
    return Boolean(check && this.mode === 'practice' && this.answers[check.step]?.outcome === 'pass' && (safetySteps[check.step].checks.includes(id) || this.confirmations[id]));
  }
  get conditionsMet() { return !this.stopped && safetyChecks.every(({ id }) => this.checkSatisfied(id)); }
  get finished() { return !this.stopped && this.conditionsMet && this.isStepComplete(6); }
  invalidateFrom(index) {
    for (let i = index; i < safetySteps.length; i++) {
      this.answers[i] = null;
      for (const id of safetySteps[i].confirmations) delete this.confirmations[id];
    }
    this.stopped = false;
  }
  answer(id) {
    if (this.mode !== 'practice' || this.stopped || this.index > this.unlocked) return false;
    const option = safetySteps[this.index].options.find((item) => item.id === id);
    if (!option) return false;
    this.invalidateFrom(this.index);
    let result = { ...option };
    if (this.index === 1 && id === 'sin-alertas' && safetyScenarios[this.scenario].risk) result = { ...option, outcome: 'retry', feedback: 'El caso sí presenta señales de riesgo. No se ignoran ni se intenta averiguar su causa manipulando el equipo. Elegí detenerte y avisar al docente.' };
    if (this.index === 6 && result.outcome === 'pass' && !this.conditionsMet) result = { ...option, outcome: 'retry', feedback: 'Todavía faltan condiciones previas. La simulación no habilita continuar: revisá los pasos pendientes.' };
    this.answers[this.index] = result;
    this.stopped = result.outcome === 'stop';
    return true;
  }
  confirm(id, checked) {
    const step = safetySteps[this.index];
    if (this.mode !== 'practice' || this.stopped || !step.confirmations.includes(id) || this.answers[this.index]?.outcome !== 'pass') return false;
    this.confirmations[id] = Boolean(checked);
    // Al revocar una condición se invalida cualquier decisión posterior.
    if (!checked) for (let i = this.index + 1; i < safetySteps.length; i++) {
      this.answers[i] = null;
      for (const key of safetySteps[i].confirmations) delete this.confirmations[key];
    }
    return true;
  }
  get canAdvance() { return !this.stopped && this.index < 6 && (this.mode === 'observe' || this.isStepComplete(this.index)); }
  next() {
    if (!this.canAdvance) return false;
    this.index++;
    this.visited = Math.max(this.visited, this.index);
    return true;
  }
  go(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.unlocked || index > 6 || this.stopped) return false;
    this.index = index;
    return true;
  }
}
