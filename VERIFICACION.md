# Verificación — 25 de octubre de 2026

## Pie del libro y Bibliografía unificada

- Pasaron las 51 pruebas y la compilación. En el navegador se verificó una sola lista con 81 entradas, incluidas las 32 citas aportadas, y el retorno al índice con foco. La vista de 670 píxeles no presentó desplazamiento horizontal. El HTML del ZIP coincide con la compilación y ya no contiene la leyenda retirada.

## Distribución del libro

- Pasaron las 51 pruebas y la compilación. Desde el ZIP extraído arrancó el iniciador de Windows y los 27 archivos compilados respondieron con el tamaño esperado.
- En Chromium se probaron la portada, el laboratorio, Bibliografía y Teclado a 320, 768 y 1440 píxeles, bloqueando las solicitudes HTTPS externas. La imagen del capítulo cargó y no hubo desplazamiento horizontal ni errores JavaScript en ese recorrido.
- El flujo de GitHub Pages está preparado. Su ejecución y la URL pública dependen del repositorio de destino. No se probó el paquete en macOS o Linux ni en teléfonos físicos.

## Encabezado y Bibliografía

- Pasaron las 51 pruebas y la compilación, con el aviso habitual de tamaño de Vite. Tres PDF locales, incluidos los originales de RAM y Microprocesador, respondieron HTTP 200.
- En el navegador se verificaron la portada, el encabezado visible a 319 píxeles, el acceso por teclado a Bibliografía, sus 10 secciones y 49 enlaces con destino, el retorno con foco y el acceso a la evaluación de Teclado. No se verificaron los destinos externos individualmente.

## Capítulo de Teclado

- Pasaron las 51 pruebas y la compilación, con el aviso habitual de tamaño de Vite. La infografía y el PDF compilados coinciden con los originales por SHA-256 y responden HTTP 200.
- En el navegador se verificaron la carga de la guía, las tres selecciones por teclado, los resultados 3/4 y 4/4, el reinicio y el regreso al índice con foco. La vista a 319 píxeles no presentó desplazamiento horizontal.

## Capítulo de Cables flex

- Pasaron las 51 pruebas y la compilación, con el aviso habitual de tamaño de Vite. La infografía y el PDF compilados coinciden con los originales por SHA-256 y responden HTTP 200.
- En el navegador se comprobaron la selección de las tres referencias con Enter, la carga de la imagen, la evaluación con 3/4 y 4/4, el reinicio, el regreso con foco al índice y la reapertura. A 319 píxeles no hubo desplazamiento horizontal.

## Guía visual de Conectores

- Pasaron las 51 pruebas y la compilación, con el aviso habitual de tamaño. La imagen compilada conserva el SHA-256 del archivo original y responde HTTP 200. En el navegador se verificaron la apertura de las dos fichas por teclado, la carga de la imagen y el foco en el enlace de descarga. No se observó desplazamiento horizontal a 319 píxeles.

## Capítulo de Conectores — 10 de noviembre de 2026

- Pasaron las 51 pruebas y la compilación. Se conserva el aviso de Vite por el tamaño del bundle. El PDF compilado coincide con el original por SHA-256 y respondió HTTP 200 como PDF.
- En el navegador integrado se comprobó la entrada desde el índice, la selección de las tres referencias con Enter, la validación del formulario incompleto, la devolución con 3/4 y 4/4, el reinicio y el retorno del foco. También se abrió Almacenamiento desde el índice y se volvió a Conectores. La vista de 319 píxeles no presentó desplazamiento horizontal.

## Recursos complementarios de almacenamiento

- Pasaron las 51 pruebas y la compilación. El hash de la infografía compilada coincide con el original.
- En el navegador se verificaron la carga a pedido, el reproductor de YouTube y su retirada al volver al índice. Se verificaron también la ampliación por teclado, el cierre con Escape y el retorno del foco, la lectura en texto y la ausencia de desbordamiento horizontal en el panel angosto. No se verificó la reproducción completa.

## Capítulo de discos rígidos y almacenamiento

- Pasaron las 51 pruebas y la compilación. Se conserva el aviso de tamaño del bundle de Vite.
- En el navegador se verificó la entrada desde el índice, la selección de las tres fotos con teclado y el regreso con foco en el capítulo. Las tres fotos y el PDF respondieron HTTP 200.
- La evaluación bloqueó un intento incompleto, mostró devoluciones con 3/4 y 4/4, conservó el puntaje al escribir la reflexión y limpió las respuestas al reiniciar. Se comprobó también una entrega de 4/4 en Motherboard tras reutilizar la corrección del formulario. No se registraron errores de consola ni desbordamiento horizontal en el panel angosto.

## Actividad de Motherboard — 10 de noviembre de 2026

- Pasaron las 51 pruebas y la compilación. Se conserva el aviso de Vite por tamaño del bundle.
- En el navegador, el formulario impidió comprobar respuestas incompletas. Se verificaron con teclado el puntaje de 3/4, la devolución de la pregunta para revisar, el cambio a 4/4 y el reinicio. El panel angosto no presentó desplazamiento horizontal y el visor 3D siguió disponible.

## Capítulo de Motherboard

- Pasaron las 51 pruebas y la compilación. Se conserva el aviso de Vite por tamaño del bundle.
- Se observaron las dos caras con sus texturas. En el navegador se comprobó giro por arrastre, cambio de cara con Enter, zoom por teclado, retorno al índice con foco y reapertura después de pasar por Microprocesador. Se verificó el panel angosto sin desplazamiento horizontal y el diseño de doble página.
- Se verificó la carga de las fotos originales. El gesto de pinza y el caso sin WebGL quedaron sin probar en un dispositivo real.

## Anexos de microprocesador

- Pasaron las 51 pruebas de `npm run check` y la compilación. Se conserva el aviso de Vite por tamaño del bundle.
- Se comprobó que los tres archivos locales responden HTTP 200 con su tipo correspondiente y que las copias de producción coinciden por SHA-256 con los originales. Se revisaron las 15 páginas del PDF como imágenes.
- En el navegador se comprobó la carga diferida, la ampliación por teclado, el cierre con Escape y el retorno del foco. Ambas infografías cargaron a 2752 px de ancho. El panel angosto no presentó desplazamiento horizontal.
- YouTube mostró el reproductor con el video indicado y el control de reproducción. Se comprobó que volver al índice retira los iframes del video y del PDF. No se verificó la reproducción completa. El visor del PDF quedó en blanco en el navegador integrado durante la revisión. Permanecen el enlace al original, la descarga y el mapa de lectura.

## Capítulo de microprocesador

- Pasaron las 51 pruebas de `npm run check` y la compilación. Vite mantiene el aviso de tamaño del bundle.
- En el navegador se comprobó el acceso por el índice con teclado, las dos referencias sobre la foto, la devolución para dos respuestas, el regreso con foco en la entrada de Microprocesador y la conservación del libro abierto. También se abrió RAM desde el índice y se regresó a Microprocesador.
- Se verificó la doble página a 1200 px y el apilado en el panel angosto, sin desplazamiento horizontal. La consola no registró errores en este recorrido.
- El hash de la foto coincide con el archivo aportado. La escena y las texturas del libro no requirieron cambios.

## Portada institucional — 3 de noviembre de 2026

- `npm run check`: 51 pruebas aprobadas, sintaxis y cuatro casos DPR. `npm run build`: correcto; aviso de bundle >500 kB conservado. Sin dependencias nuevas.
- Navegador: ambos logos cargados a su resolución original; datos y separación de instituciones comprobados. Escena sin inicializar mientras se muestra la portada inicial. Enter abre el laboratorio con libro cerrado y foco en «Abrir libro».
- Libro abierto, regreso a portada y reentrada conservan estado; un único canvas y un único acceso a RAM desde componentes. Capítulo RAM y atajo 3 seleccionan «Contactos». La portada a 320 × 800 mantiene documento y ancho útil en 305 px, sin desbordamiento horizontal.
- Pendientes: prueba con lector de pantalla, reducción de movimiento configurada en el sistema, dispositivos físicos y verificación offline real. No se afirma publicación web ni instalación PWA.

## Anexos multimedia de RAM — 27 de octubre de 2026

- `npm run check`: 51/51 aprobadas, sintaxis y cuatro casos DPR. Las tres nuevas comprueban firmas, tamaños y SHA-256 de ambos originales y el identificador/dominio/sin autoplay del video.
- `npm run build`: correcto, 36 módulos; JS 650,37 kB / 176,69 kB gzip. Aviso de bundle >500 kB conservado. No se agregaron dependencias.
- HTTP local en 4173: portada y ambos recursos responden 200. PNG y PDF se sirven con sus tipos y tamaños correspondientes.
- Navegador: RAM desde índice, acceso al anexo y enlaces de elección con Enter. Sin iframes ni imagen cargada antes de abrir los recursos. YouTube muestra miniatura y controles del video solicitado; no se comprobó reproducción completa ni disponibilidad de subtítulos durante la reproducción. La consulta de la página original indicaba subtítulos no disponibles.
- Cambiar a seguridad retira el iframe; al volver se conserva RAM y su libro. Infografía cargada a resolución original (2752 × 1536), diálogo con ampliación y ajuste; Escape devuelve el foco al botón de apertura. Consulta y cierre del iframe PDF comprobados; el visor nativo quedó vacío en este navegador, por lo que no se afirma lectura de sus páginas dentro del iframe. Permanecen apertura y descarga alternativas.
- Conservado un solo canvas dentro de la mesa. Comparación SHA-256 de doce módulos/contenidos protegidos: sin cambios. Consola consultada durante las acciones anteriores sin errores ni advertencias capturados.
- Pendiente: auditoría con lector de pantalla, prueba de reproducción completa/subtítulos, visor PDF en otros navegadores, descarga mediante diálogo del sistema, nueva prueba de viewport móvil y desconexión real de Internet. El PDF original es rasterizado: el mapa de lectura no sustituye una transcripción accesible completa. Los anexos locales suman aproximadamente 19,5 MiB y se cargan a pedido.

## Reajuste de la guía al formato libro — 26 de octubre de 2026

- `npm run check`: 48/48 aprobadas, más sintaxis y cuatro casos de resolución. Nueva prueba: rayos sobre las seis filas de la hoja real devuelven el ID correcto; fuera del capítulo RAM la página no permite esa selección. El canvas se simula solo para crear texturas en Node; las mallas, UV y rayos son reales.
- `npm run build`: correcto, conservando aviso de bundle >500 kB. Sin dependencias nuevas.
- Navegador: vista inicial con las dos páginas; clic directo sobre la entrada impresa «Contactos» selecciona la parte. Seis referencias activadas con Enter, acercamiento, regreso con «Ver libro completo», vuelta al esquema interno y acceso desde la ficha RAM. Consola consultada sin errores/advertencias. Un solo canvas, siempre hijo de `laboratorio`.
- Adaptación a 320 × 800: ancho útil y documento 305 px, canvas 279 × 380. Se inició y completó acercamiento con movimiento normal y regreso al libro; movimiento reducido conserva finalización inmediata. Revisión en escritorio para la captura final.
- Comparación SHA-256 de doce archivos protegidos: sin modificaciones en los contenidos de RAM, componentes, seguridad y diagnóstico ni en los módulos propios de los capítulos previos. Se mantiene el texto educativo HTML.
- Pendientes pruebas en lector de pantalla, equipo físico y táctil real. La tipografía de la hoja depende de la perspectiva; permanece la alternativa HTML legible.

## Mejora de la guía de RAM — 26 de octubre de 2026

- `npm run check`: 47/47 aprobadas, sintaxis y cuatro casos de DPR. Las dos pruebas nuevas comprueban seis IDs, seguimiento durante el giro, ocultación de etiqueta en el reverso y selección real por Raycaster de cada punto frontal señalado.
- `npm run build`: correcto, JS aproximado 639 kB / 173 kB gzip. Aviso >500 kB conservado; sin dependencias nuevas.
- Navegador: seis referencias activadas con Enter, botones sincronizados y explicación correspondiente; referencias ocultables, giro a 180° que oculta la etiqueta y selección de etiqueta que recupera el frente. Atajo 6 disponible. Dos cierres/reingresos restablecen el canvas en la mesa y lo vuelven a colocar junto a la lectura. Regreso al esquema interno y acceso a RAM desde su ficha. Modo bajo y zoom local comprobados, consola sin errores/advertencias capturados.
- Un solo canvas en el DOM. Vista de 320 × 800 sin desbordamiento horizontal (305 px útiles); visor de 217 × 338 px y seis números dentro de sus límites. Un clic en la lista deja el visor completo a la vista. Revisión también a 1366 × 1000, 1351 px útiles y visor de 397,5 px de ancho.
- Las fuentes contrastadas son Kingston (SO-DIMM DDR4/DDR5) y Lenovo (variantes soldadas/SO-DIMM y ejemplo LPDDR5X en CAMM2). Dos enlaces antiguos de Micron/Crucial no se pudieron abrir; se reemplazó la referencia por documentación accesible de Lenovo.
- No se probaron lectores de pantalla, hardware físico, gesto táctil real ni desconexión de red. No se afirma FPS ni VRAM exacta.

## Etapa 7: índice y RAM — 26 de octubre de 2026

- `npm run check`: 45 pruebas aprobadas, sintaxis y cuatro casos de DPR. Nuevas: vínculo de cinco IDs e índice, cincuenta giros/apariciones, encuadre en cinco aspectos a lo largo del giro, Raycaster de placa y etiqueta, veinte reconstrucciones con liberación e instancias, devolución sin certificar respuestas.
- `npm run build`: correcto. JS aproximadamente 634 kB / 171 kB gzip; persiste el aviso de chunk >500 kB. No se añadieron dependencias.
- Navegador integrado sobre preview 4173: ingreso a RAM desde libro cerrado, cinco selecciones por botones y atajos, giro hasta el extremo y restablecimiento, etiqueta con transferencia de foco, devolución incompleta y completa, cambio a seguridad/regreso con respuestas conservadas, acceso a diagnóstico desde índice, entrada desde RAM del esquema interno y tres ciclos de cierre/reingreso sin animación.
- Apertura animada desde índice llegó a capítulo RAM con controles habilitados. Cierre iniciado desde RAM con movimiento normal y verificación de estado final. Sin errores ni advertencias capturados en los recorridos.
- Vista de 320 × 800: documento y ancho útil de 305 px coinciden, canvas 279 × 380, modelo completo; lectura de etiqueta y actividad sin desbordamiento. También se revisó escritorio.
- No se probó lector de pantalla, hardware físico de netbook, gestos táctiles físicos, cambio de preferencia del sistema, pérdida de contexto ni desconexión real de Internet en esta etapa. El texto alternativo sin WebGL está implementado, sin forzar ese fallo en navegador. No se afirma un FPS ni una medición exacta de memoria GPU.

## Etapa 6: revisión y optimización

- `npm run check`: sintaxis, cuatro casos de DPR y 39 pruebas aprobadas, 0 fallos. Cuatro pruebas nuevas: proyección del exterior en cinco relaciones de aspecto y giros extremos, inventario sin doble conteo, veinte construcciones/liberaciones de netbook y veinte del esquema interno.
- `npm run build`: correcto. JS 590,68 kB minificado / 156,66 kB gzip; aviso no bloqueante de chunk >500 kB conservado. Sin dependencias nuevas.
- Navegador sobre preview: apertura y cierre animados; tres ciclos completos registrados con movimiento reducido, cuatro selecciones por HTML/teclas/clic 3D, giro, zoom, Vista inicial y regresos. Modo bajo/normal alternado tres veces, reposo sin dibujos adicionales, pausa de transición oculta y continuación al volver.
- Seguridad: siete pasos/nueve condiciones, decisión incorrecta bloqueada, riesgo con detención, siete pasos de observación sin acreditar condiciones e invalidación al revocar batería. Diagnóstico: tres evidencias, bloqueo antes de observar y de reemplazo sin fundamento, resumen y recuperación tras recargar. Se reinició el caso de prueba introducido durante la auditoría.
- Teclado: foco visible, Tab, Enter, flechas entre capítulos, 1–4, Escape, C e Inicio. Guía cerrada con Escape y foco devuelto. «Sin animación» comprobado; no se cambió la preferencia del sistema.
- Vistas 320 × 800 y 1366 × 1000 sin desbordamiento horizontal en los capítulos revisados. Se corrigió recorte de netbook en móvil y se comprobó su encuadre.
- Inventario: 124→39 geometrías; arrays 459.536→388.136 bytes; texturas estimadas 12→6 MiB. Tres ciclos de navegador mantuvieron contadores estables. No equivale a ausencia de fugas ni medición de VRAM.
- Consola sin errores/advertencias capturados en los recorridos finales. Una tanda de automatización larga agotó el tiempo; no se contabiliza como prueba completa.
- Informe, métricas, contraste y limitaciones detalladas en `../INFORME-AUDITORIA-ETAPA-6.md` y `../auditoria-metricas.json`. Pendientes hardware real, lectores de pantalla, táctil físico, otros navegadores, FPS/VRAM, desconexión real, contexto perdido y preferencia del sistema.

## Etapa 5: Detectives del Hardware

- `npm run check`: correcto; sintaxis, cuatro casos de pixel ratio y treinta y cinco pruebas (veinticuatro previas y once nuevas).
- Tests nuevos: bloqueo de saltos, aceptación de las cinco hipótesis sin premio predeterminado, separación entre pruebas elegidas y observadas, ambigüedad, requisitos de acciones, bloqueo de reemplazo/formateo, persistencia de resultado y borrador, almacenamiento fallido/corrupto/ajeno y reinicio.
- `npm run build`: correcto. Aviso no bloqueante de tamaño: aproximadamente 588 kB minificados / 156 kB gzip. Sin dependencias adicionales.
- Navegador: recorrido completo con hipótesis RAM, evidencias de memoria e inicio, interpretaciones múltiples, conclusión provisional, límites y propuesta reversible supervisada. El reemplazo por suposición quedó bloqueado con explicación.
- El resultado se recuperó tras recargar: se restauró la etapa de retroalimentación, las dos evidencias y los textos. Se comprobó que vaciar una interpretación invalida el resumen y bloquea avanzar; al completarla se pudo regenerar la devolución.
- Navegación con Enter, Espacio e Inicio/Fin entre capítulos. Regresión: seguridad siguió bloqueando abrir sin preparación; observar sus siete pasos no acreditó condiciones. El libro y la selección de RAM siguieron funcionando al volver a Exploración 3D.
- Vista revisada a 360 × 800 y escritorio a 1366 × 1000. En móvil, ancho del documento y ancho útil coincidieron en 345 px, sin desbordamiento horizontal.
- Consola sin errores ni advertencias capturados durante esas operaciones. El botón de exportación JSON está implementado; se probaron la estructura y serialización del resultado, no una descarga manual en todos los navegadores.
- La evaluación automatizada verifica estructura, referencias y condiciones de la propuesta; no juzga el significado de las respuestas. No se ejecutan pruebas ni cambios sobre un equipo real.

## Etapa 4: seguridad y mantenimiento

- Ocho pruebas automatizadas nuevas: avance secuencial, nueve condiciones, decisiones incorrectas, riesgo, detención prudente, confirmaciones, revocación y observación sin acreditación. Se conservaron las dieciséis previas.
- Navegador: se recorrieron los siete pasos y se alcanzó el cierre simulado con nueve condiciones. La opción de retirar piezas por haber completado una lista no habilitó la conclusión. Manual/batería/docente y herramientas/puesto exigieron confirmaciones.
- Revocar batería bloqueó la decisión final y ocultó el cierre. El modo observación llegó al paso 7 con cero condiciones acreditadas. En el caso con riesgo, ignorar las señales no permitió avanzar y detenerse dejó el recorrido bloqueado con remisión al docente.
- Se verificó cambiar de capítulo y regresar conservando la etapa en memoria. El capítulo no autoriza desmontajes ni acredita el estado de equipos reales.

## Etapa 3: exploración de componentes

- `npm run check`: correcto. Sintaxis, cuatro casos del límite de resolución y dieciséis pruebas con Node (once anteriores y cinco nuevas).
- Pruebas nuevas: IDs y referencias a grupos 3D, cuatro impactos reales del Raycaster desde la vista general, exclusividad del resaltado y reinicio, encuadres por encima de la geometría y correspondencia de marcadores proyectados. Las pruebas 3D se ejecutan sin GPU y no sustituyen la revisión visual.
- `npm run build`: correcto; el aviso no bloqueante de tamaño del bundle continúa (aproximadamente 543 kB minificados / 141 kB gzip). Sin dependencias adicionales.
- Navegador, sobre el preview en 4173: las cuatro selecciones mediante botones con Enter mostraron nombre, función, dos precauciones específicas y la pregunta correspondiente. Se repitieron con Espacio. El foco se conservó en el botón seleccionado tras el movimiento de cámara.
- Los cuatro clics sobre el esquema 3D seleccionaron los IDs y las fichas correctas. Los marcadores son decorativos con `pointer-events: none`: los clics pasan al lienzo y los resuelve el Raycaster. Un intento inicial de coordenadas nativas fuera del área efectiva del navegador no se contó como selección; se comprobó después cada clic en la posición del marcador mediante la automatización del navegador.
- Vista general y Escape eliminaron la selección y ocultaron la ficha. Las teclas 2 y flecha derecha pasaron de almacenamiento a placa madre. Tab pasó de RAM a almacenamiento; Enter y Espacio activaron las selecciones y los controles de regreso.
- Volver a la netbook recuperó los controles exteriores; Volver al libro recuperó el encuadre general. Ambos devolvieron el foco a Ver componentes. El atajo C cerró desde un componente seleccionado y A permitió reabrir y entrar otra vez al esquema, sin una selección residual.
- Se verificó movimiento reducido mediante «Sin animación» y selección animada con reencuadre. La grilla y el bajo consumo funcionaron: canvas de 947 × 505 píxeles para 947 × 505 píxeles CSS en bajo consumo.
- Diseño revisado a 1366 × 1000 y 360 × 800. En móvil, documento y ancho útil coincidieron en 345 px, sin desbordamiento horizontal; la lista y la ficha de almacenamiento conservaron su disposición legible en una columna.
- Consola: sin errores ni advertencias capturados durante las operaciones verificadas.
- No se hicieron desmontajes ni diagnósticos. No se probaron lectores de pantalla, táctil físico, GLB real, hardware de netbook, desconexión real de Internet ni pérdida de contexto WebGL en esta etapa. No se promete una tasa de FPS ni detección exhaustiva de colisiones.

## Etapa 2: netbook tridimensional

- `npm run check`: correcto. Sintaxis de los módulos, cuatro casos de pixel ratio y once pruebas con `node:test` (cinco anteriores y seis nuevas).
- Pruebas nuevas: aparición solo después de abrir el libro; repliegue antes de las hojas; reversión y movimiento reducido; límites de giro/inclinación y reinicio; separación de la carcasa respecto del montaje en 126 poses; sustitución de geometría con normalización y liberación de recursos; límites de zoom en cinco proporciones de pantalla. Se usa un Object3D de prueba para la sustitución, no un GLB real.
- `npm run build`: correcto. Aviso no bloqueante por bundle superior a 500 kB: aproximadamente 529 kB minificados / 136 kB gzip. No se incorporaron dependencias.
- Navegador con el servidor de preview en 4173: apertura animada, aparición reconocible sobre la página derecha, entrada a exploración, extremos de giro ±35°, inclinación ±8° y acercamiento 0–100%. Una flecha adicional en el límite de 35° no sobrepasó ese límite.
- Vista inicial comprobada después de modificar los tres controles: recupera giro −12°, inclinación 0° y el acercamiento de referencia, que varía según el ancho de pantalla. Volver al libro recuperó la vista general y devolvió el foco al botón Explorar netbook.
- Se comprobó un cierre animado tras volver al libro, tres ciclos adicionales completos con «Sin animación» cerrando directamente desde exploración, y un cierre animado directo desde exploración. La secuencia anuncia primero el repliegue de la netbook y termina con el libro cerrado.
- Regresión: grilla y bajo consumo siguen funcionando. Con bajo consumo, el canvas de 376 × 380 coincidió con su tamaño CSS de 376 × 380. Guía actualizada, abierta y cerrada con Escape.
- Revisión en viewport de 360 × 800 y escritorio de 1366 × 1000. A 360 px, documento y ancho útil coincidieron en 345 px, sin desbordamiento horizontal.
- Consola del navegador sin errores ni advertencias capturados durante las interacciones comprobadas. Los primeros dos intentos de espera automática finalizaron antes de completar los 3.7 segundos de apertura; la escena completó normalmente y se verificó su estado final después.
- No se realizaron pruebas con GLB real, lector de pantalla, táctil físico, hardware de netbook, cambio de preferencias del sistema, desconexión de Internet ni simulación de pérdida de contexto en esta etapa. Los tests de trayectoria y límites no constituyen una auditoría exhaustiva de colisiones o rendimiento.

## Etapa 1: libro pop-up

- `npm run check`: correcto. Incluye sintaxis de todos los módulos, los cuatro casos previos de resolución y cinco pruebas nuevas con `node:test`.
- Pruebas nuevas: poses exactas tras 20 ciclos, orden angular de tapa y hojas en 1.001 muestras, independencia del número de fotogramas, continuidad de pose al invertir el destino y finalización inmediata con movimiento reducido. Estas pruebas comprueban las trayectorias; no equivalen a una detección exhaustiva de colisiones de mallas.
- `npm run build`: correcto. El aviso de tamaño del bundle se mantiene: aproximadamente 512 kB minificados / 130 kB gzip. No se agregaron dependencias.
- Navegador sobre `npm run preview` en el puerto 4173: se verificaron el libro cerrado y abierto, la introducción impresa y su panel HTML, tres ciclos completos, cambios rápidos de destino, A/C con foco en el lienzo y apertura del botón con Enter.
- «Sin animación» abre y cierra directamente; la vista HTML aparece solo con el libro abierto. Se verificó el control por interfaz. La preferencia del sistema también está implementada con `matchMedia` y escucha cambios, pero no se cambió la configuración del sistema durante estas pruebas.
- Regresión: grilla y bajo consumo comprobados; canvas de 947 × 505 píxeles para 947 × 505 píxeles CSS en bajo consumo. Se conservan los botones de zoom, restablecimiento y guía de la etapa 0.
- Diseño revisado en escritorio (1366 × 1000) y viewport de 360 × 800. A 360 px, el ancho útil y el ancho del documento coincidieron (345 px, por la barra de desplazamiento), sin desbordamiento horizontal. Se amplió el margen del reencuadre para pantallas angostas.
- Consola del navegador: sin errores ni advertencias capturados durante los ciclos y las interacciones verificadas.
- No se realizaron pruebas físicas en una netbook, auditoría con lector de pantalla, prueba táctil real, desconexión de Internet ni simulación de pérdida de contexto en esta etapa. No se mide ni se promete una tasa de FPS.

## Historial: etapa 0

- `npm install`: instalación completada con caché en el área de trabajo y acceso al registro npm autorizado.
- `npm run check`: correcto; sintaxis de módulos y cuatro casos del límite de pixel ratio.
- `npm run build`: correcto con cargador nativo de Vite. Se emite un aviso no bloqueante por el bundle de Three.js superior a 500 kB sin comprimir (aproximadamente 127 kB gzip).
- `npm run preview -- --port 4173 --strictPort`: servidor iniciado y aplicación compilada abierta en navegador.
- Navegador: estado «Entorno listo», grilla activada, modo de bajo consumo activado, zoom y restablecer con actualización del estado accesible, guía modal abierta y cerrada con Escape; foco devuelto al botón de apertura.
- Se enviaron flecha izquierda e Inicio al lienzo sin errores registrados. El tamaño del canvas en bajo consumo coincidió con su tamaño CSS (861 × 489 en la vista comprobada).
- Consola del navegador: sin advertencias ni errores capturados durante esas interacciones.
- No se realizaron pruebas físicas en una netbook, auditoría con lector de pantalla, prueba táctil, desconexión real de Internet, simulación de pérdida de contexto ni verificación visual a 360 px. El diseño incluye reglas responsivas; estos escenarios quedan para revisión manual.

Incidencias resueltas: el primer intento de acceso a npm fue bloqueado por el entorno. La carga inicial de configuración con esbuild encontró una restricción de lectura; los scripts usan ahora `--configLoader native` y la compilación pasó.
