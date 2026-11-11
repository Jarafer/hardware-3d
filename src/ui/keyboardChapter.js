import { keyboardGuide, keyboardQuestions } from '../education/keyboardContent.js';
import { bindChapterAssessment } from './motherboardAssessment.js';

export function bindKeyboardChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('keyboard-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const guide = get('keyboard-guide-image');
  const marker = get('keyboard-marker');
  const controls = get('keyboard-controls');
  const resources = `${import.meta.env.BASE_URL}recursos/teclado/`;
  const guideUrl = `${resources}guia-teclado.png`;
  get('keyboard-guide-open').href = guideUrl;
  get('keyboard-guide-download').href = guideUrl;
  const unbindAssessment = bindChapterAssessment(get('keyboard-assessment'), keyboardQuestions, 'keyboard');

  const buttons = keyboardGuide.map(topic => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = topic.title;
    button.setAttribute('aria-controls', 'keyboard-reference');
    return button;
  });

  function select(index) {
    const topic = keyboardGuide[index];
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
    for (const [edge, value] of Object.entries(topic.region)) marker.style[edge] = `${value}%`;
    get('keyboard-topic-title').textContent = topic.title;
    get('keyboard-topic-description').textContent = topic.description;
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
      skip.setAttribute('href', '#keyboard-title');
      get('keyboard-title').focus();
    },
    close,
    dispose() {
      close();
      controls.removeEventListener('click', onSelect);
      unbindAssessment();
    },
  };
}
