// ============================================================================
// Service layer — business rules. Orchestrates validation (model) and
// persistence (repository), and translates between JSON entries and DB rows.
// Throws AppError with a status code; the controller turns that into HTTP.
// ============================================================================
import * as repo from '../repositories/entry.repository.js';
import {
  entryToRow,
  rowToEntry,
  validateEntry,
  normalizeEntry,
  generateId,
} from '../models/entry.model.js';
import { AppError } from '../middleware/errorHandler.js';

export async function listEntries() {
  const rows = await repo.findAll();
  return rows.map(rowToEntry);
}

export async function getEntry(id) {
  const row = await repo.findById(id);
  if (!row) throw new AppError(404, `Entry "${id}" not found`);
  return rowToEntry(row);
}

export async function createEntry(payload) {
  const errors = validateEntry(payload);
  if (errors.length) throw new AppError(400, 'Validation failed', errors);

  const entry = normalizeEntry(payload);
  const row = entryToRow(entry, generateId());
  const saved = await repo.insert(row);
  return rowToEntry(saved);
}

export async function updateEntry(id, payload) {
  const existing = await repo.findById(id);
  if (!existing) throw new AppError(404, `Entry "${id}" not found`);

  const merged = { ...payload, type: payload.type || existing.type };
  const errors = validateEntry(merged);
  if (errors.length) throw new AppError(400, 'Validation failed', errors);

  const entry = normalizeEntry(merged);
  const row = entryToRow(entry, id);
  const saved = await repo.update(id, row);
  return rowToEntry(saved);
}

export async function deleteEntry(id) {
  const ok = await repo.remove(id);
  if (!ok) throw new AppError(404, `Entry "${id}" not found`);
}
