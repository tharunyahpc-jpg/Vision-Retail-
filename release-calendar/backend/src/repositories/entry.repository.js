// ============================================================================
// Repository layer — the ONLY place that talks SQL. Returns/accepts plain rows;
// it knows nothing about HTTP or validation.
// ============================================================================
import { query } from '../config/db.js';

// All columns in insert/select order.
const COLUMNS = [
  'id', 'type', 'color',
  'functionality_name', 'version', 'release_date', 'module', 'release_manager', 'release_notes',
  'sprint_name', 'goal', 'start_date', 'end_date', 'team_notes',
  'developer_name', 'leave_type', 'from_date', 'to_date', 'duration', 'notes',
];

// Updatable columns (everything except the primary key).
const UPDATABLE = COLUMNS.filter((c) => c !== 'id');

export async function findAll() {
  const { rows } = await query(
    `SELECT * FROM entries
     ORDER BY COALESCE(release_date, start_date, from_date), id`
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await query('SELECT * FROM entries WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function insert(row) {
  const values = COLUMNS.map((c) => (row[c] === undefined ? null : row[c]));
  const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ');
  const { rows } = await query(
    `INSERT INTO entries (${COLUMNS.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  return rows[0];
}

export async function update(id, row) {
  const setClause = UPDATABLE.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const values = UPDATABLE.map((c) => (row[c] === undefined ? null : row[c]));
  values.push(id);
  const { rows } = await query(
    `UPDATE entries SET ${setClause} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function remove(id) {
  const { rowCount } = await query('DELETE FROM entries WHERE id = $1', [id]);
  return rowCount > 0;
}
