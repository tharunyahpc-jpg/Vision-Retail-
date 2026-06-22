// ============================================================================
// View layer — the month grid with multi-day spanning bars.
// Pure-ish: reads state, writes into `root`, and calls the supplied
// onCellClick(dateKey) / onBarClick(id) handlers.
// ============================================================================
import { state, today, visibleEntries } from '../core/state.js';
import { MAX_LANES, BAR_TOP, LANE } from '../core/constants.js';
import { toKey, parseKey, addDays, entryRange, entryTitle } from '../utils/date.js';
import { icon } from '../utils/icons.js';
import { esc } from '../utils/dom.js';

export function renderMonth(root, onCellClick, onBarClick) {
  const y = state.cursor.getFullYear();
  const m = state.cursor.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const gridStart = addDays(first, -startOffset);
  const todayKey = toKey(today);
  const DAY = 86400000;

  const evs = visibleEntries().map((e) => {
    const r = entryRange(e);
    return { e, start: parseKey(r.start), end: parseKey(r.end), sk: r.start };
  });

  let weeksHtml = '';
  for (let w = 0; w < 6; w++) {
    const weekStart = addDays(gridStart, w * 7);
    const weekEnd = addDays(weekStart, 6);
    const wsT = weekStart.getTime();
    const weT = weekEnd.getTime();

    const segs = evs
      .filter((o) => o.end.getTime() >= wsT && o.start.getTime() <= weT)
      .map((o) => {
        const sT = Math.max(o.start.getTime(), wsT);
        const eT = Math.min(o.end.getTime(), weT);
        return {
          o,
          startCol: Math.round((sT - wsT) / DAY),
          endCol: Math.round((eT - wsT) / DAY),
          contL: o.start.getTime() < wsT,
          contR: o.end.getTime() > weT,
        };
      })
      .sort(
        (a, b) =>
          a.startCol - b.startCol ||
          b.endCol - b.startCol - (a.endCol - a.startCol) ||
          a.o.sk.localeCompare(b.o.sk)
      );

    // Lane assignment (greedy first-fit).
    const laneEnd = [];
    segs.forEach((s) => {
      let placed = false;
      for (let i = 0; i < laneEnd.length; i++) {
        if (laneEnd[i] < s.startCol) {
          laneEnd[i] = s.endCol;
          s.lane = i;
          placed = true;
          break;
        }
      }
      if (!placed) {
        s.lane = laneEnd.length;
        laneEnd.push(s.endCol);
      }
    });

    const usedLanes = Math.min(laneEnd.length, MAX_LANES);
    const overflow = [0, 0, 0, 0, 0, 0, 0];

    let barsHtml = '';
    segs.forEach((s) => {
      if (s.lane >= MAX_LANES) {
        for (let c = s.startCol; c <= s.endCol; c++) overflow[c]++;
        return;
      }
      const e = s.o.e;
      const rl = s.contL ? '0' : '5px';
      const rr = s.contR ? '0' : '5px';
      const tag =
        e.type === 'leave' && e.duration && e.duration !== 'full'
          ? `<span class="btag">${e.duration === 'first' ? 'AM' : 'PM'}</span>`
          : '';
      barsHtml += `<div class="bar" data-id="${e.id}" title="${esc(entryTitle(e))}" style="grid-column:${s.startCol + 1}/${s.endCol + 2};grid-row:${s.lane + 1};background:${e.color};border-radius:${rl} ${rr} ${rr} ${rl}">${icon(e.type, 'bic')}<span class="btxt">${s.contL ? '… ' : ''}${esc(entryTitle(e))}</span>${tag}</div>`;
    });

    let cellsHtml = '';
    for (let c = 0; c < 7; c++) {
      const d = addDays(weekStart, c);
      const k = toKey(d);
      const out = d.getMonth() !== m;
      const wknd = d.getDay() === 0 || d.getDay() === 6;
      const more = overflow[c] > 0 ? `<span class="more">+${overflow[c]} more</span>` : '';
      cellsHtml += `<div class="cell${out ? ' out' : ''}${wknd ? ' weekend' : ''}${k === todayKey ? ' today' : ''}" data-date="${k}"><span class="daynum">${d.getDate()}</span>${more}</div>`;
    }

    const h = Math.max(106, BAR_TOP + usedLanes * LANE + 9);
    weeksHtml += `<div class="week" style="--wkh:${h}px"><div class="bgcells">${cellsHtml}</div><div class="bars">${barsHtml}</div></div>`;
  }

  root.innerHTML = `<div class="calendar"><div class="dow"><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div></div><div class="weeks">${weeksHtml}</div></div>`;

  root.querySelectorAll('.cell').forEach((cell) =>
    cell.addEventListener('click', () => onCellClick(cell.dataset.date))
  );
  root.querySelectorAll('.bar').forEach((b) =>
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      onBarClick(b.dataset.id);
    })
  );
}
