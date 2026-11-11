export function bindStorageResources(guideUrl) {
  const get = id => document.getElementById(id);
  const video = get('storage-video-panel');
  const host = get('storage-video-host');
  const load = get('storage-video-load');
  const close = get('storage-video-close');
  const guide = get('storage-guide-panel');
  const preview = get('storage-guide-image');
  const expand = get('storage-guide-expand');
  const dialog = get('storage-guide-dialog');
  const fullImage = get('storage-guide-full');
  const zoom = get('storage-guide-zoom');
  const closeGuide = get('storage-guide-close');
  const events = new AbortController();
  const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: events.signal });

  function stopVideo() {
    host.replaceChildren();
    load.disabled = false;
    close.hidden = true;
  }
  listen(load, 'click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Lo que no te dicen de los SSD | HDD VS SDD';
    frame.src = 'https://www.youtube-nocookie.com/embed/SDakFCrcNj8';
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    host.replaceChildren(frame);
    load.disabled = true;
    close.hidden = false;
    close.focus();
  });
  listen(close, 'click', () => { stopVideo(); load.focus(); });
  listen(video, 'toggle', () => { if (!video.open) stopVideo(); });

  get('storage-guide-original').href = guideUrl;
  get('storage-guide-download').href = guideUrl;
  listen(guide, 'toggle', () => {
    if (guide.open && !preview.hasAttribute('src')) preview.src = guideUrl;
  });
  function updateZoom() {
    fullImage.style.width = `${zoom.value}%`;
    get('storage-guide-zoom-value').textContent = `${zoom.value} %`;
  }
  listen(zoom, 'input', updateZoom);
  listen(expand, 'click', () => {
    fullImage.src = guideUrl;
    fullImage.alt = preview.alt;
    zoom.value = '100';
    updateZoom();
    dialog.showModal();
    dialog.querySelector('.ram-image-scroll').scrollTo(0, 0);
  });
  listen(closeGuide, 'click', () => dialog.close());
  listen(dialog, 'close', () => {
    if (expand.getClientRects().length) expand.focus({ preventScroll: true });
  });

  function closeMedia() {
    stopVideo();
    if (dialog.open) dialog.close();
  }
  const containers = ['storage-chapter', 'exploration-chapter', 'laboratory-app'].map(get);
  const observer = new MutationObserver(() => {
    if (containers.some(container => container.hidden)) closeMedia();
  });
  for (const container of containers) observer.observe(container, { attributes: true, attributeFilter: ['hidden'] });
  return () => {
    observer.disconnect();
    events.abort();
    closeMedia();
  };
}
