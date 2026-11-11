import { microInfographics, microPdf, microVideo } from '../education/microResources.js';

const localUrl = path => `${import.meta.env.BASE_URL}${path}`;

function element(tag, text = '', className = '') {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

function action(label, handler) {
  const button = element('button', label);
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}

function link(label, url, download = false) {
  const anchor = element('a', label);
  anchor.href = url;
  if (download) anchor.download = '';
  else {
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
  }
  return anchor;
}

function panel(title, className = 'ram-resource-panel') {
  const details = element('details', '', className);
  details.append(element('summary', title));
  return details;
}

function reading(title, entries) {
  const details = panel(title, 'ram-text-alternative');
  for (const [heading, text] of entries) {
    details.append(element('h4', heading), element('p', text));
  }
  return details;
}

function notes(texts) {
  const section = element('aside', '', 'ram-media-note');
  const heading = element('p');
  heading.append(element('strong', 'Aclaraciones para la lectura'));
  const list = element('ul');
  for (const text of texts) list.append(element('li', text));
  section.append(heading, list);
  return section;
}

function viewer({ details, title, url, openLabel, closeLabel, type, links }) {
  const host = element('div', '', `micro-media-host micro-media-${type}`);
  const stop = () => {
    host.replaceChildren();
    openButton.disabled = false;
    closeButton.hidden = true;
  };
  const openButton = action(openLabel, () => {
    const frame = element('iframe');
    frame.title = title;
    frame.src = url;
    if (type === 'video') {
      frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
    }
    host.replaceChildren(frame);
    openButton.disabled = true;
    closeButton.hidden = false;
    closeButton.focus();
  });
  const closeButton = action(closeLabel, () => {
    stop();
    openButton.focus();
  });
  closeButton.hidden = true;
  const actions = element('div', '', 'ram-media-actions');
  actions.append(openButton, closeButton, ...links);
  details.append(actions, host);
  details.addEventListener('toggle', () => { if (!details.open) stop(); });
  return stop;
}

export function bindMicroResources() {
  const get = id => document.getElementById(id);
  const list = get('micro-resource-list');
  const dialog = get('micro-image-dialog');
  const fullImage = get('micro-image-full');
  const zoom = get('micro-image-zoom');
  let imageTrigger;

  const updateZoom = () => {
    fullImage.style.width = `${zoom.value}%`;
    get('micro-image-zoom-value').textContent = `${zoom.value} %`;
  };
  const closeImage = () => dialog.close();
  const restoreImageFocus = () => {
    if (imageTrigger?.getClientRects().length) imageTrigger.focus({ preventScroll: true });
  };
  zoom.addEventListener('input', updateZoom);
  get('micro-image-close').addEventListener('click', closeImage);
  dialog.addEventListener('close', restoreImageFocus);

  const video = panel('01 · Video: núcleos, hilos y frecuencia');
  video.append(element('p', microVideo.title), element('p', 'El video requiere Internet. YouTube se carga cuando elegís abrir el reproductor.'));
  const stopVideo = viewer({
    details: video,
    title: microVideo.title,
    url: `https://www.youtube-nocookie.com/embed/${microVideo.id}`,
    openLabel: 'Cargar video de YouTube',
    closeLabel: 'Cerrar reproductor',
    type: 'video',
    links: [link('Ver en YouTube (nueva pestaña)', `https://www.youtube.com/watch?v=${microVideo.id}`)],
  });
  video.append(reading('Lectura alternativa: tres ideas clave', microVideo.reading));

  const infographics = microInfographics.map((resource, index) => {
    const details = panel(`0${index + 2} · Infografía: ${resource.title}`);
    const url = localUrl(resource.path);
    const figure = element('figure');
    const image = element('img', '', 'micro-media-image');
    image.alt = resource.alt;
    image.width = 2752;
    image.height = 1536;
    image.decoding = 'async';
    details.addEventListener('toggle', () => {
      if (details.open && !image.hasAttribute('src')) image.src = url;
    });
    figure.append(image, element('figcaption', 'Infografía original aportada para el capítulo.'));
    const actions = element('div', '', 'ram-media-actions');
    actions.append(action('Ampliar infografía', event => {
      imageTrigger = event.currentTarget;
      fullImage.src = url;
      fullImage.alt = resource.alt;
      get('micro-image-dialog-title').textContent = resource.title;
      zoom.value = '100';
      updateZoom();
      dialog.showModal();
      dialog.querySelector('.ram-image-scroll').scrollTo(0, 0);
    }), link('Abrir imagen original (nueva pestaña)', url), link('Descargar infografía', url, true));
    details.append(notes(resource.notes), figure, actions, reading('Descripción en texto', resource.reading));
    return details;
  });

  const pdf = panel(`04 · PDF: ${microPdf.title}`);
  const pdfUrl = localUrl(microPdf.path);
  pdf.append(element('p', 'Presentación ilustrada de 15 páginas sobre arquitectura, netbooks educativas y refrigeración. Si tu navegador no muestra la vista previa, podés abrir o descargar el archivo original.'));
  pdf.append(notes(microPdf.notes));
  const stopPdf = viewer({
    details: pdf,
    title: `PDF: ${microPdf.title}, 15 páginas`,
    url: `${pdfUrl}#view=FitH`,
    openLabel: 'Mostrar PDF en el capítulo',
    closeLabel: 'Cerrar vista del PDF',
    type: 'pdf',
    links: [link('Abrir PDF original (nueva pestaña)', pdfUrl), link('Descargar PDF', pdfUrl, true)],
  });
  pdf.append(reading('Mapa de lectura en texto', microPdf.reading));

  list.replaceChildren(video, ...infographics, pdf);

  const containers = ['micro-chapter', 'exploration-chapter', 'laboratory-app'].map(get);
  function closeMedia() {
    stopVideo();
    stopPdf();
    if (dialog.open) dialog.close();
  }
  const observer = new MutationObserver(() => {
    if (containers.some(container => container.hidden)) closeMedia();
  });
  for (const container of containers) observer.observe(container, { attributes: true, attributeFilter: ['hidden'] });
  return () => {
    observer.disconnect();
    closeMedia();
    zoom.removeEventListener('input', updateZoom);
    get('micro-image-close').removeEventListener('click', closeImage);
    dialog.removeEventListener('close', restoreImageFocus);
    list.replaceChildren();
  };
}
