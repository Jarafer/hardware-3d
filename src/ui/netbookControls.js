export function bindNetbookControls({ scene }) {
  const cleanups = [];
  let focusAfterFrame = null;
  const element = (id) => document.getElementById(id);
  function bind(id, event, action) {
    const control = element(id);
    control.addEventListener(event, action);
    cleanups.push(() => control.removeEventListener(event, action));
  }
  bind('explore-netbook', 'click', () => { focusAfterFrame = 'netbook-yaw'; scene.exploreNetbook(); });
  bind('return-book', 'click', () => { focusAfterFrame = 'explore-netbook'; scene.returnToBook(); });
  bind('reset-netbook', 'click', () => scene.reset());
  const rotate = () => scene.rotateNetbook(Number(element('netbook-yaw').value), Number(element('netbook-tilt').value));
  bind('netbook-yaw', 'input', rotate);
  bind('netbook-tilt', 'input', rotate);
  bind('netbook-zoom', 'input', () => scene.setNetbookZoom(Number(element('netbook-zoom').value)));
  const unsubscribe = scene.subscribeBook((state) => {
    const exploring = state.mode === 'netbook';
    element('netbook-tools').hidden = !state.open || !state.available || state.mode === 'internal' || state.mode === 'ram' || state.activePopUp === 'ram';
    element('netbook-adjustments').hidden = !exploring;
    element('explore-netbook').hidden = exploring;
    element('return-book').hidden = !exploring;
    element('reset-netbook').hidden = !exploring;
    for (const id of ['explore-netbook', 'return-book', 'reset-netbook', 'netbook-yaw', 'netbook-tilt', 'netbook-zoom']) element(id).disabled = !state.ready || !state.available;
    element('netbook-status').textContent = state.moving ? (state.phase === 'netbook' ? (state.target ? 'La netbook emerge de la página…' : 'La netbook vuelve a la página…') : 'Ajustando la vista…') : exploring ? 'Exploración exterior · Rotación y zoom limitados' : 'Una netbook para observar de cerca';
    element('netbook-yaw').value = Math.round(state.yaw);
    element('netbook-tilt').value = Math.round(state.tilt);
    element('netbook-zoom').value = state.zoom;
    element('yaw-value').textContent = `${Math.round(state.yaw)}°`;
    element('tilt-value').textContent = `${Math.round(state.tilt)}°`;
    element('zoom-value').textContent = `${state.zoom}%`;
    if (!state.target) focusAfterFrame = null;
    if (focusAfterFrame && state.ready && state.available) { element(focusAfterFrame).focus(); focusAfterFrame = null; }
  });
  return () => { unsubscribe(); cleanups.forEach((remove) => remove()); };
}
