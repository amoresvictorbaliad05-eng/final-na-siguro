import pool from '../db/index.js';

async function main() {
  await pool.query(`ALTER TABLE reports ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE`);
  await pool.query(`ALTER TABLE reports ADD COLUMN IF NOT EXISTS deleted_by UUID`);
  await pool.query(`ALTER TABLE reports ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`);
  console.log('Soft-delete columns added or already present.');
  await pool.end();
}

main().catch(error => {
  console.error('Failed to add soft-delete columns:', error);
  process.exit(1);
});
