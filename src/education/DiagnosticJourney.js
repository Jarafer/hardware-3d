import { diagnosticCase, hypotheses, diagnosticTests, relationTypes, diagnosticActions } from './diagnosticContent.js';

export const DIAGNOSTIC_STORAGE_KEY = 'hardware3d.detectives.v1';
const ids = (items) => items.map((item) => item.id);
const text = (value) => typeof value === 'string' ? value.slice(0, 1800) : '';
const list = (value, allowed) => Array.isArray(value) ? [...new Set(value.filter((id) => allowed.includes(id)))] : [];
function initialState() {
  return { index: 0, read: false, hypothesis: '', why: '', selected: [], observed: [], informationPlan: '', relations: {}, finalHypotheses: [], reasoning: '', uncertainty: '', action: '', plan: '', supervised: false, submittedAt: '' };
}

export class DiagnosticJourney {
  constructor(storage = null) {
    this.storage = storage;
    this.persistent = Boolean(storage);
    this.state = initialState();
    this.result = null;
    try {
      const stored = JSON.parse(storage?.getItem(DIAGNOSTIC_STORAGE_KEY) ?? 'null');
      if (stored?.version === 1 && stored.caseId === diagnosticCase.id) this.restore(stored.state);
    } catch { this.persistent = false; }
  }
  restore(raw) {
    if (!raw || typeof raw !== 'object') return;
    const state = initialState();
    for (const field of ['why', 'informationPlan', 'reasoning', 'uncertainty', 'plan']) state[field] = text(raw[field]);
    state.read = raw.read === true;
    state.supervised = raw.supervised === true;
    state.hypothesis = ids(hypotheses).includes(raw.hypothesis) ? raw.hypothesis : '';
    state.action = ids(diagnosticActions).includes(raw.action) ? raw.action : '';
    state.selected = list(raw.selected, ids(diagnosticTests));
    state.observed = list(raw.observed, state.selected);
    state.finalHypotheses = list(raw.finalHypotheses, ids(hypotheses));
    for (const id of state.observed) {
      const relation = raw.relations?.[id];
      state.relations[id] = { type: ids(relationTypes).includes(relation?.type) ? relation.type : '', hypotheses: list(relation?.hypotheses, ids(hypotheses)), note: text(relation?.note) };
    }
    this.state = state;
    state.index = Math.min(Number.isInteger(raw.index) ? Math.max(raw.index, 0) : 0, this.unlocked, 5);
    if (typeof raw.submittedAt === 'string' && raw.submittedAt.length < 40 && Number.isFinite(Date.parse(raw.submittedAt)) && this.allValid()) {
      state.submittedAt = raw.submittedAt;
      this.result = this.buildResult();
      if (raw.index === 6) state.index = 6;
    }
  }
  save() {
    try {
      if (!this.storage) { this.persistent = false; return; }
      this.storage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify({ version: 1, caseId: diagnosticCase.id, state: this.state, result: this.result }));
      this.persistent = true;
    } catch { this.persistent = false; }
  }
  changed() { this.result = null; this.state.submittedAt = ''; this.save(); }
  update(field, value) {
    if (['why', 'informationPlan', 'reasoning', 'uncertainty', 'plan'].includes(field)) this.state[field] = text(value);
    else if (['read', 'supervised'].includes(field)) this.state[field] = value === true;
    else if (field === 'hypothesis' && ids(hypotheses).includes(value)) this.state.hypothesis = value;
    else if (field === 'action' && ids(diagnosticActions).includes(value)) this.state.action = value;
    else if (field === 'finalHypotheses') this.state.finalHypotheses = list(value, ids(hypotheses));
    else return false;
    this.changed(); return true;
  }
  chooseTests(value) {
    this.state.selected = list(value, ids(diagnosticTests));
    this.state.observed = this.state.observed.filter((id) => this.state.selected.includes(id));
    for (const id of Object.keys(this.state.relations)) if (!this.state.observed.includes(id)) delete this.state.relations[id];
    this.changed();
  }
  reveal(id) {
    if (this.state.index !== 3 || !this.state.selected.includes(id)) return false;
    if (!this.state.observed.includes(id)) { this.state.observed.push(id); this.changed(); }
    return true;
  }
  relate(id, field, value) {
    if (this.state.index !== 4 || !this.state.observed.includes(id)) return false;
    const relation = this.state.relations[id] ?? { type: '', hypotheses: [], note: '' };
    if (field === 'type' && (value === '' || ids(relationTypes).includes(value))) relation.type = value;
    else if (field === 'hypotheses') relation.hypotheses = list(value, ids(hypotheses));
    else if (field === 'note') relation.note = text(value);
    else return false;
    this.state.relations[id] = relation;
    this.changed(); return true;
  }
  get actionProblem() {
    const action = diagnosticActions.find((item) => item.id === this.state.action);
    if (!action) return 'Elegí una acción para analizarla.';
    if (!action.safe) return action.feedback;
    if (!action.requires.every((id) => this.state.observed.includes(id))) return 'Todavía no observaste la información específica que fundamentaría esta acción. Volvé a planificar y revisar esa comprobación, o proponé obtener más evidencias.';
    return '';
  }
  valid(index) {
    const s = this.state;
    if (index === 0) return s.read;
    if (index === 1) return Boolean(s.hypothesis && s.why.trim().length >= 20);
    if (index === 2) return s.selected.length >= 2 && s.informationPlan.trim().length >= 20;
    if (index === 3) return s.selected.length >= 2 && s.selected.every((id) => s.observed.includes(id));
    if (index === 4) return s.observed.length >= 2 && s.observed.every((id) => {
      const relation = s.relations[id];
      return relation?.type && relation.hypotheses.length > 0 && relation.note.trim().length >= 20;
    }) && s.finalHypotheses.length > 0 && s.reasoning.trim().length >= 40 && s.uncertainty.trim().length >= 20;
    if (index === 5) return !this.actionProblem && s.plan.trim().length >= 30 && s.supervised;
    return Boolean(this.result);
  }
  get unlocked() { const first = [0, 1, 2, 3, 4, 5].find((index) => !this.valid(index)); return first ?? 6; }
  allValid() { return [0, 1, 2, 3, 4, 5].every((index) => this.valid(index)); }
  get canNext() { return this.state.index < 6 && Array.from({ length: this.state.index + 1 }, (_, index) => index).every((index) => this.valid(index)); }
  next() {
    if (!this.canNext) return false;
    if (this.state.index === 5) { this.state.submittedAt = new Date().toISOString(); this.result = this.buildResult(); }
    this.state.index++; this.save(); return true;
  }
  go(index) {
    if (!Number.isInteger(index) || index < 0 || index > this.unlocked || index > (this.result ? 6 : 5)) return false;
    this.state.index = index; this.save(); return true;
  }
  reset() { this.state = initialState(); this.result = null; this.save(); }
  buildResult() {
    const s = this.state;
    const alternativeThinking = s.finalHypotheses.length > 1 || s.observed.some((id) => s.relations[id]?.hypotheses.length > 1 || s.relations[id]?.type === 'ambiguo');
    return {
      caseId: diagnosticCase.id, simulated: true, completedAt: s.submittedAt,
      initialHypothesis: hypotheses.find((item) => item.id === s.hypothesis)?.name, initialReason: s.why,
      informationPlan: s.informationPlan,
      evidence: s.observed.map((id) => ({ ...diagnosticTests.find((item) => item.id === id), interpretation: { ...s.relations[id], hypothesisNames: s.relations[id].hypotheses.map((key) => hypotheses.find((item) => item.id === key).name) } })),
      finalHypotheses: s.finalHypotheses.map((id) => hypotheses.find((item) => item.id === id).name), reasoning: s.reasoning, uncertainty: s.uncertainty,
      action: diagnosticActions.find((item) => item.id === s.action)?.name, verificationPlan: s.plan,
      feedback: [
        { title: 'Evidencias contrastadas', status: 'Documentado', text: `Observaste ${s.observed.length} comprobaciones y dejaste una interpretación para cada una. Revisá con el docente si las relaciones escritas están justificadas.` },
        { title: 'Alternativas y ambigüedad', status: alternativeThinking ? 'Documentado' : 'Para profundizar', text: alternativeThinking ? 'Registraste alternativas o una señal ambigua. Explicá qué dato permitiría distinguirlas mejor.' : 'Una conclusión principal puede ser razonable, pero conviene explicitar qué otras causas siguen abiertas y por qué.' },
        { title: 'Decisión prudente', status: 'Documentado', text: 'Propusiste una acción no destructiva respaldada por las comprobaciones requeridas. El caso no demuestra por sí solo una pieza defectuosa.' },
        { title: 'Límites y verificación', status: 'Documentado', text: 'Escribiste incertidumbres y un plan para revisar la propuesta. No se validó automáticamente el significado ni la exactitud de esos textos.' },
      ],
      reviewNotice: 'La devolución revisa la estructura y las referencias a evidencias; no califica por adivinar una causa ni certifica un diagnóstico. La coherencia de la fundamentación se conversa con el docente.',
    };
  }
}
