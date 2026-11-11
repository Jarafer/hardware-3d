export function bindControls({ scene, announce }) {
  const cleanup = [];
  function bind(id, event, action) {
    const element = document.getElementById(id);
    element.addEventListener(event, action);
    cleanup.push(() => element.removeEventListener(event, action));
  }
  bind('reset-view', 'click', () => { scene.reset(); announce('Vista restablecida'); });
  bind('zoom-in', 'click', () => { scene.zoom(0.88); announce('Vista acercada'); });
  bind('zoom-out', 'click', () => { scene.zoom(1.12); announce('Vista alejada'); });
  bind('show-grid', 'change', (event) => { scene.setGrid(event.target.checked); announce(event.target.checked ? 'Grilla visible' : 'Grilla oculta'); });
  bind('low-performance', 'change', (event) => {
    scene.setLowPerformance(event.target.checked);
    announce(event.target.checked ? 'Bajo consumo activado' : 'Calidad estándar activada');
  });
  return () => cleanup.forEach((remove) => remove());
}

export function bindHelp() {
  const dialog = document.getElementById('help-dialog');
  const opener = document.getElementById('open-help');
  const closer = document.getElementById('close-help');
  const open = () => dialog.showModal();
  const close = () => dialog.close();
  opener.addEventListener('click', open);
  closer.addEventListener('click', close);
  return () => { opener.removeEventListener('click', open); closer.removeEventListener('click', close); dialog.close(); };
}
