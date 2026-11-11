import { ramResources, ramVideoEmbedUrl } from '../education/ramResources.js';

export function bindRamResources() {
  const get = id => document.getElementById(id);
  const removers = [];
  const on = (id, event, action) => { const element = get(id); element.addEventListener(event, action); removers.push(() => element.removeEventListener(event, action)); };
  const node = (tag, text) => { const element = document.createElement(tag); element.textContent = text; return element; };
  const localUrl = path => `${import.meta.env.BASE_URL}${path}`;
  let imageScale = 1;
  let imageTrigger;
  function paragraphs(id, pairs) {
    get(id).replaceChildren(...pairs.map(([title, text]) => { const article = document.createElement('article'); article.append(node('h4', title), node('p', text)); return article; }));
  }
  function notes(id, texts) { get(id).replaceChildren(...texts.map(text => node('li', text))); }
  paragraphs('ram-media-synthesis', ramResources.synthesis);
  paragraphs('ram-infographic-reading', ramResources.infographicReading);
  paragraphs('ram-pdf-reading-map', ramResources.pdfReadingMap);
  notes('ram-infographic-notes', ramResources.infographicNotes);
  notes('ram-pdf-notes', ramResources.pdfNotes);
  get('ram-media-video-title').textContent = ramResources.videoTitle;
  get('ram-media-video-credit').textContent = `${ramResources.videoAuthor} · ${ramResources.videoDuration}`;
  get('ram-watch-youtube').href = ramResources.videoUrl;
  for (const id of ['ram-image-open-original', 'ram-image-download']) get(id).href = localUrl(ramResources.infographic.path);
  for (const id of ['ram-pdf-open-original', 'ram-pdf-download']) get(id).href = localUrl(ramResources.pdf.path);

  function stopVideo() { get('ram-video-host').replaceChildren(); get('ram-video-stop').hidden = true; get('ram-video-load').disabled = false; }
  on('ram-video-load', 'click', () => {
    stopVideo();
    const frame = document.createElement('iframe'); frame.src = ramVideoEmbedUrl(); frame.title = ramResources.videoTitle;
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen'; frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    get('ram-video-host').append(frame); get('ram-video-load').disabled = true; get('ram-video-stop').hidden = false;
  });
  on('ram-video-stop', 'click', () => { stopVideo(); get('ram-video-load').focus(); });
  on('ram-video-panel', 'toggle', () => { if (!get('ram-video-panel').open) stopVideo(); });

  on('ram-image-panel', 'toggle', () => { if (get('ram-image-panel').open && !get('ram-resource-image').hasAttribute('src')) get('ram-resource-image').src = localUrl(ramResources.infographic.path); });
  function imageZoom() {
    get('ram-image-full').style.width = `${imageScale * 100}%`;
    get('ram-image-zoom-value').textContent = `${Math.round(imageScale * 100)} %`;
    get('ram-image-zoom-in').disabled = imageScale >= 4;
    get('ram-image-zoom-out').disabled = imageScale <= 1;
  }
  on('ram-image-enlarge', 'click', () => { imageTrigger = document.activeElement; imageScale = 1; imageZoom(); get('ram-image-full').src = localUrl(ramResources.infographic.path); get('ram-image-dialog').showModal(); });
  on('ram-image-zoom-in', 'click', () => { imageScale = Math.min(4, imageScale + 0.5); imageZoom(); });
  on('ram-image-zoom-out', 'click', () => { imageScale = Math.max(1, imageScale - 0.5); imageZoom(); });
  on('ram-image-fit', 'click', () => { imageScale = 1; imageZoom(); });
  on('ram-image-close', 'click', () => get('ram-image-dialog').close());
  on('ram-image-dialog', 'close', () => { if (imageTrigger?.getClientRects().length) imageTrigger.focus({ preventScroll: true }); });

  function closePdf() { get('ram-pdf-host').replaceChildren(); get('ram-pdf-preview').disabled = false; get('ram-pdf-close').hidden = true; }
  on('ram-pdf-preview', 'click', () => {
    closePdf(); const frame = document.createElement('iframe'); frame.src = `${localUrl(ramResources.pdf.path)}#view=FitH`;
    frame.title = 'PDF original: Diagnóstico y reparación de memoria RAM, 13 páginas';
    get('ram-pdf-host').append(frame); get('ram-pdf-preview').disabled = true; get('ram-pdf-close').hidden = false;
  });
  on('ram-pdf-close', 'click', () => { closePdf(); get('ram-pdf-preview').focus(); });
  on('ram-pdf-panel', 'toggle', () => { if (!get('ram-pdf-panel').open) closePdf(); });
  on('ram-open-resources', 'click', () => get('ram-resources-title').focus());
  on('ram-resource-menu', 'click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    const panel = get(link.hash.slice(1));
    if (!panel) return;
    event.preventDefault(); panel.open = true; panel.querySelector('summary').focus();
  });
  on('ram-resources-back', 'click', () => { stopVideo(); get('scene').focus(); });

  function pauseHiddenChapter() {
    if (get('ram-chapter').hidden || get('exploration-chapter').hidden || get('laboratory-app')?.hidden || get('book-workspace')?.hidden) { stopVideo(); closePdf(); if (get('ram-image-dialog').open) get('ram-image-dialog').close(); }
  }
  const observer = new MutationObserver(pauseHiddenChapter);
  observer.observe(get('ram-chapter'), { attributes: true, attributeFilter: ['hidden'] });
  observer.observe(get('exploration-chapter'), { attributes: true, attributeFilter: ['hidden'] });
  if (get('laboratory-app')) observer.observe(get('laboratory-app'), { attributes: true, attributeFilter: ['hidden'] });
  if (get('book-workspace')) observer.observe(get('book-workspace'), { attributes: true, attributeFilter: ['hidden'] });
  return () => { observer.disconnect(); stopVideo(); closePdf(); if (get('ram-image-dialog').open) get('ram-image-dialog').close(); removers.forEach(remove => remove()); };
}
