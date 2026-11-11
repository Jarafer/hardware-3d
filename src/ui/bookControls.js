export function bindBookControls({ scene, content, announce }) {
  const button = document.getElementById('toggle-book');
  const reading = document.getElementById('book-reading');
  document.getElementById('book-introduction').textContent = content.introduction;
  document.getElementById('book-reminder').textContent = content.reminder;
  document.getElementById('book-reserved').textContent = content.reserved;
  const toggle = () => scene.toggleBook();
  const motion = document.getElementById('reduce-book-motion');
  const onMotion = () => scene.setReducedMotion(motion.checked);
  button.addEventListener('click', toggle);
  motion.addEventListener('change', onMotion);
  onMotion();
  const unsubscribe = scene.subscribeBook((state) => {
    button.textContent = state.target === 1 ? 'Cerrar libro' : 'Abrir libro';
    button.setAttribute('aria-expanded', String(state.open));
    button.disabled = !state.available;
    reading.hidden = !state.open || !state.available || ['internal', 'ram'].includes(state.mode) || state.activePopUp === 'ram';
    const objectName = state.activePopUp === 'ram' ? 'el módulo RAM' : 'la netbook';
    const movement = state.phase === 'netbook' ? (state.target ? `Desplegando ${objectName}…` : `Replegando ${objectName}…`) : state.phase === 'camera' ? 'Reencuadrando la vista…' : state.target ? 'Abriendo las páginas…' : 'Cerrando el libro…';
    document.getElementById('book-state').textContent = state.moving ? movement : state.mode === 'ram' ? 'Capítulo 01 · Memoria RAM' : state.mode === 'internal' ? 'Libro abierto · Esquema interno' : state.open ? 'Libro abierto · Netbook desplegada' : 'Libro cerrado · Listo para explorar';
    document.getElementById('scene').setAttribute('aria-label', `${state.mode === 'netbook' ? 'Exploración de la netbook. Las flechas giran el objeto con límites.' : `Libro tridimensional ${state.open ? 'abierto con una netbook en la página derecha' : state.moving ? 'en movimiento' : 'cerrado'}. Flechas para girar la vista.`} Más y menos para zoom, Inicio para restablecer, A para abrir y C para cerrar.`);
    document.querySelector('.scene-coordinate').textContent = state.mode === 'netbook' ? 'MESA 01 / EXPLORACIÓN EXTERIOR' : state.open ? 'MESA 01 / LIBRO Y NETBOOK' : 'MESA 01 / LIBRO DE LABORATORIO';
    document.getElementById('scene-instructions').textContent = state.mode === 'netbook' ? 'Flechas o deslizadores para girar la netbook · +/− o rueda para zoom · Inicio restablece · C cierra el libro' : 'Arrastrá para girar la vista · Rueda para acercar · Teclado: flechas, A para abrir, C para cerrar';
    if (state.mode === 'internal') {
      document.getElementById('scene').setAttribute('aria-label', 'Vista interna esquemática. Seleccioná con un clic o con las teclas 1 a 4. Las flechas recorren los componentes; Escape o Inicio vuelve a la vista general. También hay una lista de botones debajo del lienzo.');
      document.getElementById('scene-instructions').textContent = 'Clic o teclas 1–4 para seleccionar · Flechas recorren las piezas · Escape o Inicio: vista general · C: cerrar libro';
      document.querySelector('.scene-coordinate').textContent = 'ESQUEMA DIDÁCTICO / CUATRO COMPONENTES';
    }
    if (state.mode === 'ram') {
      document.getElementById('scene').setAttribute('aria-label', 'Módulo RAM SO-DIMM esquemático. Guía visual numerada. Flechas izquierda y derecha para girar, 1 a 6 para seleccionar partes, más y menos para zoom. Inicio o Escape restablece. C cierra. Las partes también tienen botones y explicación HTML.');
      document.getElementById('scene-instructions').textContent = 'RAM · Clic o 1–6: partes · Flechas: giro · +/−: zoom · Inicio: vista inicial · C: cerrar';
      document.querySelector('.scene-coordinate').textContent = 'CAPÍTULO 01 / MEMORIA RAM';
    }
    for (const id of ['reset-view', 'zoom-in', 'zoom-out']) document.getElementById(id).disabled = state.moving || !state.available;
    announce(!state.available ? 'Entorno 3D pausado' : state.moving ? movement : state.mode === 'ram' ? 'Capítulo de RAM abierto. Explorá las partes o leé la actividad debajo de la escena.' : state.mode === 'netbook' ? `Netbook: giro ${Math.round(state.yaw)} grados, inclinación ${Math.round(state.tilt)} grados, acercamiento ${state.zoom} por ciento.` : state.open ? 'Libro abierto. Netbook lista para explorar.' : 'Libro cerrado');
  });
  return () => { unsubscribe(); button.removeEventListener('click', toggle); motion.removeEventListener('change', onMotion); };
}
