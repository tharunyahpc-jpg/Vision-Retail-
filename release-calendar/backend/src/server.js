// ============================================================================
// Entry point — boots the HTTP server.
// ============================================================================
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Resul Release Calendar API listening on http://localhost:${env.port}/api`);
});
