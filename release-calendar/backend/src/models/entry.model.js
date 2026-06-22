// ============================================================================
// Model layer — the single source of truth for what an Entry looks like.
// Holds field definitions, JSON<->row mapping, validation and id generation.
// No SQL and no HTTP here; just the shape and rules of the domain object.
// ============================================================================

export const ENTRY_TYPES = ['release', 'sprint', 'leave'];
export const DURATIONS = ['full', 'first', 'second'];

// camelCase field -> snake_case column, grouped by type.
export const TYPE_FIELDS = {
  release: {
    functionalityName: 'functionality_name',
    version: 'version',
    releaseDate: 'release_date',
    module: 'module',
    releaseManager: 'release_manager',
    releaseNotes: 'release_notes',
  },
  sprint: {
    sprintName: 'sprint_name',
    goal: 'goal',
    startDate: 'start_date',
    endDate: 'end_date',
    teamNotes: 'team_notes',
  },
  leave: {
    developerName: 'developer_name',
    leaveType: 'leave_type',
    fromDate: 'from_date',
    toDate: 'to_date',
    duration: 'duration',
    notes: 'notes',
  },
};

// Fields that must be present for each type (everything else is optional).
const REQUIRED = {
  release: ['functionalityName', 'releaseDate'],
  sprint: ['sprintName', 'startDate'],
  leave: ['developerName', 'fromDate'],
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function generateId() {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Build a DB row (snake_case keys) from an incoming JSON entry.
export function entryToRow(entry, id) {
  const row = { id, type: entry.type, color: entry.color };
  const map = TYPE_FIELDS[entry.type];
  for (const [camel, col] of Object.entries(map)) {
    row[col] = entry[camel] === undefined || entry[camel] === '' ? null : entry[camel];
  }
  return row;
}

// Build a JSON entry (camelCase keys) from a DB row, keeping only the columns
// relevant to the row's type and dropping nulls.
export function rowToEntry(row) {
  const entry = { id: row.id, type: row.type, color: row.color };
  const map = TYPE_FIELDS[row.type] || {};
  for (const [camel, col] of Object.entries(map)) {
    if (row[col] !== null && row[col] !== undefined) entry[camel] = row[col];
  }
  return entry;
}

// Validate an incoming entry. Returns an array of error strings (empty == valid).
export function validateEntry(entry) {
  const errors = [];
  if (!entry || typeof entry !== 'object') return ['Entry must be a JSON object'];

  if (!ENTRY_TYPES.includes(entry.type)) {
    errors.push(`"type" must be one of: ${ENTRY_TYPES.join(', ')}`);
    return errors; // can't validate fields without a valid type
  }
  if (!entry.color || typeof entry.color !== 'string') {
    errors.push('"color" is required');
  }

  for (const field of REQUIRED[entry.type]) {
    if (!entry[field] || String(entry[field]).trim() === '') {
      errors.push(`"${field}" is required for a ${entry.type}`);
    }
  }

  // Date format checks
  const dateFields = { release: ['releaseDate'], sprint: ['startDate', 'endDate'], leave: ['fromDate', 'toDate'] };
  for (const f of dateFields[entry.type]) {
    if (entry[f] != null && entry[f] !== '' && !DATE_RE.test(entry[f])) {
      errors.push(`"${f}" must be in YYYY-MM-DD format`);
    }
  }

  if (entry.type === 'leave' && entry.duration != null && !DURATIONS.includes(entry.duration)) {
    errors.push(`"duration" must be one of: ${DURATIONS.join(', ')}`);
  }

  return errors;
}

// Normalise an entry before persisting: enforce start<=end and default duration.
export function normalizeEntry(entry) {
  const e = { ...entry };
  const swap = (a, b) => {
    if (e[a] && e[b] && e[b] < e[a]) {
      const t = e[a];
      e[a] = e[b];
      e[b] = t;
    }
  };
  if (e.type === 'sprint') {
    if (!e.endDate) e.endDate = e.startDate;
    swap('startDate', 'endDate');
  }
  if (e.type === 'leave') {
    if (!e.toDate) e.toDate = e.fromDate;
    swap('fromDate', 'toDate');
    if (!e.duration) e.duration = 'full';
  }
  return e;
}
