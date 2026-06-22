// ============================================================================
// Data layer — the only module that persists entries. Transparently uses the
// REST backend (CONFIG.useApi) or the browser's localStorage (demo mode).
//
//   GET    {apiBase}/entries        -> [ Entry, ... ]
//   POST   {apiBase}/entries        -> body: Entry (no id) -> saved Entry
//   PUT    {apiBase}/entries/{id}   -> body: Entry         -> saved Entry
//   DELETE {apiBase}/entries/{id}   -> 200/204
// ============================================================================
import { CONFIG, LS_KEY } from '../config.js';

export const Store = {
  async list() {
    if (CONFIG.useApi) {
      const r = await fetch(`${CONFIG.apiBase}/entries`);
      if (!r.ok) throw new Error('GET entries failed');
      return r.json();
    }
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  async save(entry) {
    if (CONFIG.useApi) {
      const isNew = !entry.id;
      const url = isNew ? `${CONFIG.apiBase}/entries` : `${CONFIG.apiBase}/entries/${entry.id}`;
      const r = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!r.ok) throw new Error('Save failed');
      return r.json();
    }
    const all = (await this.list()) || [];
    if (entry.id) {
      const i = all.findIndex((e) => e.id === entry.id);
      if (i > -1) all[i] = entry;
      else all.push(entry);
    } else {
      entry.id = 'e' + Date.now() + Math.random().toString(36).slice(2, 6);
      all.push(entry);
    }
    localStorage.setItem(LS_KEY, JSON.stringify(all));
    return entry;
  },

  async remove(id) {
    if (CONFIG.useApi) {
      const r = await fetch(`${CONFIG.apiBase}/entries/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Delete failed');
      return;
    }
    const all = ((await this.list()) || []).filter((e) => e.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  },

  // Bulk replace — used by demo seeding and JSON import (localStorage only).
  async replaceAll(arr) {
    if (CONFIG.useApi) return;
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  },
};
