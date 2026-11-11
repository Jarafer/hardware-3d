import { microLesson } from '../education/microContent.js';

export function bindMicroChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('micro-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const image = get('micro-image');
  const outline = get('micro-outline');
  const form = get('micro-activity');
  const feedback = get('micro-feedback');

  function textNode(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
  }

  get('micro-introduction').textContent = microLesson.introduction;
  get('micro-question').textContent = microLesson.question;
  get('micro-notes').replaceChildren(...microLesson.notes.flatMap(([title, body]) => [
    textNode('dt', title), textNode('dd', body),
  ]));

  const references = get('micro-references');
  const buttons = microLesson.references.map(({ title }, index) => {
    const button = textNode('button', `${index + 1}. ${title}`);
    button.type = 'button';
    button.setAttribute('aria-controls', 'micro-reference-detail');
    return button;
  });
  references.replaceChildren(...buttons);

  function selectReference(index) {
    const reference = microLesson.references[index];
    for (const [property, value] of Object.entries(reference.bounds)) {
      outline.style[property] = `${value}%`;
    }
    get('micro-reference-detail').textContent = reference.text;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(index === i)));
  }

  function onReferenceClick(event) {
    const index = buttons.indexOf(event.target.closest('button'));
    if (index >= 0) selectReference(index);
  }
  references.addEventListener('click', onReferenceClick);
  selectReference(0);

  get('micro-choices').replaceChildren(...microLesson.choices.map(([id, label]) => {
    const option = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'micro-answer';
    input.value = id;
    input.required = true;
    option.append(input, textNode('span', label));
    return option;
  }));
  function onSubmit(event) {
    event.preventDefault();
    const answer = new FormData(form).get('micro-answer');
    feedback.textContent = microLesson.choices.find(([id]) => id === answer)?.[2] ?? '';
  }
  function clearFeedback() {
    feedback.textContent = '';
  }
  form.addEventListener('submit', onSubmit);
  form.addEventListener('change', clearFeedback);

  function close() {
    if (chapter.hidden) return;
    chapter.hidden = true;
    workspace.hidden = false;
    skip.setAttribute('href', '#laboratorio');
  }
  return {
    isOpen: () => !chapter.hidden,
    open() {
      if (!image.hasAttribute('src')) image.src = `${import.meta.env.BASE_URL}${microLesson.imagePath}`;
      workspace.hidden = true;
      chapter.hidden = false;
      skip.setAttribute('href', '#micro-title');
      get('micro-title').focus();
    },
    close,
    dispose() {
      close();
      references.removeEventListener('click', onReferenceClick);
      form.removeEventListener('submit', onSubmit);
      form.removeEventListener('change', clearFeedback);
    },
  };
}
