// ============================================================================
// Utils layer — small DOM/string helpers and the toast notifier.
// ============================================================================

// HTML-escape a value for safe interpolation into innerHTML.
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])
  );
}

// hex color -> rgba() string with the given alpha.
export function hexA(hex, a) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

let toastT;
export function toast(msg, isErr) {
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.querySelector('.tdot').style.background = isErr ? '#ff6b6b' : '#46d894';
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 2400);
}
