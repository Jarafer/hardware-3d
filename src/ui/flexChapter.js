import { flexRoutes, flexQuestions } from '../education/flexContent.js';
import { bindChapterAssessment } from './motherboardAssessment.js';

export function bindFlexChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('flex-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const guide = get('flex-guide-image');
  const marker = get('flex-marker');
  const controls = get('flex-controls');
  const resources = `${import.meta.env.BASE_URL}recursos/flex/`;
  const guideUrl = `${resources}guia-flex.png`;
  get('flex-guide-open').href = guideUrl;
  get('flex-guide-download').href = guideUrl;
  const unbindAssessment = bindChapterAssessment(get('flex-assessment'), flexQuestions, 'flex');

  const buttons = flexRoutes.map(route => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = route.title;
    button.setAttribute('aria-controls', 'flex-route');
    return button;
  });

  function select(index) {
    const route = flexRoutes[index];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    for (const [edge, value] of Object.entries(route.region)) marker.style[edge] = `${value}%`;
    get('flex-route-title').textContent = route.title;
    get('flex-route-description').textContent = route.description;
  }

  function onSelect(event) {
    const index = buttons.indexOf(event.target.closest('button'));
    if (index >= 0) select(index);
  }

  controls.replaceChildren(...buttons);
  controls.addEventListener('click', onSelect);
  select(0);

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
      if (!guide.hasAttribute('src')) guide.src = guideUrl;
      skip.setAttribute('href', '#flex-title');
      get('flex-title').focus();
    },
    close,
    dispose() {
      close();
      controls.removeEventListener('click', onSelect);
      unbindAssessment();
    },
  };
}
