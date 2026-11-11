import './styles.css';
import { createScene } from './scene/createScene.js';
import { bindControls, bindHelp } from './ui/controls.js';
import { initialStage } from './education/stage.js';
import { bookContent } from './education/bookContent.js';
import { bindBookControls } from './ui/bookControls.js';
import { bindNetbookControls } from './ui/netbookControls.js';
import { bindComponentControls } from './ui/componentControls.js';
import { components, schematicNotice, handlingNotice } from './education/components.js';
import { bindSafetyChapter } from './ui/safetyChapter.js';
import { bindChapters } from './ui/chapters.js';
import { bindDiagnosticChapter } from './ui/diagnosticChapter.js';
import { bindRamChapter } from './ui/ramChapter.js';
import { bindRamResources } from './ui/ramResources.js';
import { bindInstitutionCover } from './ui/institutionCover.js';
import { bindMicroChapter } from './ui/microChapter.js';
import { bindMicroResources } from './ui/microResources.js';
import { bindMotherboardChapter } from './ui/motherboardChapter.js';
import { bindStorageChapter } from './ui/storageChapter.js';
import { bindConnectorsChapter } from './ui/connectorsChapter.js';
import { bindFlexChapter } from './ui/flexChapter.js';
import { bindKeyboardChapter } from './ui/keyboardChapter.js';
import { bindBibliographyChapter } from './ui/bibliographyChapter.js';

function startLaboratory() {
document.documentElement.dataset.stage = initialStage.id;
const status = document.getElementById('view-status');
const error = document.getElementById('scene-error');
const announce = (message) => { status.textContent = message; };
const unbindHelp = bindHelp();
// El capítulo HTML también funciona si WebGL no está disponible.
const chapters = bindChapters();
const unbindSafety = bindSafetyChapter({ navigate: chapters.select });
const unbindDiagnostic = bindDiagnosticChapter({ navigate: chapters.select });
let scene;
let unbindControls;
let unbindBook;
let unbindNetbook;
let unbindComponents;
const ramEntry = document.createElement('button');
ramEntry.id = 'open-ram-from-component'; ramEntry.type = 'button'; ramEntry.textContent = 'Abrir capítulo de RAM'; ramEntry.hidden = true;
document.getElementById('component-detail').append(ramEntry);
function setAvailable(available) {
  for (const id of ['reset-view', 'zoom-in', 'zoom-out', 'show-grid', 'low-performance', 'toggle-book', 'explore-netbook', 'return-book', 'reset-netbook', 'netbook-yaw', 'netbook-tilt', 'netbook-zoom', 'explore-internal', 'internal-overview', 'return-exterior', 'internal-return-book']) document.getElementById(id).disabled = !available;
  error.hidden = available;
  if (!available) { for (const id of ['book-reading', 'netbook-tools', 'internal-tools', 'internal-banner', 'component-markers']) document.getElementById(id).hidden = true; }
}
try {
  scene = createScene({
    audit: new URLSearchParams(window.location.search).get('auditoria') === '1',
    bookContent,
    components,
    canvas: document.getElementById('scene'),
    container: document.getElementById('scene-container'),
    onContextChange(available) {
      error.textContent = available ? '' : 'Se interrumpió la conexión gráfica. El entorno se recuperará cuando el navegador restablezca WebGL.';
      setAvailable(available);
      announce(available ? 'Entorno recuperado' : 'Entorno pausado');
    },
  });
  scene.setLowPerformance(document.getElementById('low-performance').checked);
  scene.setGrid(document.getElementById('show-grid').checked);
  unbindControls = bindControls({ scene, announce });
  unbindBook = bindBookControls({ scene, content: bookContent, announce });
  unbindNetbook = bindNetbookControls({ scene });
  unbindComponents = bindComponentControls({ scene, components, notice: schematicNotice, handling: handlingNotice, announce });
} catch (cause) {
  console.error('No se pudo iniciar el entorno 3D:', cause);
  error.textContent = 'No pudimos iniciar WebGL. Probá activar la aceleración gráfica del navegador y recargar la página. La guía de uso sigue disponible.';
  setAvailable(false);
  announce('Entorno 3D no disponible');
}
const microChapter = bindMicroChapter();
const motherboardChapter = bindMotherboardChapter();
const storageChapter = bindStorageChapter();
const connectorsChapter = bindConnectorsChapter();
const flexChapter = bindFlexChapter();
const keyboardChapter = bindKeyboardChapter();
const bibliographyChapter = bindBibliographyChapter();
const unbindMicroResources = bindMicroResources();
const unbindRam = bindRamChapter({ scene, navigate: chapters.select, microChapter, motherboardChapter, storageChapter, connectorsChapter, flexChapter, keyboardChapter, bibliographyChapter });
const unbindRamResources = bindRamResources();
return () => { unbindMicroResources(); unbindRamResources(); unbindRam(); bibliographyChapter.dispose(); keyboardChapter.dispose(); flexChapter.dispose(); connectorsChapter.dispose(); storageChapter.dispose(); motherboardChapter.dispose(); microChapter.dispose(); ramEntry.remove(); unbindDiagnostic(); unbindSafety(); chapters.dispose(); unbindComponents?.(); unbindNetbook?.(); unbindBook?.(); unbindControls?.(); unbindHelp(); scene?.dispose(); };
}
const unbindCover = bindInstitutionCover({ start: startLaboratory });
if (import.meta.hot) import.meta.hot.dispose(unbindCover);
