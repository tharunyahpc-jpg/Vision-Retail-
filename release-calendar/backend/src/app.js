// ============================================================================
// App layer — assembles the Express application (middleware + routes).
// Kept separate from server.js so it can be imported by tests.
// ============================================================================
import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin.includes('*') ? true : env.corsOrigin,
    })
  );
  app.use(express.json());

  // All endpoints live under /api to match the frontend's apiBase.
  app.use('/api', apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
