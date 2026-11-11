export const realWorkNotice = 'Para intervenir realmente, seguí el procedimiento del fabricante para el modelo exacto y trabajá con supervisión docente. Este capítulo no autoriza abrir equipos ni retirar piezas.';
export const safetyScenarios = Object.freeze({
  regular: { name: 'Caso de práctica: revisión pendiente', risk: false, description: 'Una netbook llega al laboratorio. Hay polvo superficial; no se observan deformaciones, humedad ni cables dañados. La pantalla está oscura y el cargador sigue conectado. Todavía no se verificaron el apagado ni el modelo exacto.' },
  risk: { name: 'Caso alternativo: señales de riesgo', risk: true, description: 'La netbook presenta una deformación visible en la carcasa y olor inusual. El cargador está conectado. No sabemos la causa. Observá sin tocar ni intentar encenderla y comunicá la situación al docente.' },
});

export const maintenanceTypes = Object.freeze([
  { name: 'Inspección externa', text: 'Observar carcasa, cables, puertos y entorno sin abrir ni forzar piezas. Registrar lo visible; ante señales de riesgo, detenerse y consultar.' },
  { name: 'Limpieza preventiva', text: 'Reducir suciedad con los métodos y productos admitidos para ese modelo, tras las comprobaciones previas. No rociar líquidos directamente ni improvisar una limpieza interna.' },
  { name: 'Mantenimiento interno', text: 'Acceder al interior requiere un procedimiento específico, control de las fuentes de energía, herramientas adecuadas y supervisión docente. No se realiza en esta simulación.' },
]);

export const safetyChecks = Object.freeze([
  { id: 'inspection', label: 'Estado exterior registrado', step: 0 },
  { id: 'risks', label: 'Riesgos identificados y evaluados', step: 1 },
  { id: 'shutdown', label: 'Apagado completo verificado', step: 2 },
  { id: 'power', label: 'Alimentación externa desconectada', step: 3 },
  { id: 'manual', label: 'Modelo exacto y procedimiento revisados', step: 4 },
  { id: 'battery', label: 'Tratamiento de batería y energía residual revisado en el manual', step: 4 },
  { id: 'teacher', label: 'Supervisión docente confirmada', step: 4 },
  { id: 'tools', label: 'Herramientas compatibles identificadas', step: 5 },
  { id: 'workspace', label: 'Puesto de trabajo y protección ESD previstos', step: 5 },
]);

const pass = (id, text, feedback) => ({ id, text, outcome: 'pass', feedback });
const retry = (id, text, feedback) => ({ id, text, outcome: 'retry', feedback });
export const safetySteps = Object.freeze([
  {
    id: 'observar', title: 'Observar el estado exterior', short: 'Observar', instruction: 'Elegí qué harías antes de tocar o abrir el equipo.', checks: ['inspection'], confirmations: [],
    observation: 'El ejemplo comienza con una observación visual de la carcasa, los cables, los puertos y el entorno. Se registra lo visible sin manipular piezas.',
    options: [
      retry('abrir', 'Retirar la tapa para mirar primero por dentro.', 'Todavía no se comprobaron las condiciones previas. La inspección externa permite reunir información sin abrir el equipo.'),
      pass('registrar', 'Observar y registrar el estado exterior sin abrir ni forzar piezas.', 'La observación es el primer paso. Registrar lo visible ayuda a decidir qué comprobaciones siguen.'),
      retry('encender', 'Conectar otro cargador y encenderla para ver qué ocurre.', 'Encender no reemplaza la inspección. Primero hay que reconocer el estado exterior y los posibles riesgos.'),
    ],
  },
  {
    id: 'riesgos', title: 'Identificar posibles riesgos', short: 'Riesgos', instruction: 'Contrastá la decisión con las señales del caso, sin atribuirles una causa.', checks: ['risks'], confirmations: [],
    observation: 'Se buscan señales como humedad, deformación, olor inusual o cables dañados. Si aparecen, la decisión es detenerse y avisar al docente; no intentar continuar ni comprobar la causa manipulando el equipo.',
    options: [
      pass('sin-alertas', 'Registrar que no hay señales de alarma en este caso y seguir verificando.', 'En este caso no hay señales externas de alarma. Eso permite seguir comprobando condiciones; todavía no habilita intervenir.'),
      { id: 'detener', text: 'Detenerse, no manipular el equipo y avisar al docente.', outcome: 'stop', feedback: 'Detenerse y consultar es una decisión segura. No intentes encender, abrir ni investigar la causa manipulando el equipo. El docente debe indicar cómo proceder.' },
      retry('ignorar', 'Ignorar las señales si la netbook todavía parece funcionar.', 'Que un equipo funcione no demuestra que sea seguro. Las señales de riesgo requieren detener la práctica y consultar al docente.'),
    ],
  },
  {
    id: 'apagado', title: 'Verificar el apagado del equipo', short: 'Apagado', instruction: 'Distinguí una pantalla oscura de un apagado confirmado.', checks: ['shutdown'], confirmations: [],
    observation: 'Una pantalla oscura puede corresponder a suspensión. El ejemplo verifica el apagado completo según el procedimiento del equipo antes de seguir.',
    options: [
      retry('pantalla', 'Dar por hecho que está apagada porque la pantalla está oscura.', 'La pantalla oscura no distingue suspensión de apagado. Hace falta verificar el estado del equipo.'),
      retry('suspender', 'Cerrar la pantalla y dejarla en suspensión.', 'La suspensión no equivale a apagado completo. No cumple esta condición previa.'),
      pass('verificar', 'Verificar el apagado completo según el procedimiento del equipo.', 'Se verificó el apagado en el caso simulado. Falta comprobar la desconexión y revisar otras fuentes de energía.'),
    ],
  },
  {
    id: 'alimentacion', title: 'Comprobar la desconexión de la alimentación', short: 'Alimentación', instruction: 'No confundas apagado con ausencia de alimentación.', checks: ['power'], confirmations: [],
    observation: 'El ejemplo comprueba que el cargador y las conexiones externas que puedan aportar energía estén desconectados. La batería se trata según el procedimiento específico del fabricante, no con una instrucción universal.',
    options: [
      pass('desconectar', 'Comprobar cargador y otras conexiones externas de alimentación desconectadas.', 'La alimentación externa quedó comprobada en la simulación. Eso no garantiza ausencia de energía: la batería y la energía residual se revisan en el manual.'),
      retry('cargador', 'Dejar el cargador conectado para que no se agote la batería.', 'Apagar no elimina la alimentación del cargador. Esta condición debe comprobarse antes de planificar una intervención.'),
      retry('bateria', 'Suponer que desconectar el cargador también desconecta la batería.', 'Son fuentes distintas. No supongas que la batería está aislada: su manejo depende del modelo y del procedimiento del fabricante.'),
    ],
  },
  {
    id: 'fabricante', title: 'Revisar el procedimiento del fabricante', short: 'Procedimiento', instruction: 'Revisá el modelo exacto, las fuentes de energía y la supervisión.', checks: [], confirmations: ['manual', 'battery', 'teacher'],
    observation: 'El ejemplo identifica el modelo exacto y revisa su documentación. El manejo de la batería, posibles modos de servicio y otras medidas dependen del equipo. El docente supervisa la práctica real.',
    options: [
      retry('video', 'Usar un video de una netbook parecida como si fuera el mismo modelo.', 'El aspecto exterior no garantiza la misma construcción. Hace falta el procedimiento adecuado para el modelo exacto.'),
      pass('manual', 'Identificar el modelo, revisar su procedimiento y confirmar supervisión docente.', 'Ahora confirmá en esta simulación las tres condiciones de la lista. Si alguna no puede comprobarse en una práctica real, no se continúa.'),
      retry('extraer', 'Retirar primero la batería con un método genérico.', 'No hay un método universal: puede haber batería interna u otras medidas específicas. Primero se consulta el procedimiento del modelo y al docente.'),
    ],
  },
  {
    id: 'herramientas', title: 'Identificar herramientas apropiadas', short: 'Herramientas', instruction: 'Elegí herramientas compatibles y un puesto de trabajo preparado.', checks: [], confirmations: ['tools', 'workspace'],
    observation: 'El ejemplo prepara herramientas del tipo y tamaño indicados por el fabricante, un puesto seco, ordenado e iluminado y medidas de protección contra descargas electrostáticas (ESD) acordes al procedimiento.',
    options: [
      retry('cuchillo', 'Usar un cuchillo o cualquier destornillador que entre.', 'Una herramienta inadecuada puede dañar sujeciones o provocar una lesión. El tipo y tamaño deben corresponder al procedimiento.'),
      retry('rociar', 'Rociar limpiador dentro de las rejillas antes de empezar.', 'No se rocía líquido directamente sobre el equipo. Una limpieza preventiva sigue los métodos admitidos para el modelo; no equivale a intervenir el interior.'),
      pass('adecuadas', 'Identificar las herramientas indicadas y preparar el puesto y la protección ESD.', 'Confirmá las dos condiciones de esta simulación. Preparar herramientas no autoriza por sí solo a retirar piezas.'),
    ],
  },
  {
    id: 'decidir', title: 'Determinar si es seguro continuar', short: 'Decisión', instruction: 'Revisá todas las condiciones antes de decidir el siguiente alcance.', checks: [], confirmations: [],
    observation: 'Una conclusión segura distingue preparación de autorización. Si falta una condición o hay una duda, se detiene y consulta. Con todo comprobado, el siguiente trabajo real sigue el procedimiento del modelo y la supervisión docente.',
    options: [
      retry('retirar', 'Retirar piezas ahora porque ya completé una lista.', 'Completar la simulación no autoriza una intervención real. La tarea concreta, las condiciones del equipo y la supervisión deben confirmarse fuera de este capítulo.'),
      pass('supervisada', 'Continuar solo con la tarea prevista por el procedimiento del modelo y con el docente.', 'Preparación comprobada en la simulación. En un equipo real hay que confirmar nuevamente las condiciones y la tarea con el docente. Este capítulo termina aquí: no indica retirar piezas.'),
      retry('limpieza', 'Abrir para limpiar por dentro porque limpiar siempre es una tarea externa.', 'Inspección, limpieza preventiva e intervención interna tienen alcances diferentes. Abrir o acceder al interior exige su procedimiento y condiciones específicas.'),
    ],
  },
]);

export const safetySources = Object.freeze([
  { title: 'Dell: precauciones de seguridad y protección ESD', url: 'https://www.dell.com/support/kbdoc/en-in/000137973/safety-precautions-when-working-with-electrical-equipment' },
  { title: 'HP: pautas de limpieza del equipo', url: 'https://support.hp.com/in-en/document/ish_4507286-4416682-16' },
]);
