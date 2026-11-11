# Hardware 3D — Laboratorio Interactivo

Etapa 7: índice del libro y capítulo piloto de memoria RAM para estudiantes de quinto año. Conserva el libro, la netbook, los componentes, «Antes de abrir una netbook» y «Detectives del Hardware». Vite + JavaScript ES Modules + Three.js; HTML y CSS sin frameworks.

## Ejecución

Requiere Node.js 22.12 o superior y npm (se recomienda Node 24 LTS).

```sh
npm install
npm run dev
```

Abrir la dirección local que indica Vite (habitualmente http://127.0.0.1:5173). Para una instalación reproducible después de disponer del lockfile, usar `npm ci`.

```sh
npm run check
npm run build
npm run preview
```

`check` comprueba sintaxis, cuatro casos del límite de resolución y 51 pruebas del libro, la netbook, los componentes, RAM, seguridad, diagnóstico y recursos con el runner nativo de Node. `build` produce `dist/`. `preview` sirve ese resultado (habitualmente http://127.0.0.1:4173). No abrir `index.html` ni `dist/index.html` mediante `file://`: los ES Modules requieren un servidor HTTP. `base: './'` permite servir el resultado en una subcarpeta.

## Compartir sin conexión

Distribuí `Hardware-3D-sin-conexion-Windows.zip`. En Windows, extraé todo el ZIP y abrí **Abrir libro.exe**. Dejá la ventana del servidor abierta. Si el navegador no abre automáticamente, ingresá la dirección que muestra la ventana. El iniciador solo atiende conexiones del mismo equipo. La edición incluye los capítulos, el 3D, las actividades, las imágenes y los PDF. Los videos de YouTube y los enlaces externos requieren Internet.

Para generar el ZIP en Windows, instalá las dependencias de desarrollo y ejecutá `python scripts/empaquetar-offline.py` con Python 3 y el compilador de .NET Framework disponibles. Los destinatarios del ZIP en Windows no necesitan Python, Node.js ni npm. En macOS o Linux se puede servir la carpeta `libro` con Python 3 siguiendo el archivo LEEME del ZIP.

## Publicar con GitHub Pages

1. Subí el código fuente a la rama `main` de un repositorio de GitHub. Incluí `.github/workflows/pages.yml`, el lockfile y la carpeta `public/`. El flujo genera `dist/`.
2. En **Settings → Pages → Build and deployment → Source**, seleccioná **GitHub Actions**.
3. En **Actions**, ejecutá **Publicar Hardware 3D en GitHub Pages**. El flujo también se ejecuta con cada cambio en `main`. Cuando finalice, la URL aparecerá en el despliegue del entorno `github-pages`.

## Alcance

El capítulo «Motherboard» carga un visor Three.js propio al abrirse desde el índice y libera sus recursos al cerrarse. La geometría aproximada y las texturas se preparan en `src/scene/motherboardScene.js`. La lectura y las fotos originales están disponibles en el mismo capítulo.

Desde el índice se puede abrir «Microprocesador». Su doble página de lectura combina una foto local con referencias superpuestas, una explicación breve de la CPU y una pregunta sobre temperatura. Los contenidos están en `src/education/microContent.js` y los controles en `src/ui/microChapter.js`. El libro recupera su estado al salir del capítulo.

La portada institucional presenta los logos originales de la Escuela Provincial N° 796 “Antonio Berni” y CONSUDEC Profesorado, Taller de Hardware, residente Jaramillo Guillermo Fernando, docente Vazquez Cecilia y ciclo lectivo 2026. «Entrar al laboratorio» inicia la escena una sola vez y muestra el libro cerrado. «Portada» vuelve a la presentación sin reiniciar la actividad; «Volver al laboratorio» conserva la sesión. Los logos se sirven localmente desde `public/instituciones/`; no se modificaron las imágenes aportadas.

La interfaz de acceso está en `src/ui/institutionCover.js` y su estilo en `institutionCover.css`. La animación inicial es breve, no bloquea el botón y respeta `prefers-reduced-motion`. Los datos institucionales están en la sección `institution-cover` de `index.html`. La portada y sus recursos están incluidos en la edición sin conexión.

Libro inicialmente cerrado sobre el escritorio, con tapa, contratapa, lomo, cantos y seis hojas con grosor. La portada incluye título, subtítulo y un dibujo técnico generado mediante Canvas 2D. La apertura despliega la tapa primero y las hojas en secuencia. Al finalizar, emerge una netbook procedural desde la página derecha. Incluye carcasa mate con bordes redondeados, pantalla y marco, teclado instanciado, touchpad, bisagras, puertos representativos, ventilación e indicadores. «Ver componentes» incorpora un modo interno esquemático con RAM, almacenamiento, placa madre y refrigeración. El diagnóstico de la etapa 5 es una actividad separada y ficticia; no se realizan desmontajes, mediciones ni modificaciones reales.

La jerarquía de `Three.Group` articula la tapa y cada hoja en el lomo. Las poses absolutas derivan de una línea de tiempo: 2.6 segundos para el libro y 1.1 segundos para la aparición, interpolando escala, altura y orientación de la netbook. Pliegues de papel sostienen el objeto. Al cerrar se recorre la secuencia en sentido inverso: primero se oculta la netbook y después se pliegan las hojas. El destino puede invertirse durante la secuencia sin acumular rotaciones.

La vista general conserva una distancia mínima de 7 unidades. «Explorar netbook» reencuadra la cámara en 0.7 segundos y habilita giro del objeto entre −35° y 35° e inclinación entre −8° y 8°. El zoom calcula límites según el menor ángulo de visión horizontal/vertical y una envolvente conservadora, para mantener el exterior dentro del encuadre incluso en pantallas angostas. Se desactiva el giro libre de cámara en exploración; el objeto se gira con deslizadores o flechas. Los recorridos de cámara interpolan objetivo y coordenadas esféricas. Los controles manuales se suspenden durante el reencuadre. «Vista inicial» recupera el giro −12°, inclinación 0° y encuadre inicial de la netbook. «Volver al libro» recupera la vista general.

El renderizado responde a cambios de tamaño e interacción; el bucle solo funciona durante la transición y se suspende con la pestaña oculta. Al volver se calcula el estado según el tiempo transcurrido. El pixel ratio se limita a 1.5. El modo de bajo consumo lo limita a 1 y desactiva sombras. Los recursos y las texturas de la escena son locales. El video opcional de RAM se conecta a YouTube únicamente cuando se solicita cargarlo.

## Recursos complementarios de RAM — 27 de octubre de 2026

Entrar en «Índice del libro → Memoria RAM → Video, infografía y PDF». El anexo forma parte del capítulo y conserva el libro 3D y la guía impresa. Incluye el video solicitado (4:50), la infografía original ampliable y el PDF original de 13 páginas, con enlaces de apertura y descarga. «Volver al libro 3D» recupera el foco del lienzo.

`src/education/ramResources.js` guarda metadatos, lecturas alternativas, aclaraciones y fuentes; `src/ui/ramResources.js` controla los visores y su limpieza; `ramResources.css` limita los estilos al anexo. Los archivos originales están en `public/recursos/ram/` y Vite los copia a `dist/`. PNG: 5,7 MiB; PDF: 13,8 MiB. Se cargan al abrir la infografía o solicitar el visor PDF. Las pruebas verifican su integridad con SHA-256. No se añadieron dependencias.

YouTube requiere Internet, no se reproduce automáticamente y se descarga el iframe al cerrar su panel o abandonar el capítulo. Se ofrece enlace al sitio original. No había subtítulos disponibles en la consulta del reproductor; la síntesis HTML es propia y no es una transcripción del video. La infografía dispone de descripción extendida y ampliación de 100–400 %, con Escape y retorno del foco. El PDF contiene imágenes: el mapa de lectura HTML es una orientación, no una transcripción íntegra accesible. El visor depende del navegador; usar apertura o descarga si queda vacío.

Los originales se preservan y se acompañan de aclaraciones visibles sobre datos de la infografía y generalizaciones del PDF. Se revisaron todas sus páginas. Las fuentes de contraste están junto a los recursos: [ficha Kingston DDR3 DIMM](https://www.kingston.com/datasheets/khx2400C11D3K4_8gx.pdf) e [interpretación de MemTest86](https://www.memtest86.com/troubleshooting.htm). El libro no convierte esas propuestas de intervención en una práctica real.

## Estructura

```text
src/
  main.js                 Integración y manejo de errores
  config.js               Paleta y política de resolución
  styles.css              Estilos base y accesibilidad
  scene/createScene.js    Cámara, luces, suelo, interacción y limpieza
  scene/createBook.js     Geometría, jerarquía, bisagras y montaje futuro
  scene/bookMotion.js     Poses y transiciones temporales puras
  scene/bookTextures.js   Papel, portada y dibujo técnico con Canvas 2D
  scene/Netbook3D.js      Módulo independiente, geometría exterior y reemplazo de modelo
  scene/labMotion.js      Secuencia libro/netbook, aparición y límites de zoom
  scene/InternalView.js   Esquema interno, objetos, Raycaster, resaltado y encuadres
  education/stage.js      Estado de la etapa educativa
  education/bookContent.js Textos del libro compartidos por escena y HTML
  education/components.js IDs estables, funciones, precauciones, preguntas y fuentes
  education/safetyContent.js Siete pasos, decisiones y condiciones de seguridad
  education/SafetyJourney.js Reglas de avance y modo de observación
  education/diagnosticContent.js Caso ficticio, hipótesis, comprobaciones y acciones
  education/DiagnosticJourney.js Estado, fundamentos, devolución y persistencia
  ui/chapters.js          Navegación accesible entre los tres capítulos
  ui/safetyChapter.js     Interfaz de seguridad y confirmaciones
  ui/safety.css           Diseño de la preparación segura
  ui/diagnosticChapter.js Desafío, formularios y resumen descargable
  ui/diagnostic.css       Diseño adaptable del desafío
  ui/controls.js          Controles HTML y guía modal
  ui/bookControls.js      Sincronización del libro con botones y lectura
  ui/book.css             Estilos del libro y vista de lectura
  ui/netbookControls.js   Botones, deslizadores y foco de exploración
  ui/netbook.css          Controles adaptables de la netbook
  ui/componentControls.js Lista alternativa, fichas, marcadores y foco
  ui/components.css       Presentación adaptable del modo interno
  ui/layout.css           Diseño responsivo
scripts/check.mjs         Comprobaciones sin dependencias extra
scripts/book.test.mjs     Repetición, secuencia, tiempo, reversión y movimiento reducido
scripts/netbook.test.mjs  Aparición, repliegue, límites, separación y sustitución de modelo
scripts/components.test.mjs Datos, vínculos a objetos, Raycaster, resaltado y cámara
scripts/safety.test.mjs  Secuencia, condiciones, observación y detención por riesgo
scripts/diagnostic.test.mjs Evidencias, propuestas, recuperación y guardados inválidos
```

El libro expone `objectMount`, que contiene `Netbook3D.group` sobre la página derecha. La escena coordina ambos módulos y la cámara; las interfaces HTML se suscriben al estado. Los textos impresos y el panel HTML comparten `bookContent`; el panel aparece con las páginas completamente abiertas. Se mantiene fuera de la perspectiva 3D para permitir lectura, zoom del navegador y selección del texto desde cualquier ángulo.

## Capítulos educativos

### Índice y memoria RAM — etapa 7

El índice, al principio de Exploración 3D, permite entrar a la netbook, RAM, seguridad y diagnóstico. Los seis capítulos futuros se muestran como contenido próximo, sin botones falsamente operativos. Elegir RAM con el libro cerrado inicia la apertura y luego el despliegue del módulo sobre la página derecha. También se puede entrar desde la ficha de RAM del esquema interno. Las páginas impresas cambian de título; la lectura completa sigue siendo HTML. No hay una animación nueva de pasar hojas individuales entre capítulos: se reencuadra y emerge el objeto dentro del libro abierto.

`scene/Ram3D.js` aporta un SO-DIMM procedural con muescas geométricas, chips y contactos instanciados, etiqueta ilustrativa y seis IDs seleccionables mediante Raycaster, botones o teclas 1–6. Flechas giran, +/− y botones controlan zoom; Inicio/Escape y Vista inicial restablecen. Giro de 0–359°, distancia adaptada al aspecto del canvas y cierre con repliegue del módulo. El número de chips y contactos es ilustrativo, no una reproducción de una generación comercial.

La guía visual permanece dentro del libro: una textura reutilizada imprime las seis referencias en la página izquierda y la RAM emerge de la derecha. El canvas se mantiene siempre en la mesa original. Se puede seleccionar una entrada impresa con Raycaster, un número sobre la memoria o un botón HTML: se resalta la pieza y la fila impresa, y se acerca la cámara a la RAM. «Ver libro completo» recupera ambas páginas. Las líneas siguen la proyección de la memoria; la etiqueta se oculta en el reverso y elegirla desde la lista recupera el frente. El teclado mantiene los atajos 1–6. La lectura HTML conserva toda su información como alternativa accesible.

El contenido se centra en portátiles: SO-DIMM DDR4/DDR5, memoria soldada, formatos modulares diferentes y comprobación del modelo exacto. Se consultaron especificaciones de Kingston y Lenovo; los enlaces están dentro del capítulo. No se añadió un disipador de escritorio como pieza obligatoria de este SO-DIMM.

`education/ramContent.js` guarda partes, contenidos, índice y reglas de devolución. `ui/ramChapter.js` sincroniza selección, navegación, lectura y reflexión. Incluye formatos DIMM/SO-DIMM, RAM soldada, compatibilidad, una etiqueta ficticia y dos observaciones simuladas. Las respuestas y su devolución se conservan al navegar durante la sesión; no persisten tras recargar. No se califica semánticamente el texto ni se acredita una reparación. La lectura y selección textual del capítulo siguen disponibles si WebGL no inicia.

Se adaptó el material PDF aportado por el docente tras revisar sus ocho páginas. Se usaron reconocimiento visual, formatos y lectura de datos; se dejaron fuera las tablas desactualizadas, afirmaciones de compatibilidad por apariencia y procedimientos de instalación de software. Las especificaciones se contrastaron con fuentes del fabricante, enlazadas en el capítulo. Ver `../ETAPA-7-RAM.md` para alcance, decisiones editoriales y comprobaciones.

Se generan dos texturas adicionales locales de 512 × 768 para las páginas de RAM, reutilizadas entre visitas y liberadas al desmontar. El inventario opcional de auditoría incluye estas texturas en caché aunque todavía no estén asignadas a un material. Se mantienen DPR ≤1.5, modo bajo y renderizado bajo demanda.

Las pestañas permiten elegir Exploración 3D, Seguridad y mantenimiento y Detectives del Hardware. Flechas recorren las pestañas; Inicio/Fin seleccionan la primera/última. Cambiar de capítulo conserva el estado en memoria del resto, incluida la vista 3D. Los capítulos HTML se inicializan antes de WebGL y no dependen de manipular el objeto.

### Antes de abrir una netbook — etapa 4

Siete pasos: observación exterior, riesgos, apagado, desconexión externa, procedimiento del fabricante, herramientas y decisión de continuidad. Se distinguen inspección externa, limpieza preventiva y mantenimiento interno. El recorrido correcto exige nueve condiciones, incluidas confirmaciones de manual/modelo, tratamiento de batería, docente, herramientas y puesto/ESD. Revocar una confirmación invalida los pasos posteriores. El caso con deformación y olor inusual conduce a detenerse y consultar; no se le atribuye una causa.

«Observar sin responder» deja recorrer ejemplos sin acreditar condiciones. Cambiar el modo o el caso reinicia sus comprobaciones. Este capítulo conserva su progreso mientras la aplicación está abierta; no lo persiste tras recargar. Nunca indica retirar piezas, aun al finalizar. Una práctica real se remite siempre al procedimiento del modelo exacto y a supervisión docente. Fuentes: [Dell, precauciones y ESD](https://www.dell.com/support/kbdoc/en-in/000137973/safety-precautions-when-working-with-electrical-equipment) y [HP, limpieza del equipo](https://support.hp.com/in-en/document/ish_4507286-4416682-16).

### Detectives del Hardware — etapa 5

Caso D-01: inicio lento y baja respuesta inicial. Los datos son ficticios y están rotulados como simulados; no representan un equipo comercial. El estudiante elige una de cinco hipótesis, justifica qué información necesita, observa al menos dos comprobaciones y relaciona cada evidencia con una o varias hipótesis. Puede registrar compatibilidad, ambigüedad o menor apoyo en las condiciones del ensayo, sin convertir una señal en certeza.

La propuesta exige evidencias observadas, notas de interpretación, explicación provisional, incertidumbres y un plan de verificación. Las acciones específicas requieren la comprobación correspondiente; reemplazar por suposición y formatear sin fundamento quedan bloqueados. Se admiten distintas hipótesis iniciales: no hay una causa única premiada. La devolución registra referencias y estructura, no comprende ni califica automáticamente el contenido de los textos libres. Los mínimos de longitud ayudan a solicitar desarrollo; no garantizan calidad. La coherencia se revisa con el docente.

Se guardan automáticamente borrador y resultado en `localStorage`, bajo `hardware3d.detectives.v1`, con versión y caso. No requiere cuenta ni servidor de usuarios y no transmite las respuestas. Al recuperar un guardado se validan IDs, datos y condiciones; la devolución se reconstruye y no se confía en un resultado arbitrario almacenado. Editar información invalida el resumen hasta regenerarlo. «Reiniciar este caso guardado» borra únicamente este caso. El resumen se puede descargar en JSON.

La persistencia pertenece al origen (por ejemplo, el puerto 4173), navegador y perfil usados. No se comparte automáticamente entre dev/preview ni dispositivos y se pierde si se borran los datos del sitio. Si el almacenamiento falla, la actividad sigue en memoria y avisa que debe descargarse el resultado antes de cerrar. Los tests cubren ese caso; no se promete recuperación tras recarga cuando el navegador bloquea el almacenamiento.

Fuentes conceptuales: [Microsoft, aplicaciones de inicio](https://support.microsoft.com/en-us/windows/experience/startup-boot/configure-startup-applications-in-windows), [Dell, rendimiento lento](https://www.dell.com/support/kbdoc/en-us/000178928/how-to-troubleshoot-slow-performance-issues) y [Dell, temperatura](https://www.dell.com/support/kbdoc/en-us/000130867/how-to-troubleshoot-a-overheating-shutdown-or-thermal-issue-on-a-dell-pc). Las cifras y los ensayos son creación didáctica, no resultados extraídos de esas fuentes.

## Exploración interna esquemática

El modo interno sustituye visualmente el exterior por un diagrama sobre la página derecha. No abre ni desmonta la carcasa. Un aviso visible recuerda que la ubicación, la forma y la presencia de las piezas dependen del modelo real. RAM y almacenamiento pueden estar integrados; la refrigeración puede ser pasiva. Las representaciones no describen una netbook específica.

`education/components.js` contiene cuatro IDs estables: `ram`, `almacenamiento`, `placa-madre` y `refrigeracion`. Cada registro incluye `objectKey`, número, nombre, color, función, precauciones y pregunta abierta. `InternalView.entries` enlaza cada ID a `{ id, info, object, outline }`; `object` es el grupo 3D real y `info` conserva la referencia al dato educativo.

El clic o toque breve sobre una pieza usa `THREE.Raycaster`. Se descartan gestos de arrastre de más de 6 píxeles, y la selección se suspende durante un reencuadre para evitar cambios accidentales. La lista HTML usa el mismo método `scene.selectComponent(id)`. Se resaltan solo los materiales de la pieza elegida, con emisión tenue y un contorno fijo, sin pulsaciones ni cambios de escala. Los números HTML siguen su posición proyectada en la escena.

La selección interpola la cámara en 0.7 segundos, adapta la distancia al tamaño de pantalla y muestra una ficha con función, precauciones y una pregunta sin respuesta predeterminada ni calificación. «Vista general» elimina la selección; «Volver a la netbook» recupera el exterior y «Volver al libro» recupera el encuadre completo. Cerrar el libro también abandona el modo interno. El panel del libro vuelve a aparecer al salir del esquema.

Los textos de seguridad y de memoria/almacenamiento se contrastaron con [Dell: precauciones de seguridad](https://www.dell.com/support/kbdoc/en-ph/000137973/safety-precautions-when-working-with-electrical-equipment) y [Kingston: memoria y almacenamiento](https://www.kingston.com/en/blog/pc-performance/difference-between-memory-storage). Los enlaces son lectura opcional; no se cargan recursos externos al usar el laboratorio.

## Interfaz exterior y futuro GLB

`new Netbook3D()` crea la geometría procedural. Se puede inyectar `new Netbook3D({ model: objeto })` o sustituirla con `netbook.setModel(gltf.scene)` después de cargar un GLB local en una etapa futura. El objeto debe ser un `THREE.Object3D` sin padre, con volumen, eje Y hacia arriba y frente hacia +Z. El módulo toma propiedad de los recursos, centra y apoya el modelo y lo normaliza dentro de una envolvente de 2.15 × 1.6 × 1.85 unidades. Libera geometrías, materiales y texturas del modelo anterior al sustituirlo.

El contrato público incluye `group`, `setModel(model)`, `setEmergence(progress)`, `rotate(yawEnGrados, tiltEnGrados)`, `resetView()` y `dispose()`. El controlador de la escena usa ese contrato y no depende de piezas procedurales particulares. `resetView()` restablece la orientación del objeto; la escena coordina el encuadre de cámara. No se incluyó un cargador GLB ni archivos externos en esta etapa. La prueba de sustitución usa un Object3D de prueba, sin afirmar haber cargado un GLB real.

## Accesibilidad y controles

- Tab navega los controles; Enter/Espacio activa botones. Hay enlace para saltar al laboratorio y foco visible.
- Abrir libro/Cerrar libro funciona con Enter o Espacio. Con el lienzo enfocado: A abre, C cierra, flechas giran, +/− acercan y alejan e Inicio restablece la cámara.
- En vista del libro, arrastrar gira la cámara y la rueda cambia distancia. Táctil: un dedo gira y dos dedos hacen zoom. En exploración, los deslizadores giran la netbook y la rueda o el deslizador ajusta el zoom.
- «Explorar netbook», «Vista inicial» y «Volver al libro» funcionan con Enter/Espacio. Los deslizadores aceptan flechas, Inicio y Fin. Con el lienzo enfocado en exploración, las flechas giran el objeto dentro de sus límites. Al entrar o volver se transfiere el foco a un control visible.
- La guía usa un diálogo nativo con Escape y retorno del foco al botón de apertura.
- En el esquema, Tab recorre los cuatro botones; Enter/Espacio selecciona y se conserva el foco tras el reencuadre. Con el lienzo enfocado, 1–4 selecciona, las flechas recorren las piezas y Escape/Inicio vuelve a la vista general. Los cambios se anuncian en el estado accesible. Los marcadores numéricos son decorativos y no duplican controles para lectores de pantalla.
- `prefers-reduced-motion` lleva el libro, la netbook y la cámara directamente al estado final. El control «Sin animación» ofrece lo mismo sin cambiar el sistema. Activarlo durante una transición la termina inmediatamente; no desactiva la preferencia del sistema. Los cambios de estado se anuncian mediante `role="status"`.
- Si falla WebGL, aparece un mensaje accesible y se deshabilitan los controles 3D. Se gestionan pérdida y recuperación del contexto gráfico.

## Uso sin conexión

La instalación inicial requiere acceso al registro npm. Después, `npm run dev` o `npm run preview` funcionan sin Internet. Con el servidor local activo y todos los recursos cargados, la aplicación sigue funcionando al desconectar Internet. No se incluye service worker: no se garantiza recargar con el servidor detenido ni una instalación PWA.

## Auditoría y rendimiento — etapa 6

La escena dibuja bajo demanda, salvo durante transiciones visibles. Comparte geometrías dentro de cada modelo, conserva una sola luz con sombras de 512 × 512 y una luz hemisférica, y actualiza sombras solo cuando cambia la geometría, su pose o visibilidad. «Bajo consumo» limita DPR a 1, desactiva sombras y libera su mapa. No desactiva el antialias creado al iniciar el contexto. Las texturas del libro son locales de 512 × 768; el texto educativo legible está también en HTML.

Para inspección local, abrir `http://127.0.0.1:4173/?auditoria=1`. El atributo `data-audit` del canvas registra inventario, bytes de arrays, estimación RGBA con mipmaps, contadores del renderer y heap de JavaScript cuando Chromium lo expone. No envía datos. Sin ese parámetro no se realizan esos inventarios ni se escriben esas muestras. Los valores no son una medición completa de RAM/VRAM ni una garantía de ausencia de fugas. El inventario inicial presupone los modelos procedurales actuales; si se sustituye un modelo en el futuro, hay que renovarlo.

El informe detallado está en `../INFORME-AUDITORIA-ETAPA-6.md`, junto con métricas y capturas. `VERIFICACION.md` distingue pruebas realizadas de comprobaciones pendientes.


## Verificación manual sugerida

Abrir en un navegador con WebGL2; comprobar que la netbook aparece después de las páginas. Explorar, llevar los deslizadores a sus límites, usar Vista inicial, volver al libro y cerrar. Repetir el ciclo y cambiar el destino durante las transiciones. Probar A/C, teclado, zoom, grilla, bajo consumo y guía. Redimensionar a 360 px y escritorio. Probar «Sin animación» y movimiento reducido del sistema. Desconectar Internet con el servidor local activo y verificar los controles. Los comandos automáticos no sustituyen estas comprobaciones visuales; consultar `VERIFICACION.md` para los resultados reales.

Para la etapa 3, comprobar las cuatro selecciones tanto con clic 3D como con los botones HTML, el texto y la pregunta correspondiente, los atajos, el borrado del resaltado en Vista general y los regresos al exterior/libro. Las pruebas automatizadas incluyen impactos reales del Raycaster sin necesitar una GPU; no reemplazan la comprobación visual en un navegador.
