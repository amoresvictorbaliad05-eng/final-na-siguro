import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './index.ts';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

async function initDatabase() {
  console.log('🔧 Initializing Aiven PostgreSQL Database...\n');

  // Check for required environment variables
  const required = ['AIVEN_DB_USER', 'AIVEN_DB_PASSWORD', 'AIVEN_DB_HOST', 'AIVEN_DB_PORT', 'AIVEN_DB_NAME'];
  const missing = required.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nPlease update your .env file with Aiven PostgreSQL credentials.');
    console.error('See .env.example for reference.');
    process.exit(1);
  }

  // Create connection pool
  const sslConfig: any = {
    rejectUnauthorized: false, // Set to true in production with proper CA cert
  };

  // Check if CA cert is provided
  if (process.env.AIVEN_CA_CERT) {
    const certPath = process.env.AIVEN_CA_CERT;
    if (fs.existsSync(certPath)) {
      sslConfig.ca = fs.readFileSync(certPath).toString();
      sslConfig.rejectUnauthorized = true;
    } else {
      // Assume it's the cert content directly
      sslConfig.ca = certPath;
      sslConfig.rejectUnauthorized = true;
    }
  }

  const pool = new Pool({
    user: process.env.AIVEN_DB_USER,
    password: process.env.AIVEN_DB_PASSWORD,
    host: process.env.AIVEN_DB_HOST,
    port: parseInt(process.env.AIVEN_DB_PORT || '5432'),
    database: process.env.AIVEN_DB_NAME,
    ssl: sslConfig,
  });

  try {
    // Test connection
    console.log('📡 Testing connection to Aiven PostgreSQL...');
    const client = await pool.connect();
    const versionResult = await client.query('SELECT VERSION()');
    console.log(`✅ Connected successfully!`);
    console.log(`   PostgreSQL: ${versionResult.rows[0].version}\n`);
    client.release();

    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    const schemaClient = await pool.connect();
    try {
      await schemaClient.query(schema);
      console.log('✅ Schema created successfully!\n');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Schema already exists, skipping creation.\n');
      } else {
        throw error;
      }
    } finally {
      schemaClient.release();
    }

    console.log('✅ Database initialization complete!');
    console.log('\n📌 Next steps:');
    console.log('   1. Run "npm run db:seed" to populate with sample data');
    console.log('   2. Run "npm run server" to start the API server');
    console.log('   3. Run "npm run dev" to start the frontend');

  } catch (error: any) {
    console.error('\n❌ Database initialization failed:');
    console.error(error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Tips:');
      console.error('   - Check if your Aiven service is running');
      console.error('   - Verify the host and port in .env');
      console.error('   - Check your network/firewall settings');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Tips:');
      console.error('   - Verify your username and password in .env');
      console.error('   - Check if the user has proper permissions');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase().catch(console.error);
