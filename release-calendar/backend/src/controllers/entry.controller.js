// ============================================================================
// Controller layer — adapts HTTP <-> service calls. No business logic here.
// Async errors are forwarded to the central error handler via next().
// ============================================================================
import * as service from '../services/entry.service.js';

export async function list(req, res, next) {
  try {
    res.json(await service.listEntries());
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    res.json(await service.getEntry(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const saved = await service.createEntry(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const saved = await service.updateEntry(req.params.id, req.body);
    res.json(saved);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.deleteEntry(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
