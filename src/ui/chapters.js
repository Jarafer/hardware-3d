export function bindChapters() {
  const names = ['exploration', 'safety', 'diagnostic'];
  const removers = [];
  function select(name, focus = false) {
    if (!names.includes(name)) return;
    for (const chapter of names) {
      const active = chapter === name;
      document.getElementById(`${chapter}-chapter`).hidden = !active;
      const tab = document.getElementById(`tab-${chapter}`);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    if (focus) document.getElementById(`tab-${name}`).focus();
  }
  for (const name of names) {
    const tab = document.getElementById(`tab-${name}`);
    const action = () => select(name);
    tab.addEventListener('click', action);
    removers.push(() => tab.removeEventListener('click', action));
  }
  const tabs = document.getElementById('chapter-tabs');
  const onKey = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = names.findIndex((name) => document.getElementById(`tab-${name}`).getAttribute('aria-selected') === 'true');
    select(event.key === 'Home' ? names[0] : event.key === 'End' ? names.at(-1) : names[(index + (event.key === 'ArrowRight' ? 1 : -1) + names.length) % names.length], true);
  };
  tabs.addEventListener('keydown', onKey);
  return { select, dispose() { removers.forEach((remove) => remove()); tabs.removeEventListener('keydown', onKey); } };
}
