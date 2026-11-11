export const flexRoutes = [
  {
    id: 'io',
    title: 'Placa auxiliar',
    description: 'La cinta azul une la placa madre con una placa de entrada y salida (I/O). Según el modelo, puede llevar señales de los puertos, del audio o del botón de encendido.',
    region: { left: 20, top: 28, width: 22, height: 23 },
  },
  {
    id: 'display',
    title: 'Pantalla',
    description: 'El recorrido violeta lleva la señal de imagen al panel de la tapa. eDP y LVDS son interfaces distintas. El cable real y sus conectores dependen del equipo.',
    region: { left: 54, top: 23, width: 28, height: 10 },
  },
  {
    id: 'peripherals',
    title: 'Teclado y otros módulos',
    description: 'El sector naranja agrupa varios enlaces. El teclado lleva las pulsaciones, el touchpad envía movimientos y clics, y el lector SD intercambia datos. La batería se conecta al circuito de alimentación por su propio enlace, cuyo formato depende del modelo.',
    region: { left: 53, top: 35, width: 37, height: 25 },
  },
];

export const flexQuestions = [
  {
    id: 'observacion',
    prompt: '¿Qué podés registrar como observación?',
    options: [['cable', 'El cable de pantalla está cortado.'], ['imagen', 'El proyector muestra imagen estable mientras el panel interno parpadea.'], ['panel', 'El panel necesita un repuesto.']],
    answer: 'imagen',
    explanation: 'La diferencia entre las dos pantallas es un dato del caso. El estado del cable y del panel requiere más evidencia.',
  },
  {
    id: 'hipotesis',
    prompt: '¿Qué hipótesis vale la pena investigar primero?',
    options: [['carga', 'La batería está agotada porque la pantalla parpadea.'], ['puerto', 'El puerto del proyector explica la falla del panel interno.'], ['ruta', 'La falla podría estar en el recorrido hacia el panel interno, incluido el cable, sus conectores o el propio panel.']],
    answer: 'ruta',
    explanation: 'La salida externa estable orienta la investigación hacia la pantalla interna, pero deja abiertas varias causas.',
  },
  {
    id: 'evidencia',
    prompt: '¿Qué dato adicional ayuda a orientar la búsqueda sin abrir el equipo?',
    options: [['registro', 'Registrar si el parpadeo aparece también en la pantalla de inicio, antes de cargar el sistema operativo.'], ['edad', 'Anotar solo la antigüedad de la netbook.'], ['ajuste', 'Presionar la carcasa en la bisagra hasta que deje de parpadear.']],
    answer: 'registro',
    explanation: 'Si el síntoma aparece antes de cargar el sistema, pierde fuerza una causa exclusiva de ese sistema. Todavía hace falta distinguir entre cable, conector y panel.',
  },
  {
    id: 'decision',
    prompt: 'Antes de inspeccionar un conector interno en un equipo real, ¿qué corresponde?',
    options: [['corriente', 'Mover el cable con el equipo encendido para buscar el fallo.'], ['manual', 'Consultar el procedimiento del modelo y verificar con el docente cómo aislar la alimentación.'], ['palanca', 'Abrir el pestillo con la misma técnica que muestra la infografía.']],
    answer: 'manual',
    explanation: 'El aislamiento de la alimentación y el tipo de conector dependen del modelo. Un pestillo frágil puede dañarse si se fuerza.',
  },
];
