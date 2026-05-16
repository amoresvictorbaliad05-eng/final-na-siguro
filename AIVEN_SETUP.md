# 🔧 Aiven PostgreSQL Setup Guide

## Step-by-Step Aiven Configuration

### 1. Create Aiven Account

1. Visit [aiven.io](https://aiven.io) and click **"Get started free"**
2. Complete registration (no credit card required for free tier)
3. Verify your email address

### 2. Create PostgreSQL Service

1. Log into [Aiven Console](https://console.aiven.io)
2. Click **"Create service"** button
3. Select **"PostgreSQL"** from the service list
4. Configure:
   - **Cloud provider**: Choose your preferred (AWS, Google Cloud, Azure)
   - **Region**: Select closest to your location
   - **Service plan**: Select **"Free"** (or Hobbyist/Startup for production)
   - **Service name**: Give it a name (e.g., `barangay-bantay-db`)
5. Click **"Create service"**
6. Wait 2-3 minutes for provisioning

### 3. Get Connection Details

Once service is **"Running"**:

1. Click on your service name
2. Go to **"Overview"** tab
3. Find **"Connection information"** section

You'll see something like:
```
Host: pg-xyz123.aivencloud.com
Port: 22867
User: avnadmin
Password: REDACTED
Database: defaultdb
```

### 4. Download CA Certificate

1. On the same **Overview** page
2. Find **"Connection SSL CA certificate"** section
3. Click **"Download"** button
4. Save as `ca.pem` in your project root directory

### 5. Configure Your .env File

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=change-this-to-a-random-secret-key

# Aiven PostgreSQL - REPLACE THESE VALUES
AIVEN_DB_USER=avnadmin
AIVEN_DB_PASSWORD=REDACTED
AIVEN_DB_HOST=pg-xyz123.aivencloud.com
AIVEN_DB_PORT=22867
AIVEN_DB_NAME=defaultdb

# CA Certificate - Option A: File path (recommended)
AIVEN_CA_CERT=./ca.pem

# CA Certificate - Option B: Paste content directly
# AIVEN_CA_CERT=-----BEGIN CERTIFICATE-----
# MIIEQTCCAqmgAwIBAgIU...your-cert-content...
# -----END CERTIFICATE-----
```

### 6. Test Connection

```bash
npm run db:test
```

Expected output:
```
🔍 Testing Aiven PostgreSQL Connection...

📋 Configuration:
   Host: pg-xyz123.aivencloud.com
   Port: 22867
   User: avnadmin
   Database: defaultdb

🔒 Using CA certificate from file
📡 Connecting...
✅ Connection successful!

📊 PostgreSQL Version:
   PostgreSQL 16.2 on x86_64-pc-linux-gnu

✅ Test complete! Your Aiven PostgreSQL is ready.
```

### 7. Initialize Database

```bash
# Create tables
npm run db:init

# Seed with sample data
npm run db:seed
```

### 8. Start the Application

```bash
# Start both frontend and backend
npm run dev:full
```

## 🔍 Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED
```
**Solution**: Check if your Aiven service is running in the console.

### Authentication Failed
```
Error: password authentication failed
```
**Solution**: Double-check username and password from Aiven console.

### SSL Error
```
Error: self signed certificate
```
**Solution**: 
1. Make sure you downloaded the CA certificate
2. Set `AIVEN_CA_CERT=./ca.pem` in `.env`
3. Ensure `ca.pem` is in project root

### Timeout Error
```
Error: Connection timed out
```
**Solution**:
1. Check your internet connection
2. Verify the host and port are correct
3. Check if firewall blocks outbound PostgreSQL connections

## 📊 Aiven Free Tier Limits

- **Storage**: 1 GB
- **RAM**: 256 MB
- **Connections**: 20 concurrent
- **Backups**: Automatic daily
- **Perfect for**: Development and small barangay deployments

## 🔒 Production Recommendations

For production deployment:

1. **Upgrade plan** for better performance
2. **Enable connection pooling** (PgBouncer)
3. **Set up automated backups**
4. **Use strong passwords**
5. **Restrict IP access** in Aiven firewall rules
6. **Enable monitoring** in Aiven console

## 📚 Additional Resources

- [Aiven Documentation](https://aiven.io/docs)
- [Aiven PostgreSQL Docs](https://aiven.io/docs/products/postgresql)
- [Node.js pg Package](https://node-postgres.com/)
