export const ramResources = Object.freeze({
  videoId: 'RCooHWPP_P0',
  videoTitle: '¿Qué es la Memoria RAM y Para Qué Sirve? | Explicación Fácil',
  videoAuthor: 'Locura Informática Digital',
  videoDuration: '4 min 50 s',
  videoUrl: 'https://www.youtube.com/watch?v=RCooHWPP_P0',
  infographic: { path: 'recursos/ram/guia-visual-ram.png', bytes: 5981293, sha256: 'b0259a444b115f0fd9c4c4e02a6085fe3c7d1d584acde0e62c639070a105255f' },
  pdf: { path: 'recursos/ram/diagnostico-reparacion-ram.pdf', pages: 13, bytes: 14518641, sha256: 'd6f80fc4601e19207153b95a21687a6544233aa5e76ff57ed3a26aeadeef0d0f' },
  synthesis: [
    ['Un espacio de trabajo', 'La RAM mantiene temporalmente datos e instrucciones en uso. El almacenamiento conserva los archivos guardados sin alimentación. Al iniciar una aplicación, ambos participan en tareas diferentes.'],
    ['Capacidad y carga', 'La capacidad se expresa en GB. Si las aplicaciones requieren más memoria disponible, el sistema puede recurrir más al almacenamiento. Eso puede afectar la respuesta; no prueba por sí solo que un módulo esté dañado.'],
    ['Memoria para portátiles', 'SO-DIMM es un formato compacto; DDR3, DDR4 y DDR5 son generaciones diferentes. También hay memoria soldada y otros formatos. La compatibilidad se confirma con el modelo exacto, no con el aspecto exterior.'],
    ['Leer una especificación', 'Distinguí capacidad en GB, tasa de transferencia en MT/s y latencias. Un número aislado no resume el rendimiento. Consultá la etiqueta, la ficha del módulo y la documentación del equipo.'],
    ['Investigar con evidencias', 'Registrá el síntoma, las condiciones y los resultados. Considerá otras causas antes de proponer una intervención. El capítulo no autoriza abrir, limpiar ni reemplazar piezas reales.'],
  ],
  infographicNotes: [
    'Corrección de la tabla: un DIMM DDR3 convencional tiene 240 contactos, no 246. SO-DIMM DDR3 tiene 204. El dibujo no permite identificar por sí solo la compatibilidad de un equipo.',
    'Un CL menor no garantiza más rendimiento entre memorias con tasas distintas. El ancho de banda teórico depende de la tasa y del bus; no es una constante de 6 GB/s. La expresión mostrada con MT/s y bits produce MB/s antes de convertir a GB/s.',
    'Los pitidos y las luces se interpretan con el manual del modelo. Un error en MemTest86 no identifica automáticamente un módulo defectuoso. No se adopta la goma de borrar ni la extracción como un procedimiento universal de limpieza.',
  ],
  infographicReading: [
    ['Función y volatilidad', 'La imagen representa la RAM como un espacio de trabajo compartido con el procesador. Conserva datos de programas activos mientras recibe alimentación; no reemplaza al almacenamiento de archivos. El acceso no es instantáneo.'],
    ['DRAM y refresco', 'Las celdas de DRAM almacenan carga y requieren refresco periódico para conservar la información mientras funcionan. La ilustración de transistor y condensador es esquemática.'],
    ['Formatos', 'DIMM se encuentra en muchos equipos de escritorio y SO-DIMM es más compacto, habitual en portátiles. El formato y la generación son datos diferentes. También hay equipos con memoria soldada.'],
    ['Generaciones DDR', 'El gráfico recorre DDR, DDR2, DDR3, DDR4 y DDR5. Cambian características eléctricas y mecánicas; no se elige un reemplazo por semejanza visual ni por asumir que una generación más nueva es compatible.'],
    ['Transferencias y latencia', 'MT/s expresa millones de transferencias por segundo. El ancho de banda teórico depende de esa tasa y del ancho del bus. CL cuenta ciclos: compararlo entre tasas distintas no basta para concluir qué memoria responderá antes.'],
    ['Diagnóstico', 'La ilustración enumera falta de imagen, reinicios, errores y corrupción de archivos, junto con pruebas y propuestas de limpieza. Son pistas con causas posibles múltiples; no una confirmación automática ni una autorización de intervención. Leé las correcciones antes de usar el material.'],
  ],
  pdfNotes: [
    'El PDF se conserva como material original aportado, para lectura acompañada. Sus páginas 5–6 agrupan equipos por generaciones: esas agrupaciones no sustituyen identificar el modelo exacto ni confirman la posibilidad de ampliarlo.',
    'Las páginas 8–10 y 13 presentan códigos y pasos de intervención generales. Antes de cualquier trabajo real se consulta al docente y el procedimiento del fabricante; este libro no indica retirar baterías o módulos ni frotar contactos con goma.',
    'La página 12 simplifica los resultados como RAM sana o rota. Una prueba sin errores no descarta todas las fallas, y una con errores requiere analizar otras causas. No se decide un reemplazo solo por una pantalla o un resultado aislado.',
  ],
  pdfReadingMap: [
    ['Páginas 1–4', 'Presentación, función de la RAM, formatos y generaciones DDR. Relacioná las ilustraciones con las partes del módulo del libro.'],
    ['Páginas 5–8', 'Ejemplos de netbooks, diseños modulares o soldados, síntomas y señales POST. Contrastá las generalizaciones con la documentación del modelo.'],
    ['Páginas 9–13', 'Propuestas de intervención, pruebas y conclusiones. Leelas con las aclaraciones anteriores; no constituyen una autorización ni una secuencia práctica de este laboratorio.'],
  ],
  references: [
    { title: 'Kingston: ficha DDR3 DIMM de 240 contactos', url: 'https://www.kingston.com/datasheets/khx2400C11D3K4_8gx.pdf' },
    { title: 'MemTest86: interpretación y límites de los errores', url: 'https://www.memtest86.com/troubleshooting.htm' },
  ],
});

export function ramVideoEmbedUrl() {
  return `https://www.youtube-nocookie.com/embed/${ramResources.videoId}?autoplay=0&controls=1&hl=es&cc_lang_pref=es&cc_load_policy=1`;
}
