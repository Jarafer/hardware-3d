// La portada controla únicamente el acceso; volver a ella conserva la sesión del libro.
export function bindInstitutionCover({ start }) {
  const cover = document.getElementById('institution-cover');
  const app = document.getElementById('laboratory-app');
  const enter = document.getElementById('enter-laboratory');
  const back = document.getElementById('return-cover');
  let initialized = false;
  let disposeLaboratory;
  let previousFocus;
  const onEnter = () => {
    cover.hidden = true;
    app.hidden = false;
    if (!initialized) {
      disposeLaboratory = start();
      initialized = true;
      enter.replaceChildren(document.createTextNode('Volver al laboratorio ↗'));
    }
    const target = previousFocus?.isConnected && previousFocus.getClientRects().length ? previousFocus : document.getElementById('toggle-book');
    target.focus();
  };
  const onBack = () => {
    previousFocus = document.activeElement;
    app.hidden = true;
    cover.hidden = false;
    document.getElementById('cover-title').focus();
  };
  enter.addEventListener('click', onEnter);
  back.addEventListener('click', onBack);
  enter.disabled = false;
  return () => {
    enter.removeEventListener('click', onEnter);
    back.removeEventListener('click', onBack);
    disposeLaboratory?.();
  };
}
