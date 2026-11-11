import { diagnosticSources } from '../education/diagnosticContent.js';
import { ramLesson } from '../education/ramContent.js';
import { safetySources } from '../education/safetyContent.js';
import { componentSources } from '../education/components.js';
import { microInfographics, microPdf, microResourceSources, microVideo } from '../education/microResources.js';
import { ramResources } from '../education/ramResources.js';

export function bindBibliographyChapter() {
  const get = id => document.getElementById(id);
  const chapter = get('bibliography-chapter');
  const workspace = get('book-workspace');
  const skip = document.querySelector('.skip-link');
  const local = (title, path) => ({ title, url: `${import.meta.env.BASE_URL}recursos/${path}`, download: true });
  const sources = [
    ...componentSources,
    ...ramLesson.sources,
    ...ramResources.references,
    ...safetySources,
    ...diagnosticSources,
    local('Memoria RAM (PDF aportado)', 'ram/memoria-ram.pdf'),
    local('Diagnóstico y reparación de memoria RAM (PDF)', 'ram/diagnostico-reparacion-ram.pdf'),
    local('Guía visual de memoria RAM (infografía)', 'ram/guia-visual-ram.png'),
    { title: ramResources.videoTitle + ' (video)', url: ramResources.videoUrl },
    local('Microprocesador (PDF aportado)', 'micro/micro.pdf'),
    local(microPdf.title + ' (PDF)', 'micro/arquitectura-gestion-termica.pdf'),
    ...microInfographics.map(item => local(item.title + ' (infografía)', item.path.replace(/^recursos\//, ''))),
    { title: microVideo.title + ' (video)', url: `https://www.youtube.com/watch?v=${microVideo.id}` },
    ...microResourceSources.map(([title, url]) => ({ title, url })),
    local('Guía de almacenamiento en netbooks (infografía)', 'almacenamiento/guia-almacenamiento.png'),
    { title: 'Glitch hardware · Lo que no te dicen de los SSD (video)', url: 'https://www.youtube.com/watch?v=SDakFCrcNj8' },
    local('Guía de conectores para portátiles (infografía)', 'conectores/guia-conectores.png'),
    local('Guía técnica de cables flex (infografía)', 'flex/guia-flex.png'),
    local('Mantenimiento de teclados en portátiles (infografía)', 'teclado/guia-teclado.png'),
  ];

  const list = get('bibliography-list');
  const generatedEntries = sources.map(({ title, url, download }) => {
    const entry = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = title;
    link.href = url;
    if (download) {
      link.download = '';
    } else {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
    entry.append(link);
    return entry;
  });
  const collator = new Intl.Collator('es', { sensitivity: 'base', ignorePunctuation: true });
  const entries = [...list.children, ...generatedEntries];
  entries.sort((a, b) => collator.compare(a.textContent.trim(), b.textContent.trim()));
  list.replaceChildren(...entries);

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
      skip.setAttribute('href', '#bibliography-title');
      get('bibliography-title').focus();
    },
    close,
    dispose() {
      close();
      for (const entry of generatedEntries) entry.remove();
    },
  };
}
