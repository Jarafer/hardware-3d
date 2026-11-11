import { connectorZones, connectorsQuestions } from '../education/connectorsContent.js';
import { bindChapterAssessment } from './motherboardAssessment.js';

export function bindConnectorsChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('connectors-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const controls = get('connectors-controls');
  const image = get('connectors-photo');
  const marker = get('connectors-marker');
  const base = import.meta.env.BASE_URL;
  const unbindAssessment = bindChapterAssessment(get('connectors-assessment'), connectorsQuestions, 'connectors');

  const guideUrl = `${base}recursos/conectores/guia-conectores.png`;
  get('connectors-guide-open').href = guideUrl;
  get('connectors-guide-download').href = guideUrl;

  const buttons = connectorZones.map(zone => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.zone = zone.id;
    button.textContent = zone.title;
    button.setAttribute('aria-controls', 'connectors-reference');
    return button;
  });
  controls.replaceChildren(...buttons);

  function select(zone) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.zone === zone.id));
    for (const [edge, value] of Object.entries(zone.region)) marker.style[edge] = `${value}%`;
    get('connectors-zone-title').textContent = zone.title;
    get('connectors-zone-description').textContent = zone.observation;
  }

  function onSelect(event) {
    const id = event.target.closest('button[data-zone]')?.dataset.zone;
    const zone = connectorZones.find(item => item.id === id);
    if (zone) select(zone);
  }
  controls.addEventListener('click', onSelect);
  select(connectorZones[0]);

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
      if (!image.hasAttribute('src')) image.src = `${base}recursos/motherboard/cara-superior.png`;
      const guideImage = get('connectors-guide-image');
      if (!guideImage.hasAttribute('src')) guideImage.src = guideUrl;
      skip.setAttribute('href', '#connectors-title');
      get('connectors-title').focus();
    },
    close,
    dispose() {
      close();
      controls.removeEventListener('click', onSelect);
      unbindAssessment();
    },
  };
}
