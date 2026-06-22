// ============================================================================
// Utils layer — date helpers and entry-shape accessors.
// ============================================================================
import { MON_S } from '../core/constants.js';

export const pad = (n) => String(n).padStart(2, '0');
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseKey = (s) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const fmtShort = (s) => {
  const d = parseKey(s);
  return `${d.getDate()} ${MON_S[d.getMonth()]}`;
};

// The [start,end] date keys for any entry type.
export function entryRange(e) {
  if (e.type === 'release') return { start: e.releaseDate, end: e.releaseDate };
  if (e.type === 'sprint') return { start: e.startDate, end: e.endDate || e.startDate };
  return { start: e.fromDate, end: e.toDate || e.fromDate };
}

export function entryTitle(e) {
  if (e.type === 'release') return e.functionalityName || 'Release';
  if (e.type === 'sprint') return e.sprintName || 'Sprint';
  return e.developerName || 'Leave';
}

export function entrySub(e) {
  if (e.type === 'release') return [e.version, e.module, e.releaseManager].filter(Boolean).join(' · ');
  if (e.type === 'sprint') return [e.goal, e.teamNotes].filter(Boolean).join(' · ');
  const dur = e.duration === 'first' ? 'First half' : e.duration === 'second' ? 'Second half' : 'Full day';
  return [e.leaveType, dur, e.notes].filter(Boolean).join(' · ');
}
