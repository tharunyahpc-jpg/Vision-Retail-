// ============================================================================
// DB layer — applies schema.sql (and optionally seed.sql with `--seed`).
//   npm run migrate    -> create tables/indexes/triggers
//   npm run seed       -> migrate + load sample data
// ============================================================================
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, query } from '../config/db.js';

const here = dirname(fileURLToPath(import.meta.url));

async function run() {
  const withSeed = process.argv.includes('--seed');

  const schema = await readFile(join(here, 'schema.sql'), 'utf8');
  await query(schema);
  // eslint-disable-next-line no-console
  console.log('✓ Schema applied');

  if (withSeed) {
    const seed = await readFile(join(here, 'seed.sql'), 'utf8');
    await query(seed);
    // eslint-disable-next-line no-console
    console.log('✓ Seed data loaded');
  }

  await getPool().end();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', err);
  process.exit(1);
});
