// ============================================================================
// View layer — the chronological list, grouped by month.
// ============================================================================
import { visibleEntries } from '../core/state.js';
import { MONTHS, TYPE } from '../core/constants.js';
import { parseKey, fmtShort, entryRange, entryTitle, entrySub } from '../utils/date.js';
import { icon } from '../utils/icons.js';
import { esc, hexA } from '../utils/dom.js';

export function renderList(root, onRowClick) {
  const items = visibleEntries()
    .slice()
    .sort((a, b) => entryRange(a).start.localeCompare(entryRange(b).start));

  if (!items.length) {
    root.innerHTML = `<div class="listview"><div class="empty">
      <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
      <h3>Nothing scheduled yet</h3><p>Use “Add entry” to log a release, sprint, or leave.</p></div></div>`;
    return;
  }

  let html = '<div class="listview">';
  let curGroup = '';
  items.forEach((e) => {
    const { start, end } = entryRange(e);
    const d = parseKey(start);
    const g = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (g !== curGroup) {
      html += `<div class="lgroup-h">${g}</div>`;
      curGroup = g;
    }
    const dateTxt =
      start === end ? `<b>${fmtShort(start)}</b>` : `<b>${fmtShort(start)}</b> → ${fmtShort(end)}`;
    html += `<div class="lrow" data-id="${e.id}">
      <span class="lbar" style="background:${e.color}"></span>
      <span class="ldate">${dateTxt}</span>
      <span class="lbadge" style="background:${hexA(e.color, 0.12)};color:${e.color}">${icon(e.type)}${TYPE[e.type].label}</span>
      <span class="lmain"><div class="lt">${esc(entryTitle(e))}</div><div class="ls">${esc(entrySub(e)) || '&nbsp;'}</div></span>
    </div>`;
  });
  html += '</div>';
  root.innerHTML = html;

  root.querySelectorAll('.lrow').forEach((r) =>
    r.addEventListener('click', () => onRowClick(r.dataset.id))
  );
}
