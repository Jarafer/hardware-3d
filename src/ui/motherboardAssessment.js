import { motherboardQuestions } from '../education/motherboardContent.js';

export function bindMotherboardAssessment(form) {
  return bindChapterAssessment(form, motherboardQuestions, 'motherboard');
}

export function bindChapterAssessment(form, questions, chapterId) {
  const list = form.querySelector(`#${chapterId}-questions`);
  const summary = form.querySelector(`#${chapterId}-result`);
  const feedbackById = new Map();

  for (const [index, question] of questions.entries()) {
    const group = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = `${index + 1}. ${question.prompt}`;
    group.append(legend);

    const feedback = document.createElement('p');
    feedback.id = `${chapterId}-feedback-${question.id}`;
    feedback.className = 'motherboard-feedback';
    feedback.hidden = true;
    group.setAttribute('aria-describedby', feedback.id);
    feedbackById.set(question.id, feedback);

    for (const [value, text] of question.options) {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = question.id;
      input.value = value;
      input.required = true;
      const caption = document.createElement('span');
      caption.textContent = text;
      label.append(input, caption);
      group.append(label);
    }
    group.append(feedback);
    list.append(group);
  }

  function check(event) {
    event.preventDefault();
    const answers = new FormData(form);
    let correct = 0;
    for (const { id, answer, explanation } of questions) {
      const matches = answers.get(id) === answer;
      if (matches) correct++;
      const feedback = feedbackById.get(id);
      feedback.textContent = `${matches ? 'Correcta.' : 'Para revisar.'} ${explanation}`;
      feedback.dataset.result = matches ? 'correct' : 'review';
      feedback.hidden = false;
    }
    summary.textContent = `Resultado: ${correct} de ${questions.length} respuestas correctas. Revisá la devolución debajo de cada pregunta.`;
    summary.hidden = false;
    summary.focus();
  }

  function clearFeedback() {
    summary.hidden = true;
    for (const feedback of feedbackById.values()) feedback.hidden = true;
  }

  function reset() {
    clearFeedback();
    list.querySelector('input').focus();
  }

  function onAnswerChange(event) {
    if (event.target.type === 'radio') clearFeedback();
  }

  form.addEventListener('submit', check);
  form.addEventListener('change', onAnswerChange);
  form.addEventListener('reset', reset);
  return () => {
    form.removeEventListener('submit', check);
    form.removeEventListener('change', onAnswerChange);
    form.removeEventListener('reset', reset);
    clearFeedback();
    list.replaceChildren();
  };
}
