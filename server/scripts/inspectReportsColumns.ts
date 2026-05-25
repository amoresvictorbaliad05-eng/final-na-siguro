import pool from '../db/index.js';

async function main() {
  const result = await pool.query(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_name = 'reports'
     ORDER BY ordinal_position;`
  );

  console.log('Reports table columns:');
  result.rows.forEach((row: any) => {
    console.log(`${row.column_name} | ${row.data_type} | ${row.is_nullable} | ${row.column_default}`);
  });

  await pool.end();
}

main().catch(error => {
  console.error('Inspect failed:', error);
  process.exit(1);
});
