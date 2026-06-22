// ============================================================================
// Config layer — PostgreSQL connection pool.
// A single shared pool is exported; the repository layer borrows clients from it.
// ============================================================================
import pg from 'pg';
import { env } from './env.js';

// pg returns DATE columns as JS Date objects by default, which shifts them
// across timezones. Parse type 1082 (DATE) as the raw 'YYYY-MM-DD' string.
pg.types.setTypeParser(1082, (val) => val);

const pool = env.db.connectionString
  ? new pg.Pool({ connectionString: env.db.connectionString, ssl: env.db.ssl })
  : new pg.Pool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      ssl: env.db.ssl,
    });

pool.on('error', (err) => {
  // eslint-disable-next-line no-console
  console.error('Unexpected PostgreSQL pool error:', err);
});

export const query = (text, params) => pool.query(text, params);
export const getPool = () => pool;
