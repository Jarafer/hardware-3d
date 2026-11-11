export const microVideo = {
  title: 'Explicación simple de un procesador (Núcleo, Hilos y Frecuencia)',
  id: 'bJrfPQJ_Ks4',
  reading: [
    ['Núcleos', 'Son unidades de procesamiento dentro de la CPU. Varios núcleos pueden ejecutar trabajo al mismo tiempo si el programa reparte las tareas.'],
    ['Hilos de hardware', 'Indican cuántos flujos de ejecución puede atender simultáneamente la CPU. Si un núcleo admite más de un hilo de hardware, esos hilos comparten recursos de ese núcleo.'],
    ['Frecuencia', 'Se expresa en GHz e indica miles de millones de ciclos de reloj por segundo. Para comparar rendimiento también importan la arquitectura, el programa y las condiciones de funcionamiento.'],
  ],
};

export const microInfographics = [
  {
    title: 'Arquitectura y mantenimiento del microprocesador',
    path: 'recursos/micro/arquitectura-microprocesador.png',
    alt: 'Infografía en seis bloques sobre la función de la CPU, sus partes internas, la disipación, la protección electrostática y el flujo de aire.',
    notes: [
      'El silicio es el material del dado donde están los circuitos. El encapsulado es el conjunto que lo protege y lo conecta con la placa.',
      'El dibujo muestra un equipo con ventilador. Hay diseños con refrigeración pasiva y otros que usan almohadillas térmicas. El esquema sirve para reconocer funciones.',
    ],
    reading: [
      ['Qué hace la CPU', 'Interpreta y ejecuta instrucciones. Entre otras operaciones, calcula, compara datos y accede a memoria.'],
      ['Cómo se organiza', 'La unidad de control coordina la ejecución, la ALU realiza operaciones aritméticas y lógicas, y los registros y la caché acercan datos al núcleo. Las interconexiones transportan datos y señales.'],
      ['Cuidados preventivos', 'Dejá libres las rejillas del equipo. Para intervenir en el interior, verificá la alimentación, seguí el procedimiento del fabricante y usá la protección electrostática (ESD) indicada con supervisión docente.'],
    ],
  },
  {
    title: 'Aplicación de pasta térmica y montaje del disipador',
    path: 'recursos/micro/aplicacion-pasta-termica.png',
    alt: 'Guía ilustrada con una fase de preparación y otra que muestra la retirada del disipador, el material térmico y el montaje.',
    notes: [
      'La ilustración dice «transferencia de color». La palabra correcta es calor: el material térmico mejora el contacto entre el procesador y el disipador.',
      'La batería, el tipo de material térmico y las secuencias de extracción y montaje dependen del equipo. Antes de intervenir, consultá el manual del modelo y al docente. Usá la protección ESD que indique el procedimiento.',
    ],
    reading: [
      ['Preparación', 'La guía destaca dos cuidados antes de manipular componentes: aislar la alimentación del equipo y protegerlo de descargas electrostáticas.'],
      ['Contacto térmico', 'La pasta o almohadilla adecuada reduce los espacios de aire en la zona de contacto. El disipador recibe y evacua calor.'],
      ['Montaje', 'El esquema ilustra tornillos numerados para distribuir la presión. Consultá por separado las indicaciones de retirada y de ajuste del fabricante.'],
    ],
  },
];

export const microPdf = {
  title: 'El cerebro de silicio',
  path: 'recursos/micro/arquitectura-gestion-termica.pdf',
  notes: [
    'Las configuraciones de las páginas 5–8 son ejemplos. Identificá el equipo exacto antes de atribuirle componentes. La ficha del Intel Celeron N5100 especifica cuatro núcleos.',
    'Las temperaturas de las páginas 9, 14 y 15 corresponden a ejemplos del material. Consultá el límite del procesador y compará temperatura y frecuencia con carga similar. La lentitud o un reinicio por sí solos tienen varias causas posibles.',
    'Leé las páginas de intervención como material de observación. Para desmontar o montar, seguí el manual del modelo y trabajá con supervisión docente.',
  ],
  reading: [
    ['Páginas 1–4 · Función y arquitectura', 'Presentan la CPU, sus unidades internas y su relación con la RAM y la placa.'],
    ['Páginas 5–8 · Ejemplos de netbooks', 'Comparan generaciones educativas y procesadores Atom y Celeron. Verificá los datos en la ficha del procesador y del equipo.'],
    ['Páginas 9–11 · Temperatura y refrigeración', 'Relacionan la frecuencia con el límite térmico e ilustran el recorrido del calor desde el chip hacia el disipador.'],
    ['Páginas 12–15 · Cuidados', 'Reúnen precauciones antes de intervenir, ejemplos de desmontaje y criterios para observar el estado del sistema de refrigeración.'],
  ],
};

export const microResourceSources = [
  ['Intel · Temperatura y protección térmica', 'https://www.intel.com/content/www/us/en/support/articles/000005597/processors.html'],
  ['Intel · Especificaciones del Celeron N5100', 'https://www.intel.com/content/www/us/en/products/sku/212329/intel-celeron-processor-n5100-4m-cache-up-to-2-80-ghz/specifications.html'],
  ['Dell · Ejemplo de instrucciones de retirada del disipador', 'https://www.dell.com/support/manuals/en-in/latitude-14-7455-laptop/latitude-7455-owners-manual/heat-sink?guid=guid-029d335c-48e8-48f4-b14f-a85e5c617da0&lang=en-us'],
  ['Dell · Ejemplo de materiales térmicos para un equipo', 'https://www.dell.com/support/manuals/en-uk/g-series-15-5510-laptop/dell-g15-5510-service-manual/installing-the-heat-sink?guid=guid-8ddcd1e1-1912-468e-8d8a-05090b8c3710&lang=en-us'],
];
