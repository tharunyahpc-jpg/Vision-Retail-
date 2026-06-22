// ============================================================================
// Core layer — the single shared, mutable UI state object.
// ============================================================================
import { PALETTE } from './constants.js';

export const today = new Date();

export const state = {
  entries: [],
  cursor: new Date(2026, 4, 1), // May 2026
  view: 'month',
  filters: { release: true, sprint: true, leave: true },
  tab: 'release',
  picked: { release: PALETTE.blue, sprint: PALETTE.violet },
  duration: 'full',
  editingId: null,
};

export function visibleEntries() {
  return state.entries.filter((e) => state.filters[e.type]);
}
