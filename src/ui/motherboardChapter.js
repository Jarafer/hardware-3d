import { motherboardLesson } from '../education/motherboardContent.js';
import { createMotherboardScene } from '../scene/motherboardScene.js';
import { bindMotherboardAssessment } from './motherboardAssessment.js';

export function bindMotherboardChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('motherboard-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const canvas = get('motherboard-scene');
  const toolbar = get('motherboard-controls');
  const status = get('motherboard-status');
  const photos = get('motherboard-photos');
  const path = file => `${import.meta.env.BASE_URL}${motherboardLesson.directory}${file}`;
  const frontUrl = path('cara-superior.png');
  const rearUrl = path('cara-posterior.png');
  let scene;

  for (const key of ['introduction', 'netbook', 'variations', 'care']) {
    get(`motherboard-${key}`).textContent = motherboardLesson[key];
  }
  for (const key of ['functions', 'details']) {
    const list = get(`motherboard-${key}`);
    for (const [title, body] of motherboardLesson[key]) {
      const term = document.createElement('dt');
      const definition = document.createElement('dd');
      term.textContent = title;
      definition.textContent = body;
      list.append(term, definition);
    }
  }
  const unbindAssessment = bindMotherboardAssessment(get('motherboard-assessment'));

  function showPhotos() {
    if (!photos.open) return;
    const front = get('motherboard-photo-front');
    const rear = get('motherboard-photo-rear');
    if (!front.hasAttribute('src')) front.src = frontUrl;
    if (!rear.hasAttribute('src')) rear.src = rearUrl;
  }
  photos.addEventListener('toggle', showPhotos);

  function setStatus(state) {
    toolbar.disabled = state !== 'ready';
    canvas.hidden = state === 'error';
    get('motherboard-view-help').hidden = state === 'error';
    get('motherboard-face').hidden = state !== 'ready';
    const messages = {
      loading: 'Cargando las fotos de la placa…',
      ready: 'Modelo listo para explorar.',
      error: 'No se pudo mostrar el modelo 3D. Podés explorar ambas caras en las fotos originales.',
    };
    status.textContent = messages[state];
    if (state === 'error') {
      photos.open = true;
      showPhotos();
    }
  }

  function onControl(event) {
    const button = event.target.closest('button');
    if (!button || !scene) return;
    if (button.dataset.view) scene.view(button.dataset.view);
    else if (button.dataset.zoom) scene.zoom(Number(button.dataset.zoom));
  }
  toolbar.addEventListener('click', onControl);

  function close() {
    if (chapter.hidden) return;
    chapter.hidden = true;
    workspace.hidden = false;
    skip.setAttribute('href', '#laboratorio');
    scene?.dispose();
    scene = undefined;
  }

  return {
    isOpen: () => !chapter.hidden,
    open() {
      if (chapter.hidden) {
        workspace.hidden = true;
        chapter.hidden = false;
        skip.setAttribute('href', '#motherboard-title');
        setStatus('loading');
        try {
          scene = createMotherboardScene({
            canvas,
            frontUrl,
            rearUrl,
            lowPerformance: get('low-performance').checked,
            onStatus: setStatus,
            onFace: face => { get('motherboard-face').textContent = face; },
          });
        } catch {
          setStatus('error');
        }
      }
      get('motherboard-title').focus();
    },
    close,
    dispose() {
      close();
      toolbar.removeEventListener('click', onControl);
      photos.removeEventListener('toggle', showPhotos);
      get('motherboard-functions').replaceChildren();
      get('motherboard-details').replaceChildren();
      unbindAssessment();
    },
  };
}
