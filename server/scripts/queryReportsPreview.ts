import pool from '../db/index.js';

async function main() {
  const count = await pool.query(`SELECT COUNT(*) FROM reports`);
  console.log('Total reports:', count.rows[0].count);

  const sample = await pool.query(`SELECT id, report_number, title, status, is_deleted, created_at FROM reports ORDER BY created_at DESC LIMIT 10`);
  console.log('Sample reports:');
  sample.rows.forEach((row: any) => console.log(row));

  await pool.end();
}

main().catch(error => {
  console.error('Query failed:', error);
  process.exit(1);
});
