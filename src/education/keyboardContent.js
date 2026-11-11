export const keyboardGuide = [
  {
    title: 'Preparación',
    description: 'Prepará una superficie plana y limpia. Para limpiar por fuera, apagá el equipo y desconectá el cargador. Cualquier intervención interna requiere el procedimiento del modelo y supervisión docente.',
    region: { left: 5, top: 31, width: 21, height: 30 },
  },
  {
    title: 'Cable y conector',
    description: 'El cable plano comunica el teclado integrado con la placa. La lupa muestra un tipo de seguro. Su forma y la manera de liberarlo dependen del conector.',
    region: { left: 54, top: 47, width: 42, height: 21 },
  },
  {
    title: 'Teclado y reposamanos',
    description: 'El teclado puede ser un módulo separado o formar parte del reposamanos. La ficha del equipo indica cómo está fijado. Evitá levantar teclas o hacer palanca durante la limpieza externa.',
    region: { left: 56, top: 72, width: 42, height: 23 },
  },
];

export const keyboardQuestions = [
  {
    id: 'observacion',
    prompt: '¿Cuál es una observación del caso?',
    options: [['flex', 'El flex está cortado.'], ['teclas', 'E, D y C fallan en el teclado integrado, pero responden en el USB.'], ['membrana', 'La membrana tiene una pista dañada.']],
    answer: 'teclas',
    explanation: 'La respuesta de cada teclado es un dato observado. Todavía no se examinó el flex ni la membrana.',
  },
  {
    id: 'hipotesis',
    prompt: '¿Qué hipótesis justifica esa comparación?',
    options: [['interno', 'El problema puede estar en el teclado integrado o en su conexión.'], ['idioma', 'El idioma explica que siempre falten esas tres pulsaciones.'], ['confirmado', 'La ubicación de las teclas confirma qué pista se rompió.']],
    answer: 'interno',
    explanation: 'Que el teclado externo funcione orienta hacia el integrado y su conexión. Las filas de teclas visibles pueden diferir de las líneas eléctricas de la matriz.',
  },
  {
    id: 'prueba',
    prompt: '¿Cómo comprobarías si el patrón se repite sin abrir el equipo?',
    options: [['azar', 'Escribir un párrafo distinto con cada teclado.'], ['presion', 'Presionar con más fuerza las teclas que fallan.'], ['registro', 'Probar las mismas teclas, una por una, en la misma aplicación y registrar cuáles responden.']],
    answer: 'registro',
    explanation: 'Mantener la misma aplicación y la misma secuencia facilita comparar los resultados y ver si el patrón es repetible.',
  },
  {
    id: 'cuidado',
    prompt: 'En otra netbook hay indicios de un derrame reciente. ¿Qué hacés?',
    options: [['detener', 'Suspendés las pruebas y avisás al docente antes de intentar encenderla.'], ['arranque', 'Encendés el equipo para ver qué teclas dejaron de funcionar.'], ['teclas', 'Levantás las teclas para secar por debajo.']],
    answer: 'detener',
    explanation: 'Un derrame requiere evaluación del equipo y el procedimiento del fabricante con supervisión. Probar el encendido o levantar teclas puede agravar el daño.',
  },
];
