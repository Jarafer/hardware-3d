export const connectorZones = [
  {
    id: 'externos',
    title: 'Puertos externos',
    observation: 'En el borde derecho se ven conectores con carcasa metálica. Desde el exterior del equipo, los puertos permiten enchufar periféricos y otros cables.',
    region: { left: 86, top: 17, width: 13, height: 34 },
  },
  {
    id: 'flex',
    title: 'Conector para cinta plana',
    observation: 'Cerca del borde inferior izquierdo se ve un conector bajo y alargado. Una cinta plana puede comunicar el teclado, el touchpad o una placa auxiliar, según el equipo.',
    region: { left: 4, top: 65, width: 22, height: 8 },
  },
  {
    id: 'modulo',
    title: 'Ranura para un módulo',
    observation: 'En la zona inferior se ve un zócalo largo con trabas laterales, del tipo SO-DIMM. La muesca orienta el módulo de RAM. La generación compatible se confirma en la ficha del equipo.',
    region: { left: 24, top: 68, width: 54, height: 12 },
  },
];

export const connectorsQuestions = [
  {
    id: 'observacion',
    prompt: '¿Qué resultado podés registrar como observación?',
    options: [
      ['soldadura', 'El puerto A tiene una soldadura rota.'],
      ['comparacion', 'El mouse funciona en B y no responde en A.'],
      ['cambio', 'La placa madre necesita un reemplazo.'],
    ],
    answer: 'comparacion',
    explanation: 'La respuesta del mouse en cada puerto es un dato del caso. Todavía no hay evidencia directa sobre una soldadura o sobre el estado de toda la placa.',
  },
  {
    id: 'prueba',
    prompt: 'La inspección externa no muestra daños. ¿Qué comparación ayuda a investigar si la falla se repite en A?',
    options: [
      ['repetir', 'Probar varias veces el mismo mouse solo en A.'],
      ['cambiar', 'Cambiar el mouse y la netbook al mismo tiempo.'],
      ['control', 'Probar otro periférico USB compatible y funcional en A y en B, con la misma netbook y sin adaptadores.'],
    ],
    answer: 'control',
    explanation: 'Comparar el mismo periférico en ambos puertos, bajo las mismas condiciones, permite observar si el problema vuelve a aparecer en A.',
  },
  {
    id: 'hipotesis',
    prompt: 'El segundo periférico también funciona en B y falla en A. ¿Qué hipótesis gana fuerza?',
    options: [
      ['puerto', 'El problema parece asociado con A. Todavía hay que distinguir entre el conector, su circuito y la configuración.'],
      ['perifericos', 'Los dos periféricos están dañados.'],
      ['seguro', 'La falla confirma que hay que cambiar el puerto.'],
    ],
    answer: 'puerto',
    explanation: 'La falla sigue al puerto A en ambas pruebas. Eso orienta la búsqueda, pero no identifica por sí solo el origen físico o lógico.',
  },
  {
    id: 'decision',
    prompt: 'En otro equipo ves contactos doblados dentro de un puerto. ¿Qué decisión tomás?',
    options: [
      ['ensayo', 'Probar un dispositivo para ver si el puerto todavía responde.'],
      ['detener', 'Dejar ese puerto fuera de uso, registrar el daño y avisar al docente.'],
      ['ajustar', 'Mover la ficha conectada para buscar una posición en la que funcione.'],
    ],
    answer: 'detener',
    explanation: 'Los contactos deformados pueden provocar un cortocircuito. Cualquier intervención requiere el procedimiento del modelo y supervisión docente.',
  },
];
