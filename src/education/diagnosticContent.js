export const diagnosticCase = Object.freeze({
  id: 'netbook-lenta-d01-v1', title: 'Una netbook que tarda en arrancar',
  problem: 'Una netbook demora varios minutos en iniciar y responde lentamente durante los primeros minutos. Todavía no hay una causa confirmada. Tu desafío es investigar antes de decidir qué hacer.',
  context: 'Caso D-01, completamente ficticio: 4 GB de RAM y disco mecánico de 320 GB. Inicio medido desde el encendido hasta que el escritorio responde. No representa un modelo comercial ni mediciones de tu equipo.',
  notice: 'Todos los valores y resultados son simulados. Una señal puede ser compatible con varias causas. Ninguna comprobación de este capítulo accede a tu dispositivo ni realiza cambios reales.',
});
export const hypotheses = Object.freeze([
  { id: 'ram', name: 'Uso excesivo de memoria RAM', hint: 'La carga de programas podría generar presión de memoria y paginación; eso no implica un módulo defectuoso.' },
  { id: 'almacenamiento', name: 'Almacenamiento lento o deteriorado', hint: 'La carga de lectura, la tecnología de la unidad y su estado son cuestiones distintas que necesitan evidencias.' },
  { id: 'inicio', name: 'Procesos de inicio excesivos', hint: 'Varias aplicaciones al iniciar podrían competir por recursos.' },
  { id: 'temperatura', name: 'Problemas de temperatura', hint: 'Una limitación térmica podría reducir el rendimiento bajo ciertas condiciones.' },
  { id: 'software', name: 'Otras causas de software', hint: 'Tareas en segundo plano, actualizaciones o configuración también podrían influir.' },
]);
export const diagnosticTests = Object.freeze([
  { id: 'memoria', name: 'Uso de memoria y paginación', purpose: 'Comparar el inicio con el equipo en reposo y observar si cambia la presión de memoria.', values: [['Primeros 3 minutos', '3,6 de 4 GB ocupados'], ['Después de estabilizarse', '2,7 de 4 GB ocupados'], ['Tráfico de paginación al inicio', 'Picos de 18 MB/s; luego menos de 1 MB/s']],
    observation: 'La mayor ocupación coincide con aplicaciones que se cargan al iniciar.', limit: 'La ocupación alta no demuestra RAM averiada ni que ampliarla sea la primera medida. Hay que relacionarla con la carga, la paginación y el almacenamiento.' },
  { id: 'disco', name: 'Actividad y estado del almacenamiento', purpose: 'Distinguir actividad elevada, lentitud de acceso e indicios de deterioro.', values: [['Actividad durante el inicio', '99 % durante unos 140 s'], ['Transferencia en ese intervalo', '8 MB/s con accesos pequeños y dispersos'], ['Espacio libre', '49 de 320 GB'], ['Informe de salud simulado', 'Sin alertas reportadas por esa comprobación']],
    observation: 'El disco mecánico recibe muchas solicitudes mientras se inician programas y tareas en segundo plano.', limit: '99 % de actividad no equivale a alta velocidad ni demuestra deterioro. Un informe sin alertas tampoco descarta todos los problemas; faltan comprobaciones específicas si la lentitud persiste.' },
  { id: 'inicio', name: 'Aplicaciones de inicio y comparación controlada', purpose: 'Comparar tiempos con y sin algunas aplicaciones no esenciales, manteniendo las condiciones del caso.', values: [['Aplicaciones al iniciar', '12; 6 informadas con impacto alto'], ['Tres inicios de referencia', '205 s / 198 s / 212 s'], ['Tres inicios con menor carga', '104 s / 112 s / 107 s'], ['Cambio del ensayo ficticio', 'Se omitieron solo aplicaciones no esenciales identificadas para este caso']],
    observation: 'Reducir esa carga coincide con una mejora importante, aunque el inicio aún supera un minuto.', limit: 'Es un ensayo ficticio controlado, no una recomendación de desactivar servicios al azar. No se modificaron seguridad ni servicios esenciales. La mejora apoya una contribución de la carga de inicio, pero no prueba una causa única.' },
  { id: 'termica', name: 'Temperatura y rendimiento observado', purpose: 'Relacionar temperatura, carga y posibles eventos de limitación del rendimiento.', values: [['Tras iniciar y estabilizarse', '48 °C'], ['Durante 8 minutos de carga', 'Entre 64 y 72 °C'], ['Registro del ensayo', 'Sin eventos de limitación térmica reportados']],
    observation: 'En esa ventana de prueba la frecuencia observada se mantuvo estable para la carga aplicada.', limit: 'No hay un umbral universal para todos los equipos. Este registro reduce el apoyo a una limitación térmica en ese ensayo, pero no la descarta en otras cargas, ambientes o momentos.' },
  { id: 'software', name: 'Procesos y tareas de software', purpose: 'Observar qué tareas consumen recursos y qué alcance tiene una revisión de software.', values: [['CPU durante el inicio', 'Picos de 65 % con actualización e indexado'], ['CPU una vez estabilizado', '18 % en el intervalo observado'], ['Revisión de seguridad simulada', 'Sin amenazas detectadas en su alcance']],
    observation: 'Varias tareas de software coinciden con el período lento y con la actividad del disco.', limit: 'Coincidir en el tiempo no basta para atribuir toda la lentitud a un proceso. Una revisión sin detecciones no garantiza ausencia de toda causa de software.' },
]);
export const relationTypes = Object.freeze([
  { id: 'compatible', name: 'Compatible con estas hipótesis, sin confirmarlas por sí sola' },
  { id: 'ambiguo', name: 'No alcanza para distinguir entre estas hipótesis' },
  { id: 'menos-apoyo', name: 'Reduce su apoyo en las condiciones de este ensayo' },
]);
export const diagnosticActions = Object.freeze([
  { id: 'inicio-controlado', name: 'Proponer una revisión supervisada y reversible de aplicaciones de inicio, y volver a medir.', requires: ['inicio'], safe: true, feedback: 'La comparación de inicio permite fundamentar esa propuesta. Definí qué compararías, sin desactivar servicios esenciales ni asumir que toda la lentitud tiene una sola causa.' },
  { id: 'mas-evidencias', name: 'No intervenir todavía: pedir nuevas comprobaciones para distinguir las causas pendientes.', requires: [], safe: true, feedback: 'Pedir más evidencia es una decisión válida si explicás qué falta y cómo ayudaría a distinguir hipótesis.' },
  { id: 'software-controlado', name: 'Proponer revisar las tareas de software identificadas y comparar su impacto con el docente.', requires: ['software'], safe: true, feedback: 'Hay observaciones de software para examinar. La propuesta debe ser específica, autorizada y verificable, sin cambios indiscriminados.' },
  { id: 'revision-unidad', name: 'Solicitar comprobaciones específicas del almacenamiento antes de considerar una intervención.', requires: ['disco'], safe: true, feedback: 'La actividad elevada merece contexto. Solicitar comprobaciones adicionales es distinto de afirmar deterioro o decidir un reemplazo.' },
  { id: 'reemplazar', name: 'Reemplazar una pieza ahora porque esa fue mi primera hipótesis.', requires: [], safe: false, feedback: 'Una hipótesis no es evidencia de fallo ni autorización de reemplazo. Este caso no demuestra una pieza defectuosa. Fundamentá una comprobación o una medida reversible; una intervención real exige procedimiento del modelo y supervisión docente.' },
  { id: 'formatear', name: 'Formatear el equipo para resolver la lentitud sin otras comprobaciones.', requires: [], safe: false, feedback: 'Es una propuesta desproporcionada y con consecuencias para los datos. Los resultados no la justifican. Primero se contrastan hipótesis y se acuerdan medidas adecuadas con el docente.' },
]);
export const diagnosticStages = ['Leer la situación', 'Elegir una hipótesis', 'Planificar información', 'Observar resultados', 'Relacionar evidencias', 'Proponer una acción', 'Recibir retroalimentación'];
export const diagnosticSources = [
  { title: 'Microsoft: rendimiento y aplicaciones de inicio', url: 'https://support.microsoft.com/en-us/windows/experience/startup-boot/configure-startup-applications-in-windows' },
  { title: 'Dell: rendimiento lento y comprobaciones', url: 'https://www.dell.com/support/kbdoc/en-us/000178928/how-to-troubleshoot-slow-performance-issues' },
  { title: 'Dell: temperatura y limitación del rendimiento', url: 'https://www.dell.com/support/kbdoc/en-us/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc' },
];
