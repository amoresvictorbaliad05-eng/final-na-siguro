import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function testConnection() {
  console.log('🔍 Testing Aiven PostgreSQL Connection...\n');

  // Check env vars
  const required = ['AIVEN_DB_USER', 'AIVEN_DB_PASSWORD', 'AIVEN_DB_HOST', 'AIVEN_DB_PORT', 'AIVEN_DB_NAME'];
  const missing = required.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\nUpdate your .env file with Aiven credentials.');
    process.exit(1);
  }

  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.AIVEN_DB_HOST}`);
  console.log(`   Port: ${process.env.AIVEN_DB_PORT}`);
  console.log(`   User: ${process.env.AIVEN_DB_USER}`);
  console.log(`   Database: ${process.env.AIVEN_DB_NAME}`);
  console.log('');

  // SSL configuration
  const sslConfig: any = {
    rejectUnauthorized: false,
  };

  if (process.env.AIVEN_CA_CERT) {
    const certPath = process.env.AIVEN_CA_CERT;
    if (fs.existsSync(certPath)) {
      sslConfig.ca = fs.readFileSync(certPath).toString();
      sslConfig.rejectUnauthorized = true;
      console.log('🔒 Using CA certificate from file');
    } else if (certPath.includes('BEGIN CERTIFICATE')) {
      sslConfig.ca = certPath;
      sslConfig.rejectUnauthorized = true;
      console.log('🔒 Using CA certificate from env');
    }
  }

  const pool = new Pool({
    user: process.env.AIVEN_DB_USER,
    password: process.env.AIVEN_DB_PASSWORD,
    host: process.env.AIVEN_DB_HOST,
    port: parseInt(process.env.AIVEN_DB_PORT || '5432'),
    database: process.env.AIVEN_DB_NAME,
    ssl: sslConfig,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('📡 Connecting...');
    const client = await pool.connect();

    // Test query
    const versionResult = await client.query('SELECT VERSION()');
    console.log('✅ Connection successful!');
    console.log(`\n📊 PostgreSQL Version:\n   ${versionResult.rows[0].version}`);

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log('\n📋 Existing tables:');
      tablesResult.rows.forEach((row: any) => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('\n⚠️  No tables found. Run "npm run db:init" to create schema.');
    }

    // Check row counts if tables exist
    if (tablesResult.rows.length > 0) {
      console.log('\n📈 Row counts:');
      for (const row of tablesResult.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
          console.log(`   ${row.table_name}: ${countResult.rows[0].count} rows`);
        } catch {
          // Skip if can't query
        }
      }
    }

    client.release();
    console.log('\n✅ Test complete! Your Aiven PostgreSQL is ready.');

  } catch (error: any) {
    console.error('\n❌ Connection failed:');
    console.error(`   ${error.message}`);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Possible issues:');
      console.error('   - Service is not running (check Aiven console)');
      console.error('   - Wrong host or port');
      console.error('   - Network/firewall blocking connection');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Possible issues:');
      console.error('   - Wrong username or password');
      console.error('   - User does not exist');
    } else if (error.message.includes('SSL')) {
      console.error('\n💡 Possible issues:');
      console.error('   - SSL certificate issue');
      console.error('   - Try setting AIVEN_CA_CERT to the CA certificate');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection().catch(console.error);
