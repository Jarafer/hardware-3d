export function bindComponentControls({ scene, components, notice, handling, announce }) {
  const byId = (id) => document.getElementById(id);
  const information = new Map(components.map((entry) => [entry.id, entry]));
  const removers = [];
  let focusAfterFrame = null;
  let displayedId;
  const buttons = new Map();
  const markers = new Map();
  function bind(element, event, action) { element.addEventListener(event, action); removers.push(() => element.removeEventListener(event, action)); }
  byId('internal-notice').textContent = notice;
  byId('handling-notice').textContent = handling;
  for (const info of components) {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `component-${info.id}`;
    button.setAttribute('aria-label', info.name);
    button.setAttribute('aria-controls', 'component-detail');
    button.setAttribute('aria-pressed', 'false');
    const number = document.createElement('span');
    number.textContent = info.number;
    number.setAttribute('aria-hidden', 'true');
    number.style.borderColor = info.color;
    button.append(number, document.createTextNode(info.name));
    byId('component-list').append(button);
    buttons.set(info.id, button);
    bind(button, 'click', () => { focusAfterFrame = button.id; scene.selectComponent(info.id); });
    const marker = document.createElement('span');
    marker.textContent = info.number;
    marker.style.borderColor = info.color;
    marker.dataset.componentId = info.id;
    byId('component-markers').append(marker);
    markers.set(info.id, marker);
  }
  bind(byId('explore-internal'), 'click', () => { focusAfterFrame = `component-${components[0].id}`; scene.showInternal(); });
  bind(byId('internal-overview'), 'click', () => { focusAfterFrame = 'internal-overview'; scene.showInternalOverview(); });
  bind(byId('return-exterior'), 'click', () => { focusAfterFrame = 'explore-internal'; scene.exploreNetbook(); });
  bind(byId('internal-return-book'), 'click', () => { focusAfterFrame = 'explore-internal'; scene.returnToBook(); });
  const unsubscribe = scene.subscribeBook((state) => {
    const active = state.mode === 'internal' && state.open && state.available;
    byId('internal-tools').hidden = !active;
    byId('internal-banner').hidden = !active;
    byId('component-markers').hidden = !active;
    byId('explore-internal').disabled = !state.ready || !state.available;
    for (const button of buttons.values()) button.disabled = !state.ready || !state.available;
    for (const id of ['internal-overview', 'return-exterior', 'internal-return-book']) byId(id).disabled = !state.ready || !state.available;
    for (const [id, button] of buttons) {
      button.setAttribute('aria-pressed', String(active && state.selectedId === id));
      markers.get(id).classList.toggle('selected', state.selectedId === id);
    }
    const info = information.get(state.selectedId);
    byId('component-empty').hidden = Boolean(info);
    byId('component-detail').hidden = !info;
    if (displayedId !== state.selectedId) {
      displayedId = state.selectedId;
      if (info) {
        byId('component-name').textContent = info.name;
        byId('component-function').textContent = info.function;
        byId('component-question').textContent = info.question;
        byId('component-precautions').replaceChildren(...info.precautions.map((text) => { const item = document.createElement('li'); item.textContent = text; return item; }));
      }
    }
    if (active) announce(state.moving ? `Ajustando la vista${info ? `: ${info.name}` : ' general'}.` : info ? `Selección: ${info.name}. Su función, precauciones y pregunta están disponibles debajo de la lista.` : 'Vista interna esquemática. Elegí una de las cuatro piezas.');
    if (!state.target) focusAfterFrame = null;
    if (focusAfterFrame && state.ready && state.available) { byId(focusAfterFrame).focus(); focusAfterFrame = null; }
  });
  const unsubscribeMarkers = scene.subscribeMarkers((positions) => {
    for (const position of positions) {
      const marker = markers.get(position.id);
      marker.hidden = !position.visible;
      marker.style.left = `${position.x}%`;
      marker.style.top = `${position.y}%`;
    }
  });
  return () => {
    unsubscribe(); unsubscribeMarkers(); removers.forEach((remove) => remove());
    byId('component-list').replaceChildren(); byId('component-markers').replaceChildren();
  };
}
