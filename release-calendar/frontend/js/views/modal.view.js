// ============================================================================
// View layer — the add/edit modal. Owns the form, swatches and duration
// pickers, and persists via the Store. After a successful save/delete it calls
// the `refresh` callback handed in by the app so the active view re-renders.
// ============================================================================
import { state, today } from '../core/state.js';
import { PALETTE, SWATCH_SETS } from '../core/constants.js';
import { toKey } from '../utils/date.js';
import { icon } from '../utils/icons.js';
import { toast } from '../utils/dom.js';
import { Store } from '../data/store.js';

const scrim = document.getElementById('scrim');
const $ = (id) => document.getElementById(id);

let refresh = () => {}; // set by initModal()

function buildSwatches() {
  ['release', 'sprint'].forEach((type) => {
    const wrap = document.querySelector(`[data-swatches="${type}"]`);
    wrap.innerHTML = SWATCH_SETS[type]
      .map(
        (c) =>
          `<button class="sw" type="button" data-color="${c}" style="background:${c};color:${c}" aria-checked="false"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></button>`
      )
      .join('');
    wrap.querySelectorAll('.sw').forEach((sw) =>
      sw.addEventListener('click', () => {
        state.picked[type] = sw.dataset.color;
        wrap.querySelectorAll('.sw').forEach((s) => s.setAttribute('aria-checked', s === sw));
      })
    );
  });
}

function markSwatch(type, color) {
  const wrap = document.querySelector(`[data-swatches="${type}"]`);
  let matched = false;
  wrap.querySelectorAll('.sw').forEach((s) => {
    const on = s.dataset.color.toLowerCase() === String(color).toLowerCase();
    s.setAttribute('aria-checked', on);
    if (on) matched = true;
  });
  if (!matched) {
    const f = wrap.querySelector('.sw');
    if (f) {
      f.setAttribute('aria-checked', 'true');
      state.picked[type] = f.dataset.color;
    }
  } else {
    state.picked[type] = color;
  }
}

function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll('#tabs button').forEach((b) =>
    b.setAttribute('aria-selected', b.dataset.tab === tab)
  );
  document.querySelectorAll('.fields').forEach((f) =>
    f.classList.toggle('active', f.dataset.fields === tab)
  );
  $('m-icon').innerHTML = icon(tab);
}

function setDuration(d) {
  state.duration = d;
  document.querySelectorAll('#durs .dur').forEach((b) =>
    b.setAttribute('aria-checked', b.dataset.dur === d)
  );
}

function clearForm() {
  ['r-name', 'r-version', 'r-module', 'r-manager', 'r-notes', 's-name', 's-goal', 's-team', 'l-name', 'l-notes'].forEach(
    (id) => ($(id).value = '')
  );
  $('l-type').selectedIndex = 0;
}

export function openModal(id, dateKey) {
  state.editingId = id || null;
  clearForm();
  const dEl = $('m-delete');
  const tEl = $('m-title');
  const dk = dateKey || toKey(today);

  if (id) {
    const e = state.entries.find((x) => x.id === id);
    if (!e) return;
    setTab(e.type);
    tEl.textContent = 'Edit entry';
    dEl.style.display = '';
    if (e.type === 'release') {
      $('r-name').value = e.functionalityName || '';
      $('r-version').value = e.version || '';
      $('r-date').value = e.releaseDate || dk;
      $('r-module').value = e.module || '';
      $('r-manager').value = e.releaseManager || '';
      $('r-notes').value = e.releaseNotes || '';
      markSwatch('release', e.color);
    } else if (e.type === 'sprint') {
      $('s-name').value = e.sprintName || '';
      $('s-goal').value = e.goal || '';
      $('s-start').value = e.startDate || dk;
      $('s-end').value = e.endDate || dk;
      $('s-team').value = e.teamNotes || '';
      markSwatch('sprint', e.color);
    } else {
      $('l-name').value = e.developerName || '';
      $('l-type').value = e.leaveType || 'Planned Leave';
      $('l-from').value = e.fromDate || dk;
      $('l-to').value = e.toDate || dk;
      $('l-notes').value = e.notes || '';
      setDuration(e.duration || 'full');
    }
  } else {
    setTab('release');
    tEl.textContent = 'Add entry';
    dEl.style.display = 'none';
    $('r-date').value = dk;
    $('s-start').value = dk;
    $('s-end').value = dk;
    $('l-from').value = dk;
    $('l-to').value = dk;
    markSwatch('release', PALETTE.blue);
    markSwatch('sprint', PALETTE.violet);
    setDuration('full');
  }
  scrim.classList.add('open');
}

export function closeModal() {
  scrim.classList.remove('open');
  state.editingId = null;
}

async function saveEntry() {
  const tab = state.tab;
  const entry = { type: tab };
  if (state.editingId) entry.id = state.editingId;

  if (tab === 'release') {
    const name = $('r-name').value.trim();
    if (!name) return toast('Add a functionality name', true);
    entry.functionalityName = name;
    entry.version = $('r-version').value.trim();
    entry.releaseDate = $('r-date').value || toKey(today);
    entry.module = $('r-module').value.trim();
    entry.releaseManager = $('r-manager').value.trim();
    entry.releaseNotes = $('r-notes').value.trim();
    entry.color = state.picked.release;
  } else if (tab === 'sprint') {
    const name = $('s-name').value.trim();
    if (!name) return toast('Add a sprint name', true);
    entry.sprintName = name;
    entry.goal = $('s-goal').value.trim();
    entry.startDate = $('s-start').value || toKey(today);
    entry.endDate = $('s-end').value || entry.startDate;
    if (entry.endDate < entry.startDate) {
      const t = entry.endDate;
      entry.endDate = entry.startDate;
      entry.startDate = t;
    }
    entry.teamNotes = $('s-team').value.trim();
    entry.color = state.picked.sprint;
  } else {
    const name = $('l-name').value.trim();
    if (!name) return toast('Add a developer name', true);
    entry.developerName = name;
    entry.leaveType = $('l-type').value;
    entry.fromDate = $('l-from').value || toKey(today);
    entry.toDate = $('l-to').value || entry.fromDate;
    if (entry.toDate < entry.fromDate) {
      const t = entry.toDate;
      entry.toDate = entry.fromDate;
      entry.fromDate = t;
    }
    entry.duration = state.duration;
    entry.notes = $('l-notes').value.trim();
    entry.color = PALETTE.red;
  }

  try {
    const saved = await Store.save(entry);
    if (state.editingId) {
      const i = state.entries.findIndex((e) => e.id === state.editingId);
      if (i > -1) state.entries[i] = saved;
    } else {
      state.entries.push(saved);
    }
    const wasEdit = !!state.editingId;
    closeModal();
    refresh();
    toast(wasEdit ? 'Entry updated' : 'Entry added');
  } catch (err) {
    toast('Could not save — ' + err.message, true);
  }
}

async function deleteEntry() {
  if (!state.editingId) return;
  if (!confirm('Delete this entry? This can’t be undone.')) return;
  try {
    await Store.remove(state.editingId);
    state.entries = state.entries.filter((e) => e.id !== state.editingId);
    closeModal();
    refresh();
    toast('Entry deleted');
  } catch (err) {
    toast('Could not delete — ' + err.message, true);
  }
}

// Wire the modal's own controls. Called once at startup with the app's render fn.
export function initModal(onChange) {
  refresh = onChange;
  buildSwatches();
  $('m-close').onclick = closeModal;
  $('m-cancel').onclick = closeModal;
  $('m-save').onclick = saveEntry;
  $('m-delete').onclick = deleteEntry;
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scrim.classList.contains('open')) closeModal();
  });
  $('tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) setTab(b.dataset.tab);
  });
  $('durs').addEventListener('click', (e) => {
    const b = e.target.closest('.dur');
    if (b) setDuration(b.dataset.dur);
  });
}
