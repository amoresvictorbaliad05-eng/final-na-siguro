import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Aiven PostgreSQL connection configuration
// Uses SSL with CA certificate for secure connection
const pool = new Pool({
  user: process.env.AIVEN_DB_USER,
  password: process.env.AIVEN_DB_PASSWORD,
  host: process.env.AIVEN_DB_HOST,
  port: parseInt(process.env.AIVEN_DB_PORT || '5432'),
  database: process.env.AIVEN_DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Verify connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error connecting to Aiven PostgreSQL:', err.stack);
    console.error('Please check your Aiven connection credentials in .env file');
  } else {
    console.log('✅ Connected to Aiven PostgreSQL database');
    release();
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err);
});

export default pool;

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: pg.PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
