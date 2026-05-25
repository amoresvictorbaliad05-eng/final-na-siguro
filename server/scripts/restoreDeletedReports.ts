import pool from '../db/index.js';

async function main() {
  const result = await pool.query(
    `UPDATE reports
     SET is_deleted = false,
         deleted_at = NULL,
         deleted_by = NULL
     WHERE is_deleted = true
     RETURNING id, report_number`
  );

  console.log('Restored', result.rowCount, 'reports');
  result.rows.forEach(row => {
    console.log(`- ${row.id} (${row.report_number})`);
  });

  await pool.end();
}

main().catch(error => {
  console.error('Restore failed:', error);
  process.exit(1);
});
