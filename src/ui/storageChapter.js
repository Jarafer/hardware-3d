import { storageDevices, storageQuestions } from '../education/storageContent.js';
import { bindChapterAssessment } from './motherboardAssessment.js';
import { bindStorageResources } from './storageResources.js';

export function bindStorageChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('storage-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const controls = get('storage-device-controls');
  const image = get('storage-photo');
  const asset = file => `${import.meta.env.BASE_URL}recursos/almacenamiento/${file}`;
  const unbindAssessment = bindChapterAssessment(get('storage-assessment'), storageQuestions, 'storage');
  const unbindResources = bindStorageResources(asset('guia-almacenamiento.png'));

  const buttons = new Map();
  for (const device of storageDevices) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.device = device.id;
    button.textContent = device.button;
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-controls', 'storage-device');
    buttons.set(device.id, button);
  }
  controls.replaceChildren(...buttons.values());

  function select(device) {
    for (const [id, button] of buttons) button.setAttribute('aria-pressed', String(device.id === id));
    get('storage-device-name').textContent = device.title;
    image.alt = device.alt;
    image.src = asset(device.file);
    for (const field of ['observation', 'technology', 'connection', 'check']) {
      get(`storage-${field}`).textContent = device[field];
    }
    get('storage-selection').textContent = `En vista: ${device.title}.`;
  }

  function onSelect(event) {
    const id = event.target.closest('button[data-device]')?.dataset.device;
    const device = storageDevices.find(item => item.id === id);
    if (device) select(device);
  }
  controls.addEventListener('click', onSelect);

  function close() {
    if (chapter.hidden) return;
    chapter.hidden = true;
    workspace.hidden = false;
    skip.setAttribute('href', '#laboratorio');
  }
  return {
    isOpen: () => !chapter.hidden,
    open() {
      workspace.hidden = true;
      chapter.hidden = false;
      skip.setAttribute('href', '#storage-title');
      if (!image.hasAttribute('src')) select(storageDevices[0]);
      get('storage-title').focus();
    },
    close,
    dispose() {
      close();
      controls.removeEventListener('click', onSelect);
      unbindAssessment();
      unbindResources();
    },
  };
}
