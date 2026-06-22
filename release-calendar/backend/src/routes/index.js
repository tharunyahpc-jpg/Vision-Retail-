// ============================================================================
// Route layer — aggregates all feature routers under the API.
// ============================================================================
import { Router } from 'express';
import entryRoutes from './entry.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/entries', entryRoutes);

export default router;
