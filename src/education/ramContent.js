// Adaptación del material aportado: se conserva el reconocimiento visual y se revisan cifras antiguas.
export const ramParts = Object.freeze([
  { id: 'pcb', name: 'Placa del módulo', text: 'El circuito impreso sostiene y conecta los componentes. No es la placa madre del equipo.' },
  { id: 'chips', name: 'Chips de memoria', text: 'Estos circuitos almacenan temporalmente datos e instrucciones en uso. La RAM de trabajo pierde su contenido sin alimentación.' },
  { id: 'contactos', name: 'Contactos', text: 'Conectan el módulo con el zócalo. El dibujo simplifica su cantidad: no permite contar pines ni identificar una generación.' },
  { id: 'muesca', name: 'Muesca de posición', text: 'Ayuda a orientar el módulo y distingue formatos o generaciones. Que una pieza parezca encajar no acredita compatibilidad; nunca se fuerza.' },
  { id: 'etiqueta', name: 'Etiqueta de identificación', text: 'Puede informar fabricante, número de parte, capacidad y otras especificaciones. Su contenido varía: contrastalo con la ficha técnica y el manual del equipo.' },
  { id: 'retencion', name: 'Muescas laterales de retención', text: 'Son rebajes en los bordes donde actúan las sujeciones del zócalo. No son la muesca de posición del borde de contactos. Su forma y el mecanismo dependen del módulo y del equipo; no se practica su liberación aquí.' },
]);
export const ramLesson = Object.freeze({
  title: 'Memoria RAM', subtitle: 'Un espacio de trabajo temporal',
  introduction: 'Al abrir una aplicación, parte de sus datos e instrucciones se carga desde el almacenamiento hacia la RAM. El procesador trabaja con esa información; los archivos guardados permanecen en el almacenamiento al apagar.',
  format: 'En este capítulo observás un SO-DIMM, un formato compacto usado en muchas notebooks y netbooks. El DIMM largo de escritorio no es el módulo que representa este modelo. Hay portátiles con memoria soldada o combinaciones de memoria soldada y ranura: no todos admiten ampliación.',
  compatibility: 'DDR, DDR2, DDR3, DDR4 y DDR5 son generaciones diferentes. No son intercambiables. Para una ampliación se revisan el modelo exacto, formato, generación, capacidad admitida, tensión y especificaciones del fabricante.',
  specifications: [ ['Formato', 'SO-DIMM'], ['Generación', 'DDR4'], ['Capacidad', '8 GB'], ['Tasa de transferencia', '2666 MT/s'], ['Tensión nominal', '1,2 V'] ],
  labelNotice: 'Etiqueta ficticia de un ejemplo didáctico. No es una recomendación de compra ni describe tu equipo. MT/s expresa transferencias por segundo; no es lo mismo que MHz de reloj.',
  evidence: [ ['Al abrir varias aplicaciones', 'La memoria en uso sube de 2,1 a 3,7 GB sobre 4 GB. El almacenamiento también aumenta su actividad.'], ['Al cerrar algunas aplicaciones', 'La memoria en uso baja a 2,6 GB y la respuesta mejora.'] ],
  questions: ['¿Qué relación encontrás entre las aplicaciones abiertas, la RAM ocupada y la actividad del almacenamiento?', '¿Estos datos prueban un módulo defectuoso? ¿Qué otra explicación y qué comprobación considerarías?'],
  caution: 'Lentitud, bloqueos o errores pueden tener varias causas. Un consumo alto no demuestra una RAM defectuosa. Toda práctica real requiere apagado, control de alimentación y batería según el manual, protección ESD y supervisión docente. No se practica extracción en este capítulo.',
  portableNotes: [
    'SO-DIMM es el formato; DDR3, DDR4 y DDR5 identifican generaciones distintas. En equipos antiguos pueden encontrarse generaciones anteriores. El nombre notebook o netbook no indica qué memoria admite.',
    'Como referencias de SO-DIMM, DDR4 utiliza 260 contactos y DDR5, 262. No son intercambiables. El modelo 3D simplifica los contactos: no los cuentes para identificar una memoria real.',
    'LPDDR no es un SO-DIMM. Hay equipos con LPDDR soldada y también formatos modulares diferentes, como LPCAMM2. Consultá la documentación del modelo exacto antes de suponer que se puede ampliar.',
    'Este SO-DIMM se representa sin un disipador voluminoso de escritorio. La presencia de disipadores o cubiertas térmicas depende del diseño; no son una pieza obligatoria de toda memoria portátil.',
  ],
  sources: [
    { title: 'Kingston: memoria y almacenamiento', url: 'https://www.kingston.com/en/blog/pc-performance/difference-between-memory-storage' },
    { title: 'Kingston: ejemplo de SO-DIMM DDR4 de 260 contactos', url: 'https://www.kingston.com/dataSheets/KF426S15IB1_16.pdf' },
    { title: 'Kingston: especificaciones y compatibilidad de memoria', url: 'https://www.kingston.com/en/memory?memorytype=desktop+and+laptop+memory' },
    { title: 'Lenovo: ejemplo de portátil con variantes de memoria soldada y SO-DIMM', url: 'https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_P16s_Gen_2_Intel/ThinkPad_P16s_Gen_2_Intel_Spec.html' },
    { title: 'Lenovo: ejemplo de portátil con LPDDR5X en módulo CAMM2', url: 'https://download.lenovo.com/manual/p1_g7/user_guide/en/discover_quick_start.html' },
  ],
});

export const bookIndex = Object.freeze([
  { id: 'overview', title: 'La netbook', note: 'Exterior y mapa de componentes', available: true },
  { id: 'ram', title: 'Memoria RAM', note: 'Modelo 3D · Lectura · Indagación', available: true },
  { id: 'micro', title: 'Microprocesador', note: 'Foto de la placa · CPU y temperatura', available: true },
  { id: 'motherboard', title: 'Motherboard', note: 'Placa 3D · Dos caras y sus funciones', available: true },
  { id: 'storage', title: 'Disco rígido y almacenamiento', note: 'HDD · SSD M.2 · eMMC', available: true },
  { id: 'connectors', title: 'Conectores', note: 'Puertos, conexiones internas y pruebas comparativas', available: true },
  { id: 'flex', title: 'Cables flex', note: 'Recorridos internos, conectores y señales de falla', available: true },
  { id: 'keyboard', title: 'Teclado', note: 'Matriz de teclas, cuidado y diagnóstico', available: true },
  { id: 'safety', title: 'Antes de abrir una netbook', note: 'Seguridad y mantenimiento', available: true },
  { id: 'diagnostic', title: 'Detectives del Hardware', note: 'Hipótesis y evidencias simuladas', available: true },
  { id: 'bibliography', title: 'Bibliografía', note: 'Referencias y materiales consultados', available: true },
]);

// Se guarda un borrador en memoria; la longitud nunca se presenta como corrección conceptual.
export function ramReflectionFeedback(observation, explanation) {
  if (observation.trim().length < 20 || explanation.trim().length < 20) return { complete: false, text: 'Desarrollá ambas respuestas con al menos 20 caracteres: registrá lo observado y una explicación que puedas contrastar.' };
  return { complete: true, text: 'Reflexión registrada en esta sesión. Compará con el docente si distinguís una observación de una causa confirmada y si tu próxima comprobación permite distinguir alternativas. No se evaluó automáticamente la exactitud de tus respuestas.' };
}
