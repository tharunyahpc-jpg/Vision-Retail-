// ============================================================================
// App layer — orchestration. Owns render(), wires the toolbar/header controls,
// handles JSON export/import, and boots the initial data load. Delegates the
// heavy lifting to the view modules and the data Store.
// ============================================================================
import { state, today } from './core/state.js';
import { MONTHS, TYPE, DEMO } from './core/constants.js';
import { toKey } from './utils/date.js';
import { toast } from './utils/dom.js';
import { Store } from './data/store.js';
import { renderMonth } from './views/calendar.view.js';
import { renderList } from './views/list.view.js';
import { initModal, openModal } from './views/modal.view.js';

const root = document.getElementById('view-root');

export function render() {
  document.getElementById('monthlabel').textContent =
    `${MONTHS[state.cursor.getMonth()]} ${state.cursor.getFullYear()}`;

  const c = { release: 0, sprint: 0, leave: 0 };
  state.entries.forEach((e) => c[e.type]++);
  document.getElementById('c-release').textContent = c.release;
  document.getElementById('c-sprint').textContent = c.sprint;
  document.getElementById('c-leave').textContent = c.leave;

  if (state.view === 'month') {
    renderMonth(root, (dateKey) => openModal(null, dateKey), (id) => openModal(id));
  } else {
    renderList(root, (id) => openModal(id));
  }
}

// ---- Export / Import (demo-mode JSON round-trip) ----------------------------
function exportJSON() {
  const blob = new Blob([JSON.stringify(state.entries, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `resul-release-calendar-${toKey(today)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Exported ' + state.entries.length + ' entries');
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error('Expected a JSON array');
      const clean = data
        .filter((e) => e && TYPE[e.type])
        .map((e) => ({
          ...e,
          id: e.id || 'e' + Date.now() + Math.random().toString(36).slice(2, 6),
          color: e.color || TYPE[e.type].def,
        }));
      if (!confirm(`Import ${clean.length} entries? This replaces what's currently loaded.`)) return;
      await Store.replaceAll(clean);
      state.entries = clean;
      render();
      toast('Imported ' + clean.length + ' entries');
    } catch (err) {
      toast('Import failed — ' + err.message, true);
    }
  };
  reader.readAsText(file);
}

// ---- Wiring -----------------------------------------------------------------
function wire() {
  document.getElementById('prev').onclick = () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() - 1, 1);
    render();
  };
  document.getElementById('next').onclick = () => {
    state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + 1, 1);
    render();
  };
  document.getElementById('btn-today').onclick = () => {
    state.cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    render();
  };
  document.getElementById('viewseg').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    state.view = b.dataset.view;
    document.querySelectorAll('#viewseg button').forEach((x) => x.setAttribute('aria-pressed', x === b));
    render();
  });
  document.getElementById('pills').addEventListener('click', (e) => {
    const b = e.target.closest('.pill');
    if (!b) return;
    const f = b.dataset.filter;
    state.filters[f] = !state.filters[f];
    b.setAttribute('aria-pressed', state.filters[f]);
    render();
  });
  document.getElementById('btn-add').onclick = () => openModal();
  document.getElementById('btn-export').onclick = exportJSON;
  document.getElementById('btn-import').onclick = () => document.getElementById('file-import').click();
  document.getElementById('file-import').addEventListener('change', (e) => {
    if (e.target.files[0]) importJSON(e.target.files[0]);
    e.target.value = '';
  });
}

// ---- Boot -------------------------------------------------------------------
export async function init() {
  initModal(render);
  wire();
  try {
    let data = await Store.list();
    if (data === null) {
      // First demo run: seed sample data into localStorage.
      const seeded = DEMO.map((e) => ({ ...e, id: 'e' + Date.now() + Math.random().toString(36).slice(2, 6) }));
      await Store.replaceAll(seeded);
      data = seeded;
    }
    state.entries = data || [];
  } catch (err) {
    toast('Could not load entries — ' + err.message, true);
    state.entries = [];
  }
  render();
}
